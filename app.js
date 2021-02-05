const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');  // body-parser para definirmos o corpo da entrada (requisição)

// CORS -> Funcionalidade do HTML que permite um site acessar outro site independente de algumas restriçoes (como o cabeçalho)

const rotapersonagens = require('./routes/personagens');

app.use(morgan('dev'));     // Monitora tudo e gera um log no terminal
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); // Só aceitará formato json de entrada no body

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Definindo quem tem permissão de controle de acesso
    res.header('Acess-Control-Allow-Header',
     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }

    next();

});

app.use('/personagens', rotapersonagens);

app.use('/teste', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Ok, deu certo'
    })
});

// Tratamento para quando não encontrar nenhuma das rotas acima
app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})

module.exports = app;