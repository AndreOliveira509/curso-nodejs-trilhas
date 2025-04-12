import express from "express";
import {
    sequelize,
    criaProduto,
    leProdutos,
    leProdutoPorID,
    atualizaProdutoPorID,
    deletaProdutoPorID
  } from './../models.js';



export const rotasProduto = express.Router();

rotasProduto.post( '/produtos', async (req, res, next) => {
    const produto = req.body;

    if (!produto?.nome) {
      res.statusCode = 400;
      const resposta = {
        erro: { mensagem: `O atributo 'nome' não foi encontrado!` }
      }

      res.send(resposta)
      
      return;
    }

    if (!produto?.preco) {
      res.statusCode = 400;
      res.end(JSON.stringify({
        erro: { mensagem: `O atributo 'preco' não foi encontrado!` }
      }));
      return;
    }

    try {
      const resposta = await criaProduto(produto);
      res.statusCode = 201;
      res.end(JSON.stringify(resposta));
      return;
    } catch (erro) {
      console.log('Falha ao criar produto', erro);
      res.statusCode = 500;
      res.end(JSON.stringify({
        erro: { mensagem: `Falha ao criar produto ${produto.nome}` }
      }));
      return;
    }
});
rotasProduto.patch( '/produtos/:id', async (req, res, next) => {
    const produto = req.body;
    res.statusCode = 400;

      if (!produto?.nome && !produto?.preco) {
        res.end(JSON.stringify({
          erro: { mensagem: 'Nenhum atributo encontrado!' }
        }));
        return;
      }

      try {
        const resposta = await atualizaProdutoPorID(id, produto);
        res.statusCode = 200;
        if(!resposta) {
            res.statusCode = 404;
        }
        res.end(JSON.stringify(resposta));
        return;
      } catch (erro) {
        console.log('Falha ao atualizar produto', erro);
        res.statusCode = 500;
        res.end(JSON.stringify({
          erro: { mensagem: `Falha ao atualizar produto ${id}` }
        }));
        return;
      }

});
rotasProduto.delete( '/produtos/:id', async (req, res, next) => {
    const id = req.params.id;

    try {
      const encontrado = await deletaProdutoPorID(id);
      res.statusCode = 204;
      if(!encontrado) {
        res.statusCode = 404;
      }
      res.send();
      return;
    } catch (erro) {
      console.log('Falha ao remover produto', erro);
      res.statusCode = 500;
      const resposta = {
        erro: { mensagem: `Falha ao remover produto ${id}` }
       } 
       res.send(resposta);
      return;
    }     
});
rotasProduto.get( '/produtos/:id', async (req, res, next) => {
    const id = req.params.id;

    if (isNaN(id)) return;

    try {
      const resposta = await leProdutoPorID(id);
      res.statusCode = 200;
      if(!resposta) {
        res.statusCode = 404;
      }
      res.send(resposta);
      return;
    } catch (erro) {
      console.log('Falha ao buscar produto', erro);
      res.statusCode = 500;
      const resposta = {
        erro: { mensagem: `Falha ao remover produto ${id}` }
       } 
       res.send(resposta);
      return;
    }
});
rotasProduto.get( '/produtos', async (req, res, next) => {
    try {
        const resposta = await leProdutos();
        res.statusCode = 200;
        res.send(resposta);
        return;
      } catch (erro) {
        console.log('Falha ao buscar produtos', erro);
        res.statusCode = 500;
        const resposta = {
            erro: { mensagem: `Falha ao remover produto ${id}` }
           }
           res.send(resposta); 
      }
});



