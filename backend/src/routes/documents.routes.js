const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Documents route root' });
});

module.exports = router;
