const express = require('express');
const app = express();

let jobs = [];

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

// Página principal
app.get('/', (req, res) => {
    res.send(`
        <html>
        <style>
            body{font-family:Arial;padding:20px;background:#0f0c29;color:white;}
            .job{background:#2a2a3e;padding:15px;margin:10px;border-radius:8px;}
        </style>
        <h1>🧠 Brainrot API</h1>
        <p>📊 Jobs: ${jobs.length}</p>
        ${jobs.slice().reverse().slice(0,5).map(job => `
            <div class="job">
                <strong>${job.name}</strong><br>
                💰 ${job.money} | 👥 ${job.players}<br>
                ID: ${job.id.substring(0,20)}...
            </div>
        `).join('')}
        </html>
    `);
});

// Obtener jobs
app.get('/api/jobs', (req, res) => {
    res.json({ success: true, jobs: jobs });
});

// Agregar job (formato específico)
app.post('/api/jobs', (req, res) => {
    const { name, money, players, jobId } = req.body;
    
    if (!jobId) return res.json({ error: 'Falta Job ID' });
    
    // Evitar duplicados
    const isDuplicate = jobs.some(j => j.id === jobId);
    
    if (!isDuplicate) {
        jobs.unshift({
            id: jobId,
            name: name || 'Unknown',
            money: money || '0M/s',
            players: players || '0/0',
            timestamp: new Date().toISOString()
        });
        
        // Mantener últimos 50
        if (jobs.length > 50) jobs = jobs.slice(0, 50);
        
        console.log(`✅ Job: ${name} | ${money} | ${players}`);
        res.json({ success: true });
    } else {
        res.json({ success: true, message: 'Duplicado' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API en puerto ${PORT}`);
});
