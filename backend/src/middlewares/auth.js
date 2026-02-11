const { verify } = require('jsonwebtoken');
const {verifyToken} = require('../utils/jwt');
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Token invalide' });
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, email: true, twitchUrl: true, logo: true}});

        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = { authenticate };