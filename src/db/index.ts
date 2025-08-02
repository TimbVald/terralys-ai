import { drizzle } from 'drizzle-orm/neon-http';

export const db = drizzle(process.env.DATABASE_URL!);

// const result = await db.execute('select 1');
