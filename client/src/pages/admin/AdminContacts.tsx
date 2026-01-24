import { useState } from 'react'
import { Mail, Phone, Clock, Check, Reply, Trash2, Eye } from 'lucide-react'

interface Contact {
  id: number
  name: string
  email: string
  phone?: string
  message: string
  status: 'new' | 'read' | 'replied'
  createdAt: string
}

const mockContacts: Contact[] = [
  { id: 1, name: 'Иван Петров', email: 'ivan@example.com', phone: '+7 999 123-45-67', message: 'Добрый день! Интересует выпуск облигаций для нашей компании. Оборот около 500 млн рублей в год. Хотели бы обсудить условия и сроки.', status: 'new', createdAt: '2026-01-23T14:30:00' },
  { id: 2, name: 'Мария Сидорова', email: 'maria@company.ru', message: 'Здравствуйте! Хотим обсудить сотрудничество в сфере финансового консалтинга. Когда можно созвониться?', status: 'new', createdAt: '2026-01-23T10:15:00' },
  { id: 3, name: 'Алексей Козлов', email: 'alex@firm.com', phone: '+7 916 555-00-00', message: 'Нужна консультация по криптокартам для бизнеса. Есть несколько вопросов по комплаенсу.', status: 'read', createdAt: '2026-01-22T16:45:00' },
  { id: 4, name: 'Ольга Новикова', email: 'olga@startup.io', message: 'Интересует финансовое моделирование для нашего стартапа перед раундом инвестиций.', status: 'replied', createdAt: '2026-01-21T09:00:00' },
]

const statusConfig = {
  new: { label: 'Новая', class: 'bg-orange-100 text-orange-700', icon: Clock },
  read: { label: 'Прочитано', class: 'bg-blue-100 text-blue-700', icon: Eye },
  replied: { label: 'Отвечено', class: 'bg-green-100 text-green-700', icon: Check },
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all')

  const filteredContacts = contacts.filter(c => 
    filter === 'all' || c.status === filter
  )

  const newCount = contacts.filter(c => c.status === 'new').length

  const handleMarkAsRead = (id: number) => {
    setContacts(contacts.map(c => 
      c.id === id ? { ...c, status: 'read' as const } : c
    ))
  }

  const handleMarkAsReplied = (id: number) => {
    setContacts(contacts.map(c => 
      c.id === id ? { ...c, status: 'replied' as const } : c
    ))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Заявки</h2>
        <p className="text-gray-600">Обращения с формы обратной связи</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'Все' },
          { value: 'new', label: `Новые (${newCount})` },
          { value: 'read', label: 'Прочитанные' },
          { value: 'replied', label: 'Отвеченные' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Contacts list */}
      <div className="space-y-3">
        {filteredContacts.map((contact) => {
          const StatusIcon = statusConfig[contact.status].icon
          return (
            <div 
              key={contact.id} 
              className={`bg-white rounded-xl shadow-sm border p-4 cursor-pointer transition-all hover:shadow-md ${
                contact.status === 'new' ? 'border-orange-200' : 'border-gray-100'
              }`}
              onClick={() => {
                setSelectedContact(contact)
                if (contact.status === 'new') handleMarkAsRead(contact.id)
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig[contact.status].class}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig[contact.status].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {contact.email}
                    </span>
                    {contact.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 line-clamp-2">{contact.message}</p>
                </div>
                <div className="text-right ml-4">
                  <span className="text-xs text-gray-400">
                    {new Date(contact.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredContacts.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          Заявки не найдены
        </div>
      )}

      {/* Detail modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedContact.name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span>{selectedContact.email}</span>
                    {selectedContact.phone && <span>{selectedContact.phone}</span>}
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig[selectedContact.status].class}`}>
                  {statusConfig[selectedContact.status].label}
                </span>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
              <p className="text-sm text-gray-400 mt-4">
                {new Date(selectedContact.createdAt).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-b-2xl flex justify-between">
              <button 
                onClick={() => setSelectedContact(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Закрыть
              </button>
              <div className="flex gap-2">
                <a
                  href={`mailto:${selectedContact.email}`}
                  onClick={() => handleMarkAsReplied(selectedContact.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  Ответить
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
