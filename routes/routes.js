const { response } = require('express');
const pool = require('../data/config');

const router = app => {
  app.get('/',(req,res)=>{
    res.send({
      message: 'Node.js and Express REST API 2.0'
    });
  });
  app.get('/tovars',(req,res)=>{
    pool.query('SELECT * FROM tovars', (error,result) => {
      if(error) throw error;
      res.send(result);
    });
//    res.send(req.query);
//    console.log(req.query);
  });
  app.get('/tovars/:id',(req,res)=>{
    const id = req.params.id;
    pool.query('SELECT * FROM tovars WHERE id = ?',id, (error,result) => {
      if(error) throw error;
      res.send(result);
    });
  });

  app.post('/users',(req,res)=>{
    console.log(req.body);
    pool.query('INSERT INTO users SET ?', req.body, (error,result)=>{
      if(error) throw error;
      res.status(201).send(`User added with ID: ${result.insertId}`);
    });
  });

  app.put('/users/:id',(req,res)=>{
    const id = req.params.id;

    pool.query('UPDATE users SET ? WHERE id = ?',[req.body,id],(error,result)=>{
      if(error) throw error;
//      res.send('User updated successfully');
      res.send(result);
    });
  });

  app.delete('/users/:id',(req,res)=>{
    const id = req.params.id;
    pool.query('DELETE FROM users WHERE id = ?', id, (error,result)=>{
      if(error) throw error;
      res.send('User deleted');
    });
  });
};

module.exports = router;