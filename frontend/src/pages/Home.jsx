import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
const { user } = useAuth();

return (
    <div className="text-center">
    {/* Hero Section */}
    <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-20 px-4 rounded-lg mb-8">
        <h1 className="text-5xl font-bold mb-4">
        Bienvenue sur TwitchPlanner
        </h1>
        <p className="text-xl mb-8">
        Organisez vos streams facilement avec notre outil de planning
        </p>

        {user ? (
        <Link
            to="/dashboard"
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 inline-block"
        >
            Voir mes plannings
        </Link>
        ) : (
        <div className="flex gap-4 justify-center">
            <Link
            to="/register"
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100"
            >
            Créer un compte
            </Link>
            <Link
            to="/login"
            className="bg-purple-800 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-purple-900"
            >
            Se connecter
            </Link>
        </div>
        )}
    </div>

    {/* Features */}
    <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-4xl mb-4">📅</div>
        <h3 className="text-xl font-bold mb-2">Planifiez facilement</h3>
        <p className="text-gray-600">
            Créez vos plannings de stream en quelques clics
        </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-4xl mb-4">🎮</div>
        <h3 className="text-xl font-bold mb-2">Organisez vos jeux</h3>
        <p className="text-gray-600">
            Ajoutez vos jeux préférés avec images et horaires
        </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-4xl mb-4">📸</div>
        <h3 className="text-xl font-bold mb-2">Exportez en image</h3>
        <p className="text-gray-600">
            Partagez votre planning sur les réseaux sociaux
        </p>
        </div>
    </div>
    </div>
);
};

export default Home;