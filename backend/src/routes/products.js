import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('is_active', true);

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin only)
router.post('/',
  authenticateAdmin,
  [
    body('name').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('price').isFloat({ min: 0 }),
    body('category').notEmpty().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description, price, category, colors, stock_quantity, tags } = req.body;

      const { data, error } = await supabase
        .from('products')
        .insert([{
          name,
          description,
          price,
          category,
          colors: colors || [],
          stock_quantity: stock_quantity || 0,
          tags: tags || [],
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
);

// Update product (admin only)
router.put('/:id',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { name, description, price, category, colors, stock_quantity, tags, is_active } = req.body;

      const { data, error } = await supabase
        .from('products')
        .update({
          name,
          description,
          price,
          category,
          colors,
          stock_quantity,
          tags,
          is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(data);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }
);

// Delete product (admin only)
router.delete('/:id',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', req.params.id);

      if (error) throw error;
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
);

// Upload product image (admin only)
router.post('/:id/images',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { url, is_primary } = req.body;
      
      const { data, error } = await supabase
        .from('product_images')
        .insert([{
          product_id: req.params.id,
          image_url: url,
          is_primary: is_primary || false
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('Error adding product image:', error);
      res.status(500).json({ error: 'Failed to add product image' });
    }
  }
);

export default router;
