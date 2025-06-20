import React, { useState, useEffect } from 'react';
import { HomeIcon, AddIcon, SparklesIcon } from './components/icons';
import SettingsModal from './components/SettingsModal';
import WardrobeScreen from './components/WardrobeScreen';
import AddItemScreen from './components/AddItemScreen';
import RecommendationScreen from './components/RecommendationScreen';

// --- Main App Component ---

const App = () => {
    const [activeScreen, setActiveScreen] = useState('wardrobe');
    const [weather, setWeather] = useState(null);
    const [clothing, setClothing] = useState(() => {
        const saved = localStorage.getItem('wardrobe');
        return saved ? JSON.parse(saved) : [];
    });
    const [recommendations, setRecommendations] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [preselectedItems, setPreselectedItems] = useState([]);
    const [lockedItemsByOutfit, setLockedItemsByOutfit] = useState({});
    
    // --- New Settings State ---
    const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
    const [userLocation, setUserLocation] = useState(() => {
        const saved = localStorage.getItem('userLocation');
        return saved ? JSON.parse(saved) : { city: '', state: '' };
    });
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const [includeAccessories, setIncludeAccessories] = useState(true);

    // --- API Configuration ---
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

    useEffect(() => {
        localStorage.setItem('wardrobe', JSON.stringify(clothing));
    }, [clothing]);

    useEffect(() => {
        localStorage.setItem('userName', userName);
    }, [userName]);

    useEffect(() => {
        localStorage.setItem('userLocation', JSON.stringify(userLocation));
    }, [userLocation]);

    useEffect(() => {
        setClothing([]);
        
        const fetchWeather = async () => {
            if (userLocation.city && WEATHER_API_KEY) {
                try {
                    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userLocation.city},${userLocation.state},US&appid=${WEATHER_API_KEY}&units=imperial`);
                    const data = await response.json();
                    if (data.main) {
                        setWeather({ temp: data.main.temp, description: data.weather[0].description });
                    }
                } catch (err) { console.error("Failed to fetch weather", err); }
            } else if (userLocation.city && API_KEY) {
                // Use Gemini to get the weather
                try {
                    const prompt = `What is the weather today in ${userLocation.city}, ${userLocation.state}? Please answer in the format: {\"temp\": <temperature in F>, \"description\": <short description>}`;
                    const result = await callGeminiAPI(prompt);
                    if (result.temp && result.description) {
                        setWeather({ temp: result.temp, description: result.description });
                    } else {
                        setWeather({ temp: '', description: `Gemini: ${JSON.stringify(result)}` });
                    }
                } catch (err) {
                    setWeather({ temp: '', description: 'Could not fetch weather from Gemini.' });
                }
            } else if (userLocation.city) {
                setWeather({ temp: 72, description: `pleasant in ${userLocation.city}` });
            } else {
                 setWeather(null);
            }
        };
        fetchWeather();

    }, [userLocation]);

    useEffect(() => {
        if (activeScreen === 'recommendation') {
            fetchWeather();
        }
    }, [activeScreen]);

    const handleSelectItem = (itemId) => {
        setPreselectedItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
    };

    const handleToggleLock = (itemId, outfitIndex) => {
        setLockedItemsByOutfit(prev => {
            const currentLocks = prev[outfitIndex] || [];
            const newLocks = currentLocks.includes(itemId) ? currentLocks.filter(id => id !== itemId) : [...currentLocks, itemId];
            return { ...prev, [outfitIndex]: newLocks };
        });
    };
    
    const callGeminiAPI = async (prompt) => {
        if (!API_KEY) {
            setError("Gemini API key is not set. Please add it to your .env file.");
            return;
        }
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } };
        const response = await fetch(GEMINI_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) { const errorBody = await response.json(); console.error("API Error:", errorBody); throw new Error(`API call failed: ${response.status}`); }
        const data = await response.json();
        if (!data.candidates || !data.candidates[0].content.parts[0].text) { throw new Error("Invalid response from API"); }
        return JSON.parse(data.candidates[0].content.parts[0].text);
    };

    const handleGetRecommendations = async (activity) => {
        setLoading(true); setError(''); setLockedItemsByOutfit({});
        const selectedNames = clothing.filter(item => preselectedItems.includes(item.id)).map(item => item.name);
        
        let prompt = `Generate 3 distinct outfit recommendations. The user's name is ${userName || 'friend'}. My available clothes are: ${JSON.stringify(clothing.map(c=>c.name))}. The occasion is "${activity}".`;
        prompt += ` The weather is ${weather ? `${weather.temp}°F, ${weather.description}` : 'unknown'}. Please ensure the outfits are appropriate for the temperature.`;
        if(selectedNames.length > 0) { prompt += ` I've pre-selected these items: ${JSON.stringify(selectedNames)}. Please include at least one of them in each outfit.` }
        if (!includeAccessories) { prompt += ` Do NOT include any accessories (like hats, jewelry, etc.).` }
        prompt += ` Respond with ONLY a JSON object with a single key "outfits" which is an array of 3 outfit objects. Each object must have two keys: "recommendation_text" and "outfit_items".`;
        
        try {
            const result = await callGeminiAPI(prompt);
            if (!result.outfits || !Array.isArray(result.outfits)) { throw new Error("Expected 'outfits' array."); }
            setRecommendations(result.outfits.map(o => ({...o, id: Math.random() })));
        } catch (e) { console.error("Error getting recommendations:", e); setError("The AI couldn't generate outfits."); } 
        finally { setLoading(false); }
    };

    const handleRefineOutfit = async (activity, outfitIndex, rating) => {
        setLoading(true); setError('');
        const lockedNames = clothing.filter(item => (lockedItemsByOutfit[outfitIndex] || []).includes(item.id)).map(item => item.name);
        
        let prompt = `Generate ONE new outfit recommendation to replace an existing one. My clothes are: ${JSON.stringify(clothing.map(c=>c.name))}. Occasion: "${activity}".`;
        prompt += ` The weather is ${weather ? `${weather.temp}°F, ${weather.description}` : 'unknown'}. Make sure the new outfit is appropriate for the temperature.`;
        if(lockedNames.length > 0) { prompt += ` The user INSISTS on including these items: ${JSON.stringify(lockedNames)}. You MUST use them.`; } 
        else { prompt += ` The user did not lock any items, so create a completely new outfit.` }
        if (!includeAccessories) { prompt += ` Do NOT include any accessories.` }
        if (rating) { prompt += ` The user rated the previous version of this outfit ${rating}/5 stars. Keep this in mind.`; }
        prompt += ` Respond with ONLY a JSON object with two keys: "recommendation_text" and "outfit_items".`;
        
        try {
             const result = await callGeminiAPI(prompt);
             const newRecommendations = [...recommendations];
             newRecommendations[outfitIndex] = { ...result, id: Math.random() };
             setRecommendations(newRecommendations);
        } catch (e) { console.error("Error refining outfit:", e); setError("The AI couldn't refine the outfit."); } 
        finally { setLoading(false); }
    };
    
    const handleSaveSettings = ({ name, location }) => {
        setUserName(name);
        setUserLocation(location);
    };
    
    const handleAddItem = (item) => {
        setClothing(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                name: item.name,
                category: item.category,
                imageUrl: item.image?.uri || '',
            }
        ]);
    };
    
    const renderScreen = () => {
        switch (activeScreen) {
            case 'add': return <AddItemScreen onAddItem={handleAddItem} loading={false}/>;
            case 'recommendation': return <RecommendationScreen clothing={clothing} onGetRecommendations={handleGetRecommendations} onRefineOutfit={handleRefineOutfit} weather={weather} recommendations={recommendations} loading={loading} error={error} lockedItemsByOutfit={lockedItemsByOutfit} onToggleLock={handleToggleLock} onSettingsClick={() => setIsSettingsVisible(true)} includeAccessories={includeAccessories} setIncludeAccessories={setIncludeAccessories} />;
            case 'wardrobe':
            default: return <WardrobeScreen clothing={clothing} selectedItems={preselectedItems} onSelectItem={handleSelectItem} userName={userName} onSettingsClick={() => setIsSettingsVisible(true)} />;
        }
    };
    
    return (
      <div className="w-full max-w-sm mx-auto h-[90vh] flex flex-col bg-white border-2 border-gray-300 rounded-[2.5rem] shadow-2xl overflow-hidden font-sans relative">
          <SettingsModal isVisible={isSettingsVisible} onClose={() => setIsSettingsVisible(false)} onSave={handleSaveSettings} userName={userName} userLocation={userLocation} />
          <div className="flex-1 flex flex-col overflow-y-hidden">{renderScreen()}</div>
          <footer className="flex justify-around items-center h-24 border-t-2 border-gray-200 bg-white/50 backdrop-blur-sm rounded-b-[2.5rem]">
              {[ { name: 'wardrobe', icon: HomeIcon }, { name: 'add', icon: AddIcon }, { name: 'recommendation', icon: SparklesIcon } ].map(tab => (
                  <button key={tab.name} onClick={() => setActiveScreen(tab.name)} className={`p-4 rounded-2xl transition-all duration-300 ${activeScreen === tab.name ? 'bg-purple-100' : ''}`}>
                      <tab.icon color={activeScreen === tab.name ? '#8B5CF6' : '#9CA3AF'} />
                  </button>
              ))}
          </footer>
      </div>
    );
};

export default App; 