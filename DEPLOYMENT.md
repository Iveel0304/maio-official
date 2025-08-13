# MAIO Platform - Deployment Guide

This guide will help you deploy the Mongolian AI Olympiad (MAIO) platform, a fully functional, polished website with advanced animations and features.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn
- Git

### Installation

1. **Clone and setup**:
```bash
git clone <repository-url> maio-platform
cd maio-platform
pnpm install
```

2. **Development server**:
```bash
pnpm dev
```

3. **Build for production**:
```bash
pnpm build
pnpm preview
```

## 🌟 Features Overview

### ✨ Enhanced User Experience
- **Animated Loading Screen**: Brain-to-AI network transformation with progress indicators
- **Interactive Backgrounds**: Neural network, circuit patterns, and particle animations
- **Smooth Animations**: Framer Motion powered transitions and scroll-based animations
- **Responsive Design**: Mobile-first approach with perfect tablet and desktop layouts

### 🎨 Modern UI/UX
- **Custom 404 Page**: Friendly AI/robot theme with looping animations
- **Rich Text Editor**: TipTap-based editor for article creation with full toolbar
- **Social Sharing**: Native and custom share options with animated buttons
- **Dark/Light Themes**: Seamless theme switching with system preference support
- **Multilingual**: Mongolian and English language support

### 🛠 Technical Features
- **Built with Vite + React**: Lightning-fast development and builds
- **TypeScript**: Full type safety and developer experience
- **Tailwind CSS**: Utility-first styling with custom animations
- **shadcn/ui**: Beautiful, accessible component system
- **Framer Motion**: Professional-grade animations
- **React Router**: Client-side routing with lazy loading

## 📁 Project Structure

```
maio-official/
├── src/
│   ├── components/
│   │   ├── ui/                    # Base UI components
│   │   │   ├── LoadingScreen.tsx  # Animated loading screen
│   │   │   ├── AnimatedBackground.tsx # Interactive backgrounds
│   │   │   ├── RichTextEditor.tsx # Article editor
│   │   │   └── SocialShare.tsx    # Share functionality
│   │   ├── layout/               # Layout components
│   │   ├── home/                 # Homepage components
│   │   ├── articles/             # Article components
│   │   ├── events/               # Event components
│   │   └── admin/                # Admin panel components
│   ├── pages/                    # Route components
│   │   ├── Index.tsx            # Enhanced homepage
│   │   ├── NotFound.tsx         # Custom 404 page
│   │   └── admin/               # Admin pages
│   ├── contexts/                # React contexts
│   ├── hooks/                   # Custom hooks
│   └── lib/                     # Utilities and data
├── public/                      # Static assets
├── vercel.json                 # Vercel deployment config
└── DEPLOYMENT.md              # This guide
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**:
   - Push code to GitHub/GitLab/Bitbucket
   - Import project to Vercel
   - Vercel automatically detects Vite configuration

2. **Configure Build Settings**:
   ```bash
   # Build Command
   pnpm build
   
   # Output Directory
   dist
   
   # Install Command
   pnpm install
   ```

3. **Environment Variables**:
   ```bash
   # Add in Vercel dashboard
   VITE_APP_TITLE=MAIO Platform
   VITE_API_URL=https://your-api.com
   ```

4. **Deploy**:
   - Automatic deployment on git push
   - Preview deployments for branches
   - Production URL: `https://your-project.vercel.app`

### Option 2: Netlify

1. **Deploy from Git**:
   ```bash
   # Build command
   pnpm build
   
   # Publish directory
   dist
   ```

2. **Configure redirects** (create `public/_redirects`):
   ```
   /*    /index.html   200
   ```

### Option 3: Traditional Hosting

1. **Build locally**:
   ```bash
   pnpm build
   ```

2. **Upload `dist/` folder** to your web server

3. **Configure web server** for SPA routing:
   
   **Apache (.htaccess)**:
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```
   
   **Nginx**:
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

## 🔧 Configuration

### Environment Variables

Create `.env` file in project root:

```bash
# App Configuration
VITE_APP_TITLE="MAIO - Mongolian AI Olympiad"
VITE_APP_DESCRIPTION="Mongolia's premier AI competition platform"

# API Configuration (if using backend)
VITE_API_URL=https://your-api-endpoint.com
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHAT=false
```

### Customization

#### Branding
- Update `src/lib/constants.ts` for site configuration
- Replace logo in `public/` folder
- Modify color scheme in `src/index.css` CSS variables

#### Content
- Update mock data in `src/lib/mockData.ts`
- Modify language translations in language context
- Customize animations in components

#### Admin Panel
- Configure authentication in `src/contexts/AuthContext.tsx`
- Add/modify admin routes in `src/App.tsx`
- Extend rich text editor features as needed

## 🎨 Animation Features

### Loading Screen
- **Brain-to-AI Transformation**: Morphing animation from brain to circuit
- **Progress Tracking**: Real-time loading progress with phases
- **Neural Networks**: Animated connections and nodes
- **Particle Effects**: Floating tech elements

### Interactive Backgrounds
- **Neural Networks**: Mouse-responsive node connections
- **Circuit Patterns**: Animated electrical flows
- **Particle Systems**: Floating geometric shapes

### Page Transitions
- **Scroll Animations**: Intersection Observer based reveals
- **Hover Effects**: Card scaling, glowing, and transformations
- **Loading States**: Skeleton screens and shimmer effects

## 🌐 Browser Support

- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Mobile**: iOS Safari 14+, Chrome Mobile 88+
- **Progressive Enhancement**: Graceful degradation for older browsers

## 📱 Performance

### Optimization Features
- **Code Splitting**: Lazy loading of routes and components
- **Image Optimization**: WebP support with fallbacks
- **Bundle Analysis**: Built-in webpack-bundle-analyzer
- **Caching**: Aggressive caching for static assets

### Performance Metrics (Target)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔒 Security

### Security Headers
- CSP (Content Security Policy)
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff

### Authentication
- JWT-based admin authentication
- Role-based access control
- Secure password requirements
- Session management

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules dist .vite
   pnpm install
   pnpm build
   ```

2. **Animation Performance**:
   - Reduce particle count in backgrounds
   - Enable hardware acceleration
   - Check `prefers-reduced-motion` settings

3. **Loading Screen Issues**:
   - Verify sessionStorage is available
   - Check for JavaScript errors in console
   - Test with different screen sizes

4. **Deployment Issues**:
   - Verify build command produces `dist/` folder
   - Check environment variables are set
   - Ensure SPA routing is configured

### Performance Monitoring

```bash
# Bundle analysis
pnpm build --analyze

# Lighthouse audit
pnpm lighthouse

# Performance testing
pnpm test:performance
```

## 📞 Support

### Development Team Contact
- **Technical Lead**: [your-email@domain.com]
- **Design Lead**: [design@domain.com]
- **DevOps**: [devops@domain.com]

### Documentation
- Component Storybook: `/storybook`
- API Documentation: `/docs/api`
- Design System: `/docs/design`

---

## 🎉 Launch Checklist

- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Analytics tracking enabled
- [ ] Error monitoring setup
- [ ] Performance monitoring active
- [ ] Social media metadata set
- [ ] SEO optimization complete
- [ ] Cross-browser testing done
- [ ] Mobile responsiveness verified
- [ ] Loading performance optimized
- [ ] Admin panel access tested
- [ ] Content management tested
- [ ] Backup system in place

**Congratulations! Your MAIO platform is ready to inspire the next generation of AI innovators in Mongolia! 🇲🇳🤖**
