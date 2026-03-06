import { useState, useEffect } from 'react';
import axios from 'axios';

export const useItems = (category = null) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchItems = async () => {
    try {
      setLoading(true);
      const url = category 
        ? `${apiUrl}/items?category=${category}`
        : `${apiUrl}/items`;
      const response = await axios.get(url);
      setItems(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData, token) => {
    try {
      const response = await axios.post(
        `${apiUrl}/items`,
        itemData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      await fetchItems();
      return response.data;
    } catch (err) {
      console.error('Error creating item:', err);
      throw err;
    }
  };

  const updateItem = async (id, itemData, token) => {
    try {
      const response = await axios.put(
        `${apiUrl}/items/${id}`,
        itemData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      await fetchItems();
      return response.data;
    } catch (err) {
      console.error('Error updating item:', err);
      throw err;
    }
  };

  const deleteItem = async (id, token) => {
    try {
      await axios.delete(
        `${apiUrl}/items/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      await fetchItems();
    } catch (err) {
      console.error('Error deleting item:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category]);

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
    createItem,
    updateItem,
    deleteItem
  };
};
