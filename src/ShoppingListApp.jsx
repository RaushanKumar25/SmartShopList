import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Edit3, Save, X, ShoppingCart, Calendar, Bell } from 'lucide-react';

const ShoppingListApp = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState('1');
  const [newCategory, setNewCategory] = useState('Other');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [filter, setFilter] = useState('all');
  const [reminders, setReminders] = useState([]);

  const categories = ['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Bakery', 'Pantry', 'Frozen', 'Other'];

  // Add new item
  const addItem = () => {
    if (newItem.trim()) {
      const item = {
        id: Date.now(),
        name: newItem.trim(),
        quantity: newQuantity,
        category: newCategory,
        completed: false,
        dateAdded: new Date().toLocaleDateString()
      };
      setItems([...items, item]);
      setNewItem('');
      setNewQuantity('1');
      setNewCategory('Other');
    }
  };

  // Toggle item completion
  const toggleComplete = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  // Delete item
  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Start editing
  const startEdit = (id, name, quantity) => {
    setEditingId(id);
    setEditText(name);
    setEditQuantity(quantity);
  };

  // Save edit
  const saveEdit = () => {
    setItems(items.map(item => 
      item.id === editingId 
        ? { ...item, name: editText, quantity: editQuantity }
        : item
    ));
    setEditingId(null);
    setEditText('');
    setEditQuantity('');
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditQuantity('');
  };

  // Filter items
  const filteredItems = items.filter(item => {
    if (filter === 'completed') return item.completed;
    if (filter === 'pending') return !item.completed;
    return true;
  });

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Clear completed items
  const clearCompleted = () => {
    setItems(items.filter(item => !item.completed));
  };

  // Add reminder
  const addReminder = () => {
    const reminder = {
      id: Date.now(),
      message: `Don't forget your shopping list with ${items.filter(item => !item.completed).length} items!`,
      time: new Date().toLocaleString()
    };
    setReminders([reminder, ...reminders.slice(0, 4)]);
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingCart size={32} />
              <h1 className="text-3xl font-bold">Shopping List</h1>
            </div>
            <div className="text-right">
              <div className="text-blue-100 text-sm">Progress</div>
              <div className="text-xl font-semibold">
                {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 bg-blue-500 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Add Item Form */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              placeholder="Add new item..."
              className="flex-1 min-w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              placeholder="Qty"
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              onClick={addItem}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Filter and Actions */}
        <div className="p-4 border-b bg-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({totalCount - completedCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'completed' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Done ({completedCount})
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={addReminder}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Bell size={18} />
              <span>Remind</span>
            </button>
            <button
              onClick={clearCompleted}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear Done
            </button>
          </div>
        </div>

        {/* Shopping List */}
        <div className="max-h-96 overflow-y-auto">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Your shopping list is empty</p>
              <p className="text-sm">Add some items to get started!</p>
            </div>
          ) : (
            Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category} className="border-b">
                <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700 sticky top-0">
                  {category} ({categoryItems.length})
                </div>
                {categoryItems.map(item => (
                  <div
                    key={item.id}
                    className={`p-4 border-b transition-all ${
                      item.completed ? 'bg-green-50' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    {editingId === item.id ? (
                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(e.target.value)}
                          className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={saveEdit}
                          className="p-2 text-green-600 hover:bg-green-100 rounded"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleComplete(item.id)}
                            className={`p-2 rounded-full transition-colors ${
                              item.completed
                                ? 'bg-green-500 text-white'
                                : 'border-2 border-gray-300 hover:border-green-500'
                            }`}
                          >
                            <Check size={16} />
                          </button>
                          <div className="flex-1">
                            <span
                              className={`text-lg ${
                                item.completed
                                  ? 'line-through text-gray-500'
                                  : 'text-gray-900'
                              }`}
                            >
                              {item.name}
                            </span>
                            <div className="text-sm text-gray-500">
                              Qty: {item.quantity} • Added: {item.dateAdded}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => startEdit(item.id, item.name, item.quantity)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Reminders Section */}
        {reminders.length > 0 && (
          <div className="p-4 bg-purple-50 border-t">
            <div className="flex items-center space-x-2 mb-3">
              <Bell size={20} className="text-purple-600" />
              <h3 className="font-semibold text-purple-800">Recent Reminders</h3>
            </div>
            <div className="space-y-2">
              {reminders.map(reminder => (
                <div key={reminder.id} className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-gray-800">{reminder.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{reminder.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Footer */}
        <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
          Total: {totalCount} items • Completed: {completedCount} • Remaining: {totalCount - completedCount}
        </div>
      </div>
    </div>
  );
};

export default ShoppingListApp;