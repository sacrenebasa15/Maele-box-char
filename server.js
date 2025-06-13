const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

let users = [];
let payments = [];

// Enregistrement
app.post('/register', (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ message: 'Nom et numéro requis' });
  }
  const existing = users.find(u => u.number === number);
  if (existing) return res.status(409).json({ message: 'Déjà inscrit' });

  const newUser = { name, number, active: false };
  users.push(newUser);
  res.json({ message: 'Compte créé', user: newUser });
});

// Paiement
app.post('/pay-mpesa', (req, res) => {
  const { number, amount } = req.body;
  if (amount >= 5000) {
    const user = users.find(u => u.number === number);
    if (user) {
      user.active = true;
      payments.push({ number, amount, date: new Date() });
      return res.json({ message: 'Paiement reçu. Abonnement activé.', user });
    } else {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
  } else {
    return res.status(400).json({ message: 'Montant insuffisant' });
  }
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Serveur MAELE BOX en marche sur le port ${PORT}`);
});
