import http from 'http';
import fs from 'fs';
import rotas from './routes.js';
 
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

function iniciaServidorHttp(mensagem){

    const servidor = http.createServer((req, res) => {  
        rotas(req, res, { conteudo }); 
    });
    
    const porta = 3000;
    const host = 'localhost';
    
    servidor.listen(porta, host, () => {
        console.log(`Servidor está rodando em http://${host}:${porta}/`);
    })
}


