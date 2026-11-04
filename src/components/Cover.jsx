import { useState } from 'react'

export default function Cover({ src, alt, className = '', rounded = 'rounded-md' }) {
  const [err, setErr] = useState(false)
  if (err) return <div className={`${rounded} bg-gradient-to-br from-[#5038E6] to-[#1E3264] ${className}`} />
  return <img src={src} alt={alt} loading="lazy" onError={() => setErr(true)} draggable={false}
    className={`${rounded} object-cover bg-elev ${className}`} />
}
