# CodeArena Frontend

A modern, responsive frontend application for the CodeArena hackathon management platform built with Next.js 15 and React 19.

## 🚀 Advanced Features

### 🎯 Core Functionality
- **Multi-Role Authentication**: Support for organizers, judges, and participants
- **Event Management**: Create, edit, and manage hackathon events
- **Team Collaboration**: Form teams and manage team memberships
- **Submission System**: Submit projects and track submission status
- **Certificate Generation**: Generate and download certificates for winners
- **Real-time Announcements**: Stay updated with event announcements
- **Enrollment Tracking**: Monitor participant enrollments and statistics

### 🎨 UI/UX Features
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Dark/Light Theme**: Automatic theme switching support
- **Responsive Layout**: Mobile-first design that works on all devices
- **Interactive Components**: Rich UI components from Radix UI
- **Real-time Updates**: Dynamic content updates without page refresh
- **Accessibility**: WCAG compliant components and keyboard navigation

### 📊 Dashboard Features
- **Role-based Dashboards**: Customized experiences for different user roles
- **Analytics & Statistics**: Visual charts and metrics using Recharts
- **Event Calendar**: Track important dates and deadlines
- **Progress Tracking**: Monitor event progress and milestones

## 🛠️ Tech Stack

### Core Framework
- **Next.js 15.4.6** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5** - Static type checking for better development experience

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI components
- **Lucide React** - Beautiful icon library
- **next-themes** - Easy theme switching

### State Management & Forms
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **React Context** - State management for auth and events

### Additional Libraries
- **date-fns** - Modern JavaScript date utility library
- **react-to-print** - Print React components
- **recharts** - Composable charting library
- **js-cookie** - Simple cookie handling
- **react-confetti** - Celebration animations

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18.17 or later)
- **npm** or **yarn** package manager
- **Git** for version control

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-key

# Optional: External Services
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your-ga-id
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint for code quality

# Type Checking
npx tsc --noEmit     # Check TypeScript types without building
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── competitions/      # Competition pages
│   └── unauthorized/      # Access control page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Radix + Tailwind)
│   └── auth/             # Authentication components
├── contexts/             # React Context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and configurations
└── middleware.ts        # Next.js middleware for auth
```

### Key Directories

- **`app/`**: Next.js 13+ App Router pages and layouts
- **`components/ui/`**: Reusable UI components built on Radix UI
- **`contexts/`**: React Context for global state management
- **`hooks/`**: Custom hooks for data fetching and state logic
- **`lib/`**: Utilities, API client, and configuration

## 🔐 Authentication & Authorization

### Role-based Access Control
- **Organizers**: Full access to event management, submissions, and analytics
- **Judges**: Access to judging interface and submission evaluation
- **Participants**: Access to event participation, team formation, and submissions

### Authentication Flow
1. User logs in through `/auth/login`
2. JWT token stored in HTTP-only cookies
3. Middleware checks authentication on protected routes
4. Role-based redirection to appropriate dashboard

## 🎨 Theming & Styling

### Theme System
- Built-in dark/light mode toggle
- CSS custom properties for consistent theming
- Automatic system preference detection

### Customization
Modify theme colors in `src/app/globals.css`:

```css
:root {
  --primary: 27 96 136;      /* Brand primary color */
  --secondary: 215 28 99;    /* Secondary accent */
  --background: 0 0 100;     /* Background color */
  --foreground: 222 47 11;   /* Text color */
}
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🧪 Testing

### Development Testing
```bash
# Type checking
npm run type-check

# Lint checking
npm run lint

# Build verification
npm run build
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Configuration

### API Integration
The frontend communicates with the backend API through:
- **Base URL**: Configured via `NEXT_PUBLIC_API_URL`
- **Authentication**: JWT tokens in HTTP-only cookies
- **Error Handling**: Centralized error management

### Feature Flags
Enable/disable features via environment variables:
```env
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_CHAT=false
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

2. **TypeScript Errors**
   ```bash
   # Check for type errors
   npx tsc --noEmit
   ```

3. **Styling Issues**
   ```bash
   # Rebuild Tailwind classes
   npm run dev
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a pull request

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Radix UI** for accessible components
- **Tailwind CSS** for utility-first styling
- **Vercel** for hosting and deployment

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

---

Built with ❤️ using Next.js and React
