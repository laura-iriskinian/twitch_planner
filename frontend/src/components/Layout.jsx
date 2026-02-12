import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
const { user, logout } = useAuth();
const navigate = useNavigate();

const handleLogout = async () => {
    try {
    await logout();
    navigate('/');
    } catch (error) {
    console.error('Erreur déconnexion:', error);
    }
};

return (
    <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <header className="bg-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
            Twitch Planner
        </Link>

        <nav className="flex gap-4 items-center">
            {user ? (
            <>
                <Link to="/dashboard" className="hover:text-purple-200">
                Mes plannings
                </Link>
                <Link to="/profile" className="hover:text-purple-200">
                Profil
                </Link>
                <button
                onClick={handleLogout}
                className="bg-purple-800 px-4 py-2 rounded hover:bg-purple-900"
                >
                Déconnexion
                </button>
            </>
            ) : (
            <>
                <Link to="/login" className="hover:text-purple-200">
                Connexion
                </Link>
                <Link
                to="/register"
                className="bg-purple-800 px-4 py-2 rounded hover:bg-purple-900"
                >
                Inscription
                </Link>
            </>
            )}
        </nav>
        </div>
    </header>

    {/* Contenu */}
    <main className="container mx-auto px-4 py-8">
        {children}
    </main>

    {/* Footer */}
    <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
        <p>&copy; 2026 TwitchPlanner - Tous droits réservés</p>
    </footer>
    </div>
);
};

export default Layout;