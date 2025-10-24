"use client";

import { useState } from "react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login({ email, password });

      if (response.data?.data) {
        setUser(response.data.data.user);
        setToken(response.data.data.token);
        localStorage.setItem("token", response.data.data.token);

        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login fehlgeschlagen. Bitte versuche es erneut."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-8"
        >
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Login
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            {isLoading ? "Laden..." : "Login"}
          </button>

          <p className="mt-4 text-center text-gray-600">
            Noch kein Account?{" "}
            <a href="/register" className="text-purple-600 font-semibold">
              Jetzt registrieren
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
