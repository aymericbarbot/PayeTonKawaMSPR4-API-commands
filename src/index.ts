import express from 'express';
import commandeRoutes from './routes/commandeRoutes';
const app = express();
const port = 3000;

app.use('/commandes', commandeRoutes);

app.get('/', (_req, res) => {
  res.send('Hello, Express + TypeScript 👋');
});

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});

export default app;