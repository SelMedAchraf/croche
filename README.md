# Croche Ella - Handmade Crochet E-Commerce Website

A beautiful, full-stack e-commerce platform for showcasing and selling handmade crochet creations. Built with modern technologies and featuring multi-language support, admin dashboard, and seamless user experience.

![Croche Ella](https://images.unsplash.com/photo-1606997724049-c0c1b0be2a8a?w=1200)

## 🌟 Features

### Customer Features
- 🛍️ **Product Catalog** - Browse beautiful crochet products with filtering and search
- 🛒 **Shopping Cart** - Add products, manage quantities, and checkout seamlessly
- 🌐 **Multi-Language** - Full support for English, French, and Arabic (with RTL)
- 📱 **Responsive Design** - Perfect experience on mobile, tablet, and desktop
- 🖼️ **Image Gallery** - View stunning crochet creations
- 💝 **Custom Orders** - Request personalized crochet items
- 💬 **Testimonials** - Read reviews from happy customers
- 📞 **Contact** - Easy communication with the artist
- 💚 **WhatsApp Integration** - Quick messaging via floating button

### Admin Features
- 🔐 **Secure Authentication** - Protected admin panel with Supabase Auth
- 📦 **Product Management** - Add, edit, and delete products
- 📋 **Order Management** - View and update order statuses
- 📊 **Analytics Dashboard** - Track sales and popular products
- 🖼️ **Gallery Management** - Upload and manage showcase images
- ⭐ **Testimonial Management** - Add and moderate customer reviews

## 🚀 Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Framer Motion** - Animations
- **i18next** - Internationalization
- **Axios** - HTTP client
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime
- **Express** - API framework
- **Supabase** - Database & Authentication
- **PostgreSQL** - Database

### Infrastructure
- **Supabase** - Database, Auth, Storage
- **Vercel** - Frontend hosting (recommended)
- **Render** - Backend hosting (recommended)

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SelMedAchraf/croche.git
cd croche
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `database/schema.sql`
3. Get your project URL and anon key from Settings > API

### 3. Configure Environment Variables

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Frontend (.env)
```bash
cd ../frontend
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

## 🏃 Running Locally

### Start Backend Server
```bash
cd backend
npm run dev
```
Backend runs on http://localhost:5000

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

## 👤 Admin Access

### Create Admin User

1. Go to your Supabase project
2. Navigate to Authentication > Users
3. Click "Add User"
4. Enter email and password
5. User will be created - use these credentials to login at `/admin/login`

### Admin Routes
- Login: `http://localhost:5173/admin/login`
- Dashboard: `http://localhost:5173/admin/dashboard`

## 🗄️ Database Schema

The database includes the following tables:
- **products** - Product information
- **product_images** - Product image URLs
- **orders** - Customer orders
- **order_items** - Individual items in orders
- **testimonials** - Customer reviews
- **gallery** - Gallery images

See `database/schema.sql` for complete schema.

## 📦 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set environment variables:
   - `VITE_API_URL`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

### Backend (Render)

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect your repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend`
5. Set environment variables:
   - `PORT`
   - `NODE_ENV`
   - `FRONTEND_URL` (your Vercel URL)
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
6. Deploy

## 🎨 Customization

### Colors
Edit `frontend/tailwind.config.js`:
```js
colors: {
  primary: '#F8C8DC',    // Soft pink
  secondary: '#FFF6F9',  // Cream
  accent: '#F5E6DA',     // Warm beige
  highlight: '#D9C6F3',  // Lavender
  text: '#3A3A3A',       // Dark gray
}
```

### Fonts
Fonts are imported in `frontend/src/index.css`:
- Headings: Playfair Display
- Body: Poppins

### Content
Update translations in `frontend/src/i18n/config.js`

## 📱 Features Overview

### Multi-Language Support
The site supports:
- **English** (en) - Default
- **French** (fr)
- **Arabic** (ar) - with full RTL support

Language switcher is in the navbar.

### Payment Method
Currently supports **Cash on Delivery** only. Can be extended to include:
- Stripe
- PayPal
- Other payment gateways

### Image Storage
Uses **Supabase Storage** for:
- Product images
- Gallery images
- Testimonial images

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify environment variables are set
- Check Supabase credentials

### Frontend won't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running

### Admin login fails
- Verify user exists in Supabase Auth
- Check Supabase configuration
- Ensure credentials are correct

## 📄 License

MIT License - feel free to use for your own projects!

## 👤 Author

**Croche Ella**
- Instagram: [@croche.ella_](https://www.instagram.com/croche.ella_/)
- Website: [Coming Soon]

## 🙏 Acknowledgments

- Design inspired by modern e-commerce best practices
- Images from Unsplash
- Icons from React Icons

## 📞 Support

For questions or issues:
- Email: contact@crocheella.com
- Instagram: @croche.ella_
- WhatsApp: [Your Number]

---

Made with ❤️ and 🧶 by Croche Ella
