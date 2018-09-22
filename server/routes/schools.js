const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {
    authenticate
} = require('../middleware/authenticate');
const {
    School
} = require('../models/School');

//Rotas de registro de escolas

router.post('/register', authenticate, (req, res) => {
    let school = _.pick(req.body, ['name', 'country', 'city', 'differentials', 'infrastructure', 'extras']);

    let photos = req.files.path;

    if (req.isAdmin) {
        School.create(school).then((school) => {
            res.status(200).send(school);
        }, (e) => {
            res.status(400).send(e);
        })
    } else {
        res.status(404).send();
    }
})

router.delete('/:id', authenticate, (req, res) => {
    let id = req.params.id;
    if (req.isAdmin) {
        School.findById(id).then((school) => {
            school.remove().then((school) => {
                res.status(200).send(school);
            }, (e) => {
                res.status(400).send(e);
            })
        })
    }
    else{
        res.status(404).send();
    }
})
module.exports = router;