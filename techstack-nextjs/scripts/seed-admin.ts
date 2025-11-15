#!/usr/bin/env ts-node

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env.local' });

// Admin interface
interface AdminData {
  username: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'super-admin';
  isActive: boolean;
}

// Admin Schema (matching the backend model)
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'super-admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

// Default admin credentials
const defaultAdmin: AdminData = {
  username: 'admin',
  name: 'TechStack Admin',
  email: 'admin@techstacksolutions.com',
  password: 'Admin123!',
  role: 'super-admin',
  isActive: true
};

async function seedAdmin() {
  try {
    // Get MongoDB URI from environment
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/consultancy-website';

    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: defaultAdmin.email });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists:', existingAdmin.email);
      console.log('📝 Login credentials:');
      console.log('   Email:', defaultAdmin.email);
      console.log('   Password:', defaultAdmin.password);
      return;
    }

    // Create new admin
    console.log('👤 Creating admin user...');
    const admin = new Admin(defaultAdmin);
    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('📝 Login credentials:');
    console.log('   Email:', defaultAdmin.email);
    console.log('   Password:', defaultAdmin.password);
    console.log('   Role:', defaultAdmin.role);
    console.log('');
    console.log('🔐 You can now login at: http://localhost:3001/admin');

  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Alternative admin credentials for different environments
const alternativeAdmins: AdminData[] = [
  {
    username: 'superadmin',
    name: 'Super Admin',
    email: 'pranabpiitk@gmail.com',
    password: 'Kolkata@84',
    role: 'super-admin',
    isActive: true
  },
  {
    username: 'testadmin',
    name: 'Test Admin',
    email: 'test@techstacksolutions.com',
    password: 'Test123!',
    role: 'admin',
    isActive: true
  }
];

async function seedMultipleAdmins() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/consultancy-website';

    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    for (const adminData of [defaultAdmin, ...alternativeAdmins]) {
      const existingAdmin = await Admin.findOne({ email: adminData.email });

      if (existingAdmin) {
        console.log(`ℹ️  Admin user already exists: ${existingAdmin.email}`);
        continue;
      }

      console.log(`👤 Creating admin user: ${adminData.email}...`);
      const admin = new Admin(adminData);
      await admin.save();
      console.log(`✅ Admin user created: ${adminData.email}`);
    }

    console.log('');
    console.log('📝 Available admin accounts:');
    [defaultAdmin, ...alternativeAdmins].forEach(admin => {
      console.log(`   ${admin.email} (${admin.role}) - Password: ${admin.password}`);
    });
    console.log('');
    console.log('🔐 Login at: http://localhost:3001/admin');

  } catch (error) {
    console.error('❌ Error seeding admins:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// CLI interface
const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'multiple':
    case 'all':
      console.log('🌱 Seeding multiple admin accounts...');
      await seedMultipleAdmins();
      break;
    case 'single':
    case 'default':
    default:
      console.log('🌱 Seeding default admin account...');
      await seedAdmin();
      break;
  }
}

// Run the main function
main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
