import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="relative">
          <h1 className="text-[150px] md:text-[200px] font-bold text-gray-100 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔍</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Страница не найдена
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          К сожалению, запрашиваемая страница не существует или была перемещена
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            На главную
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад
          </button>
        </div>
      </div>
    </div>
  )
}
