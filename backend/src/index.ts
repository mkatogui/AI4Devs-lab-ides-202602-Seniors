import { Request, Response, NextFunction } from 'express';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { candidatesRouter, CVS_DIR } from './routes/candidates';
import { authRouter } from './routes/auth';
import { requireAuth } from './middleware/auth';

// Load backend/.env so DB and config are correct when run from repo root (e.g. npm run dev)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

export const app = express();
export { prisma } from './db';
export { default } from './db';

const port = 3010;
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

// Ensure CV upload directory exists
try {
  fs.mkdirSync(CVS_DIR, { recursive: true });
} catch (e) {
  console.warn('Could not create upload directory:', (e as Error).message);
}

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

app.use('/auth', authRouter);
app.use('/candidates', requireAuth, candidatesRouter);

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const isPrisma = err && typeof err === 'object' && 'code' in err;
  const code = isPrisma ? (err as { code?: string }).code : undefined;
  const message = err instanceof Error ? err.message : 'An error occurred. Please try again.';

  if (code === 'P2002') {
    res.status(400).json({ message: 'Email already registered', error: message });
    return;
  }
  const isValidation = /required|must be|CV must be|invalid entry/i.test(message);
  if (isValidation) {
    res.status(400).json({ message: 'Validation error', error: message });
    return;
  }
  res.status(500).json({ message: 'An error occurred. Please try again.', error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
