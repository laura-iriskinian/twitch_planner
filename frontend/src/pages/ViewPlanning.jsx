import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';

const ViewPlanning = () => {
const { id } = useParams();
const navigate = useNavigate();

const [planning, setPlanning] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

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

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
    });
};

const eventsByDay = {};
if (planning) {
    daysOfWeek.forEach((day, index) => {
    eventsByDay[index + 1] = planning.events.filter(
        (event) => event.dayOfWeek === index + 1
    );
    });
}

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
    <div className="bg-purple-600 text-white p-6 rounded-lg mb-6">
        <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold mb-2">{planning.title}</h1>
            <p className="text-purple-200">
            {formatDate(planning.startDate)} → {formatDate(planning.endDate)}
            </p>
        </div>
        <div className="flex gap-2">
            <Link
            to={`/plannings/${id}/edit`}
            className="bg-white text-purple-600 px-4 py-2 rounded font-bold hover:bg-gray-100"
            >
            Modifier
            </Link>
            <Link
            to={`/plannings/${id}/add-event`}
            className="bg-purple-800 text-white px-4 py-2 rounded font-bold hover:bg-purple-900"
            >
            + Ajouter un événement
            </Link>
        </div>
        </div>
    </div>

    <div className="grid md:grid-cols-7 gap-4">
        {daysOfWeek.map((day, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-center mb-4 text-purple-600 border-b pb-2">
            {day}
            </h3>

            {eventsByDay[index + 1].length === 0 ? (
            <p className="text-gray-400 text-center text-sm">Aucun événement</p>
            ) : (
            <div className="space-y-2">
                {eventsByDay[index + 1].map((event) => (
                <div
                    key={event.id}
                    className="border border-purple-200 rounded p-2 hover:border-purple-400 transition-colors"
                >
                    {event.gameImage && (
                    <img
                        src={event.gameImage}
                        alt={event.gameName}
                        className="w-full h-24 object-cover rounded mb-2"
                    />
                    )}
                    <p className="font-bold text-sm">{event.gameName}</p>
                    {event.streamTitle && (
                    <p className="text-xs text-gray-600 mb-1">{event.streamTitle}</p>
                    )}
                    <p className="text-xs text-purple-600 font-bold">
                    {event.startTime}
                    {event.endTime && ` - ${event.endTime}`}
                    </p>
                    <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-red-600 text-xs mt-2 hover:underline"
                    >
                    Supprimer
                    </button>
                </div>
                ))}
            </div>
            )}
        </div>
        ))}
    </div>

    <div className="mt-8 text-center">
        <Link
        to="/dashboard"
        className="text-purple-600 hover:underline"
        >
        ← Retour au dashboard
        </Link>
    </div>
    </div>
);
};

export default ViewPlanning;