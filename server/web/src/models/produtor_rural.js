'use strict';
const {
  Model
} = require('sequelize');

const formatarTextoPtBr = require('../utils/formatarTextoPtBr');
module.exports = (sequelize, DataTypes) => {
  class produtor_rural extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      produtor_rural.belongsTo(models.cidades, { foreignKey: 'cidade', as: 'ass_produtor_rural_cidade' })
      produtor_rural.hasMany(models.anexo, { foreignKey: 'agricultor_id', as: 'ass_agricultor_anexo' });
    }
  }
  produtor_rural.init({
    pedido: DataTypes.STRING,
    nome: DataTypes.STRING,
    telefone: DataTypes.STRING,
    cpf_cnpj: DataTypes.STRING,
    rg: DataTypes.STRING,
    endereco: DataTypes.STRING,    
    nome_propriedade: DataTypes.STRING,
    ponto_referencia: DataTypes.STRING,
    area_total: DataTypes.DOUBLE,
    area_algodao: DataTypes.DOUBLE,
    pedido_atendido: DataTypes.BOOLEAN,
    sementes_recebidas: DataTypes.DOUBLE,
    regime_cultivo: DataTypes.STRING,
    cadastro_adagri: DataTypes.STRING,
    confirma_informacao: DataTypes.BOOLEAN,
    email_trabalhador: DataTypes.STRING,
    apelido_trabalhador: DataTypes.STRING,
    tem_cadastro_adagri: DataTypes.BOOLEAN,
    uso_dados: DataTypes.BOOLEAN,
    status_farmer: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'produtor_rural',

    // ✅ HOOKS NO LUGAR CERTO
      hooks: {
        beforeCreate: (instance) => {
          formatarCamposString(instance);
        },
        beforeUpdate: (instance) => {
          formatarCamposString(instance);
        }
      }
  });
  return produtor_rural;
};

const CAMPOS_EXCLUIDOS = [
  'pedido', 'regime_cultivo'
];

// 🔹 Função genérica: percorre TODOS os campos STRING
function formatarCamposString(instance) {
  Object.keys(instance.dataValues).forEach((campo) => {

    // ⛔ pula campos excluídos
    if (CAMPOS_EXCLUIDOS.includes(campo)) return;

    const valor = instance.dataValues[campo];

    if (typeof valor === 'string') {
      instance.dataValues[campo] = formatarTextoPtBr(valor.trim());
    }
  });
}