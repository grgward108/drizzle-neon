import 'dotenv/config';
import { db } from './src/db/client';
import { sql } from 'drizzle-orm';

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    
    const result = await db.execute(sql`SELECT version();`);
    
    console.log('✅ Database connection successful!');
    console.log('PostgreSQL version:', result[0]);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    process.exit(1);
  }
}

testConnection(); 