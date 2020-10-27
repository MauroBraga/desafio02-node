const express = require("express");
const cors = require("cors");

const {  uuid, isUuid } = require('uuidv4');

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
  return response.send(repository)
});

app.put("/repositories/:id",  (request, response) => {
  const { id } = request.params
  const {title, url, techs } = request.body

  const repositorieIndex = repositories.findIndex(r => r.id === id)

  if(repositorieIndex < 0){ return response.status(400).json({error: "Repository not found"})}

  const repositorie =  {
    id, title, url, techs, likes: repositories[repositorieIndex].likes
  }

  repositories[repositorieIndex] = repositorie

  return response.status(200).json(repositorie)

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositorieIndex = repositories.findIndex(r => r.id === id)

  if(repositorieIndex < 0){ return response.status.apply(400).json({error: "Repository not found"})}

  repositories.splice(repositorieIndex,1)

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositorieIndex = repositories.findIndex(r => r.id === id)

  if(repositorieIndex < 0){ return response.status.apply(400).json({error: "Repository not found"})}

  const repositorie = {
    id: repositories[repositorieIndex].id,
    title: repositories[repositorieIndex].title, 
    url: repositories[repositorieIndex].url, 
    techs:repositories[repositorieIndex].techs,
    like: repositories[repositorieIndex].like ? repositories[repositorieIndex].like + 1 : 1

  }

  repositories[repositorieIndex] = repositorie

  return response.status(200).json({likes: repositorie.like})

});

module.exports = app;
