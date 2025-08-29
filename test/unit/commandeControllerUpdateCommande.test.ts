import { updateCommande } from '../../src/controller/commandeController';
import { Request, Response } from 'express';
import Commande from '../../src/model/commandeModel';

jest.mock('../../src/model/commandeModel');

describe('updateCommande', () => {
  let req: Request;
  let res: Response;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: { id: '1' },
      body: {
        id_produit: 99,
        id_client: 42,
        date_commande: '2024-07-15T12:00:00Z'
      }
    } as unknown as Request;

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnThis();

    res = {
      status: statusMock,
      json: jsonMock
    } as unknown as Response;
  });

  it('should update commande and return updated data', async () => {
    const mockCommandeInstance = {
      update: jest.fn().mockResolvedValue(undefined), // update renvoie rien
      ...req.body
    };

    (Commande.findByPk as jest.Mock).mockResolvedValue(mockCommandeInstance);

    await updateCommande(req, res);

    expect(Commande.findByPk).toHaveBeenCalledWith('1');
    expect(mockCommandeInstance.update).toHaveBeenCalledWith(req.body);
    expect(jsonMock).toHaveBeenCalledWith(mockCommandeInstance);
  });

  it('should return 404 if commande not found', async () => {
    (Commande.findByPk as jest.Mock).mockResolvedValue(null);

    await updateCommande(req, res);

    expect(Commande.findByPk).toHaveBeenCalledWith('1');
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Commande not found' });
  });

  it('should return 500 if an error occurs', async () => {
    const error = new Error('Unexpected DB error');
    (Commande.findByPk as jest.Mock).mockRejectedValue(error);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await updateCommande(req, res);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal server error' });
    expect(console.error).toHaveBeenCalledWith(error);

    consoleSpy.mockRestore();
  });
});
