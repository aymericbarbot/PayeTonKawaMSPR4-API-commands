import app from './app';
import sequelize from './database/database';

const port = process.env.COMMANDE_PORT || 3000;

sequelize.sync().then(() => {
  console.log('Base de données synchronisée');
  app.listen(port, () => {
    console.log(`API COMMANDES prête sur http://localhost:${port}`);
  });
}).catch(console.error);

export default app;