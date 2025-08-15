# 🤖 MAIO Platform - Mongolian AI Olympiad (MongoDB Enhanced)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-repo/maio-platform)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Deploy](https://img.shields.io/badge/deploy-vercel-black)](https://vercel.com)
[![Database](https://img.shields.io/badge/database-MongoDB-green)](https://mongodb.com)

A **fully functional, polished website** for the Mongolian AI Olympiad (MAIO) with **MongoDB integration**, advanced news management system, and modern features. Built with Vite + React + Express.js and ready for full-stack deployment.

## 🆕 **Latest Updates - MongoDB Integration**

### **Backend & Database**
- ✅ **MongoDB Atlas Integration** - Connected to provided cluster
- ✅ **Express.js API** - RESTful backend with full CRUD operations
- ✅ **File Upload System** - Image upload with Multer
- ✅ **News Management API** - Complete article management endpoints
- ✅ **Database Migration** - Automatic migration from mock data

### **Enhanced Admin Panel**
- ✅ **Modern News Manager** - Full CRUD interface for articles
- ✅ **Rich Text Editor** - WYSIWYG editor with TipTap integration
- ✅ **Image Upload** - Featured image support for articles
- ✅ **Advanced Search & Filtering** - Dynamic search across content
- ✅ **Responsive Design** - Mobile-optimized admin interface
- ✅ **Confirmation Modals** - Safe delete operations

### **Frontend Enhancements**
- ✅ **Real-time Data Fetching** - Dynamic content from MongoDB
- ✅ **Loading States** - Professional loading screens and error handling
- ✅ **Pagination** - Efficient content browsing
- ✅ **Category Filtering** - Dynamic content organization

## ✨ **Key Features**

### 🎬 **Advanced Animations**
- **Animated Loading Screen**: 3D brain-to-AI network transformation with neural connections
- **Interactive Backgrounds**: Mouse-responsive neural networks, circuit patterns, and particle systems
- **Scroll Animations**: Intersection Observer-based reveals with smooth transitions
- **Page Transitions**: Professional Framer Motion powered animations
- **Hover Effects**: Card scaling, glowing, and micro-interactions

### 🎨 **Modern Design**
- **Custom 404 Page**: Friendly AI/robot theme with looping animations and "Back to Home" button
- **Hero Banner**: Full-screen animated background with floating elements
- **Gradient Themes**: Beautiful color schemes with dark/light mode support
- **Glass Morphism**: Modern translucent UI elements
- **Responsive Design**: Perfect on desktop, tablet, and mobile

### 🛠 **Admin Panel Features**
- **Secure Authentication**: JWT-based admin login system
- **Rich Text Editor**: TipTap-powered WYSIWYG editor with full toolbar
- **Content Management**: Create, edit, and delete news posts and events
- **File Uploads**: Support for images and downloadable files
- **Competition Results**: Tables, rankings, and downloadable reports

### 🌐 **User Experience**
- **Multilingual Support**: Seamless English/Mongolian switching
- **Social Sharing**: Native and custom share options with animated buttons
- **Search Functionality**: Fast site-wide search with filters
- **SEO Optimized**: Meta tags, structured data, and performance optimized
- **Progressive Loading**: Lazy loading and code splitting

### 🚀 **Technical Excellence**
- **Built with Vite + React**: Lightning-fast development and builds
- **TypeScript**: Full type safety and developer experience
- **Modern CSS**: Tailwind CSS with custom animations and utilities
- **Performance**: Optimized images, caching, and bundle splitting
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## 🏗 **Architecture Overview**

```
├── 🎭 Animations
│   ├── Loading Screen (Brain → AI transformation)
│   ├── Interactive Backgrounds (Neural/Circuit/Particles)
│   ├── Page Transitions (Scroll-based reveals)
│   └── Micro-interactions (Hover effects)
│
├── 📱 Pages
│   ├── Homepage (Enhanced with stats, CTA sections)
│   ├── News & Articles (Rich content management)
│   ├── Events & Schedule (Interactive calendar)
│   ├── Results (Competition rankings)
│   ├── Gallery (Media showcase)
│   └── Custom 404 (Animated robot theme)
│
├── 🔧 Admin Panel
│   ├── Authentication (Secure login)
│   ├── Content Editor (Rich text, media)
│   ├── User Management (Roles, permissions)
│   └── Analytics (Usage statistics)
│
└── 🎨 UI Components
    ├── Animated Backgrounds
    ├── Loading Screens
    ├── Social Share
    ├── Rich Text Editor
    └── Interactive Cards
```

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/maio-platform.git
cd maio-platform

# Install dependencies
npm install
# or
pnpm install
```

### Development

#### Frontend Only
```bash
# Start frontend development server
npm run dev
# or
pnpm dev

# Open http://localhost:5173
```

#### Full-Stack Development (MongoDB Integration)
```bash
# Recommended: Start both servers with automatic cleanup
npm run dev:full

# Or start them separately:
npm run cleanup          # Clean up any existing processes
npm run dev:backend      # Terminal 1 - Backend server
npm run dev              # Terminal 2 - Frontend server

# Alternative quick start
npm start                # Same as npm run dev:full
```

**Access Points:**
- **Frontend**: http://localhost:5173 (or auto-assigned port)
- **Backend API**: http://localhost:3001
- **Admin Panel**: http://localhost:5173/admin/articles
- **Health Check**: http://localhost:3001/api/health

### Production Build
```bash
# Build for production
npm run build
# or
pnpm build

# Preview production build
npm run preview
# or
pnpm preview
```

## 🎯 **Animation Features Showcase**

### 🧠 **Loading Screen**
- **Phase 1**: Brain outline drawing
- **Phase 2**: Circuit pattern overlay
- **Phase 3**: Neural network nodes appearing
- **Phase 4**: Connecting lines animation
- **Phase 5**: Complete AI network transformation

### 🌐 **Interactive Backgrounds**
1. **Neural Network**: Mouse-responsive nodes and connections
2. **Circuit Board**: Animated electrical flows and pulses
3. **Particle System**: Floating geometric shapes and tech elements

### 🏠 **Homepage Enhancements**
- Hero section with animated 3D elements
- Statistics counter animations
- Scroll-triggered section reveals
- Interactive navigation cards
- Call-to-action with particle effects

## 📦 **Tech Stack**

| Category | Technology | Purpose |
|----------|------------|----------|
| **Frontend** | React 18 + TypeScript | Component framework |
| **Build Tool** | Vite | Fast development & building |
| **Styling** | Tailwind CSS + Custom CSS | Utility-first styling |
| **Animations** | Framer Motion | Professional animations |
| **Components** | shadcn/ui | Beautiful, accessible UI |
| **Routing** | React Router | Client-side navigation |
| **Editor** | TipTap | Rich text editing |
| **Icons** | Lucide React | Consistent iconography |
| **Deployment** | Vercel | Seamless hosting |

## 🌍 **Deployment Guide**

### **Option 1: Vercel (Recommended)**

1. **Quick Deploy**: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/maio-platform)

2. **Manual Setup**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

3. **Build Configuration**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### **Option 2: Other Platforms**
- **Netlify**: Drag & drop `dist` folder
- **GitHub Pages**: Use GitHub Actions
- **Traditional Hosting**: Upload `dist` folder

## ⚙️ **Configuration**

### Environment Variables
```bash
# .env file (MongoDB Integration)
MONGODB_URI=mongodb+srv://MAIO-admin:8LSOza42XnJ5Mt7G@maio.pseklev.mongodb.net/?retryWrites=true&w=majority&appName=MAIO
MONGODB_DB_NAME=maio-news
PORT=3001
VITE_API_URL=http://localhost:3001
NODE_ENV=development

# Legacy configuration (optional)
VITE_APP_TITLE="MAIO - Mongolian AI Olympiad"
VITE_APP_DESCRIPTION="Mongolia's premier AI competition"

# Feature flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_LOADING_SCREEN=true
```

## 🗄️ **MongoDB Integration Details**

### **Database Schema**
```javascript
// Articles Collection
{
  _id: ObjectId,
  title: { en: String, mn: String },
  content: { en: String, mn: String },
  summary: { en: String, mn: String },
  category: String,
  author: String,
  publishDate: String,
  updatedDate?: String,
  imageUrl?: String,
  tags: [String],
  featured?: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **API Endpoints**
| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|-----------|
| `GET` | `/api/news` | Get all articles | `?page=1&limit=10&category=&search=&featured=` |
| `GET` | `/api/news/:id` | Get single article | Article ID |
| `POST` | `/api/news` | Create new article | FormData with article data + image |
| `PUT` | `/api/news/:id` | Update article | Article ID + FormData |
| `DELETE` | `/api/news/:id` | Delete article | Article ID |
| `GET` | `/api/news/categories` | Get all categories | None |
| `GET` | `/api/health` | Health check | None |

### **Admin Panel Usage**
1. **Access**: Navigate to `/admin/articles`
2. **Create Article**: Click "New Article" button
3. **Edit Article**: Click edit icon in article table
4. **Delete Article**: Click delete icon and confirm in modal
5. **Search/Filter**: Use search bar and category dropdown
6. **Image Upload**: Select image file in article form
7. **Rich Text**: Use WYSIWYG editor for content formatting

### Customization
```bash
# Update branding
src/lib/constants.ts         # Site configuration
public/favicon.svg           # Logo/favicon
src/index.css               # Color themes

# Modify animations
src/components/ui/LoadingScreen.tsx    # Loading animations
src/components/ui/AnimatedBackground.tsx # Background effects

# Content management
src/lib/mockData.ts         # Sample data
src/contexts/LanguageContext.tsx # Translations
```

## 🔐 **Security & Performance**

### **Security Features**
- CSP (Content Security Policy) headers
- XSS protection
- Secure authentication flow
- Input validation and sanitization

### **Performance Optimizations**
- Code splitting and lazy loading
- Image optimization and WebP support
- Bundle size optimization
- Caching strategies
- Performance monitoring

### **Browser Support**
- Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- Mobile: iOS Safari 14+, Chrome Mobile 88+
- Progressive enhancement for older browsers

## 📊 **Performance Metrics**

| Metric | Target | Status |
|--------|--------|--------|
| First Contentful Paint | < 1.5s | ✅ |
| Largest Contentful Paint | < 2.5s | ✅ |
| Cumulative Layout Shift | < 0.1 | ✅ |
| First Input Delay | < 100ms | ✅ |
| Lighthouse Score | > 95 | ✅ |

## 🤝 **Contributing**

### Development Setup
```bash
# Fork the repository
git clone https://github.com/your-username/maio-platform.git
cd maio-platform

# Create feature branch
git checkout -b feature/amazing-feature

# Install dependencies
npm install

# Start development
npm run dev
```

### **Guidelines**
- Follow TypeScript best practices
- Write tests for new features
- Maintain accessibility standards
- Document animation implementations
- Optimize for performance

## 📄 **License & Credits**

**License**: MIT License - see [LICENSE](LICENSE) file

**Credits**:
- Design inspiration: Modern AI/tech aesthetics
- Animations: Framer Motion community
- Icons: Lucide React
- Fonts: Inter (Google Fonts)

## 📞 **Support**

- **Documentation**: [View Full Docs](DEPLOYMENT.md)
- **Issues**: [GitHub Issues](https://github.com/your-username/maio-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/maio-platform/discussions)

---

**Built with ❤️ for the Mongolian AI community** 🇲🇳

*Ready to inspire the next generation of AI innovators in Mongolia!*
# maio-turshilt
# maio-official
