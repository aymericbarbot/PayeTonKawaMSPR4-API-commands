import { deleteCommande } from '../../src/controller/commandeController';
import { Request, Response } from 'express';
import Commande from '../../src/model/commandeModel';

jest.mock('../../src/model/commandeModel');

describe('deleteCommande', () => {
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
      status: statusMock,
      json: jsonMock
    } as unknown as Response;
  });

  it('should delete commande and return success message', async () => {
    const mockCommandeInstance = {
      destroy: jest.fn().mockResolvedValue(undefined)
    };

    (Commande.findByPk as jest.Mock).mockResolvedValue(mockCommandeInstance);

    await deleteCommande(req, res);

    expect(Commande.findByPk).toHaveBeenCalledWith('1');
    expect(mockCommandeInstance.destroy).toHaveBeenCalled();
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Commande deleted successfully' });
  });

  it('should return 404 if commande not found', async () => {
    (Commande.findByPk as jest.Mock).mockResolvedValue(null);

    await deleteCommande(req, res);

    expect(Commande.findByPk).toHaveBeenCalledWith('1');
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Commande not found' });
  });

  it('should return 500 if an error occurs', async () => {
    const error = new Error('Unexpected error');
    (Commande.findByPk as jest.Mock).mockRejectedValue(error);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await deleteCommande(req, res);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal server error' });
    expect(console.error).toHaveBeenCalledWith(error);

    consoleSpy.mockRestore();
  });
});
