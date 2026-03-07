import { useState, useEffect } from 'react';
import axios from 'axios';

export const useColors = (availableFilter = null) => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchColors = async (filter = availableFilter) => {
    try {
      setLoading(true);
      let url = `${apiUrl}/colors`;
      
      // Add filter query parameter if specified
      if (filter === 'available') {
        url += '?available=true';
      } else if (filter === 'unavailable') {
        url += '?available=false';
      }
      
      const response = await axios.get(url);
      setColors(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching colors:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createColor = async (colorData, token) => {
    try {
      const response = await axios.post(
        `${apiUrl}/colors`,
        colorData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      await fetchColors();
      return response.data;
    } catch (err) {
      console.error('Error creating color:', err);
      throw err;
    }
  };

  const updateColor = async (id, colorData, token) => {
    try {
      const response = await axios.put(
        `${apiUrl}/colors/${id}`,
        colorData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      await fetchColors();
      return response.data;
    } catch (err) {
      console.error('Error updating color:', err);
      throw err;
    }
  };

  const deleteColor = async (id, token) => {
    try {
      await axios.delete(
        `${apiUrl}/colors/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      await fetchColors();
    } catch (err) {
      console.error('Error deleting color:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchColors();
  }, [availableFilter]);

  return {
    colors,
    loading,
    error,
    refetch: fetchColors,
    createColor,
    updateColor,
    deleteColor
  };
};
