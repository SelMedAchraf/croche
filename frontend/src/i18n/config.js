import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        products: 'Products',
        customOrders: 'Custom Orders',
        about: 'About',
        contact: 'Contact',
        cart: 'Cart',
        admin: 'Admin'
      },
      // Home Page
      home: {
        hero: {
          title: 'Handmade Crochet Creations',
          subtitle: 'Unique handmade gifts crafted with love',
          shopNow: 'Shop Now',
          customOrder: 'Custom Order'
        },
        featured: 'Featured Products',
        popular: 'Popular Items',
        aboutTitle: 'About the Artist',
        instagramTitle: 'Follow Us on Instagram',
        newsletter: {
          title: 'Stay Updated',
          subtitle: 'Subscribe to get special offers and updates',
          placeholder: 'Enter your email',
          button: 'Subscribe'
        }
      },
      // Products
      products: {
        title: 'Our Products',
        all: 'All Products',
        filter: 'Filter by Category',
        addToCart: 'Add to Cart',
        outOfStock: 'Out of Stock',
        viewDetails: 'View Details',
        categories: {
          all: 'All'
        }
      },
      // Product Details
      productDetails: {
        price: 'Price',
        colors: 'Available Colors',
        quantity: 'Quantity',
        description: 'Description',
        addToCart: 'Add to Cart',
        relatedProducts: 'Related Products'
      },
      // Cart
      cart: {
        title: 'Shopping Cart',
        empty: 'Your cart is empty',
        continueShopping: 'Continue Shopping',
        remove: 'Remove',
        quantity: 'Quantity',
        price: 'Price',
        total: 'Total',
        subtotal: 'Subtotal',
        checkout: 'Proceed to Checkout'
      },
      // Checkout
      checkout: {
        title: 'Checkout',
        customerInfo: 'Customer Information',
        name: 'Full Name',
        phone: 'Phone Number',
        city: 'City',
        deliveryNotes: 'Delivery Notes (Optional)',
        orderSummary: 'Order Summary',
        placeOrder: 'Place Order',
        paymentMethod: 'Payment Method',
        cashOnDelivery: 'Cash on Delivery',
        success: 'Order placed successfully!',
        thankYou: 'Thank you for your order'
      },
      // Custom Orders
      customOrders: {
        title: 'Custom Crochet Orders',
        subtitle: 'Build your perfect custom bouquet with our price calculator',
        formTitle: 'Tell us about your custom order',
        description: 'Describe your idea',
        preferredColors: 'Preferred Colors',
        budget: 'Your Budget',
        contactInfo: 'Contact Information',
        submit: 'Submit Request',
        success: 'Request submitted successfully!',
        selectFlowers: 'Select Flowers',
        selectWrapping: 'Select Wrapping',
        addAccessories: 'Add Accessories',
        orderSummary: 'Order Summary',
        noComponents: 'No components selected yet',
        totalPrice: 'Total Price'
      },
      // Items
      items: {
        title: 'Items',
        addItem: 'Add Item',
        editItem: 'Edit Item',
        name: 'Item Name',
        category: 'Category',
        description: 'Description',
        price: 'Price',
        imageUrl: 'Image URL',
        categories: {
          flower: 'Flower',
          packaging: 'Packaging',
          accessory: 'Accessory'
        }
      },
      // Delivery Prices
      deliveryPrices: {
        title: 'Delivery Prices',
        wilaya: 'Wilaya',
        wilayaCode: 'Code',
        homeDelivery: 'Home Delivery',
        stopDesk: 'Stop Desk',
        selectWilaya: 'Select Wilaya',
        deliveryType: 'Delivery Type'
      },
      // About
      about: {
        title: 'About the Artist',
        story: 'My Story',
        mission: 'Our Mission',
        values: 'Our Values'
      },
      // Contact
      contact: {
        title: 'Contact Us',
        getInTouch: 'Get in Touch',
        name: 'Your Name',
        email: 'Your Email',
        message: 'Your Message',
        send: 'Send Message',
        success: 'Message sent successfully!'
      },
      // Common
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        tryAgain: 'Try Again',
        viewMore: 'View More',
        learnMore: 'Learn More',
        backHome: 'Back to Home'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
