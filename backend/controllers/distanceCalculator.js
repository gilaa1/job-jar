const express = require('express');
const axios = require('axios');
const app = express();

const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Store your API key in .env

app.get('/geocode', async (req, res) => {
  const { address } = req.query;
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address,
        key: apiKey
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Geocoding request failed' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
