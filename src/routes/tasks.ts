import { Hono } from 'hono';
import { db } from '../db/client';
import { tasks, users } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

const app = new Hono();

// Get all tasks
app.get('/', async (c) => {
  try {
    const allTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        completed: tasks.completed,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(tasks)
      .leftJoin(users, eq(tasks.userId, users.id))
      .orderBy(desc(tasks.createdAt));

    return c.json({ tasks: allTasks });
  } catch (error) {
    return c.json({ error: 'Failed to fetch tasks' }, 500);
  }
});

// Get task by ID
app.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const task = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        completed: tasks.completed,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(tasks)
      .leftJoin(users, eq(tasks.userId, users.id))
      .where(eq(tasks.id, id))
      .limit(1);

    if (task.length === 0) {
      return c.json({ error: 'Task not found' }, 404);
    }

    return c.json({ task: task[0] });
  } catch (error) {
    return c.json({ error: 'Failed to fetch task' }, 500);
  }
});

// Create new task
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { title, description, userId } = body;

    if (!title) {
      return c.json({ error: 'Title is required' }, 400);
    }

    const newTask = await db
      .insert(tasks)
      .values({
        title,
        description: description || null,
        userId: userId || null,
      })
      .returning();

    return c.json({ task: newTask[0] }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create task' }, 500);
  }
});

// Update task
app.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();
    const { title, description, completed } = body;

    const updatedTask = await db
      .update(tasks)
      .set({
        title,
        description,
        completed,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning();

    if (updatedTask.length === 0) {
      return c.json({ error: 'Task not found' }, 404);
    }

    return c.json({ task: updatedTask[0] });
  } catch (error) {
    return c.json({ error: 'Failed to update task' }, 500);
  }
});

// Delete task
app.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));

    const deletedTask = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();

    if (deletedTask.length === 0) {
      return c.json({ error: 'Task not found' }, 404);
    }

    return c.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete task' }, 500);
  }
});

export default app; 