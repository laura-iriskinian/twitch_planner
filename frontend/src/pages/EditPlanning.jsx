import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const EditPlanning = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPlanning();
    }, [id]);

    const fetchPlanning = async () => {
        try {
            const response = await axios.get(`/plannings/${id}`);
            const planning = response.data.planning;

            setTitle(planning.title);
            setStartDate(planning.startDate.split('T')[0]);
            setEndDate(planning.endDate.split('T')[0]);
        } catch (err) {
            setError('Planning introuvable');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            await axios.put(`/plannings/${id}`, {
                title,
                startDate,
                endDate
            });

            navigate(`/plannings/${id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la modification');
        } finally {
            setSaving(false);
        }
    };

if(loading) {
    return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-2xl text-purple-600">Chargement...</div>
        </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Modifier le planning
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            </div>

            <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">
                Date de début
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
                Date de fin
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
                disabled={saving}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 disabled:bg-gray-400"
            >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
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
export default EditPlanning;