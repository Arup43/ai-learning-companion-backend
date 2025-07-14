import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')
  
  // Add your seed data here when you create new models
  await prisma.user.create({
    data: {
      email: 'test@test.com',
      name: 'Test User',
    },
  })
  
  console.log('🌱 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 