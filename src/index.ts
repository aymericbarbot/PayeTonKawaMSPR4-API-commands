import express from 'express';
import commandeRoutes from './routes/commandeRoutes';
import sequelize from './database/database';
const app = express();
const port = 3000;

app.use('/commandes', commandeRoutes);

app.get('/', (_req, res) => {
  res.send('Hello, Express + TypeScript 👋');
});

sequelize.sync().then(() => {
  console.log('Base de données synchronisée');
  app.listen(port, () => {
    console.log(`API COMMANDES prête sur http://localhost:${port}`);
  });
}).catch(console.error);

export default app;