'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface SuggestedTag {
  tag: string;
  confidence: number;
}

export default function UploadPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<SuggestedTag[]>([]);
  const [photoType, setPhotoType] = useState<'object' | 'scene' | 'other'>('object');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        analyzeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Image: string) => {
    setAnalyzing(true);
    try {
      // Call ML Service for object recognition
      const response = await fetch('http://localhost:5000/api/v1/photo/recognize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image.split(',')[1], // Remove data:image/jpeg;base64, prefix
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestedTags(data.suggestedTags || []);
      }
    } catch (error) {
      console.error('Failed to analyze image:', error);
      // Fallback: Mock tags
      setSuggestedTags([
        { tag: 'latex', confidence: 0.85 },
        { tag: 'handschuh', confidence: 0.72 },
        { tag: 'glänzend', confidence: 0.68 },
      ]);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !preview) return;

    setUploading(true);
    try {
      // In production: Upload to S3/MinIO first, then save URL
      // For now: Mock upload
      const formData = new FormData();
      formData.append('photo', selectedFile);
      formData.append('photoType', photoType);

      const response = await fetch('http://localhost:3001/api/v1/photos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photoUrl: preview, // In production: S3 URL
          photoType,
          isPrimary: false,
        }),
      });

      if (response.ok) {
        router.push('/profile');
      }
    } catch (error) {
      console.error('Failed to upload photo:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push('/profile')}
              className="text-gray-600 hover:text-purple-600 transition"
            >
              ← Zurück
            </button>
            <h1 className="text-xl font-bold">Foto hochladen</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Info Box */}
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-2">📸 Objekt-Fotos</h3>
            <p className="text-sm text-purple-700">
              Lade Fotos von Objekten hoch (z.B. Windel, Seil, Latex-Handschuh), keine Gesichter.
              Unsere KI erkennt automatisch Tags für besseres Matching.
            </p>
          </div>

          {/* Upload Area */}
          {!preview ? (
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-purple-600 hover:bg-purple-50 transition">
                <span className="text-6xl mb-4 block">📷</span>
                <p className="text-gray-600 mb-2">Klicke hier oder ziehe ein Foto hinein</p>
                <p className="text-sm text-gray-500">JPG, PNG bis 10MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-6">
              {/* Preview */}
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full rounded-lg shadow-lg max-h-96 object-contain bg-gray-100"
                />
                <button
                  onClick={() => {
                    setPreview(null);
                    setSelectedFile(null);
                    setSuggestedTags([]);
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
                >
                  ✕
                </button>
              </div>

              {/* Photo Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto-Typ
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setPhotoType('object')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                      photoType === 'object'
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-purple-600'
                    }`}
                  >
                    Objekt
                  </button>
                  <button
                    onClick={() => setPhotoType('scene')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                      photoType === 'scene'
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-purple-600'
                    }`}
                  >
                    Szene
                  </button>
                  <button
                    onClick={() => setPhotoType('other')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                      photoType === 'other'
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-purple-600'
                    }`}
                  >
                    Sonstiges
                  </button>
                </div>
              </div>

              {/* AI Analysis */}
              {analyzing ? (
                <div className="p-6 bg-gray-50 rounded-lg text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">KI analysiert Foto...</p>
                </div>
              ) : suggestedTags.length > 0 ? (
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-3">
                    🤖 KI hat Tags erkannt:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white border border-green-300 rounded-full text-sm flex items-center gap-2"
                      >
                        <span>{tag.tag}</span>
                        <span className="text-xs text-gray-500">
                          {Math.round(tag.confidence * 100)}%
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setPreview(null);
                    setSelectedFile(null);
                    setSuggestedTags([]);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Wird hochgeladen...' : 'Hochladen'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
