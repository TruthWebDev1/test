require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// CORS setup (allow frontend to access backend)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Restrict to specific domain in production
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Proxy endpoint for Google Generative AI
app.post('/api/gemini', async (req, res) => {
    const { feeling, query } = req.body;
    const API_KEY = process.env.GOOGLE_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const prompt = `
        Provide personalized insights for a Pi Network user who feels "${feeling}" about their Pi holdings${query ? ` and asks: "${query}"` : ''}. Include:
        1. Optimal strategy for Pi growth
        2. Budget allocation recommendations (provide percentages for categories like savings, trading, staking, etc.)
        3. Factors driving Pi value increase
        4. 6-month price prediction (based on trends, avoid wild speculation)
        Format the response with markdown headings (##) and bullet points (-). Keep it concise and practical.
    `;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 1500, temperature: 0.7 }
            })
        });

        if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
        const data = await response.json();
        res.json({ text: data.candidates[0].content.parts[0].text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
