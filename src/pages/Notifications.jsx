import { useState } from 'react'
import { Disc3, ListMusic, UserRound, BellRing, Trash2 } from 'lucide-react'
import { PageHeader } from '../components/ui'
import { useUser } from '../context/UserContext'
import { useToast } from '../context/ToastContext'
import { notificationSeed } from '../data/catalog'

const ICONS = { release: Disc3, playlist: ListMusic, follower: UserRound, account: BellRing }

export default function Notifications({ goBack }) {
  const { notifications, setNotifications } = useUser()
  const { toast } = useToast()
  const list = notifications || notificationSeed

  const markRead = (id) => setNotifications(list.map(n => n.id === id ? { ...n, read: true } : n))
  const markAll = () => { setNotifications(list.map(n => ({ ...n, read: true }))); toast('All caught up') }
  const del = (id) => setNotifications(list.filter(n => n.id !== id))

  return (
    <div className="pb-40 md:pb-8">
      <PageHeader title="Notifications" onBack={goBack}>
        {list.some(n => !n.read) && <button onClick={markAll} className="text-[13px] text-muted hover:text-white font-semibold">Mark all read</button>}
      </PageHeader>

      {list.length === 0 ? (
        <div className="px-4 py-16 text-center">
          <BellRing size={40} className="mx-auto text-muted" />
          <p className="text-xl font-bold mt-4">No notifications</p>
          <p className="text-muted mt-1.5 text-sm">New releases and updates will land here.</p>
        </div>
      ) : (
        <ul className="mt-2">
          {list.map(n => {
            const Icon = ICONS[n.type] || BellRing
            return (
              <li key={n.id} onClick={() => markRead(n.id)} className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 ${n.read ? 'opacity-60' : ''}`}>
                <span className="w-10 h-10 rounded-full bg-elev flex items-center justify-center shrink-0"><Icon size={19} /></span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[15px] leading-snug">{n.text}</span>
                  <span className="block text-[12px] text-muted mt-1">{n.time}</span>
                </span>
                {!n.read && <span className="w-2 h-2 rounded-full bg-spot mt-2 shrink-0" />}
                <button aria-label="Delete" onClick={e => { e.stopPropagation(); del(n.id) }} className="p-1.5 text-muted hover:text-white"><Trash2 size={16} /></button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
