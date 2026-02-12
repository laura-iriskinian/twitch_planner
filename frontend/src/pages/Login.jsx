import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const { login } = useAuth();
const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
    await login(email, password);
    navigate('/dashboard');
    } catch (err) {
    setError(err.response?.data?.error || 'Erreur de connexion');
    } finally {
    setLoading(false);
    }
};

return (
    <div className="max-w-md mx-auto mt-12">
    <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-600">
        Connexion
        </h2>

        {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
        </div>
        )}

        <form onSubmit={handleSubmit}>
        <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
            Email
            </label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
            />
        </div>

        <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">
            Mot de passe
            </label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
            />
        </div>

        <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 disabled:bg-gray-400"
        >
            {loading ? 'Connexion...' : 'Se connecter'}
        </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
        Pas encore de compte ?{' '}
        <Link to="/register" className="text-purple-600 font-bold hover:underline">
            Inscrivez-vous
        </Link>
        </p>
    </div>
    </div>
);
};

export default Login;