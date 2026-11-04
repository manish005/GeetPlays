import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, User, Calendar, Check } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useToast } from '../context/ToastContext'
import { Field, inputCls, btnPrimary, btnGhost } from '../components/ui'

const strength = (p) => {
  let s = 0
  if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++
  return s
}
const STRENGTH_LABEL = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']

export default function Auth({ go }) {
  const { login } = useUser()
  const { toast } = useToast()
  const [mode, setMode] = useState('login') // login | signup | forgot | reset
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [username, setUsername] = useState('')
  const [pass, setPass] = useState(''); const [pass2, setPass2] = useState(''); const [dob, setDob] = useState('')
  const [show, setShow] = useState(false); const [terms, setTerms] = useState(false); const [remember, setRemember] = useState(true)
  const [msg, setMsg] = useState('')

  const err = (m) => setMsg(m)

  const doLogin = (e) => {
    e.preventDefault(); setMsg('')
    // Admin credentials (seeded in UserContext / localStorage)
    if (email.toLowerCase() === 'admin@geetplays.com' && pass === 'Admin@2026') {
      login('Admin', email, 'admin')
      toast('Welcome back, Admin')
      go('home')
      return
    }
    if (email.toLowerCase() === 'admin@geetplays.com') return err('Invalid admin password.')
    if (!email.includes('@')) return err('Enter a valid email address.')
    if (pass.length < 6) return err('Password must be at least 6 characters.')
    login(email.split('@')[0] || 'Guest', email, 'user')
    toast(`Welcome back, ${email.split('@')[0]}`)
    go('home')
  }
  const doSignup = (e) => {
    e.preventDefault(); setMsg('')
    if (name.trim().length < 2) return err('Enter your full name.')
    if (!email.includes('@')) return err('Enter a valid email address.')
    if (username.trim().length < 3) return err('Username must be at least 3 characters.')
    if (pass.length < 8) return err('Password must be at least 8 characters.')
    if (pass !== pass2) return err('Passwords do not match.')
    if (!dob) return err('Date of birth is required.')
    if (!terms) return err('Please accept the Terms & Conditions.')
    try {
      const users = JSON.parse(localStorage.getItem('vb_accounts') || '[]')
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) return err('An account with this email already exists.')
      users.push({ name, email, username, pass }); localStorage.setItem('vb_accounts', JSON.stringify(users))
    } catch {}
    login(name, email)
    toast('Account created — welcome to GeetPlays')
    go('home')
  }
  const doForgot = (e) => {
    e.preventDefault()
    if (!email.includes('@')) return err('Enter a valid email address.')
    toast(`Reset link sent to ${email}`)
    setMode('reset')
  }
  const doReset = (e) => {
    e.preventDefault()
    if (pass.length < 8) return err('Password must be at least 8 characters.')
    if (pass !== pass2) return err('Passwords do not match.')
    toast('Password updated — please log in')
    setMode('login')
  }

  const passField = (label, val, set, ph) => (
    <Field label={label}>
      <div className="relative">
        <input type={show ? 'text' : 'password'} value={val} onChange={e => set(e.target.value)} placeholder={ph} className={`${inputCls} pr-11`} />
        <button type="button" aria-label="Toggle password" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white p-1">
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </Field>
  )

  return (
    <div className="min-h-dvh bg-ink flex items-center justify-center px-4 py-10">
      <form onSubmit={mode === 'login' ? doLogin : mode === 'signup' ? doSignup : mode === 'forgot' ? doForgot : doReset}
        className="w-full max-w-sm bg-panel rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-2 justify-center mb-1">
          <span className="w-9 h-9 rounded-full bg-spot flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 9.5c5-1.5 10.5-1.2 15.5 1.2M5 13.5c4.1-1.1 8.6-.9 12.7 1M6 17.3c3.2-.8 6.6-.6 9.7.8" stroke="#000" strokeWidth="2.2" strokeLinecap="round" /></svg>
          </span>
          <span className="text-2xl font-black tracking-tight">GeetPlays</span>
        </div>
        <p className="text-center text-muted text-sm mb-5">
          {mode === 'login' && 'Log in to your account'}
          {mode === 'signup' && 'Sign up for free — then play on'}
          {mode === 'forgot' && 'We’ll email you a reset link'}
          {mode === 'reset' && 'Choose a new password'}
        </p>

        <div className="flex flex-col gap-4">
          {mode === 'login' && (<>
            <Field label="Email or username">
              <div className="relative"><Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={`${inputCls} pl-10`} /></div>
            </Field>
            {passField('Password', pass, setPass, 'Your password')}
            <label className="flex items-center gap-2 text-[13px] text-muted">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="accent-[#1ED760] w-4 h-4" /> Remember me
            </label>
            <button type="submit" className={btnPrimary}>Log In</button>
            <button type="button" onClick={() => { login('Guest', '', 'user'); toast('Signed in as Guest'); go('home') }} className={btnGhost}>Continue as Guest</button>
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3 text-[12px] text-neutral-400 leading-relaxed">
              <span className="text-neutral-200 font-semibold">Admin login:</span> admin@geetplays.com / Admin@2026
            </div>
            <p className="text-center text-[13px] text-muted">Don’t have an account? <button type="button" onClick={() => { setMode('signup'); setMsg('') }} className="text-white underline">Sign up for GeetPlays</button></p>
            <button type="button" onClick={() => setMode('forgot')} className="text-center text-[13px] text-muted hover:text-white underline">Forgot password?</button>
          </>)}

          {mode === 'signup' && (<>
            <Field label="Full name"><input value={name} onChange={e => setName(e.target.value)} placeholder="Alex Rivera" className={inputCls} /></Field>
            <Field label="Email"><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} /></Field>
            <Field label="Username"><input value={username} onChange={e => setUsername(e.target.value)} placeholder="alex.wav" className={inputCls} /></Field>
            {passField('Password', pass, setPass, '8+ characters')}
            {pass && (
              <div>
                <div className="flex gap-1">{[0,1,2,3].map(i => <span key={i} className={`h-1.5 flex-1 rounded ${i < strength(pass) ? (strength(pass) <= 1 ? 'bg-red-500' : strength(pass) === 2 ? 'bg-yellow-500' : 'bg-spot') : 'bg-white/15'}`} />)}</div>
                <p className="text-[11px] text-muted mt-1">{STRENGTH_LABEL[strength(pass)]}</p>
              </div>
            )}
            {passField('Confirm password', pass2, setPass2, 'Repeat password')}
            <Field label="Date of birth"><input type="date" value={dob} onChange={e => setDob(e.target.value)} className={inputCls} /></Field>
            <label className="flex items-start gap-2 text-[13px] text-muted">
              <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} className="accent-[#1ED760] w-4 h-4 mt-0.5" />
              <span>I agree to the Terms &amp; Conditions and Privacy Policy</span>
            </label>
            <button type="submit" className={btnPrimary}>Sign Up</button>
            <p className="text-center text-[13px] text-muted">Already have an account? <button type="button" onClick={() => setMode('login')} className="text-white underline">Log in</button></p>
          </>)}

          {mode === 'forgot' && (<>
            <Field label="Registered email"><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} /></Field>
            <button type="submit" className={btnPrimary}>Send Reset Link</button>
            <button type="button" onClick={() => setMode('login')} className={btnGhost}>Back to Login</button>
          </>)}

          {mode === 'reset' && (<>
            {passField('New password', pass, setPass, '8+ characters')}
            {passField('Confirm new password', pass2, setPass2, 'Repeat password')}
            <button type="submit" className={btnPrimary}>Reset Password</button>
          </>)}

          {msg && <p className="text-[13px] text-red-400 text-center">{msg}</p>}
        </div>
      </form>
    </div>
  )
}
