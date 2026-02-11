const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllPlannings = async (req, res) => {
    try {
        const userId = req.user.id;
        const plannings = await prisma.planning.findMany({
            where: { userId },
            include: {
                events:  true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ plannings });
    } catch (error) {
        console.error('Erreur lors de la récupération des plannings:', error);
        res.status(500).json({ message: 'Erreur serveur' });
        }
    };

    const getPlanningById = async (req, res) => {
    try {
        const userId = req.user.id;
        const planningId = parseInt(req.params.id);

        const planning = await prisma.planning.findFirst({
            where: { id: planningId, userId },
            include: {
                events: {
                    orderBy: [
                        { startTime: 'asc' },
                        { createdAt: 'asc' }
                    ]
                }
            }
        });

        if (!planning) {
            return res.status(404).json({ message: 'Planning non trouvé' });
        }

        res.json({ planning });
    } catch (error) {
        console.error('Erreur lors de la récupération du planning:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const createPlanning = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, startDate, endDate } = req.body;

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Dates de début et de fin requises'});
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime() || isNaN(end.getTime()))) {
            return res.status(400).json({ error: 'Dates invalides' });
        }

        if (end <= start) {
            return res.status(400).json({ error: 'La date de fin doit être après la date de début'});
        }

        const planning = await prisma.planning.create({
            data: {
                title: title || 'Planning de stream',
                startDate: start,
                endDate: end,
                userId
            },
            include: {
                events:true
            }
        });
    } catch (error) {
        console.error('Erreur createPlanning', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
    };

    const updatePlanning = async (req, res) => {
    try {
        const userId = req.user.id;
        const planningId = parseInt(req.params.id);
        const { title, startDate, endDate } = req.body;

        const existingPlanning = await prisma.planning.findFirst({
            where: { id: planningId, userId }
        });

        if (!existingPlanning) {
            return res.status(404).json({ message: 'Planning non trouvé' });
        }

        const updateData = {};

        if (title !== undefined) {
            updateData.title = title;
        }

        if (startDate) {
            const start = new Date(startDate);
            if (isNaN(start.getTime())) {
                return res.status(400).json({ error: 'Date de début invalide' });
            }
            updateData.startDate = start;
        }

        if (endDate) {
            const end = new Date(endDate);
            if (isNaN(end.getTime())) {
                return res.status(400).json({ error: 'Date de fin invalide' });
            }
            updateData.endDate = end;
        }

        if (updateData.startDate && updateData.endDate) {
            if (updateData.endDate <= updateData.startDate) {
                return res.status(400).json({ error: 'La date de fin doit être après la date de début' });
            }
        }

        const updatedPlanning = await prisma.planning.update({
            where: { id: planningId },
            data: updateData,
            include: {
                events: true
            }
        });

        res.json({
            message: 'Planning mis à jour avec succès',
            planning: updatedPlanning
        });
    } catch (error) {
        console.error('Erreur updatePlanning', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const deletePlanning = async (req, res) => {
    try {
        const userId = req.user.id;
        const planningId = parseInt(req.params.id);

        const planning = await prisma.planning.findFirst({
            where: { id: planningId, userId }
        });

        if (!planning) {
            return res.status(404).json({ message: 'Planning non trouvé' });
        }

        await prisma.planning.delete({
            where: { id: planningId }
        });

        res.json({ message: 'Planning supprimé avec succès' });

    } catch (error) {
        console.error('Erreur deletePlanning', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    getAllPlannings,
    getPlanningById,
    createPlanning,
    updatePlanning,
    deletePlanning
};
