/**
 * prisma/seed.ts
 *
 * Populates the database with initial Org, User, and CRM data.
 * Used for setting up a local dev environment or a fresh production instance.
 *
 * Usage: npx tsx apps/console/prisma/seed.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create a Master Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'moreways-legal' },
    update: {},
    create: {
      name: 'Moreways Legal',
      slug: 'moreways-legal',
      plan: 'Enterprise',
      status: 'active',
      mrr: 50000,
      seatLimit: 100
    },
  });

  // 2. Create an Admin User 
  // [SECURITY] In production, this user needs to sign up via Supabase Auth FIRST.
  // Then this seed ensures they have the SUPER_ADMIN role in the internal DB.
  const adminEmail = 'admin@moreways.com';
  
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'SUPER_ADMIN' },
    create: {
      email: adminEmail,
      organizationId: org.id,
      role: 'SUPER_ADMIN',
      passwordHash: 'placeholder_hash' 
    },
  });

  console.log(`✅ Admin user configured: ${adminEmail}`);

  // 3. Create some Customers (Organizations)
  const customers = [
    { name: 'Morgan & Morgan', plan: 'Enterprise', mrr: 12000, status: 'active' },
    { name: 'Davis Law Group', plan: 'Pro', mrr: 2500, status: 'active' },
    { name: 'Better Call Saul', plan: 'Starter', mrr: 0, status: 'churned' },
  ];

  for (const c of customers) {
    // Generate a slug from the name
    const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const custOrg = await prisma.organization.upsert({
        where: { slug },
        update: {},
        create: {
            name: c.name,
            slug,
            plan: c.plan,
            mrr: c.mrr,
            status: c.status
        }
    });

    // 4. Create Support Tickets for the first customer
    if (c.name === 'Davis Law Group') {
        await prisma.supportTicket.createMany({
          data: [
            { 
              organizationId: custOrg.id, 
              subject: 'API Integration Error', 
              priority: 'HIGH', 
              status: 'OPEN',
              description: 'Getting 500 errors on the intake webhook.'
            },
            { 
              organizationId: custOrg.id, 
              subject: 'Add new user request', 
              priority: 'LOW', 
              status: 'RESOLVED',
              description: 'Please add Sarah to the seat license.'
            }
          ]
        });
    }
  }

  console.log('✅ Seed complete.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });