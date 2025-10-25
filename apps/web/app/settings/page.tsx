'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function SettingsPage() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const [privacyLevel, setPrivacyLevel] = useState(user?.privacyLevel || 3);
  const [searchRadiusKm, setSearchRadiusKm] = useState(50);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:3001/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          privacyLevel,
          searchRadiusKm,
        }),
      });

      if (response.ok) {
        alert('Einstellungen gespeichert!');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm('Account wirklich deaktivieren?')) return;

    try {
      const response = await fetch('http://localhost:3001/api/v1/users/profile/deactivate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        logout();
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to deactivate account:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-purple-600 transition"
            >
              ← Zurück
            </button>
            <h1 className="text-xl font-bold">Einstellungen</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Privacy Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">🔒 Privatsphäre</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Privacy Level: {privacyLevel}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={privacyLevel}
              onChange={(e) => setPrivacyLevel(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Offen</span>
              <span>Mittel</span>
              <span>Sehr privat</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm">Fotos nur für Matches sichtbar</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm">Online-Status verbergen</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">Profilbesuche nicht anzeigen</span>
            </label>
          </div>
        </div>

        {/* Discover Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">🔍 Entdecken</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suchradius: {searchRadiusKm} km
            </label>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={searchRadiusKm}
              onChange={(e) => setSearchRadiusKm(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">Altersbereich</span>
              <select className="px-3 py-1 border rounded">
                <option>18-99</option>
                <option>18-25</option>
                <option>25-35</option>
                <option>35-50</option>
                <option>50+</option>
              </select>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm">Nur verifizierte Profile</span>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">🔔 Benachrichtigungen</h2>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm">Neue Matches</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm">Nachrichten</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">Profilbesuche</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">Likes</span>
            </label>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">👤 Account</h2>
          
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition">
              📧 Email ändern
            </button>
            <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition">
              🔑 Passwort ändern
            </button>
            <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition">
              📥 Daten exportieren (GDPR)
            </button>
            <button
              onClick={handleDeactivate}
              className="w-full text-left px-4 py-3 hover:bg-red-50 rounded-lg transition text-red-600"
            >
              ⏸️ Account deaktivieren
            </button>
            <button className="w-full text-left px-4 py-3 hover:bg-red-50 rounded-lg transition text-red-600">
              🗑️ Account löschen
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            {saving ? 'Speichert...' : 'Speichern'}
          </button>
        </div>
      </main>
    </div>
  );
}
