const express = require("express");
const cors = require("cors");

const { v4: uuid, isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

function validateId(request, response, next){
  const  {id} = request.params

  if(!isUuid(id)){
      return response.status(400).json({error: 'Invalid  ID.'})
  }
  next()
}

function validate(request, response, next){
  const {title, url, techs } = request.body

  if(!title || !url || !techs || techs.length <=0 ){
    return response.status(400).json({error: 'Mandatory field not filled.'})
  } 

  next()
}

app.use('/repositories/:id', validateId)

const repositories = [];

app.get("/repositories", (request, response) => {
   return response.json(repositories)
});

app.post("/repositories", validate, (request, response) => {
    const {title, url, techs } = request.body
    const repository  = { id: uuid(), title, url, techs, likes:0}
    repositories.push(repository)
    return response.send(repositories)
});

app.put("/repositories/:id", validate, (request, response) => {
  
  const {title, url, techs } = request.body
});

app.delete("/repositories/:id", (request, response) => {
  // TODO
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

module.exports = app;
