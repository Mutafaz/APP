import React, { useState } from 'react';

const AddItemScreen = ({ onAddItem, loading }) => {
    const [itemName, setItemName] = useState('');
    const [itemCategory, setItemCategory] = useState('');
    const [itemImage, setItemImage] = useState(null);

    const handleAddItem = () => {
        onAddItem({ name: itemName, category: itemCategory, image: itemImage });
        setItemName(''); setItemCategory(''); setItemImage(null);
    };

    return (
      <div className="flex-1 bg-gray-50 overflow-y-auto p-5">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-5">Add New Item</h1>
          <div className="space-y-5">
              <label htmlFor="image-upload" className="cursor-pointer group">
                  <div className="h-52 w-full bg-gray-200 rounded-2xl flex flex-col justify-center items-center overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-purple-400 transition-all">
                      {itemImage ? <img src={itemImage.uri} alt="Preview" className="w-full h-full object-cover" /> : <p className="text-lg font-semibold text-gray-700">Select Image</p>}
                  </div>
              </label>
              <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files && e.target.files[0]) setItemImage({file: e.target.files[0], uri: URL.createObjectURL(e.target.files[0])})}} />
              <input type="text" className="w-full bg-white p-4 rounded-lg text-base border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" placeholder="Item Name (e.g., Black Leather Jacket)" value={itemName} onChange={(e) => setItemName(e.target.value)} />
              <input type="text" className="w-full bg-white p-4 rounded-lg text-base border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" placeholder="Category (e.g., Shirt, Shoes)" value={itemCategory} onChange={(e) => setItemCategory(e.target.value)} />
              <button onClick={handleAddItem} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-lg text-lg font-bold hover:shadow-lg disabled:opacity-50 flex justify-center transform hover:scale-105 transition-transform">
                  {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Add to Wardrobe'}
              </button>
          </div>
      </div>
    );
};

export default AddItemScreen; 