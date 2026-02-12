require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares de sécurité
app.use(helmet());
app.use(cors({
origin: 'http://localhost:5173', 
credentials: true 
}));

// Middlewares de parsing
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const planningRoutes = require('./src/routes/planningRoutes');
const eventRoutes = require('./src/routes/eventRoutes');

app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/plannings', planningRoutes);
app.use('/api/event', eventRoutes);

//Route de test
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Démarrage du serveur
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});