import express from 'express';
import cors from 'cors';

import authRoutes from './backend/routes/auth.routes.js';
import companyRoutes from './backend/routes/company.routes.js';
import errorHandler from './backend/middleware/errorHandler.js';

const app = express();

app.set('trust proxy', 1);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'accounting-erp', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);

app.use(errorHandler);

export default app;
