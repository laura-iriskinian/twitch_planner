import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';
import html2canvas from 'html2canvas';

const ViewPlanning = () => {
const { id } = useParams();
const navigate = useNavigate();
const planningRef = useRef(null);

const [planning, setPlanning] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

useEffect(() => {
    fetchPlanning();
}, [id]);

const fetchPlanning = async () => {
    try {
    const response = await axios.get(`/plannings/${id}`);
    setPlanning(response.data.planning);
    } catch (err) {
    setError('Planning non trouvé');
    console.error(err);
    } finally {
    setLoading(false);
    }
};

const deleteEvent = async (eventId) => {
    if (!window.confirm('Supprimer cet événement ?')) {
    return;
    }

    try {
    await axios.delete(`/events/${eventId}`);
    fetchPlanning();
    } catch (err) {
    alert('Erreur lors de la suppression');
    }
};

const exportToPNG = async () => {
    if (!planningRef.current) return;

    try {
    const canvas = await html2canvas(planningRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
    });

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `planning-${planning.title.replace(/\s+/g, '-')}.png`;
    link.href = image;
    link.click();
    } catch (error) {
    console.error('Erreur export PNG:', error);
    alert('Erreur lors de l\'export');
    }
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
    });
};

const formatDateShort = (date) => {
    return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit'
    });
};

// Générer la liste des jours entre startDate et endDate
const generateDaysArray = () => {
    if (!planning) return [];
    
    const start = new Date(planning.startDate);
    const end = new Date(planning.endDate);
    const days = [];
    
    const currentDate = new Date(start);
    while (currentDate <= end) {
        days.push({
            date: new Date(currentDate),
            dayOfWeek: currentDate.getDay() === 0 ? 7 : currentDate.getDay(), // Convertir Dimanche (0) en 7
            dayName: daysOfWeek[currentDate.getDay()],
            dateStr: formatDateShort(currentDate)
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
};

// Grouper les events par jour de la semaine et les trier par heure
const eventsByDay = {};
if (planning) {
    planning.events.forEach(event => {
        if (!eventsByDay[event.dayOfWeek]) {
            eventsByDay[event.dayOfWeek] = [];
        }
        eventsByDay[event.dayOfWeek].push(event);
    });
    
    // Trier par heure pour chaque jour
    Object.keys(eventsByDay).forEach(day => {
        eventsByDay[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
}

const daysToDisplay = generateDaysArray();

if (loading) {
    return (
    <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-2xl text-purple-600">Chargement...</div>
    </div>
    );
}

if (error || !planning) {
    return (
    <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-600 mb-4">{error}</h2>
        <Link to="/dashboard" className="text-purple-600 hover:underline">
        Retour au dashboard
        </Link>
    </div>
    );
}

return (
    <div>
    {/* Boutons d'action au-dessus */}
    <div className="flex justify-between items-center mb-6">
        <Link
        to="/dashboard"
        className="text-purple-600 hover:underline font-semibold flex items-center gap-2"
        >
        ← Retour au dashboard
        </Link>
        
        <div className="flex gap-2">
        <button
            onClick={exportToPNG}
            className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700"
        >
            📸 Exporter PNG
        </button>
        <Link
            to={`/plannings/${id}/edit`}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-bold hover:bg-gray-300"
        >
            ✏️ Modifier
        </Link>
        <Link
            to={`/plannings/${id}/add-event`}
            className="bg-purple-600 text-white px-4 py-2 rounded font-bold hover:bg-purple-700"
        >
            + Ajouter un événement
        </Link>
        </div>
    </div>

    {/* Planning en grille */}
    <div ref={planningRef} className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header du planning */}
        <div className="bg-purple-600 text-white p-6">
        <div className="flex justify-between items-center">
            <div>
            <h1 className="text-3xl font-bold mb-1">{planning.title}</h1>
            <p className="text-purple-200">
                {formatDate(planning.startDate)} → {formatDate(planning.endDate)}
            </p>
            </div>
        </div>
        </div>

        {/* Grille des jours dynamique */}
        <div className="grid divide-x divide-gray-200" style={{ gridTemplateColumns: `repeat(${daysToDisplay.length}, minmax(0, 1fr))` }}>
        {daysToDisplay.map((day, index) => (
            <div key={index} className="min-h-[500px]">
            {/* Nom du jour avec date */}
            <div className="bg-purple-100 p-3 text-center font-bold text-purple-800 border-b border-gray-200">
                <div>{day.dayName}</div>
                <div className="text-sm font-normal text-purple-600">{day.dateStr}</div>
            </div>

            {/* Événements du jour */}
            <div className="p-2 space-y-2">
                {(!eventsByDay[day.dayOfWeek] || eventsByDay[day.dayOfWeek].length === 0) ? (
                <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">OFF</p>
                </div>
                ) : (
                eventsByDay[day.dayOfWeek].map((event) => (
                    <div
                    key={event.id}
                    className="border border-gray-300 rounded overflow-hidden hover:shadow-md transition-shadow group relative"
                    >
                    {/* Image du jeu */}
                    {event.gameImage && (
                        <div className="relative">
                        <img
                            src={event.gameImage}
                            alt={event.gameName}
                            className="w-full h-32 object-cover"
                        />
                        {/* Heure en overlay sur l'image */}
                        <div className="absolute top-1 left-1 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-bold">
                            {event.startTime}
                        </div>
                        </div>
                    )}

                    {/* Infos de l'événement */}
                    <div className="p-2">
                        <p className="font-bold text-sm text-gray-900 truncate">
                        {event.gameName}
                        </p>
                        
                        {event.streamTitle && (
                        <p className="text-xs text-gray-600 truncate mt-1">
                            {event.streamTitle}
                        </p>
                        )}

                        {!event.gameImage && (
                        <p className="text-xs text-purple-600 font-bold mt-1">
                            ⏰ {event.startTime}
                            {event.endTime && ` - ${event.endTime}`}
                        </p>
                        )}
                    </div>

                    {/* Bouton supprimer (visible au hover) */}
                    <button
                        onClick={() => deleteEvent(event.id)}
                        className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        🗑️
                    </button>
                    </div>
                ))
                )}

                {/* Bouton + pour ajouter un événement ce jour */}
                <button
                onClick={() => navigate(`/plannings/${id}/add-event?day=${day.dayOfWeek}`)}
                className="w-full border-2 border-dashed border-gray-300 rounded py-3 text-gray-400 hover:border-purple-400 hover:text-purple-600 transition-colors"
                >
                +
                </button>
            </div>
            </div>
        ))}
        </div>
    </div>
    </div>
);
};

export default ViewPlanning;