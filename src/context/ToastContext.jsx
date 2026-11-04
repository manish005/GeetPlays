import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

const Ctx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)
  const toast = useCallback((msg) => {
    const id = ++idRef.current
    setToasts(t => [...t.slice(-2), { id, msg }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2600)
  }, [])
  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-28 md:bottom-24 left-1/2 -translate-x-1/2 z-[80] flex flex-col items-center gap-2 pointer-events-none px-4">
        {toasts.map(t => (
          <div key={t.id} className="animate-fade-in flex items-center gap-2 bg-white text-black text-sm font-medium px-4 py-2.5 rounded-full shadow-2xl max-w-[90vw]">
            <CheckCircle2 size={16} className="text-spotdark shrink-0" /><span className="truncate">{t.msg}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)
