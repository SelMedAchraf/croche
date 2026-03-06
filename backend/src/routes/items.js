import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get all items (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get single item by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Create item (admin only)
router.post('/',
  authenticateAdmin,
  [
    body('name').notEmpty().trim(),
    body('category').notEmpty().trim(),
    body('image_url').notEmpty().trim(),
    body('price').isFloat({ min: 0 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, category, image_url, price } = req.body;

      const { data, error } = await supabase
        .from('items')
        .insert([{
          name,
          category,
          image_url,
          price
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('Error creating item:', error);
      res.status(500).json({ error: 'Failed to create item' });
    }
  }
);

// Update item (admin only)
router.put('/:id',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { name, category, image_url, price } = req.body;

      const { data, error } = await supabase
        .from('items')
        .update({
          name,
          category,
          image_url,
          price
        })
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Item not found' });
      }

      res.json(data);
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ error: 'Failed to update item' });
    }
  }
);

// Delete item (admin only)
router.delete('/:id',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', req.params.id);

      if (error) throw error;
      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ error: 'Failed to delete item' });
    }
  }
);

export default router;
