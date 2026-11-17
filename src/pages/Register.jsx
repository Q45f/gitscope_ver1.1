import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LockKeyhole,
  Mail,
  LoaderCircle,
  GitBranch,
} from 'lucide-react'

import { supabase } from '../services/supabase'

// [เพิ่ม] เรียกใช้ระบบแปลภาษา
import { useLanguage } from '../contexts/LanguageContext'

function Register() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleRegister(event) {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      })

      if (error) {
        throw error
      }

      if (data.session) {
        navigate('/', { replace: true })
      } else {
        setSuccess(
          'Registration successful! Please check your email to confirm your account.'
        )
      }
    } catch (err) {
      setError(err.message || 'Unable to create your account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      {/* [แก้ไข] จัดเลย์เอาต์ Split Layout 2 ฝั่ง (ซ้าย: Create account ขนาดใหญ่ / ขวา: ฟอร์มสมัครสมาชิก) ตามภาพ 2.jpg */}
      <div className="auth-split-layout">

        {/* ฝั่งซ้าย */}
        <section className="auth-hero-side">
          <Link to="/" className="auth-brand">
            <GitBranch size={30} />
            <span>GitScope</span>
          </Link>

          <h1 className="auth-hero-title">
            Create
            <br />
            account
          </h1>
        </section>

        {/* ฝั่งขวา */}
        <section className="auth-card">
          <div className="auth-heading">
            <p>{t('joinGitScopeSubtitle')}</p>
          </div>

          <form className="auth-form" onSubmit={handleRegister}>
            {/* ช่องกรอก Email */}
            <div className="auth-field">
              <label htmlFor="register-email">{t('email')}</label>

              <div className="auth-input-wrapper">
                <Mail size={18} />

                <input
                  id="register-email"
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
              <label htmlFor="register-password">{t('password')}</label>

              <div className="auth-input-wrapper">
                <LockKeyhole size={18} />

                <input
                  id="register-password"
                  type="password"
                  placeholder={t('passwordMinLength')}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>
            </div>

            {/* ช่องยืนยัน Password */}
            <div className="auth-field">
              <label htmlFor="confirm-password">{t('confirmPassword')}</label>

              <div className="auth-input-wrapper">
                <LockKeyhole size={18} />

                <input
                  id="confirm-password"
                  type="password"
                  placeholder={t('confirmPasswordPlaceholder')}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className="auth-success" role="status">
                {success}
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
                  {t('creatingAccount')}
                </>
              ) : (
                t('createAccount')
              )}
            </button>
          </form>

          <p className="auth-switch">
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login">{t('signIn')}</Link>
          </p>
        </section>

      </div>
    </main>
  )
}

export default Register