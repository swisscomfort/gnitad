'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface Tag {
  id: string;
  name: string;
  description: string;
  category: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [step, setStep] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/taxonomy/tags');
      if (response.ok) {
        const data = await response.json();
        setAllTags(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      // Fallback mock data
      setAllTags([
        { id: 'bdsm', name: 'BDSM', description: 'Bondage, Dominanz, Submission', category: 'bdsm' },
        { id: 'latex', name: 'Latex', description: 'Latex-Kleidung und -Accessoires', category: 'material' },
        { id: 'leather', name: 'Leder', description: 'Leder-Kleidung und -Accessoires', category: 'material' },
        { id: 'dominance', name: 'Dominanz', description: 'Dominante Rolle', category: 'bdsm' },
        { id: 'submission', name: 'Submission', description: 'Unterwürfige Rolle', category: 'bdsm' },
        { id: 'bondage', name: 'Bondage', description: 'Fesseln und Fixierung', category: 'bdsm' },
        { id: 'nylon', name: 'Nylon', description: 'Nylon-Strümpfe und -Kleidung', category: 'material' },
        { id: 'roleplay', name: 'Roleplay', description: 'Rollenspiele', category: 'roleplay' },
        { id: 'abdl', name: 'ABDL', description: 'Adult Baby / Diaper Lover', category: 'abdl' },
        { id: 'petplay', name: 'Petplay', description: 'Tier-Rollenspiele', category: 'roleplay' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async () => {
    try {
      await fetch('http://localhost:3001/api/v1/taxonomy/user-tags', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tagIds: selectedTags,
          preference: 'interested',
        }),
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save tags:', error);
    }
  };

  const categories = [...new Set(allTags.map(tag => tag.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600">
      {/* Header */}
      <header className="p-6 text-white">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Profil vervollständigen</h1>
          <span className="text-white/80">Schritt {step}/3</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Willkommen! 🎭</h2>
              <p className="text-gray-600 mb-8">
                Lass uns dein Profil einrichten. Wähle deine Interessen aus, damit wir
                die perfekten Matches für dich finden können.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Was interessiert dich? (Wähle mindestens 3)
                  </label>
                  <p className="text-sm text-gray-500 mb-4">
                    {selectedTags.length} ausgewählt
                  </p>
                </div>

                {categories.map(category => {
                  const categoryTags = allTags.filter(tag => tag.category === category);
                  return (
                    <div key={category}>
                      <h3 className="font-semibold text-lg mb-3 capitalize">{category}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {categoryTags.map(tag => (
                          <button
                            key={tag.id}
                            onClick={() => toggleTag(tag.id)}
                            className={`p-4 rounded-lg border-2 text-left transition ${
                              selectedTags.includes(tag.id)
                                ? 'border-purple-600 bg-purple-50 text-purple-700'
                                : 'border-gray-300 hover:border-purple-600'
                            }`}
                          >
                            <div className="font-semibold mb-1">{tag.name}</div>
                            <div className="text-xs text-gray-600">{tag.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Überspringen
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={selectedTags.length < 3}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Weiter
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Erfahrungslevel</h2>
              <p className="text-gray-600 mb-8">
                Wie würdest du dein Erfahrungslevel beschreiben?
              </p>

              <div className="grid gap-4 mb-8">
                {['Anfänger - Neugierig', 'Fortgeschritten - Etwas Erfahrung', 'Erfahren - Regelmäßig aktiv', 'Experte - Sehr erfahren'].map((level, index) => (
                  <button
                    key={index}
                    className="p-6 rounded-lg border-2 border-gray-300 text-left hover:border-purple-600 hover:bg-purple-50 transition"
                  >
                    <div className="font-semibold mb-1">{level}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Zurück
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Weiter
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Fast fertig! 🎉</h2>
              <p className="text-gray-600 mb-8">
                Du hast {selectedTags.length} Interessen ausgewählt. Bereit loszulegen?
              </p>

              <div className="bg-purple-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold mb-3">Deine Auswahl:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tagId => {
                    const tag = allTags.find(t => t.id === tagId);
                    return (
                      <span
                        key={tagId}
                        className="px-3 py-1 bg-white rounded-full text-sm border border-purple-300"
                      >
                        {tag?.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Zurück
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Profil abschließen
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
