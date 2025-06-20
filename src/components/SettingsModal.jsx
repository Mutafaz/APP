import React, { useState } from 'react';

const SettingsModal = ({ isVisible, onClose, onSave, userName, userLocation }) => {
    if (!isVisible) return null;
    const [name, setName] = useState(userName);
    const [city, setCity] = useState(userLocation.city);
    const [state, setState] = useState(userLocation.state);

    const handleSave = () => {
        onSave({ name, location: { city, state } });
        onClose();
    };

    return (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Settings</h2>
                <div className="space-y-4">
                    <input type="text" className="w-full bg-gray-100 p-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-purple-500" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="text" className="w-full bg-gray-100 p-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-purple-500" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                    <input type="text" className="w-full bg-gray-100 p-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-purple-500" placeholder="State / Province" value={state} onChange={(e) => setState(e.target.value)} />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold">Save</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal; 