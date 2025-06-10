import { Hono } from 'hono';
import { cors } from 'hono/cors';
import userRoutes from './routes/users';
import taskRoutes from './routes/tasks';

const app = new Hono();

// Add CORS middleware
app.use('/*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Vite default + fallback
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
}));

// Health check
app.get('/', (c) => {
  return c.json({ message: 'Task Management API is running!' });
});

// Routes
app.route('/api/users', userRoutes);
app.route('/api/tasks', taskRoutes);

export default app;
