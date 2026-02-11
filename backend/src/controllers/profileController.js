const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { isValidEmail, isValidPassword } = require('../utils/validations');

const prisma = new PrismaClient();

const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id },
            select: { id: true, email: true, twitchUrl: true, logo: true, createdAt: true } 
        });

        res.json({ user });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { email, password, twitchUrl, logo } = req.body;
        const userId = req.user.id;

        const updateData = {};

        if (email) {
            if (!isValidEmail(email)) {
                return res.status(400).json({ message: 'Email invalide' });
            }
        
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser && existingUser.id !== userId) {
            return res.status(409).json({ message: 'Email déjà utilisé' });
        }

        updateData.email = email;
    }

        if (password) {
            if (!isValidPassword(password)) {
                return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.' });
            }

            updateData.password = await bcrypt.hash(password, 10);
        }

        if (twitchUrl) {
            updateData.twitchUrl = twitchUrl;
        }

        if (logo !== undefined) {
            if (logo && !logo.startsWith('data:image/')) {
                return res.status(400).json({ message: 'Logo doit être une image au format base64' });
            }

            updateData.logo = logo;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: { id: true, email: true, twitchUrl: true, logo: true, createdAt: true }
        });

        res.json({ message: 'Profil mis à jour avec succès', user: updatedUser });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }   
};

const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        await prisma.user.delete({ where: { id: userId } });

        res.clearCookie('token');

        res.json({ message: 'Compte supprimé avec succès' });

    } catch (error) {
        console.error('Erreur lors de la suppression du compte:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = { getProfile, updateProfile, deleteAccount };