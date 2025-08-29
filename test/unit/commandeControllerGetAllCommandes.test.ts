import { getAllCommandes } from '../../src/controller/commandeController';
import { Request, Response } from 'express';
import Commande from '../../src/model/commandeModel';

jest.mock('../../src/model/commandeModel');

describe('getAllCommandes', () => {
  let req: Request;
  let res: Response;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {} as Request;
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnThis();

    res = {
      json: jsonMock,
      status: statusMock,
    } as unknown as Response;
  });

  it('should return all commandes as JSON when findAll succeeds', async () => {
    const mockCommandes = [
      {
        id_commande: 1,
        id_produit: 101,
        id_client: 1,
        date_commande: new Date('2024-08-01T10:00:00Z'),
      },
      {
        id_commande: 2,
        id_produit: 202,
        id_client: 2,
        date_commande: new Date('2024-08-02T12:30:00Z'),
      },
    ];

    (Commande.findAll as jest.Mock).mockResolvedValue(mockCommandes);

    await getAllCommandes(req, res);

    expect(Commande.findAll).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockCommandes);
  });

  it('should return empty array if no commandes exist', async () => {
    (Commande.findAll as jest.Mock).mockResolvedValue([]);

    await getAllCommandes(req, res);

    expect(Commande.findAll).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should return 500 and error message if findAll throws', async () => {
    const mockError = new Error('Database failure');
    (Commande.findAll as jest.Mock).mockRejectedValue(mockError);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await getAllCommandes(req, res);

    expect(Commande.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    expect(console.error).toHaveBeenCalledWith(mockError);

    consoleSpy.mockRestore();
  });
});
