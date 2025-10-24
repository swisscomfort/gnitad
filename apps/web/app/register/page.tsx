"use client";

import { useState } from "react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    pseudonym: "",
    email: "",
    password: "",
    passwordConfirm: "",
    ageRange: "25-30",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.password !== formData.passwordConfirm) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register({
        pseudonym: formData.pseudonym,
        email: formData.email,
        password: formData.password,
        ageRange: formData.ageRange,
      });

      if (response.data?.data) {
        setUser(response.data.data.user);
        setToken(response.data.data.token);
        localStorage.setItem("token", response.data.data.token);

        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Registrierung fehlgeschlagen. Bitte versuche es erneut."
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
            Registrieren
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Pseudonym
            </label>
            <input
              type="text"
              name="pseudonym"
              value={formData.pseudonym}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Altersgruppe
            </label>
            <select
              name="ageRange"
              value={formData.ageRange}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="18-25">18-25</option>
              <option value="25-30">25-30</option>
              <option value="30-35">30-35</option>
              <option value="35-40">35-40</option>
              <option value="40-45">40-45</option>
              <option value="45-50">45-50</option>
              <option value="50+">50+</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Passwort
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Passwort bestätigen
            </label>
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            {isLoading ? "Laden..." : "Registrieren"}
          </button>

          <p className="mt-4 text-center text-gray-600">
            Bereits registriert?{" "}
            <a href="/login" className="text-purple-600 font-semibold">
              Hier anmelden
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
