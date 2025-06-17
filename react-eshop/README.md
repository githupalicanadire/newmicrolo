# EShop React Frontend

Modern React TypeScript e-commerce application built to work with the .NET microservices backend.

## 🚀 Features

- **Modern React 18** with TypeScript
- **Responsive Design** with Tailwind CSS
- **State Management** with Zustand
- **API Integration** with React Query/TanStack Query
- **Authentication** with Identity Server 4 support
- **Shopping Cart** with persistent storage
- **Product Catalog** with search and filtering
- **Checkout Process** with form validation
- **Order Management** for tracking purchases
- **Mobile-First** responsive design

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Zustand** - State management
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Lucide React** - Icons

## 🏗️ Backend Integration

This frontend is designed to work with the .NET microservices backend:

- **Identity Server**: Port 6006 (Authentication)
- **API Gateway**: Port 6004 (YARP Reverse Proxy)
- **Catalog Service**: Port 6000 (Products)
- **Basket Service**: Port 6001 (Shopping Cart)
- **Ordering Service**: Port 6003 (Orders)
- **Discount Service**: Port 6002 (Discounts)

## 📦 Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🔧 Configuration

The app is configured to work with the backend services via Vite proxy:

- Frontend: `http://localhost:3000`
- API calls proxy to: `http://localhost:6004` (API Gateway)
- Identity calls proxy to: `http://localhost:6006` (Identity Server)

### Environment Setup

Make sure your .NET backend services are running:

```bash
# In the backend project root
cd src
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

## 🎯 Key Features

### Authentication

- Integration with Identity Server 4
- JWT token management
- Protected routes
- Demo login credentials included

### Shopping Experience

- Product browsing with categories
- Advanced search and filtering
- Product detail views
- Shopping cart management
- Secure checkout process

### User Management

- User profile management
- Order history
- Wishlist functionality (demo)

### Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions

## 🧪 Demo Credentials

The app includes demo login functionality:

**Admin User:**

- Email: `admin@toyshop.com`
- Password: `Admin123!`

**Regular User:**

- Email: `john.doe@example.com`
- Password: `User123!`

## 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── cart/           # Shopping cart components
│   ├── layout/         # Layout components
│   └── products/       # Product-related components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── pages/              # Page components
├── store/              # Zustand state stores
├── types/              # TypeScript type definitions
└── App.tsx             # Main app component
```

## 🎨 Styling

The app uses Tailwind CSS with a custom design system:

- **Primary Colors**: Blue gradient theme
- **Secondary Colors**: Green accents
- **Typography**: Inter font family
- **Animations**: Custom CSS animations
- **Components**: Utility-first approach

## 🔐 Security Features

- JWT token validation
- Protected route guards
- XSS protection
- CSRF protection
- Secure cookie handling

## 🚀 Performance

- Code splitting with React.lazy
- Image optimization with lazy loading
- Efficient state management
- Optimized bundle size
- Fast development server

## 📱 Mobile Experience

- Responsive navigation
- Touch-friendly interactions
- Mobile-optimized forms
- Swipe gestures support
- Progressive Web App ready

## 🧩 API Integration

The app integrates with backend APIs through:

- RESTful API calls
- Error handling with toast notifications
- Loading states and skeletons
- Optimistic updates
- Cache management

## 🔄 State Management

Using Zustand for clean state management:

- **Auth Store**: User authentication state
- **Cart Store**: Shopping cart state
- **UI Store**: UI component state

## 🎯 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced product filtering
- [ ] Social authentication
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Progressive Web App features

## 🐛 Known Issues

- Demo mode - some features are mocked
- Identity Server integration requires backend running
- Image URLs are placeholder images from Unsplash

## 📄 License

This project is licensed under the MIT License.
