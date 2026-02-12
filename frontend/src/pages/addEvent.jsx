import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const AddEvent = () => {
const { id } = useParams();
const navigate = useNavigate();

const [gameName, setGameName] = useState('');
const [gameImage, setGameImage] = useState('');
const [streamTitle, setStreamTitle] = useState('');
const [dayOfWeek, setDayOfWeek] = useState('1');
const [startTime, setStartTime] = useState('');
const [endTime, setEndTime] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const daysOfWeek = [
    { value: 1, label: 'Lundi' },
    { value: 2, label: 'Mardi' },
    { value: 3, label: 'Mercredi' },
    { value: 4, label: 'Jeudi' },
    { value: 5, label: 'Vendredi' },
    { value: 6, label: 'Samedi' },
    { value: 7, label: 'Dimanche' },
];

const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
    setGameImage(reader.result);
    };
    reader.readAsDataURL(file);
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
    await axios.post(`/events/planning/${id}`, {
        gameName,
        gameImage: gameImage || null,
        streamTitle: streamTitle || null,
        dayOfWeek: parseInt(dayOfWeek),
        startTime,
        endTime: endTime || null,
    });

    navigate(`/plannings/${id}`);
    } catch (err) {
    setError(err.response?.data?.error || 'Erreur lors de la création');
    } finally {
    setLoading(false);
    }
};

return (
    <div className="max-w-2xl mx-auto">
    <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Ajouter un événement
    </h1>

    {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
        </div>
    )}

    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">
            Nom du jeu / de la catégorie *
        </label>
        <input
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="League of Legends"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
        />
        </div>

        <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">
            Image du jeu (optionnel)
        </label>
        <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        {gameImage && (
            <img
            src={gameImage}
            alt="Preview"
            className="mt-4 w-32 h-32 object-cover rounded"
            />
        )}
        </div>

        <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">
            Titre du stream (optionnel)
        </label>
        <input
            type="text"
            value={streamTitle}
            onChange={(e) => setStreamTitle(e.target.value)}
            placeholder="Ranked Solo Queue"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        </div>

        <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">
            Jour de la semaine *
        </label>
        <select
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
        >
            {daysOfWeek.map((day) => (
            <option key={day.value} value={day.value}>
                {day.label}
            </option>
            ))}
        </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
            <label className="block text-gray-700 font-bold mb-2">
            Heure de début *
            </label>
            <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
            />
        </div>

        <div>
            <label className="block text-gray-700 font-bold mb-2">
            Heure de fin (optionnel)
            </label>
            <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
        </div>
        </div>

        <div className="flex gap-4">
        <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 disabled:bg-gray-400"
        >
            {loading ? 'Ajout...' : 'Ajouter l\'événement'}
        </button>
        <button
            type="button"
            onClick={() => navigate(`/plannings/${id}`)}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300"
        >
            Annuler
        </button>
        </div>
    </form>
    </div>
);
};

export default AddEvent;