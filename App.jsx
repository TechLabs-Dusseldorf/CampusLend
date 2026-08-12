import { useState, useEffect, useMemo } from 'react';
import { fetchItems, addItem, deleteItem } from './api/items';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import ItemGrid from './components/ItemGrid';
import OfferItem from './components/OfferItem';

function App() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success'); // 'success' or 'error'

  // Fetch items on initial load
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError(null); // Clear any previous error
      try {
        const fetchedItems = await fetchItems();
        setItems(fetchedItems);
      } catch (error) {
        console.error('Error fetching items:', error);
        setError('Unable to connect to the campus network. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  // Compute filtered items based on search term and category
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Filter by category
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Filter by search term
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(term);
        const matchesDescription = item.description.toLowerCase().includes(term);
        return matchesTitle || matchesDescription;
      }

      return true;
    });
  }, [items, searchTerm, selectedCategory]);

  // Set a temporary message that clears after 3 seconds
  const setTemporaryMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  // Handle category filter change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Handle search change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // Handle adding new item
  const handleItemAdded = async (newItem) => {
    try {
      const addedItem = await addItem(newItem);
      setItems(prev => [...prev, addedItem]);
      setTemporaryMessage('Item added successfully!', 'success');
    } catch (error) {
      console.error('Error adding item:', error);
      setTemporaryMessage('Failed to add item. Please try again.', 'error');
    }
  };

  // Handle deleting item
  const handleItemDeleted = async (id) => {
    try {
      await deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      setTemporaryMessage('Item deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting item:', error);
      setTemporaryMessage('Failed to delete item. Please try again.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans antialiased text-slate-800">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="flex items-center justify-center space-x-3">
              <div className="h-5 w-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500">Loading items...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans antialiased text-slate-800">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-slate-800">
      <Header />
      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className={messageType === 'success' ? 'bg-green-50 text-green-800 rounded-lg p-4 mb-6 flex items-center space-x-3' : 'bg-red-50 text-red-800 rounded-lg p-4 mb-6 flex items-center space-x-3'}>
            {messageType === 'success' ? (
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000-16m1-7a1 1 0 10-2 0v4H7a1 1 0 100-2h2V7a1 1 0 001-1h2a1 1 0 100 2h-2v2h2z" clipRule="evenodd" />
              </svg>
            )}
            <span>{message}</span>
          </div>
        </div>
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Campus Inventory
          </h1>
          <div className="space-y-4">
            <CategoryFilter onFilterChange={handleCategoryChange} />
            <SearchBar onSearchChange={handleSearchChange} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <ItemGrid
            items={filteredItems}
            onDelete={handleItemDeleted}
          />
        </div>

        <div className="mt-8">
          <OfferItem
            onItemAdded={handleItemAdded}
            onItemDeleted={handleItemDeleted}
          />
        </div>
      </main>
    </div>
  );
}

export default App;