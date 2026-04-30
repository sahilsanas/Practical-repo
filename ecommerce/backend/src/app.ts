import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { productsRouter } from './routes/products.js';
import { ordersRouter } from './routes/orders.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(morgan('dev'));

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim()) : true
    })
  );

  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/products', productsRouter);
  app.use('/api/orders', ordersRouter);

  app.use((req, res) => {
    res.status(404).json({ message: `Not found: ${req.method} ${req.path}` });
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, _req: any, res: any, _next: any) => {
    const status = typeof err?.status === 'number' ? err.status : 500;
    const message = err?.message ?? 'Internal Server Error';

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(err);
    }

    res.status(status).json({ message });
  });

  return app;
}
