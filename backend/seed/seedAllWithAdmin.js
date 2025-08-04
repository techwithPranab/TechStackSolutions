const mongoose = require('mongoose');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const Blog = require('../models/Blog');
const Admin = require('../models/Admin');
const Stats = require('../models/Stats');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/consultancy-website';


const services = [
  {
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile applications built with React Native and cutting-edge technologies for iOS and Android.',
        features: [
          'Cross-platform development with React Native',
          'Native iOS and Android apps',
          'Real-time features and push notifications',
          'Backend API integration',
          'App store deployment support'
        ],
        technologies: ['React Native', 'Expo', 'Firebase', 'Redux', 'TypeScript'],
        icon: 'mobile',
        price: {
          startingPrice: 15000,
          currency: 'USD'
        }
      },
      {
        title: 'Web Application Development',
        description: 'Modern, responsive web applications using React.js, Node.js, and modern web technologies with scalable architecture.',
        features: [
          'Responsive React.js applications',
          'RESTful API development with Node.js',
          'Database design and optimization',
          'Real-time features with WebSockets',
          'Cloud deployment and scaling'
        ],
        technologies: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'AWS'],
        icon: 'web',
        price: {
          startingPrice: 10000,
          currency: 'USD'
        }
      },
      {
        title: 'Full-Stack Solutions',
        description: 'Complete end-to-end development services from concept to deployment with ongoing support and maintenance.',
        features: [
          'Complete project planning and architecture',
          'Frontend and backend development',
          'Database design and implementation',
          'DevOps and deployment automation',
          'Ongoing maintenance and support'
        ],
        technologies: ['MERN Stack', 'TypeScript', 'Docker', 'AWS', 'MongoDB'],
        icon: 'fullstack',
        price: {
          startingPrice: 25000,
          currency: 'USD'
        }
      },
      {
        title: 'Technical Consulting',
        description: 'Expert technical guidance, code reviews, architecture planning, and technology stack recommendations.',
        features: [
          'Technical architecture consulting',
          'Code review and optimization',
          'Technology stack recommendations',
          'Performance optimization',
          'Best practices implementation'
        ],
        technologies: ['Various', 'Architecture', 'Performance', 'Security', 'Scalability'],
        icon: 'consulting',
        price: {
          startingPrice: 150,
          currency: 'USD'
        }
      }
];

const testimonials = [
  {
    name: 'Priya Sharma',
    company: 'FinEdge',
    position: 'Product Manager',
    content: 'TechStack Solutions delivered our mobile banking app on time with flawless execution. Their team is highly professional and responsive.',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    isActive: true
  },
  {
    name: 'Rahul Verma',
    company: 'EduNext',
    position: 'CTO',
    content: 'Our web portal for online courses was built with great attention to detail. The UI is modern and our users love the experience!',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    isActive: true
  },
  {
    name: 'Samantha Lee',
    company: 'HealthSync',
    position: 'Founder',
    content: 'The team created a robust full-stack solution for our health tracking platform. Highly recommended for startups!',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    isActive: true
  }
];


const blogs = [
  {
    title: 'Building a Cross-Platform Fintech App',
    summary: 'How we delivered a secure, scalable mobile banking solution for FinEdge.',
    content: 'We partnered with FinEdge to build a React Native app enabling seamless banking for thousands of users. Our focus was on security, performance, and a delightful user experience. The project included biometric authentication, real-time notifications, and integration with core banking APIs.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
    client: 'FinEdge',
    technologies: ['React Native', 'Node.js', 'MongoDB'],
    isActive: true
  },
  {
    title: 'Scaling Online Education with React.js',
    summary: 'Case study: EduNext’s journey to a modern web platform.',
    content: 'EduNext needed a robust web portal for their growing online course catalog. We built a scalable React.js SPA with Material-UI, custom theming, and seamless video integration. The result: improved engagement and a 40% increase in course signups.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
    client: 'EduNext',
    technologies: ['React.js', 'TypeScript', 'Material-UI'],
    isActive: true
  },
  {
    title: 'Full-Stack Health Platform for Startups',
    summary: 'How HealthSync launched a HIPAA-compliant health tracking app.',
    content: 'HealthSync approached us to build a full-stack solution for their health tracking platform. We delivered a secure, cloud-deployed system with real-time analytics, user dashboards, and mobile-first design.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    client: 'HealthSync',
    technologies: ['Node.js', 'Express', 'React Native', 'MongoDB'],
    isActive: true
  }
];

const adminData = {
  username: 'superadmin',
  name: 'Super Admin',
  email: 'pranabpiitk@gmail.com',
  password: 'Kolkata@84', // This will be hashed automatically
  role: 'super-admin'
};

async function seedAllWithAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Seed Services
    await Service.deleteMany({});
    await Service.insertMany(services);
    console.log('Services seeded!');

    // Seed Testimonials
    await Testimonial.deleteMany({});
    await Testimonial.insertMany(testimonials);
    console.log('Testimonials seeded!');


    // Seed Blogs
    await Blog.deleteMany({});
    await Blog.insertMany(blogs);
    console.log('Blogs seeded!');

    // Seed Stats (ensure only one document)
    await Stats.deleteMany({});
    await Stats.create({
      totalProjects: 50,
      totalYears: 8,
      totalMobileApps: 25,
      totalWebApps: 30,
      email: 'pranabpiitk@gmail.com',
      contactNumber: '+91-9836027578'
    });
    console.log('Stats seeded!');


    // Create Super Admin if not exists
    const existingAdmin = await Admin.findOne({ role: 'super-admin' });
    if (!existingAdmin) {
      // Debug: print adminData
      console.log('Attempting to create super admin with data:', adminData);
      if (!adminData.username || !adminData.name || !adminData.email || !adminData.password) {
        throw new Error('Missing required admin fields: ' + JSON.stringify(adminData));
      }
      await Admin.create(adminData);
      console.log('Super admin created! Email: admin@techstacksolutions.com, Password: Admin123!');
    } else {
      console.log('Super admin already exists:', existingAdmin.email);
    }

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedAllWithAdmin();
