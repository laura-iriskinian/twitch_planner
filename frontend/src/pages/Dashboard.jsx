import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';

const Dashboard = () => {
const [plannings, setPlannings] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
    fetchPlannings();
}, []);

const fetchPlannings = async () => {
    try {
    const response = await axios.get('/plannings');
    setPlannings(response.data.plannings);
    } catch (err) {
    setError('Erreur lors du chargement des plannings');
    console.error(err);
    } finally {
    setLoading(false);
    }
};

const deletePlanning = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce planning ?')) {
    return;
    }

    try {
    await axios.delete(`/plannings/${id}`);
    fetchPlannings();
    } catch (err) {
    alert('Erreur lors de la suppression');
    console.error(err);
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

if (loading) {
    return (
    <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-2xl text-purple-600">Chargement...</div>
    </div>
    );
}

return (
    <div>
    <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Mes plannings</h1>
        <Link
        to="/plannings/create"
        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 flex items-center gap-2"
        >
        <span className="text-xl">+</span>
        Nouveau planning
        </Link>
    </div>

    {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
        </div>
    )}

    {plannings.length === 0 ? (
        <div className="text-center py-12">
        <div className="text-6xl mb-4">📅</div>
        <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Aucun planning pour le moment
        </h2>
        <p className="text-gray-500 mb-6">
            Créez votre premier planning pour organiser vos streams
        </p>
        <Link
            to="/plannings/create"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700"
        >
            Créer mon premier planning
        </Link>
        </div>
    ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plannings.map((planning) => (
            <div
            key={planning.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
            <h3 className="text-xl font-bold text-gray-800 mb-2">
                {planning.title}
            </h3>
            <p className="text-gray-600 mb-4">
                {formatDate(planning.startDate)} → {formatDate(planning.endDate)}
            </p>
            <p className="text-sm text-gray-500 mb-4">
                {planning.events?.length || 0} événement(s)
            </p>

            <div className="flex gap-2">
                <Link
                to={`/plannings/${planning.id}`}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded text-center hover:bg-purple-700"
                >
                Voir
                </Link>
                <Link
                to={`/plannings/${planning.id}/edit`}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded text-center hover:bg-gray-300"
                >
                Modifier
                </Link>
                <button
                onClick={() => deletePlanning(planning.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                🗑️
                </button>
            </div>
            </div>
        ))}
        </div>
    )}
    </div>
);
};

export default Dashboard;