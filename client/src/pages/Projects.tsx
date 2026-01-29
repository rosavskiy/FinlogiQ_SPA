import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useTelegram } from '../context/TelegramContext'
import { projectsApi } from '../services/api'

interface Project {
  _id: string
  title: string
  description: string
  category: string
  status: 'active' | 'completed' | 'upcoming'
  image?: string
  createdAt: string
}

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: 'В процессе', color: 'bg-yellow-500/90 text-white' },
  completed: { label: 'Завершён', color: 'bg-green-500/90 text-white' },
  upcoming: { label: 'Планируется', color: 'bg-blue-500/90 text-white' },
}

const MAX_DESCRIPTION_LENGTH = 200

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())
  const { showBackButton, hideBackButton, isTelegram } = useTelegram()

  const toggleExpand = (projectId: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsApi.getAll(1, 20)
        setProjects(response.data.projects || [])
      } catch (err) {
        console.error('Error loading projects:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  useEffect(() => {
    if (isTelegram) {
      showBackButton(() => window.history.back())
      return () => hideBackButton()
    }
  }, [isTelegram, showBackButton, hideBackButton])

  return (
    <div className="pt-16 pb-20 md:pb-0">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Наши проекты
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Реализованные кейсы и текущие проекты в области разработки ПО и финансового консалтинга
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              Проекты пока не добавлены
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {projects.map((project, index) => (
                <article
                  key={project._id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image */}
                  <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center">
                          <span className="text-3xl font-bold text-primary-600">{index + 1}</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-full">
                        {project.category}
                      </span>
                      <span className={`px-3 py-1 backdrop-blur-sm text-xs font-medium rounded-full ${statusLabels[project.status]?.color || 'bg-gray-500/90 text-white'}`}>
                        {statusLabels[project.status]?.label || project.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {new Date(project.createdAt).getFullYear()}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {project.title}
                    </h3>
                    <div className="text-gray-600 dark:text-gray-300 mb-4 prose prose-sm dark:prose-invert max-w-none">
                      {project.description.length > MAX_DESCRIPTION_LENGTH && !expandedProjects.has(project._id) ? (
                        <>
                          <ReactMarkdown>
                            {project.description.substring(0, MAX_DESCRIPTION_LENGTH) + '...'}
                          </ReactMarkdown>
                          <button
                            onClick={() => toggleExpand(project._id)}
                            className="inline-flex items-center gap-1 text-primary-600 font-medium text-sm mt-2 hover:gap-2 transition-all"
                          >
                            Развернуть
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <ReactMarkdown>{project.description}</ReactMarkdown>
                          {project.description.length > MAX_DESCRIPTION_LENGTH && (
                            <button
                              onClick={() => toggleExpand(project._id)}
                              className="inline-flex items-center gap-1 text-primary-600 font-medium text-sm mt-2 hover:gap-2 transition-all"
                            >
                              Свернуть
                              <ChevronUp className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    <button className="inline-flex items-center gap-2 text-primary-600 font-medium hover:gap-3 transition-all">
                      Подробнее
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Хотите стать следующим кейсом?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Расскажите о вашем проекте, и мы подготовим индивидуальное предложение
          </p>
          <Link
            to="/contacts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Обсудить проект
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
