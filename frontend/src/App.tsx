import Navigation from './components/Navigation';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';



import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import TestimonialSection from './components/TestimonialSection';
import Contact from './components/Contact';

import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import AdminPanel from './components/admin/AdminPanel';

import BlogPage from './pages/BlogPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#9bb5ff',
      dark: '#3f4ba8',
    },
    secondary: {
      main: '#764ba2',
      light: '#a47bd5',
      dark: '#4a2872',
    },
    background: {
      default: '#ffffff',
      paper: '#f8fafc',
    },
    text: {
      primary: '#1a202c',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
});

const MainSite = () => (
  <div className="App">
    <Navigation />
    <Hero />
    <AboutUs />
    <Services />
    <TestimonialSection />
    <Contact />
    <Footer />
  </div>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainSite />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/admin/*" element={<AdminPanel />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
