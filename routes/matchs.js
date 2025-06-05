const express = require('express');
const router = express.Router();
const fs = require('fs');

const getMatchs = () => JSON.parse(fs.readFileSync('./mock-matchs.json'));
const saveMatchs = (data) => fs.writeFileSync('./mock-matchs.json', JSON.stringify(data, null, 2));

// GET tous les matchs
router.get('/', (req, res) => {
  res.json(getMatchs());
});

// GET matchs d’une date
router.get('/date/:date', (req, res) => {
  const matchs = getMatchs().filter(m => m.date === req.params.date);
  res.json(matchs);
});

// GET un match
router.get('/:id', (req, res) => {
  const match = getMatchs().find(m => m.id === req.params.id);
  if (!match) return res.status(404).json({ message: 'Match non trouvé' });
  res.json(match);
});

// POST un match
router.post('/', (req, res) => {
  const matchs = getMatchs();
  matchs.push(req.body);
  saveMatchs(matchs);
  res.status(201).json({ message: 'Match ajouté' });
});

// PUT modifier match
router.put('/:id', (req, res) => {
  const matchs = getMatchs();
  const index = matchs.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Match non trouvé' });

  matchs[index] = { ...matchs[index], ...req.body };
  saveMatchs(matchs);
  res.json({ message: 'Match mis à jour', match: matchs[index] });
});

// DELETE match
router.delete('/:id', (req, res) => {
  let matchs = getMatchs();
  if (!matchs.some(m => m.id === req.params.id)) return res.status(404).json({ message: 'Match non trouvé' });

  matchs = matchs.filter(m => m.id !== req.params.id);
  saveMatchs(matchs);
  res.json({ message: 'Match supprimé' });
});

module.exports = router;
