const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); 

app.get('/api/movies', async (req, res) => {
    const { page = 1, query = '' } = req.query;
    const apiKey = process.env.API_KEY;

    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&page=${page}&apikey=${apiKey}`;

    try {
        const { default: fetch } = await import('node-fetch');
        const response = await fetch(url);
        const data = await response.json();
        res.json(data.Response === 'True' ? data.Search : []);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
