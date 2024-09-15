const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static('public')); 
app.get('/api/suggestions', async (req, res) => {
    const query = req.query.query;
    const apiKey = process.env.API_KEY;
    try {
        const { default: fetch } = await import('node-fetch');
        const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/api/content', async (req, res) => {
    const query = req.query.query;
    const apiKey = process.env.API_KEY;
    try {
        // Importa node-fetch dinamicamente
        const { default: fetch } = await import('node-fetch');
        const response = await fetch(`https://www.omdbapi.com/?t=${query}&apikey=${apiKey}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});