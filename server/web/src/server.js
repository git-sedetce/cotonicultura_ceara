const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

require('dotenv').config();

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:2601',
    'http://cotonicultura.sde.ce.gov.br',
    'https://cotonicultura.sde.ce.gov.br'
  ],
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// CORS deve ser configurado antes das rotas
app.use(cors(corsOptions));

// Limites de requisição
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

app.use(cookieParser());

// Tratamento de requisições excessivamente grandes
app.use((err, req, res, next) => {
  if (err.status === 413 || err.type === 'entity.too.large') {
    console.error('Requisição excedeu o limite permitido:', {
      rota: req.originalUrl,
      contentLength: req.headers['content-length'],
      limite: err.limit
    });

    return res.status(413).json({
      message: 'O tamanho dos dados enviados excede o limite permitido.'
    });
  }

  next(err);
});

// Rotas da aplicação
routes(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});

module.exports = app;