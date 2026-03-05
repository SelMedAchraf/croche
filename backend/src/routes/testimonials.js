import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all testimonials (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Add testimonial (admin only)
router.post('/',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { customer_name, message, rating, image_url } = req.body;

      const { data, error } = await supabase
        .from('testimonials')
        .insert([{
          customer_name,
          message,
          rating,
          image_url,
          is_approved: true
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('Error adding testimonial:', error);
      res.status(500).json({ error: 'Failed to add testimonial' });
    }
  }
);

// Delete testimonial (admin only)
router.delete('/:id',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', req.params.id);

      if (error) throw error;
      res.json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      res.status(500).json({ error: 'Failed to delete testimonial' });
    }
  }
);

export default router;
