import fs from 'fs';
import {
  sequelize,
  criaProduto,
  leProdutos,
  leProdutoPorID,
  atualizaProdutoPorID,
  deletaProdutoPorID
} from './models.js';

export default async function rotas(req, res, dado) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // Rota inicial
  if (req.method === 'GET' && req.url === '/') {
    const { conteudo } = dado;

    res.statusCode = 200;
    const resposta = {
      mensagem: conteudo
    };
    res.end(JSON.stringify(resposta));
    return;
  }

  // Criar produto
  if (req.method === 'POST' && req.url === '/produtos') {
    const corpo = [];

    req.on('data', (parte) => {
      corpo.push(parte);
    });

    req.on('end', async () => {
      const produto = JSON.parse(corpo.join(''));

      if (!produto?.nome) {
        res.statusCode = 400;
        res.end(JSON.stringify({
          erro: { mensagem: `O atributo 'nome' não foi encontrado!` }
        }));
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

    req.on('error', (erro) => {
      console.log('Falha ao processar a requisição', erro);
      res.statusCode = 400;
      res.end(JSON.stringify({
        erro: { mensagem: 'Falha ao processar a requisição' }
      }));
    });

    return;
  }

  // Atualizar produto
  if (req.method === 'PATCH' && req.url.startsWith('/produtos/')) {
    const id = req.url.split('/')[2];
    if (isNaN(id)) return;

    const corpo = [];

    req.on('data', (parte) => {
      corpo.push(parte);
    });

    req.on('end', async () => {
      const produto = JSON.parse(corpo.join(''));

      if (!produto?.nome && !produto?.preco) {
        res.statusCode = 400;
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
          erro: { mensagem: `Falha ao atualizar produto ${produto.nome}` }
        }));
        return;
      }
    });

    return;
  }

  // Deletar produto
  if (req.method === 'DELETE' && req.url.startsWith('/produtos/')) {
    const id = req.url.split('/')[2];
    if (isNaN(id)) return;

    try {
      const encontrado = await deletaProdutoPorID(id);
      res.statusCode = 204;
      if(!encontrado) {
        res.statusCode = 404;
      }
      res.end();
      return;
    } catch (erro) {
      console.log('Falha ao remover produto', erro);
      res.statusCode = 500;
      res.end(JSON.stringify({
        erro: { mensagem: `Falha ao remover produto ${id}` }
      }));
      return;
    }
  }

  // Buscar produto por ID
  if (req.method === 'GET' && req.url.startsWith('/produtos/')) { 
    const id = req.url.split('/')[2];
    if (isNaN(id)) return;

    try {
      const resposta = await leProdutoPorID(id);
      res.statusCode = 200;
      if(!resposta) {
        res.statusCode = 404;
      }
      res.end(JSON.stringify(resposta));
      return;
    } catch (erro) {
      console.log('Falha ao buscar produto', erro);
      res.statusCode = 500;
      res.end(JSON.stringify({
        erro: { mensagem: `Falha ao buscar produto ${id}` }
      }));
      return;
    }
  }

  // Listar todos os produtos
  if (req.method === 'GET' && req.url === '/produtos') {
    try {
      const resposta = await leProdutos();
      res.statusCode = 200;
      res.end(JSON.stringify(resposta));
      return;
    } catch (erro) {
      console.log('Falha ao buscar produtos', erro);
      res.statusCode = 500;
      res.end(JSON.stringify({
        erro: { mensagem: 'Falha ao buscar produtos' }
      }));
      return;
    }
  }

  // Rota não encontrada
  res.statusCode = 404;
  res.end(JSON.stringify({
    erro: { mensagem: 'Rota não encontrada!' }
  }));
}