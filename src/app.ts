import express from 'express';
import commandeRoutes from './routes/commandeRoutes';

const app = express();

app.use(express.json());
app.use('/commandes', commandeRoutes);

app.get('/', (_req, res) => {
  res.send('Hello, Express + TypeScript 👋');
});

export default app;
