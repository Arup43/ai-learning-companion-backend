import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Database connection test function
export async function testDatabaseConnection(): Promise<{
  success: boolean
  message: string
  error?: string
}> {
  try {
    // Test the connection by running a simple query
    await prisma.$queryRaw`SELECT 1 as test`
    
    console.log('✅ Database connection successful!')
    return {
      success: true,
      message: 'Database connection established successfully'
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return {
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Graceful shutdown function
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect()
    console.log('📊 Database disconnected successfully')
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error)
  }
}

export default prisma 