import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all gallery images (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
});

// Add gallery image (admin only)
router.post('/',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { image_url, title, description } = req.body;

      const { data, error } = await supabase
        .from('gallery')
        .insert([{ image_url, title, description }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('Error adding gallery image:', error);
      res.status(500).json({ error: 'Failed to add gallery image' });
    }
  }
);

// Delete gallery image (admin only)
router.delete('/:id',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', req.params.id);

      if (error) throw error;
      res.json({ message: 'Gallery image deleted successfully' });
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      res.status(500).json({ error: 'Failed to delete gallery image' });
    }
  }
);

export default router;
