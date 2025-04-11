import http from 'http';
import fs from 'fs';
import rotas from './routes.js';
import sqlite3 from 'sqlite3';
import { sequelize, criaPedido, lePedidos, Produto } from './models.js';

const db = new sqlite3.Database('./tic.bd', (erro)=>{
    if(erro) {
        console.log('falha ao escrever no arquivo', erro);
        return;
    }
    console.log('banco inicializado')
});

fs.writeFile('./mensagem.txt', 'Olá, Tic em trilhas do arquivo!', 'utf-8', (erro) =>{
    if (erro) {
        console.log('Falha ao escrever arquivo', erro);
        return; 
    }
    console.log('Arquivo foi criado com sucesso!');

});

fs.readFile ('./mensagem.txt', 'utf-8', (erro, conteudo) =>{
    if (erro){
        console.log('Falha ao escrever arquivo', erro);
        return;
    }
    console.log(`Conteudo: ${conteudo}`);
 
    iniciaServidorHttp(conteudo);
})

async function iniciaServidorHttp(mensagem){
    await sequelize.sync();
    await criaPedido({ valorTotal: 13.00, produtos: [{ id: 2, quantidade: 1 }, { id: 4, quantidade: 2}] });
    await lePedidos();

    await criaProduto({
        nome: 'Açai tradicional',
        preco: 10.50
    });
    await criaProduto({
        nome: 'Açai com granola',
        preco: 12.50
    });
    


    const servidor = http.createServer((req, res) => {  
        rotas(req, res, { conteudo }); 
    });
    
    const porta = 3000;
    const host = 'localhost';
    
    servidor.listen(porta, host, () => {
        console.log(`Servidor está rodando em http://${host}:${porta}/`);
    })
}


