const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS OS PERSONAGENS CADASTRADOS
router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM personagens;',
            (error, resultado, fields) => {
                if (error) {return res.status(500).send({error: error})}
                const response = {
                    quantidade: resultado.length,
                    personagens: resultado.map(prod => {
                        return {
                            id: prod.id,
                            nome: prod.nome,
                            descricao_curta: prod.descricao_curta,
                            descricao_completa: prod.descricao_completa,
                            url_imagem: prod.url_imagem,

                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um personagem específico',
                                url: 'http://localhost:3333/personagens/' + prod.id // Link para quando alguém clicá-lo ser redirecionado para o  'GET' individual do personagem
                            }
                        }
                    })
                }
                return res.status(200).send(response)
            }
        )
    });
});

// INSERE UM NOVO PERSONAGEM
router.post('/', (req, res, next) => {
    console.log(req.body)
    

    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({error: error})}
        conn.query(
            'INSERT INTO personagens (nome, descricao_curta, descricao_completa, url_imagem) VALUES (?,?,?,?)',
            [req.body.nome, req.body.descricao_curta, req.body.descricao_completa, req.body.url_imagem],
            (error, resultado, field) => {
                conn.release();     // Importante liberar a conexão depois da consulta, para a API não travar quando ocorrer novas consultas
                
                if (error) {return res.status(500).send({error: error})}
                const response = {
                    mensagem: 'personagem inserido com sucesso',
                    personagemCriado: {
                        id: resultado.id,
                        nome: req.body.nome,
                        descricao_curta: req.body.descricao_curta,
                        descricao_completa: req.body.descricao_completa,
                        url_imagem: req.body.url_imagem,
                        
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os personagens',
                            url: 'http://localhost:3333/personagens'
                        }
                    }
                }
                return res.status(201).send(response);
            }
                
        )
    });

});

// RETORNA OS DADOS DE UM PERSONAGEM ESPECÍFICO
router.get('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM personagens WHERE id = ?;',
            [req.params.id],
            (error, resultado, fields) => {
                if (error) {return res.status(500).send({error: error})}

                if (resultado.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado o personagem com este ID'
                    })
                }

                const response = {
                    personagem: {
                        id: resultado[0].id,
                        nome: resultado[0].nome,
                        descricao_curta: resultado[0].descricao_curta,
                        descricao_completa: resultado[0].descricao_completa,
                        url_imagem: resultado[0].url_imagem,

                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os personagens',
                            url: 'http://localhost:3333/personagens'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
    
});


// ALTERA PERSONAGEM
router.put('/:id', (req, res, next) => {
    console.log(req.body)
    
    mysql.getConnection((error, conn) => {
        
        if (error) {return res.status(500).send({error: error})}
        conn.query(
            `UPDATE personagens
                SET nome = ?,
                descricao_curta = ?,
                descricao_completa = ?,
                url_imagem = ?
                WHERE id = ?`,
                [
                req.body.nome,
                req.body.descricao_curta,
                req.body.descricao_completa,
                req.body.url_imagem,
                req.params.id
                ],
            (error, resultado, field) => {
                conn.release();
                
                if (error) {return res.status(500).send({error: error})}
                const response = {
                    mensagem: 'personagem alterado com sucesso',
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna os detalhes de um personagem específico',
                        url: 'http://localhost:3333/personagens/' + req.body.id

                    }
                }
                
                return res.status(202).send(response);
            }
                
        )
    });

});

// DELETA PERSONAGEM
router.delete('/:id', (req, res, next) => {
    
    
    mysql.getConnection((error, conn) => {
        
        if (error) {return res.status(500).send({error: error})}
        conn.query(
            `DELETE FROM personagens WHERE id = ?`,
            [req.params.id],
            (error, resultado, field) => {
                conn.release();
                
                if (error) {return res.status(500).send({error: error})}
                const response = {
                    mensagem: 'personagem excluido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um personagem',
                        url: 'http://localhost:3333/personagens',
                        body: {
                            nome: 'String',
                            descricao_curta: 'String',
                            descricao_completa: 'String',
                            url_imagem: 'String'
                            
                        }
                    }
                }
                
                return res.status(202).send(response);
            }
                
        )
    });

});

module.exports = router;
