import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  GitBranch,
  Menu,
  X,
  UserRound,
  LogOut,
  Languages,
} from 'lucide-react'

import ThemeToggle from './ThemeToggle'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'

function Topbar({ theme, onToggleTheme, user }) {
  const navigate = useNavigate()
  const { language, toggleLanguage, t } = useLanguage()

  const [loggingOut, setLoggingOut] = useState(false)
  // [เพิ่ม] State สำหรับควบคุมการเปิด-ปิดเมนูบนหน้าจอมือถือ
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navClass = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link'

  async function handleLogout() {
    setLoggingOut(true)

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Logout error:', error.message)
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <header className="topbar">
      <div className="container topbar-inner">

        {/* โลโก้เว็บไซต์ */}
        <Link to="/" className="brand" onClick={() => setMobileMenuOpen(false)}>
          <span className="brand-icon">
            <GitBranch size={22} />
          </span>
          <span>GitScope</span>
        </Link>

        {/* เมนูหลักบนเดสก์ท็อป */}
        <nav className="desktop-nav">
          <NavLink to="/" end className={navClass}>
            {t('dashboard')}
          </NavLink>

          <NavLink to="/explore" className={navClass}>
            {t('explore')}
          </NavLink>

          <NavLink to="/collections" className={navClass}>
            {t('collections')}
          </NavLink>
        </nav>

        {/* ส่วนจัดการบัญชี ภาษา และธีม */}
        <div className="topbar-actions">
          <div className="account-info">
            <UserRound size={17} />
            <span className="account-email">
              {user?.email}
            </span>
          </div>

          <button
            className="language-toggle"
            onClick={toggleLanguage}
            title={language === 'en' ? 'เปลี่ยนเป็นภาษาไทย' : 'Switch to English'}
            aria-label={language === 'en' ? 'Switch to Thai' : 'Switch to English'}
          >
            <Languages size={17} />
            <span>{language === 'en' ? 'TH' : 'EN'}</span>
          </button>

          <ThemeToggle
            theme={theme}
            onToggle={onToggleTheme}
          />

          <button
            className="logout-button"
            onClick={handleLogout}
            disabled={loggingOut}
            title={t('logout')}
          >
            <LogOut size={17} />
            <span>
              {loggingOut ? t('loggingOut') : t('logout')}
            </span>
          </button>

          {/* [แก้ไข] เชื่อมปุ่มเมนูมือถือให้กดเปิด/ปิด Drawer ได้จริง */}
          <button
            className="mobile-menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={t('menu')}
            title={t('menu')}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* [เพิ่ม] แถบเมนูนำทางสำหรับหน้าจอมือถือ */}
      {mobileMenuOpen && (
        <nav className="mobile-nav-drawer">
          <NavLink
            to="/"
            end
            className={navClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('dashboard')}
          </NavLink>

          <NavLink
            to="/explore"
            className={navClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('explore')}
          </NavLink>

          <NavLink
            to="/collections"
            className={navClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('collections')}
          </NavLink>
        </nav>
      )}
    </header>
  )
}

export default Topbar