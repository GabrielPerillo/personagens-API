const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');  // body-parser para definirmos o corpo da entrada (requisição)
const cors = require('cors');

// CORS -> Funcionalidade do HTML que permite um site acessar outro site independente de algumas restriçoes (como o cabeçalho)

const rotapersonagens = require('./routes/personagens');

app.use(morgan('dev'));     // Monitora tudo e gera um log no terminal
app.use(express.json()); // Só aceitará formato json de entrada no body
app.use(cors('*'));


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