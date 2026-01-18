// server.js - API para Brainrot AutoJoiner
const express = require('express');
const app = express();

// Base de datos en memoria (se reinicia cuando Render duerme)
let jobsDatabase = [];

// Configuración
app.use(express.json());

// Permitir acceso desde Roblox
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Ruta 1: Página principal
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>🧠 Brainrot AutoJoiner API</title>
            <style>
                body { font-family: Arial; padding: 20px; background: #0f0c29; color: white; }
                h1 { color: #00ff9d; }
                .job { background: #2a2a3e; padding: 15px; margin: 10px 0; border-radius: 8px; }
            </style>
        </head>
        <body>
            <h1>🧠 Brainrot AutoJoiner API</h1>
            <p>✅ API hosteada en Render + GitHub</p>
            <p>📊 Total jobs: ${jobsDatabase.length}</p>
            <h3>Últimos jobs:</h3>
            <div id="jobs">
                ${jobsDatabase.slice().reverse().map(job => `
                    <div class="job">
                        <strong>ID:</strong> ${job.id}<br>
                        <strong>Brainrot:</strong> ${job.brainrot}<br>
                        <strong>M/S:</strong> ${job.mps}
                    </div>
                `).join('') || '<p>No hay jobs aún</p>'}
            </div>
        </body>
        </html>
    `);
});

// Ruta 2: Obtener jobs (para Roblox)
app.get('/api/jobs', (req, res) => {
    res.json({
        success: true,
        jobs: jobsDatabase,
        count: jobsDatabase.length,
        timestamp: new Date().toISOString()
    });
});

// Ruta 3: Agregar job (para el bot Discord)
app.post('/api/jobs', (req, res) => {
    const { jobId, brainrot, mps } = req.body;
    
    if (!jobId) {
        return res.status(400).json({ error: 'Se requiere jobId' });
    }
    
    // Evitar duplicados recientes
    const isDuplicate = jobsDatabase.some(job => 
        job.id === jobId && 
        (Date.now() - new Date(job.timestamp).getTime()) < 60000
    );
    
    if (!isDuplicate) {
        const newJob = {
            id: jobId,
            brainrot: brainrot || 'Desconocido',
            mps: mps || 0,
            timestamp: new Date().toISOString()
        };
        
        jobsDatabase.push(newJob);
        
        // Mantener últimos 50 jobs
        if (jobsDatabase.length > 50) {
            jobsDatabase = jobsDatabase.slice(-50);
        }
        
        console.log(`✅ Job guardado: ${jobId} | ${brainrot} | ${mps} M/S`);
        
        res.json({
            success: true,
            message: 'Job guardado',
            job: newJob
        });
    } else {
        res.json({
            success: true,
            message: 'Job duplicado (ignorado)'
        });
    }
});

// Ruta 4: Estado del servidor
app.get('/status', (req, res) => {
    res.json({
        status: 'online',
        service: 'brainrot-autojoiner',
        uptime: process.uptime(),
        jobs: jobsDatabase.length
    });
});

// Puerto (Render asigna automáticamente)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API Brainrot iniciada en puerto ${PORT}`);
    console.log(`📡 URL base: http://localhost:${PORT}`);
});