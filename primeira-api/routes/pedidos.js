import express from "express";
import { criaPedido, lePedidoPorId, lePedidos } from "./../models.js";

export const rotasPedido = express.Router();

rotasPedido.post('/pedidos', async (req, res, next) => {
    const pedido = req.body
    
    res.statusCode = 400;

    if(!pedido?.valorTotal || !pedido.valorTotal <= 0) {
        const resposta = {
            erro: {
                mensagem: `O atributo 'valorTotal' não foi encontrado ou é menor ou igual a zero, porém é obrigatório para a criação do pedido`
            }
        }; 
        return res.send(resposta);
    }
     try {
        const resposta = await criaPedido(pedido);
        res.status(201).send(resposta);
     } catch (erro) {
        console.log('falha ao criar pedido', resultado);
        const resposta = {
            erro: {
                mensagem: 'Falha ao criar pedido'
            }
        };
        return res.status(500).send(resposta);
     }
});
rotasPedido.get('/pedidos/:id', async (req, res, next) => {
     const id = req.params.id;
    
        if (isNaN(id)) return;
    
        try {
          const resposta = await lePedidoPorId(id);
          res.statusCode = 200;
          if(!resposta) {
            res.statusCode = 404;
          }
          res.send(resposta);
          return;
        } catch (erro) {
          console.log('Falha ao buscar pedido', erro);
          res.statusCode = 500;
          const resposta = {
            erro: { mensagem: `Falha ao remover pedido ${id}` }
           } 
           res.send(resposta);
          return;
        }
});
rotasPedido.get('/pedidos', async (req, res, next) => {
    try {
            const resposta = await lePedidos();
            res.statusCode = 200;
            res.send(resposta);
            return;
    } catch (erro) {
            console.log('Falha ao buscar pedidos', erro);
            res.statusCode = 500;
            const resposta = {
                erro: { mensagem: `Falha ao remover pedidos` }
               }
               res.send(resposta); 
          }

});