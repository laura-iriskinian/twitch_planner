import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const CreatePlanning = () => {
const [title, setTitle] = useState('');
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
    const response = await axios.post('/plannings', {
        title: title || 'Planning de stream',
        startDate,
        endDate
    });

    navigate(`/plannings/${response.data.planning.id}`);
    } catch (err) {
    setError(err.response?.data?.error || 'Erreur lors de la création');
    } finally {
    setLoading(false);
    }
};

return (
    <div className="max-w-2xl mx-auto">
    <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Créer un nouveau planning
    </h1>

    {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
        </div>
    )}

    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">
            Titre du planning
        </label>
        <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Planning de stream"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <p className="text-sm text-gray-500 mt-1">
            Laissez vide pour "Planning de stream" par défaut
        </p>
        </div>

        <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">
            Date de début *
        </label>
        <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
        />
        </div>

        <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">
            Date de fin *
        </label>
        <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
        />
        </div>

        <div className="flex gap-4">
        <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 disabled:bg-gray-400"
        >
            {loading ? 'Création...' : 'Créer le planning'}
        </button>
        <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300"
        >
            Annuler
        </button>
        </div>
    </form>
    </div>
);
};

export default CreatePlanning;