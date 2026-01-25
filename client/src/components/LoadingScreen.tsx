import { useEffect, useState } from 'react'

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    // Минимальное время показа - 1 секунда
    const minDisplayTime = setTimeout(() => {
      if (isVideoLoaded) {
        onComplete()
      }
    }, 1000)

    return () => clearTimeout(minDisplayTime)
  }, [isVideoLoaded, onComplete])

  const handleVideoEnd = () => {
    setIsVideoLoaded(true)
    onComplete()
  }

  const handleVideoError = () => {
    // Если видео не загрузилось, показываем минимум 1 секунду и скрываем
    setTimeout(onComplete, 1000)
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <div className="relative w-full max-w-md px-8">
        <video
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          onError={handleVideoError}
          className="w-full h-auto"
        >
          <source src="/animation.mp4" type="video/mp4" />
        </video>
        
        {/* Fallback если видео не поддерживается */}
        <noscript>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </noscript>
      </div>
    </div>
  )
}
