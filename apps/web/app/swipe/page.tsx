'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface PotentialMatch {
  id: string;
  pseudonym: string;
  ageRange: string;
  distance?: number;
  tags: string[];
  primaryPhotoUrl?: string;
  compatibilityScore: number;
}

export default function SwipePage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [currentProfile, setCurrentProfile] = useState<PotentialMatch | null>(null);
  const [profiles, setProfiles] = useState<PotentialMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchPotentialMatches();
  }, [token, router]);

  const fetchPotentialMatches = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/matches/potential?limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const fetchedProfiles = data.data || [];
        setProfiles(fetchedProfiles);
        setCurrentProfile(fetchedProfiles[0] || null);
      }
    } catch (error) {
      console.error('Failed to fetch potential matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!currentProfile) return;

    setSwipeDirection(direction);
    
    // API Call für Like/Pass
    if (direction === 'right') {
      try {
        await fetch('http://localhost:3001/api/v1/matches', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ targetUserId: currentProfile.id }),
        });
      } catch (error) {
        console.error('Failed to create match:', error);
      }
    }

    // Animation, dann nächstes Profil
    setTimeout(() => {
      const nextProfiles = profiles.slice(1);
      setProfiles(nextProfiles);
      setCurrentProfile(nextProfiles[0] || null);
      setSwipeDirection(null);

      // Neue Profile laden wenn nur noch 3 übrig
      if (nextProfiles.length <= 3) {
        fetchPotentialMatches();
      }
    }, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-white hover:text-white/80 transition"
        >
          ← Zurück
        </button>
        <h1 className="text-white text-xl font-bold">Entdecken</h1>
        <div className="w-16"></div>
      </header>

      {/* Swipe Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        {currentProfile ? (
          <div className="relative w-full max-w-md">
            {/* Card Stack Background */}
            {profiles.slice(1, 3).map((profile, index) => (
              <div
                key={profile.id}
                className="absolute inset-0 bg-white rounded-2xl shadow-xl"
                style={{
                  transform: `scale(${1 - (index + 1) * 0.05}) translateY(${(index + 1) * -10}px)`,
                  zIndex: -index - 1,
                  opacity: 1 - (index + 1) * 0.2,
                }}
              ></div>
            ))}

            {/* Current Card */}
            <div
              className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden transition-transform duration-300 ${
                swipeDirection === 'left' ? '-translate-x-96 -rotate-12 opacity-0' : ''
              } ${
                swipeDirection === 'right' ? 'translate-x-96 rotate-12 opacity-0' : ''
              }`}
            >
              {/* Photo */}
              <div className="aspect-[3/4] bg-gradient-to-br from-purple-400 to-pink-400 relative">
                {currentProfile.primaryPhotoUrl ? (
                  <img
                    src={currentProfile.primaryPhotoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-9xl">🎭</span>
                  </div>
                )}
                
                {/* Compatibility Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-purple-600 font-bold">
                    {Math.round(currentProfile.compatibilityScore * 100)}% Match
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold">{currentProfile.pseudonym}</h2>
                  {currentProfile.distance && (
                    <span className="text-gray-500 text-sm">{currentProfile.distance} km</span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{currentProfile.ageRange}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {currentProfile.tags.slice(0, 5).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                  {currentProfile.tags.length > 5 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      +{currentProfile.tags.length - 5} mehr
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-6 mt-8">
              <button
                onClick={() => handleSwipe('left')}
                className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                disabled={swipeDirection !== null}
              >
                <span className="text-3xl">❌</span>
              </button>
              <button
                onClick={() => handleSwipe('right')}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                disabled={swipeDirection !== null}
              >
                <span className="text-4xl">❤️</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
            <span className="text-6xl mb-4 block">😔</span>
            <h2 className="text-2xl font-bold mb-2">Keine neuen Profile</h2>
            <p className="text-gray-600 mb-6">
              Schau später wieder vorbei oder erweitere deine Suchkriterien.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Zurück zum Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      {profiles.length > 0 && (
        <div className="p-4 text-center text-white/80 text-sm">
          Noch {profiles.length} Profile zu entdecken
        </div>
      )}
    </div>
  );
}
