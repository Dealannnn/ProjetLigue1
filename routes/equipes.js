const express = require('express');
const router = express.Router();
const fs = require('fs');

const getEquipes = () => JSON.parse(fs.readFileSync('./data/mock-equipes.json'));
const saveEquipes = (data) => fs.writeFileSync('./data/mock-equipes.json', JSON.stringify(data, null, 2));
const getMatchs = () => JSON.parse(fs.readFileSync('./data/mock-matchs.json'));
const saveMatchs = (data) => fs.writeFileSync('./data/mock-matchs.json', JSON.stringify(data, null, 2));

// GET toutes les équipes
router.get('/', (req, res) => {
  res.json(getEquipes());
});

// GET une équipe
router.get('/:id', (req, res) => {
  const equipe = getEquipes().find(e => e.id === req.params.id);
  if (!equipe) return res.status(404).json({ message: 'Équipe non trouvée' });
  res.json(equipe);
});

// POST une équipe
router.post('/', (req, res) => {
  const equipes = getEquipes();
  equipes.push(req.body);
  saveEquipes(equipes);
  res.status(201).json({ message: 'Équipe ajoutée' });
});

// PUT modifier équipe
router.put('/:id', (req, res) => {
  const equipes = getEquipes();
  const index = equipes.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Équipe non trouvée' });

  equipes[index] = { ...equipes[index], ...req.body };
  saveEquipes(equipes);
  res.json({ message: 'Équipe mise à jour', equipe: equipes[index] });
});

// DELETE équipe
router.delete('/:id', (req, res) => {
  const equipeId = req.params.id;
  let equipes = getEquipes();
  if (!equipes.some(e => e.id === equipeId)) return res.status(404).json({ message: 'Équipe non trouvée' });

  equipes = equipes.filter(e => e.id !== equipeId);
  saveEquipes(equipes);

  let matchs = getMatchs();
  const matchsAvant = matchs.length;
  matchs = matchs.filter(m => m.equipe_recoit !== equipeId && m.equipe_deplace !== equipeId);
  saveMatchs(matchs);

  res.json({ message: `Équipe supprimée avec ${matchsAvant - matchs.length} match(s) associé(s)` });
});

module.exports = router;
