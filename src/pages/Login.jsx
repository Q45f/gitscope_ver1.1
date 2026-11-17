import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail, LoaderCircle, GitBranch } from 'lucide-react'

// เรียกใช้ Supabase Client ที่มีอยู่แล้ว
import { supabase } from '../services/supabase'

// [เพิ่ม] เรียกใช้ระบบแปลภาษาเพื่อให้หน้า Login รองรับ TH/EN เหมือนหน้าอื่น
import { useLanguage } from '../contexts/LanguageContext'

function Login() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(event) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        throw error
      }

      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      {/* [แก้ไข] เปลี่ยนโครงสร้างเป็น Split Layout 2 ฝั่ง (ซ้าย: แบรนด์และคำทักทาย / ขวา: ฟอร์ม Sign in) ตามภาพ 1.jpg */}
      <div className="auth-split-layout">

        {/* ฝั่งซ้าย: โลโก้ GitScope และข้อความต้อนรับขนาดใหญ่ */}
        <section className="auth-hero-side">
          <Link to="/" className="auth-brand">
            <GitBranch size={30} />
            <span>GitScope</span>
          </Link>

          <h1 className="auth-hero-title">
            Welcome
            <br />
            back
          </h1>
        </section>

        {/* ฝั่งขวา: การ์ด Glassmorphism สำหรับเข้าสู่ระบบ */}
        <section className="auth-card">
          <div className="auth-heading">
            <h2>{t('signIn')}</h2>
            {/* [แก้ไข] แก้คำสะกดจาก "repositortes" ในภาพตัวอย่างเป็น "repositories" */}
            <p>{t('signInSubtitle')}</p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            {/* ช่องกรอก Email */}
            <div className="auth-field">
              <label htmlFor="login-email">{t('email')}</label>

              <div className="auth-input-wrapper">
                <Mail size={18} />

                <input
                  id="login-email"
                  type="email"
                  placeholder={t('enterEmail')}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* ช่องกรอก Password */}
            <div className="auth-field">
              <label htmlFor="login-password">{t('password')}</label>

              <div className="auth-input-wrapper">
                <LockKeyhole size={18} />

                <input
                  id="login-password"
                  type="password"
                  placeholder={t('enterPassword')}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="primary-button auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle size={18} className="loading-icon" />
                  {t('signingIn')}
                </>
              ) : (
                t('signIn')
              )}
            </button>
          </form>

          <p className="auth-switch">
            {t('dontHaveAccount')}{' '}
            <Link to="/register">{t('createAccount')}</Link>
          </p>
        </section>

      </div>
    </main>
  )
}

export default Login