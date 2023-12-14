// app.js

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'suaChaveSecreta',
  resave: false,
  saveUninitialized: true
}));

const usersDB = [];

app.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/chat');
  } else {
    res.sendFile(__dirname + '/login.html');
  }
});

app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const user = usersDB.find(u => u.email === email && u.senha === senha);
  if (user) {
    req.session.user = user;
    res.redirect('/chat');
  } else {
    res.send('Credenciais inválidas');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

app.get('/chat', (req, res) => {
  if (req.session.user) {
    res.sendFile(__dirname + '/chat.html');
  } else {
    res.redirect('/');
  }
});

app.post('/enviar-mensagem', (req, res) => {
  const mensagem = req.body.mensagem;
  res.send('Mensagem enviada: ' + mensagem);
});

app.get('/cadastro', (req, res) => {
  res.sendFile(__dirname + '/cadastro.html');
});

app.post('/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;
  usersDB.push({ nome, email, senha });
  res.redirect(303, '/login'); 
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});