import React, { useState } from 'react';
import { SettingsIcon, SparklesIcon, RefreshIcon, StarIcon } from './icons';
import StarRating from './StarRating';

const RecommendationScreen = ({ clothing, onGetRecommendations, onRefineOutfit, weather, recommendations, loading, error, lockedItemsByOutfit, onToggleLock, onSettingsClick, includeAccessories, setIncludeAccessories }) => {
    const [activity, setActivity] = useState('');
    const [ratings, setRatings] = useState({});

    return (
        <div className="flex-1 bg-gradient-to-b from-indigo-50 to-purple-50 overflow-y-auto p-5">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-extrabold text-gray-800">Style Assistant</h1>
                 <button onClick={onSettingsClick} className="text-gray-500 hover:text-purple-600">
                    <SettingsIcon/>
                 </button>
            </div>
            <div className="space-y-6 mt-4">
                {weather ? <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl text-center shadow-md"><p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">{Math.round(weather.temp)}°F</p><p className="text-md text-gray-600 capitalize">{weather.description}</p></div> : <div className="bg-white/70 p-4 rounded-xl text-center shadow-md"><p className="text-gray-500">Enter your location in Settings for weather.</p></div>}
                
                <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                    <label className="font-semibold text-gray-700">Include Accessories</label>
                    <button onClick={() => setIncludeAccessories(!includeAccessories)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${includeAccessories ? 'bg-purple-600' : 'bg-gray-300'}`}>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${includeAccessories ? 'translate-x-6' : 'translate-x-1'}`}/>
                    </button>
                </div>

                <input type="text" className="w-full bg-white p-4 rounded-lg text-base border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" placeholder="What's the occasion?" value={activity} onChange={(e) => setActivity(e.target.value)} />
                <button onClick={() => onGetRecommendations(activity)} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-lg text-lg font-bold hover:shadow-lg disabled:opacity-50 flex justify-center items-center gap-2 transform hover:scale-105 transition-transform">
                     {loading && recommendations.length === 0 ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><SparklesIcon color="white"/> Get Initial Recommendations</>}
                </button>
                
                {recommendations.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-700 mt-4">Here are a few ideas...</h2>
                        {recommendations.map((rec, index) => {
                             const outfitItems = clothing.filter(c => rec.outfit_items.includes(c.name));
                             const lockedItemsForThisOutfit = lockedItemsByOutfit[index] || [];

                             return (
                                <div key={rec.id} className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                                    <div className="flex space-x-3 overflow-x-auto pb-3">
                                        {outfitItems.map(item => {
                                            const isLocked = lockedItemsForThisOutfit.includes(item.id);
                                            return (
                                                <div key={item.id} onClick={() => onToggleLock(item.id, index)} className="flex-shrink-0 w-28 text-center cursor-pointer group">
                                                    <div className={`relative w-28 h-28 rounded-xl overflow-hidden transform group-hover:scale-105 transition-transform ${isLocked ? 'ring-4 ring-purple-500' : ''}`}>
                                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover"/>
                                                        {isLocked && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><StarIcon filled={true} color="white" /></div>}
                                                    </div>
                                                    <p className="text-xs mt-1.5 font-semibold truncate">{item.name}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <p className="text-sm leading-relaxed text-gray-700 mt-3">{rec.recommendation_text}</p>
                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                                       <button onClick={() => onRefineOutfit(activity, index, ratings[index])} disabled={loading} className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-cyan-500 text-white px-3 py-2 rounded-lg text-sm font-bold hover:shadow-lg disabled:opacity-50">
                                           <RefreshIcon/> Refine
                                       </button>
                                       <StarRating rating={ratings[index] || 0} setRating={(newRating) => setRatings(prev => ({...prev, [index]: newRating}))}/>
                                    </div>
                                </div>
                             )
                        })}
                    </div>
                )}
                 {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default RecommendationScreen; 