const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { authenticate } = require('../middleware/authenticate');
const { Instituicao } = require('../models/escola');

router.get('/', (req, res) => {
    let filter = req.query;
    Instituicao.findByFilter(filter).then((turnos) => {

        intensidades = _.uniq(_.map(turnos, 'intensidade'));
        turnos = turnos.map(turno =>{
            intensidadeId = turno.intensidade._id;
            turno = _.omit(turno, ['intensidade', 'instituicao']);
            turno.intensidade = intensidadeId;
            return turno;
        })

        cursos = _.uniq(_.map(intensidades, 'curso'));
        intensidades = intensidades.map(intensidade =>{
            cursoId = intensidade.curso._id;
            intensidade = _.omit(intensidade, 'curso');
            intensidade.curso = cursoId;
            return intensidade;
        })

        escolas = _.uniq(_.map(cursos, 'instituicao'));
        cursos = cursos.map(curso =>{
            instituicaoId = curso.instituicao._id;
            curso = _.omit(curso, 'instituicao');
            curso.instituicao = instituicaoId;
            return curso;
        })

        intensidades = intensidades.map(intensidade =>{
            intensidade.turnos = _.filter(turnos, {'intensidade': intensidade._id});
            return intensidade;
        })

        cursos = cursos.map(curso =>{
            curso.intensidades = _.filter(intensidades, {'curso': curso._id});
            return curso;
        })
        
        escolas = escolas.map(escola =>{
            escola.cursos = _.filter(cursos, {'instituicao': escola._id});
            return escola;
        })

        res.status(200).send(escolas);
    }, (e) => {
        res.status(400).send(e);
    })
})

//Rotas de registro de escolas

router.post('/register', authenticate, (req, res) => {
    let escola = _.pick(req.body, ['nome', 'pais', 'cidade', 'comentarios', 'infraestrutura', 'atividadesExtra']);
let diferenciais = new Array();
//salvando o nome das imagens
diferenciais.icone = req.files.icone.originalFilename;
escola.fotos = req.files.arquivo.originalFilename;
//colocando os diferencias em um vetor
diferenciais.descricao = req.descricao;
escola.diferenciais = diferenciais;
    if(req.isAdmin){
        Instituicao.create(escola).then((escola) => {
            res.status(200).send(escola);
        }, (e) => {
            res.status(400).send(e);
        })
    }
})

router.delete('/:id', authenticate, (req, res) => {
    let id = req.params.id;
    if (req.isAdmin) {
        Instituicao.findById(id).then((instituicao) => {
            instituicao.remove().then((instituicao) => {
                res.status(200).send(instituicao);
            }, (e) => {
                res.status(400).send(e);
            })
        })
    }
})

router.get('/todas', (req, res) => {
    Instituicao.find().then((resultados) =>{
      res.status(200).send(resultados);
    },(e) =>{
      res.status(400).send(e);
    })
  })
  
module.exports = router;