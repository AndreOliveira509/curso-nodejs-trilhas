import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './tic.bd'
});

sequelize.authenticate();

export const Produto = sequelize.define('produto', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    preco: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

export async function criaProduto(produto) {
    try {
        await Produto.create(produto);
        console.log(`O produto ${produto.nome} foi criado`);
    } catch (erro) {
        console.log('erro ao criar produto', erro);
    }
}

export async function leProdutos() {
    try {
        const resultado = await Produto.findAll();
        console.log('Produtos consultados:', resultado);
    } catch (erro) {
        console.log('erro ao consultar produtos', erro);
    }
}

export async function leProdutoPorID(id) {
    try {
        const resultado = await Produto.findByPk(id);
        console.log('Produto consultado:', resultado);
    } catch (erro) {
        console.log('erro ao consultar produto por ID', erro);
    }
}
export async function atualizaProdutoPorID(id, dadosProduto) {
    try {
        const resultado = await Produto.update(dadosProduto, { where: { id: id } });
        console.log('Produto atualizado:', resultado);
    } catch (erro) {
        console.log('erro ao atualizar produto por ID', erro);
    }
}

export async function deletaProdutoPorID(id) {
    try {
        const resultado = await Produto.destroy({ where: { id: id } });
        console.log('Produto deletado:', resultado);
    } catch (erro) {
        console.log('erro ao deletar produto por ID', erro);
    }
}

