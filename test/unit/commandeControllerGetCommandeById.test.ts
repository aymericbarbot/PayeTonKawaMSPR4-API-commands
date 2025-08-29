import { getCommandeById } from '../../src/controller/commandeController';
import { Request, Response } from 'express';
import Commande from '../../src/model/commandeModel';

jest.mock('../../src/model/commandeModel');

describe('getCommandeById', () => {
  let req: Request;
  let res: Response;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: { id: '1' }
    } as unknown as Request;

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnThis();

    res = {
      json: jsonMock,
      status: statusMock
    } as unknown as Response;
  });

  it('should return commande as JSON when found', async () => {
    const mockCommande = {
      id_commande: 1,
      id_produit: 42,
      id_client: 7,
      date_commande: new Date('2024-07-10T10:00:00Z')
    };

    (Commande.findByPk as jest.Mock).mockResolvedValue(mockCommande);

    await getCommandeById(req, res);

    expect(Commande.findByPk).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith(mockCommande);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 404 if commande not found', async () => {
    (Commande.findByPk as jest.Mock).mockResolvedValue(null);

    await getCommandeById(req, res);

    expect(Commande.findByPk).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Commande not found' });
  });

  it('should return 500 on error', async () => {
    const mockError = new Error('DB failure');
    (Commande.findByPk as jest.Mock).mockRejectedValue(mockError);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await getCommandeById(req, res);

    expect(Commande.findByPk).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    expect(consoleSpy).toHaveBeenCalledWith(mockError);

    consoleSpy.mockRestore();
  });
});
