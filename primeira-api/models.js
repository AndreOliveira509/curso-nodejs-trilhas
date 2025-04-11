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
        const resultado =   await Produto.create(produto);
        console.log(`O produto ${resultado.nome} foi criado`);
        return resultado;
    } catch (erro) {
        console.log('erro ao criar produto', erro);
        throw erro; 
    }
}

export async function leProdutos() {
    try {
        const resultado = await Produto.findAll();
        console.log('Produtos consultados:', resultado);
        return resultado;
    } catch (erro) {
        console.log('erro ao consultar produtos', erro);
        throw erro;
    }
}

export async function leProdutoPorID(id) {
    try {
        const resultado = await Produto.findByPk(id);
        console.log('Produto consultado:', resultado);
        return resultado;
    } catch (erro) {
        console.log('erro ao consultar produto por ID', erro);
        throw erro; 
    }
}
export async function atualizaProdutoPorID(id, dadosProduto) {
    try {
        const resultado = await Produto.findByPk(id);
        if(resultado?.id){
            for (const chave in dadosProduto) {
                if(chave in resultado) {
                    resultado[chave] = dadosProduto[chave];
                }
            }   
            resultado.save();
             console.log('Produto atualizado:', resultado);
        }
        return resultado;
    } catch (erro) {
        console.log('erro ao atualizar produto por ID', erro);
        throw erro;
    }
}

export async function deletaProdutoPorID(id) {
    try {
        const resultado = await Produto.destroy({ where: { id: id } });
        console.log('Produto deletado:', resultado);
    } catch (erro) {
        console.log('erro ao deletar produto por ID', erro);
        throw erro 
    }
}

const Pedido = sequelize.define('pedido', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    valor_total: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    estado: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const ProdutosPedido = sequelize.define('produtos_pedido', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    preco: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

Produto.belongsToMany(Pedido, { through: ProdutosPedidos });
Pedido.belongsToMany(Produto, { through: ProdutosPedidos });

export async function criaPedido(novoPedido) {
    try{
        const pedido = await Pedido.create({
            valor_total: novoPedido.valorTotal,
            estado: 'ENCAMINHADO'
        });  
        
        for (const prod of novoPedido.produtos) {
            const produto = await Produto.findByPk(prod.id);
           if (produto){
               pedido.addProduto(produto, { through: {
                   quantidade: prod.quantidade, preco: produto.preco
               }});
           } 
        }

        console.log('pedido criado com sucesso!');

        return pedido;

    }
    catch (erro) {
        console.log('falha ao criar pedido!')
        throw erro;

    }
}

export async function  lePedidos() {
    try {
        const resultado = await ProdutosPedido.findAll();
        console.log('pedidos foram consultados com sucesso!', resultado);
        return resultado;

    } catch(erro) {
        console.log('Falha ao consultar pedidos', erro);
        throw erro;
    }
    
}
export async function  lePedidoPorID() {
    try {
        const resultado = await Pedido.findAll();
        console.log('pedido foi consultado com sucesso!', resultado);
        return resultado;

    } catch(erro) {
        console.log('Falha ao consultar o pedido', erro);
        throw erro;
    }
    
}
