import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';

const Profile = () => {
const { user, checkAuth } = useAuth();

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [twitchUrl, setTwitchUrl] = useState('');
const [logo, setLogo] = useState('');
const [logoPreview, setLogoPreview] = useState('');
const [error, setError] = useState('');
const [success, setSuccess] = useState('');
const [loading, setLoading] = useState(false);

useEffect(() => {
    if (user) {
    setEmail(user.email || '');
    setTwitchUrl(user.twitchUrl || '');
    setLogoPreview(user.logo || '');
    }
}, [user]);

const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
    setLogo(reader.result);
    setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
    const updateData = {};

    if (email !== user.email) {
        updateData.email = email;
    }

    if (password) {
        updateData.password = password;
    }

    if (twitchUrl !== user.twitchUrl) {
        updateData.twitchUrl = twitchUrl;
    }

    if (logo) {
        updateData.logo = logo;
    }

    await axios.put('/profile', updateData);

    setSuccess('Profil mis à jour avec succès');
    setPassword(''); 
    setLogo(''); 
    await checkAuth();
    } catch (err) {
    setError(err.response?.data?.error || 'Erreur lors de la mise à jour');
    } finally {
    setLoading(false);
    }
};

return (
    <div className="max-w-2xl mx-auto">
    <h1 className="text-4xl font-bold text-gray-800 mb-8">Mon profil</h1>

    {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
        </div>
    )}

    {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        {success}
        </div>
    )}

    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">Email</label>
        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        </div>

        <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">
            Nouveau mot de passe
        </label>
        <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Laisser vide pour ne pas changer"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        </div>

        <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">
            URL de la chaîne Twitch
        </label>
        <input
            type="text"
            value={twitchUrl}
            onChange={(e) => setTwitchUrl(e.target.value)}
            placeholder="https://twitch.tv/votre_pseudo"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        </div>

        <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">Logo</label>
        <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        {logoPreview && (
            <img
            src={logoPreview}
            alt="Logo"
            className="mt-4 w-32 h-32 object-cover rounded-full"
            />
        )}
        </div>

        <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 disabled:bg-gray-400"
        >
        {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
        </button>
    </form>
    </div>
);
};

export default Profile;