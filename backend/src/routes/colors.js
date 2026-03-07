import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get all colors (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const { available } = req.query;
    
    let query = supabase
      .from('colors')
      .select('*');

    // Filter by availability if specified
    if (available === 'true') {
      query = query.eq('available', true);
    } else if (available === 'false') {
      query = query.eq('available', false);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching colors:', error);
    res.status(500).json({ error: 'Failed to fetch colors' });
  }
});

// Get single color by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('colors')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Color not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching color:', error);
    res.status(500).json({ error: 'Failed to fetch color' });
  }
});

// Create color (admin only)
router.post('/',
  authenticateAdmin,
  [
    body('name').notEmpty().trim().withMessage('Color name is required'),
    body('image_url').notEmpty().trim().withMessage('Image URL is required'),
    body('available').isBoolean().withMessage('Available must be a boolean')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, image_url, available } = req.body;

      const { data, error } = await supabase
        .from('colors')
        .insert([{
          name,
          image_url,
          available: available !== undefined ? available : true
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('Error creating color:', error);
      res.status(500).json({ error: 'Failed to create color' });
    }
  }
);

// Update color (admin only)
router.put('/:id',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { name, image_url, available } = req.body;

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (image_url !== undefined) updateData.image_url = image_url;
      if (available !== undefined) updateData.available = available;

      const { data, error } = await supabase
        .from('colors')
        .update(updateData)
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Color not found' });
      }

      res.json(data);
    } catch (error) {
      console.error('Error updating color:', error);
      res.status(500).json({ error: 'Failed to update color' });
    }
  }
);

// Delete color (admin only)
router.delete('/:id',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { error } = await supabase
        .from('colors')
        .delete()
        .eq('id', req.params.id);

      if (error) throw error;
      res.json({ message: 'Color deleted successfully' });
    } catch (error) {
      console.error('Error deleting color:', error);
      res.status(500).json({ error: 'Failed to delete color' });
    }
  }
);

export default router;
