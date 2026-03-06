import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../config/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Create category (admin only)
router.post(
  '/',
  authenticateAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name } = req.body;

      const { data, error } = await supabase
        .from('categories')
        .insert([{ name }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return res.status(400).json({ error: 'Category with this name already exists' });
        }
        throw error;
      }

      res.status(201).json(data);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Failed to create category' });
    }
  }
);

// Update category (admin only)
router.put(
  '/:id',
  authenticateAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name } = req.body;

      // First, get the old category name
      const { data: oldCategory, error: fetchError } = await supabase
        .from('categories')
        .select('name')
        .eq('id', req.params.id)
        .single();

      if (fetchError) throw fetchError;
      if (!oldCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }

      const oldName = oldCategory.name;

      // Update the category
      const { data, error } = await supabase
        .from('categories')
        .update({
          name,
          updated_at: new Date().toISOString()
        })
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return res.status(400).json({ error: 'Category with this name already exists' });
        }
        throw error;
      }

      if (!data) {
        return res.status(404).json({ error: 'Category not found' });
      }

      // Update all products with the old category name to the new category name
      const { error: updateProductsError } = await supabase
        .from('products')
        .update({ category: name })
        .eq('category', oldName);

      if (updateProductsError) {
        console.error('Error updating products:', updateProductsError);
        // Don't throw error here, category update was successful
      }

      res.json(data);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Failed to update category' });
    }
  }
);

// Delete category (admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    // First, get the category name
    const { data: category, error: fetchError } = await supabase
      .from('categories')
      .select('name')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if any products use this category
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')
      .eq('category', category.name)
      .limit(1);

    if (productsError) throw productsError;

    if (products && products.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete this category. There are products using this category. Please delete the products first or reassign them to another category.' 
      });
    }

    // If no products use this category, proceed with deletion
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
