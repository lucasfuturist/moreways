import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const orgId = 'org_default_local'

  // 1. Create the Organization
  const org = await prisma.organization.upsert({
    where: { id: orgId },
    update: {},
    create: {
      id: orgId,
      name: 'Local Dev Firm',
    },
  })
  console.log(`✅ Organization created: ${org.id}`)

  // 2. Create the Dev User
  const userId = 'dev_user_01'
  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: 'local-dev@argueos.com',
      organizationId: org.id,
      role: 'admin',
    },
  })
  console.log(`✅ User created: ${user.id}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })