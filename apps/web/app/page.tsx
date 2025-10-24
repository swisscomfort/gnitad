export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Fetisch Dating Plattform
        </h1>
        <p className="text-xl text-white/80 mb-8">
          Diskrete Dating-Plattform mit KI-Charakter-Generator
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition"
          >
            Registrieren
          </a>
        </div>
      </div>
    </div>
  );
}
