import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database';

class Commande extends Model {}

Commande.init(
  {
    id_commande: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_produit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_client: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date_commande: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,         
    modelName: 'Commande',  
    tableName: 'commandes', 
    timestamps: false,
  }
);

export default Commande;