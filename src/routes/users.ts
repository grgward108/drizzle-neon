import { Hono } from 'hono';
import { db } from '../db/client';
import { users } from '../db/schema';

const userRoutes = new Hono();

userRoutes.get('/', async (c) => {
  const result = await db.select().from(users);
  return c.json(result);
});

userRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const inserted = await db
    .insert(users)
    .values({ name: body.name })
    .returning();
  return c.json(inserted[0]);
});

export default userRoutes;
