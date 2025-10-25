'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface Match {
  id: string;
  pseudonym: string;
  ageRange: string;
  compatibilityScore: number;
  primaryPhotoUrl?: string;
  matchedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'matches' | 'discover' | 'chat'>('matches');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchMatches();
  }, [token, router]);

  const fetchMatches = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/matches', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMatches(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                🎭 Fetisch Dating
              </h1>
              <span className="text-gray-600">Hallo, {user.pseudonym}!</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/profile')}
                className="px-4 py-2 text-gray-700 hover:text-purple-600 transition"
              >
                Profil
              </button>
              <button
                onClick={() => router.push('/settings')}
                className="px-4 py-2 text-gray-700 hover:text-purple-600 transition"
              >
                Einstellungen
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('matches')}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'matches'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              💘 Matches
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'discover'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              🔍 Entdecken
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'chat'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              💬 Nachrichten
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'matches' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Deine Matches</h2>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 mb-4">Noch keine Matches gefunden.</p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Jetzt entdecken
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match) => (
                  <div
                    key={match.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/profile/${match.id}`)}
                  >
                    <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      {match.primaryPhotoUrl ? (
                        <img
                          src={match.primaryPhotoUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-6xl">🎭</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{match.pseudonym}</h3>
                      <p className="text-gray-600 text-sm mb-2">{match.ageRange}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-purple-600 font-medium">
                          {Math.round(match.compatibilityScore * 100)}% Match
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/chat/${match.id}`);
                          }}
                          className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition"
                        >
                          Nachricht
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'discover' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Neue Leute entdecken</h2>
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">Swipe-Interface</p>
              <button
                onClick={() => router.push('/swipe')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Zum Swipe-Modus
              </button>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Nachrichten</h2>
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">Deine Konversationen</p>
              <button
                onClick={() => router.push('/chat')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Chat öffnen
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
