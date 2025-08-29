import request from 'supertest';
import app from '../../src/app'; // Assure-toi que ce fichier instancie bien Express avec les routes de commandes
import sequelize from '../../src/database/database';

describe('Integration tests - /commandes', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset DB
  });

  afterAll(async () => {
    await sequelize.close(); // Ferme proprement Sequelize
  });

  it('GET /commandes should return 200 and an array', async () => {
    const res = await request(app).get('/commandes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /commandes should fail with 500 if required fields are missing', async () => {
    const res = await request(app)
      .post('/commandes')
      .send({}); // Aucun champ

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /commandes should succeed with valid data', async () => {
    const res = await request(app)
      .post('/commandes')
      .send({
        id_produit: 1,
        id_client: 1,
        date_commande: '2025-08-28T00:00:00Z'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id_commande');
  });

  it('GET /commandes/:id should return 200 and the order when exists', async () => {
    const createRes = await request(app)
      .post('/commandes')
      .send({
        id_produit: 2,
        id_client: 2,
        date_commande: '2025-08-28T10:00:00Z'
      });

    const orderId = createRes.body.id_commande;

    const res = await request(app).get(`/commandes/${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id_commande', orderId);
  });

  it('GET /orders/:id should return 404 if not found', async () => {
    const res = await request(app).get('/orders/99999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('PUT /orders/:id should update the order and return 200', async () => {
    const createRes = await request(app)
      .post('/orders')
      .send({
        id_produit: 3,
        id_client: 3,
        date_commande: '2025-08-28T11:00:00Z'
      });

    const orderId = createRes.body.id_commande;

    const res = await request(app)
      .put(`/orders/${orderId}`)
      .send({
        id_produit: 4,
        id_client: 3,
        date_commande: '2025-08-29T00:00:00Z'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id_commande', orderId);
  });

  it('PUT /orders/:id should return 404 if not found', async () => {
    const res = await request(app)
      .put('/orders/99999')
      .send({
        id_produit: 1,
        id_client: 1,
        date_commande: '2025-08-28T00:00:00Z'
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('DELETE /orders/:id should delete the order and return 200', async () => {
    const createRes = await request(app)
      .post('/orders')
      .send({
        id_produit: 5,
        id_client: 5,
        date_commande: '2025-08-28T12:00:00Z'
      });

    const orderId = createRes.body.id_commande;

    const res = await request(app).delete(`/orders/${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Commande deleted successfully');
  });

  it('DELETE /orders/:id should return 404 if order not found', async () => {
    const res = await request(app).delete('/orders/99999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
