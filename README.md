# TechStack Solutions - Consultancy Website

A modern, responsive consultancy website for mobile and web app development services, built with React.js, Node.js, and MongoDB.

## 🚀 Features

- **Modern Design**: Purple/blue gradient theme with smooth animations
- **Responsive**: Mobile-first design that works on all devices
- **Full-Stack**: React.js frontend with Node.js/Express backend
- **Database**: MongoDB integration for contact forms and services
- **TypeScript**: End-to-end type safety
- **Material-UI**: Professional component library with custom theming

## 🛠 Tech Stack

### Frontend
- React.js with TypeScript
- Material-UI (MUI) for components
- Framer Motion for animations
- React Hook Form for form handling
- Axios for API calls

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- CORS, Helmet for security
- Rate limiting and request validation

## 📋 Services Offered

1. **Mobile App Development** - React Native cross-platform apps
2. **Web Application Development** - Modern React.js web apps
3. **Full-Stack Solutions** - Complete MERN stack development
4. **Technical Consulting** - Architecture and code review services

## 🏗 Project Structure

```
ConsultancyWebsite/
├── frontend/           # React.js application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── services/   # API service functions
│   │   ├── types/      # TypeScript type definitions
│   │   └── pages/      # Page components
│   └── public/         # Static assets
├── backend/            # Node.js API server
│   ├── models/         # MongoDB schemas
│   ├── routes/         # Express route handlers
│   └── server.js       # Main server file
└── .github/            # GitHub configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ConsultancyWebsite
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file in backend directory
   PORT=5000
   CLIENT_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/consultancy-website
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start the development servers**

   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 Mobile Responsiveness

The website is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎨 Design Features

- **Hero Section**: Animated statistics and call-to-action buttons
- **Services Grid**: Interactive service cards with hover effects
- **Contact Form**: Comprehensive form with validation
- **Smooth Scrolling**: Navigation with smooth scroll to sections
- **Gradient Backgrounds**: Professional purple/blue gradients

## 📧 Contact Form Fields

- Name and Email (required)
- Phone and Company (optional)
- Project Type (Mobile App, Web App, Full-Stack, Consulting)
- Budget Range and Timeline
- Project Description (required)

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use your preferred MongoDB hosting
2. Configure production environment variables
3. Deploy to Heroku, Railway, or your preferred platform

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to Netlify, Vercel, or your preferred static hosting

### Environment Variables for Production
```
PORT=5000
CLIENT_URL=https://your-frontend-domain.com
MONGODB_URI=your_production_mongodb_url
JWT_SECRET=your_secure_jwt_secret
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support or questions about this project, please contact:
- Email: contact@techstacksolutions.com
- Phone: +1 (555) 123-4567

## 🙏 Acknowledgments

- Inspired by modern consultancy websites like Desklay
- Built with love using React.js and Node.js
- Material-UI for the beautiful component library
