const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const isValidTime = (time) => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5][0-9])$/;
    return timeRegex.test(time);
};

const isValidDayOfWeek = (day) => {
    return Number.isInteger(day) && day >= 1 && day <= 7;
};

const getEventsByPlanning = async (req, res) => {
    try {
        const userId = req.user.id;
        const planningId = parseInt(req.params.planningId);

        const planning = await prisma.planning.findFirst({
            where: { id: planningId, userId },
        });

        if (!planning) {
            return res.status(404).json({ message: 'Planning non trouvé' });
        }

        const events = await prisma.event.findMany({
            where: { planningId },
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' },
            ]
        });

        res.json({ events });
    } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const createEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const planningId = parseInt(req.params.planningId);
        const {
            gameName,
            gameImage,
            streamTitle,
            dayOfWeek,
            startTime,
            endTime } = req.body;

        
        const planning = await prisma.planning.findFirst({
            where: { id: planningId, userId },
        });

        if (!planning) {
            return res.status(404).json({ message: 'Planning non trouvé' });
        }

        if (!gameName) {
            return res.status(400).json({ message: 'Le nom du jeu est requis' });   
        }

        if (!dayOfWeek) {
            return res.status(400).json({ message: 'Le jour de la semaine est requis' });
        }

        if (!startTime) {
            return res.status(400).json({ message: 'L\'heure de début est requise' });
        }

        if (!isValidTime(startTime)) {
            return res.status(400).json({ message: 'L\'heure de début doit être au format HH:mm' });
        }

        if (endTime && !isValidTime(endTime)) {
            return res.status(400).json({ message: 'L\'heure de fin doit être au format HH:mm' });
        }

        if (endTime && endTime <= startTime) {
            return res.status(400).json({ message: 'L\'heure de fin doit être supérieure à l\'heure de début' });
        }

        if (gameImage && !gameImage.startsWith('data:image/')) {
            return res.status(400).json({ message: 'L\'image du jeu doit être au format base64' });
        }

        const event = await prisma.event.create({
            data: {
                gameName,
                gameImage: gameImage || null, 
                streamTitle: streamTitle || null,
                dayOfWeek,
                startTime,
                endTime: endTime || null, 
                planningId
            }
        });

        res.status(201).json({ message: 'Événement créé avec succès', event });
    } catch (error) {
        console.error('Erreur lors de la création de l\'événement:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const updateEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const eventId = parseInt(req.params.eventId);
        const { gameName, gameImage, streamTitle, dayOfWeek, startTime, endTime } = req.body;

        const existingEvent = await prisma.event.findFirst({
            where: { id: eventId },
            include: {
                planning: true
            }
        });

        if (!existingEvent || existingEvent.planning.userId !== userId) {
            return res.status(404).json({ message: 'Événement non trouvé' });
        }

        const updateData = {};

        if (gameName !== undefined) {
            if (!gameName) {
                return res.status(400).json({ message: 'Le nom du jeu est requis' });
            }
            updateData.gameName = gameName;
        }

        if (streamTitle !== undefined) {
            updateData.streamTitle = streamTitle || null;
        }

        if (gameImage !== undefined) {
            if (gameImage && !gameImage.startsWith('data:image/')) {
                return res.status(400).json({ message: 'L\'image du jeu doit être au format base64' });
            }
            updateData.gameImage = gameImage || null;
        }

        if (dayOfWeek !== undefined) {
            if (!isValidDayOfWeek(dayOfWeek)) {
                return res.status(400).json({ message: 'Le jour de la semaine doit être un entier entre 1 et 7' });
            }
            updateData.dayOfWeek = dayOfWeek;
        }

        if (startTime !== undefined) {
            if (!isValidTime(startTime)) {
                return res.status(400).json({ message: 'L\'heure de début doit être au format HH:mm' });
            }
            updateData.startTime = startTime;
        }

        if (endTime !== undefined) {
            if (endTime && !isValidTime(endTime)) {
                return res.status(400).json({ message: 'L\'heure de fin doit être au format HH:mm' });
            }
            updateData.endTime = endTime || null;
        }

        const finalStartTime = updateData.startTime || existingEvent.startTime;
        const finalEndTime = updateData.endTime !== undefined ? updateData.endTime : existingEvent.endTime;

        if (finalEndTime && finalEndTime <= finalStartTime) {
            return res.status(400).json({ message: 'L\'heure de fin doit être supérieure à l\'heure de début' });
        }

        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: updateData
        });

        res.json({ message: 'Événement mis à jour avec succès', event: updatedEvent });

    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'événement:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const eventId = parseInt(req.params.id);

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                planning: true
            }
        });

        if (!event || event.planning.userId !== userId) {
            return res.status(404).json({ message: 'Événement non trouvé' });
        }

        await prisma.event.delete({
            where: { id: eventId }
        });

        res.json({ message: 'Événement supprimé avec succès' });

    } catch (error) {
        console.error('Erreur lors de la suppression de l\'événement:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    getEventsByPlanning,
    createEvent,
    updateEvent,
    deleteEvent
};