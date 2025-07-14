# Database Setup Instructions

## Setting up Supabase PostgreSQL Connection

### 1. Create .env file

Create a `.env` file in the root directory with the following content:

```env
# Database Configuration
# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.iokhwbdyozzjsaccquvx:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.iokhwbdyozzjsaccquvx:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

# Application Configuration
NODE_ENV=development
PORT=3000

# Security
JWT_SECRET=your-jwt-secret-key-here

# API Configuration
API_VERSION=v1
```

**Important:** Replace `[YOUR-PASSWORD]` with your actual Supabase database password.

### 2. Generate Prisma Client

```bash
npm run db:generate
```

### 3. Run Database Migrations (Optional)

If you want to create the tables in your database:

```bash
npm run db:migrate
```

### 4. Test Database Connection

#### Option 1: Start the server and check logs

```bash
npm run dev
```

The server will automatically test the database connection on startup and display the results in the console.

#### Option 2: Use the database test endpoint

Once the server is running, visit:

```
http://localhost:3000/db-test
```

This endpoint will return a JSON response indicating whether the database connection is successful.

### 5. Available Endpoints

- `GET /health` - Health check endpoint
- `GET /db-test` - Database connection test endpoint

### 6. Troubleshooting

If you encounter connection issues:

1. **Check your password**: Make sure you've replaced `[YOUR-PASSWORD]` with your actual Supabase password
2. **Check your connection strings**: Verify that the URLs are correct
3. **Check Supabase dashboard**: Ensure your database is running and accessible
4. **Check firewall**: Make sure your IP is allowed to connect to Supabase

### 7. Database Schema

The current schema includes a test `User` model. You can view and modify the schema in `prisma/schema.prisma`.

### 8. Useful Commands

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed database
npm run db:seed

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
