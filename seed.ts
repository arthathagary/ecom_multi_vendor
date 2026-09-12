import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './src/db/schema';

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client, { schema });

async function seed() {
  console.log('Seeding database with URL:', process.env.DATABASE_URL?.split('@')[1]);
  try {
    await db.insert(schema.templates).values({
      name: 'Classic Shop',
      slug: 'classic',
      componentKey: 'classic',
      isActive: true,
    }).onConflictDoNothing();
    
    console.log('✅ Template seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

seed();
