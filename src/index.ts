import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { testDatabaseConnection, disconnectDatabase } from './lib/database'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(helmet()) // Security headers
app.use(cors()) // Enable CORS
app.use(express.json()) // Parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Prisma + Supabase + Express API is running!',
    timestamp: new Date().toISOString()
  })
})

// Database connection test endpoint
app.get('/db-test', async (req, res) => {
  try {
    const result = await testDatabaseConnection()
    
    if (result.success) {
      res.json({
        status: 'success',
        message: result.message,
        database: 'Supabase PostgreSQL',
        timestamp: new Date().toISOString()
      })
    } else {
      res.status(500).json({
        status: 'error',
        message: result.message,
        error: result.error,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} was not found on this server.`
  })
})

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err)
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  })
})

// Test database connection on startup
async function startServer() {
  try {
    console.log('🔄 Testing database connection...')
    const dbTest = await testDatabaseConnection()
    
    if (!dbTest.success) {
      console.error('❌ Failed to connect to database on startup')
      console.error('Error:', dbTest.error)
      console.log('💡 Make sure your .env file has the correct DATABASE_URL and DIRECT_URL')
      // Don't exit, let the server start anyway for debugging
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/health`)
      console.log(`🔍 Database test: http://localhost:${PORT}/db-test`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server
startServer()

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...')
  await disconnectDatabase()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n👋 Shutting down gracefully...')
  await disconnectDatabase()
  process.exit(0)
}) 