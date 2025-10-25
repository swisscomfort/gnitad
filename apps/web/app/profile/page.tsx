'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface Photo {
  id: string;
  photoUrl: string;
  photoType: string;
  isPrimary: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [token, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPhotos(data.data.photos || []);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-purple-600 transition"
            >
              ← Zurück
            </button>
            <h1 className="text-xl font-bold">Mein Profil</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              {isEditing ? 'Fertig' : 'Bearbeiten'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-4xl">
              🎭
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{user.pseudonym}</h2>
              <p className="text-gray-600">{user.ageRange || 'Alter nicht angegeben'}</p>
              <div className="mt-2 flex items-center gap-2">
                {user.isVerified && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                    ✓ Verifiziert
                  </span>
                )}
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Privacy Level: {user.privacyLevel || 3}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Fotos</h3>
            <button
              onClick={() => router.push('/upload')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
            >
              + Foto hinzufügen
            </button>
          </div>
          
          {photos.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <span className="text-4xl mb-2 block">📸</span>
              <p className="text-gray-500 mb-4">Noch keine Fotos hochgeladen</p>
              <button
                onClick={() => router.push('/upload')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Erstes Foto hochladen
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer"
                >
                  <img
                    src={photo.photoUrl}
                    alt="Profile photo"
                    className="w-full h-full object-cover"
                  />
                  {photo.isPrimary && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-purple-600 text-white text-xs rounded">
                      Primär
                    </div>
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <button className="px-3 py-1 bg-white rounded text-sm">
                        Primär
                      </button>
                      <button className="px-3 py-1 bg-red-500 text-white rounded text-sm">
                        Löschen
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags/Interests */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Interessen & Tags</h3>
            <button
              onClick={() => router.push('/onboarding')}
              className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition text-sm"
            >
              Bearbeiten
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              BDSM
            </span>
            <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
              Latex
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              Dominanz
            </span>
            <button className="px-3 py-1 border-2 border-dashed border-gray-300 text-gray-500 rounded-full text-sm hover:border-purple-600 hover:text-purple-600 transition">
              + Tags hinzufügen
            </button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Account</h3>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/settings')}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition"
            >
              ⚙️ Einstellungen
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition"
            >
              🔒 Privatsphäre
            </button>
            <button
              className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition text-red-600"
            >
              🚪 Account löschen
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
