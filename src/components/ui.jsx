import { X } from 'lucide-react'

export function PageHeader({ title, children, onBack }) {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-b from-[#333]/90 to-[#121212]/70 backdrop-blur-md px-4 pt-3 pb-3 flex items-center gap-3">
      {onBack && <button aria-label="Back" onClick={onBack} className="p-1.5 -ml-1.5 rounded-full bg-black/40 hover:bg-black/60 text-[15px]">←</button>}
      <h1 className="text-[20px] md:text-2xl font-bold flex-1 truncate">{title}</h1>
      {children}
    </header>
  )
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] bg-black/70 flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="bg-elev w-full md:max-w-md max-h-[85dvh] overflow-y-auto no-scrollbar rounded-t-2xl md:rounded-2xl p-5 animate-slide-up md:animate-fade-in"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button aria-label="Close" onClick={onClose} className="p-2 rounded-full hover:bg-white/10"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Menu({ open, onClose, items }) {
  if (!open) return null
  return (
    <>
      <div className="fixed inset-0 z-[60]" onClick={onClose} />
      <div className="fixed right-4 md:right-auto md:left-1/2 md:-translate-x-1/2 bottom-32 md:bottom-auto md:top-24 z-[65] w-56 bg-elev rounded-lg shadow-2xl py-1.5 animate-fade-in">
        {items.map((it, i) => (
          <button key={i} disabled={it.disabled} onClick={() => { it.onClick && it.onClick(); onClose() }}
            className="w-full text-left px-3.5 py-2 text-[14px] hover:bg-white/10 disabled:opacity-40 flex items-center gap-2.5">
            {it.icon}{it.label}
          </button>
        ))}
      </div>
    </>
  )
}

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      {label && <span className="block text-[13px] font-semibold mb-1.5">{label}</span>}
      {children}
      {hint && <span className="block text-[12px] text-muted mt-1">{hint}</span>}
    </label>
  )
}

export const inputCls = 'w-full bg-elev border border-white/10 rounded-md px-3.5 py-2.5 text-[15px] outline-none focus:border-white placeholder:text-muted'
export const btnPrimary = 'w-full bg-spot hover:bg-spotdark text-black font-bold rounded-full py-3 text-[15px] transition active:scale-[.98] disabled:opacity-50'
export const btnGhost = 'w-full border border-white/30 hover:border-white font-bold rounded-full py-3 text-[15px] transition disabled:opacity-50'
