const routes = require('./routes/routes');
const express = require('express');
const bodyParser = require('body-parser');

const port = 3002;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin', `*`);
//  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  next();
});

//  app.get('/',(req,res)=>{
//    console.log(`URL: ${req.url}`);
//    res.send({message: 'Node.js and Express REST API'});
//  });

routes(app);

const server = app.listen(port, (err)=>{
  if(err) return console.log(`Error: ${err}`);
  console.log(`Server listening on port ${server.address().port}`);
});