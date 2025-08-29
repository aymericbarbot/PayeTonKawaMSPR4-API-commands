import { createCommande } from '../../src/controller/commandeController';
import { Request, Response } from 'express';
import Commande from '../../src/model/commandeModel';

jest.mock('../../src/model/commandeModel');

describe('createCommande', () => {
  let req: Request;
  let res: Response;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        id_produit: 42,
        id_client: 7,
        date_commande: '2024-07-10T10:00:00Z'
      }
    } as unknown as Request;

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnThis();

    res = {
      status: statusMock,
      json: jsonMock
    } as unknown as Response;
  });

  it('should create a new commande and return 201 with the commande', async () => {
    const mockCreatedCommande = {
      id_commande: 1,
      ...req.body
    };

    (Commande.create as jest.Mock).mockResolvedValue(mockCreatedCommande);

    await createCommande(req, res);

    expect(Commande.create).toHaveBeenCalledWith(req.body);
    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(mockCreatedCommande);
  });

  it('should return 500 if an error occurs during creation', async () => {
    const error = new Error('Database error');
    (Commande.create as jest.Mock).mockRejectedValue(error);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await createCommande(req, res);

    expect(Commande.create).toHaveBeenCalledWith(req.body);
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal server error' });
    expect(consoleSpy).toHaveBeenCalledWith(error);

    consoleSpy.mockRestore();
  });
});
