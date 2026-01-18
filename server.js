const express = require('express');
const app = express();

// Base de datos simple
let jobs = [];

// Configuración
app.use(express.json());

// Permitir acceso desde Roblox
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

// Página principal
app.get('/', (req, res) => {
    res.send(`
        <html>
        <style>body{font-family:Arial;padding:20px;background:#0f0c29;color:white;}</style>
        <h1>🧠 Brainrot API</h1>
        <p>✅ API funcionando</p>
        <p>📊 Jobs: ${jobs.length}</p>
        <p>🔗 Para Roblox: <code>/api/jobs</code></p>
        </html>
    `);
});

// Obtener jobs (para Roblox)
app.get('/api/jobs', (req, res) => {
    res.json({
        success: true,
        jobs: jobs,
        count: jobs.length
    });
});

// Agregar job (para bot Discord)
app.post('/api/jobs', (req, res) => {
    const { id, name, mps } = req.body;
    
    if (!id) return res.json({ error: 'Falta ID' });
    
    jobs.push({
        id: id,
        name: name || 'Unknown',
        mps: mps || 0,
        timestamp: new Date()
    });
    
    // Mantener últimos 50
    if (jobs.length > 50) jobs = jobs.slice(-50);
    
    res.json({ success: true });
});

// Puerto (Render asigna automático)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API en puerto ${PORT}`);
});
