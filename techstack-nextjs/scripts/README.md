# Admin Seed Script

This script creates admin users for the TechStack Solutions admin panel.

## Prerequisites

- MongoDB must be running
- Environment variables must be configured (`.env.local`)

## Usage

### Create Default Admin User

```bash
npm run seed:admin
```

This creates a default admin user with the following credentials:
- **Email:** admin@techstacksolutions.com
- **Password:** Admin123!
- **Role:** super-admin

### Create Multiple Admin Users

```bash
npm run seed:admin:multiple
```

This creates multiple admin users:

1. **Default Admin**
   - Email: admin@techstacksolutions.com
   - Password: Admin123!

2. **Super Admin**
   - Email: pranabpiitk@gmail.com
   - Password: Kolkata@84

3. **Test Admin**
   - Email: test@techstacksolutions.com
   - Password: Test123!

## Admin Login

After running the seed script, you can login to the admin panel at:
**http://localhost:3001/admin**

## Environment Variables

Make sure your `.env.local` file contains:

```env
MONGODB_URI=mongodb://localhost:27017/consultancy-website
```

## Script Details

- **Location:** `scripts/seed-admin.ts`
- **Language:** TypeScript
- **Dependencies:** mongoose, bcryptjs, dotenv
- **Password Hashing:** Automatic bcrypt hashing with salt rounds of 10

## Safety Features

- Checks for existing users before creating new ones
- Prevents duplicate admin accounts
- Displays login credentials after successful creation
- Graceful error handling and connection management

## Troubleshooting

1. **MongoDB Connection Error**: Ensure MongoDB is running with `brew services start mongodb-community`
2. **Environment Variables**: Check that `.env.local` exists and contains the correct MongoDB URI
3. **Permission Issues**: Make sure the script has write access to the database

## Manual Usage

You can also run the script directly with ts-node:

```bash
npx ts-node scripts/seed-admin.ts [command]
```

Commands:
- (no command): Creates default admin
- `multiple` or `all`: Creates multiple admin accounts
