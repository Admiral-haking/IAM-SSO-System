import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import apiApp from './src/serverApi';

async function bootstrap() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Mount backend IAM API endpoints directly
  app.use(apiApp);

  // In development, integrate Vite middlewares
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built dist files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 Centralized IAM & SSO System running at http://localhost:${PORT}`);
  });
}

bootstrap();
