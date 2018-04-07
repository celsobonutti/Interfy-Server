var express = require('express');
var bodyParser = require('body-parser');
const port = process.env.PORT || 8000;
var {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) =>{
  Todo.find().then((todos)=>{
    res.send({todos});
  }, (e) =>{
    res.status(400).send(e);
  });
})

app.get('/todos/:id', (req, res) =>{
  var id = req.params.id;
  if(ObjectId.isValid(id)){
    Todo.findById(id).then((todo)=>{
      if(!todo){
        res.status(404).send();
      }
      else{
        res.status(200).send({todo});
      }
    }).catch((e)=>{
        res.status(400).send();
    })
  }
  else{
    res.status(404).send('ID is not valid.');
  }

});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};