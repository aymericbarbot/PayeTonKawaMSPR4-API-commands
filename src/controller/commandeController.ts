import { Request, Response } from 'express';
import Commande from '../model/commandeModel';


export const getAllCommandes = async (req: Request, res: Response) => {
    try {
        const commandes = await Commande.findAll();
        res.json(commandes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getCommandeById = async (req: Request, res: Response) => {
    try {
        const commande = await Commande.findByPk(req.params.id);
        if (commande) {
            res.json(commande);
        } else {
            res.status(404).json({ error: 'Commande not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createCommande = async (req: Request, res: Response) => {
    try {
        const commande = await Commande.create(req.body);
        res.status(201).json(commande);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateCommande = async (req: Request, res: Response) => {
    try {
        const commande = await Commande.findByPk(req.params.id);
        if (commande) {
            await commande.update(req.body);
            res.json(commande);
        } else {
            res.status(404).json({ error: 'Commande not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteCommande = async (req: Request, res: Response) => {
    try {
        const commande = await Commande.findByPk(req.params.id);
        if (commande) {
            await commande.destroy();
            res.json({ message: 'Commande deleted successfully' });
        } else {
            res.status(404).json({ error: 'Commande not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};