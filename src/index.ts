import express from 'express';

const app = express();
const port = 3000;

app.get('/', (_req, res) => {
  res.send('Hello, Express + TypeScript 👋');
});

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});

export default app;