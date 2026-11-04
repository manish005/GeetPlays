import { useState } from 'react'
import { Crown, Check } from 'lucide-react'
import { PageHeader } from '../components/ui'
import { useUser } from '../context/UserContext'
import { useToast } from '../context/ToastContext'

const PLANS = [
  { name: 'Free', price: '$0', desc: 'Everyday listening', perks: ['Ad-supported playback', 'Standard quality', 'Playlists & search'] },
  { name: 'Premium Individual', price: '$10.99/mo', desc: 'One account, full unlock', perks: ['Ad-free playback', 'High quality audio', 'Offline downloads', 'Unlimited skips'] },
  { name: 'Premium Family', price: '$16.99/mo', desc: 'Up to 6 accounts', perks: ['Everything in Individual', '6 accounts', 'Kid-friendly filter'] },
  { name: 'Premium Student', price: '$5.99/mo', desc: 'Students with verification', perks: ['Everything in Individual', 'Student discount'] },
]

export default function Premium({ goBack }) {
  const { settings, setSettings } = useUser()
  const { toast } = useToast()
  const [active, setActive] = useState(settings.plan === 'Premium' ? 'Premium Individual' : null)

  const choose = (name) => {
    setActive(name)
    if (name === 'Free') { setSettings({ ...settings, plan: 'Free' }); toast('Downgraded to Free') }
    else { setSettings({ ...settings, plan: 'Premium' }); toast(`${name} activated (test mode)`) }
  }

  return (
    <div className="pb-40 md:pb-8">
      <PageHeader title="GeetPlays Premium" onBack={goBack} />
      <div className="px-4 mt-4 bg-gradient-to-br from-[#5038E6] to-[#1E3264] rounded-xl p-5">
        <Crown size={32} className="text-white" />
        <h2 className="text-2xl font-black mt-2">Music without limits</h2>
        <p className="text-white/80 text-sm mt-1">Test mode — no real payment. Tap a plan to switch instantly.</p>
        <p className="text-sm mt-3 font-semibold">Current: {settings.plan}{active ? ` • ${active}` : ''}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-3 px-4 mt-4">
        {PLANS.map(p => (
          <div key={p.name} className={`rounded-xl p-4 border ${active === p.name ? 'border-spot bg-card' : 'border-white/10 bg-panel'}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold">{p.name}</h3>
              <span className="font-black text-spot">{p.price}</span>
            </div>
            <p className="text-muted text-[13px] mt-0.5">{p.desc}</p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {p.perks.map(x => <li key={x} className="flex items-center gap-2 text-[13px] text-muted"><Check size={14} className="text-spot" />{x}</li>)}
            </ul>
            <button onClick={() => choose(p.name)} className={`w-full mt-4 rounded-full py-2.5 font-bold text-sm ${active === p.name ? 'bg-white/10' : 'bg-spot text-black hover:bg-spotdark'}`}>
              {active === p.name ? 'Current plan' : 'Choose ' + p.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
