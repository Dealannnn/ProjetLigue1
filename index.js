const express = require('express');
const app = express();
const equipesRouter = require('./routes/equipes');
const matchsRouter = require('./routes/matchs');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Ligue1');
});

app.use('/api/equipes', equipesRouter);
app.use('/api/matchs', matchsRouter);

app.listen(3000, () => console.log('Serveur lancé sur le port 3000'));
