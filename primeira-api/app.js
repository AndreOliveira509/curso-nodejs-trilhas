import sqlite3 from 'sqlite3';
import express from 'express';
import bodyParser from 'body-parser';
import { rotasProduto } from './routes/produtos.js';
import { rotasPedido } from './routes/pedidos.js';

import { sequelize } from './models.js';

const app = express();
app.use(bodyParser.json()); 

app.use(rotasProduto);

app.use(rotasPedido);

async function inicializaApp() {
    
    const db = new sqlite3.Database('./tic.bd', (erro)=>{
        if(erro) {
            console.log('falha ao escrever no arquivo', erro);
            return;
        }
        console.log('banco inicializado')
    });
    
    await sequelize.sync();

    const porta = 3000;
    const host = 'localhost';    

    app.listen(porta);     
}

inicializaApp();


