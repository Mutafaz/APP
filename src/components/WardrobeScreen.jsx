import React from 'react';
import { SettingsIcon } from './icons';

const WardrobeScreen = ({ clothing, selectedItems, onSelectItem, userName, onSettingsClick }) => (
  <div className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 overflow-y-auto">
    <div className="p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-gray-800">Hello, {userName || 'Style Seeker'}!</h1>
        <button onClick={onSettingsClick} className="text-gray-500 hover:text-purple-600">
            <SettingsIcon/>
        </button>
      </div>
      <p className="mt-2 text-gray-600">Tap items you'd love to wear today.</p>
    </div>
    <div className="flex flex-wrap px-2">
      {clothing.map(item => {
        const isSelected = selectedItems.includes(item.id);
        return (
          <div key={item.id} className="w-1/3 p-2" onClick={() => onSelectItem(item.id)}>
            <div className={`w-full aspect-square relative rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${isSelected ? 'ring-4 ring-purple-500 shadow-lg' : 'shadow-md'}`}>
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                    <p className="text-white font-bold text-xs truncate">{item.name}</p>
                </div>
                {isSelected && (
                    <div className="absolute top-2 right-2 bg-purple-500 text-white rounded-full h-6 w-6 flex items-center justify-center border-2 border-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
          </div>
        )
      })}
    </div>
  </div>
);

export default WardrobeScreen; 