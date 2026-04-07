import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            VIP AI Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Chat dengan AI paling canggih • Mulai dari Rp 50.000/bulan
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold transition">
              Mulai Gratis
            </Link>
            <Link href="/pricing" className="border border-gray-600 hover:border-white px-8 py-3 rounded-xl font-semibold transition">
              Lihat Harga
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-gray-800/50 p-6 rounded-2xl backdrop-blur">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-xl font-bold mb-2">DeepSeek AI</h3>
            <p className="text-gray-400">Model AI terbaru dengan kemampuan super cerdas</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-2xl backdrop-blur">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-xl font-bold mb-2">Response Cepat</h3>
            <p className="text-gray-400">Jawaban instan dalam hitungan detik</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-2xl backdrop-blur">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-xl font-bold mb-2">Aman & Privasi</h3>
            <p className="text-gray-400">Data chat Anda terenkripsi dan aman</p>
          </div>
        </div>
      </div>
    </main>
  )
}
