
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// เรียกใช้หน้าต่าง ๆ ของ GitScope
import Collections from './pages/Collections'
import Explore from './pages/Explore'
import RepositoryDetails from './pages/RepositoryDetails'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'

// เรียกใช้ระบบจัดการธีมและแถบนำทาง
import { useTheme } from './hooks/useTheme'
import Topbar from './components/Topbar'

// เรียกใช้ระบบ Authentication
import { AuthProvider, useAuth } from './contexts/AuthContext'

// เรียกใช้ระบบจัดการภาษา
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'

// ป้องกันหน้าภายในเว็บไซต์สำหรับผู้ที่ยังไม่ได้ Login
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const { t } = useLanguage()

  // รอให้ระบบตรวจสอบ Session เสร็จก่อน
  if (loading) {
    return <div className="auth-loading">{t('authChecking')}</div>
  }

  // ถ้าไม่มีผู้ใช้ ให้กลับไปหน้า Login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // ถ้า Login แล้ว อนุญาตให้เข้าหน้านั้นได้
  return children
}

// ป้องกันไม่ให้ผู้ใช้ที่ Login แล้วกลับไปหน้า Login หรือ Register
function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  const { t } = useLanguage()

  // รอให้ตรวจสอบ Session เสร็จก่อน
  if (loading) {
    return <div className="auth-loading">{t('authChecking')}</div>
  }

  // ถ้ามีผู้ใช้ที่ Login อยู่แล้ว ให้ไปหน้า Dashboard
  if (user) {
    return <Navigate to="/" replace />
  }

  // ถ้ายังไม่ได้ Login อนุญาตให้เข้าหน้า Login หรือ Register
  return children
}

// ส่วนหลักของแอปที่ใช้ข้อมูล Authentication และภาษา
function AppContent() {
  const { theme, toggleTheme } = useTheme()

  // ดึงสถานะผู้ใช้จาก AuthContext
  const { user } = useAuth()

  return (
    <>
      {/* แสดง Topbar เมื่อผู้ใช้ Login แล้ว */}
      {user && (
        <Topbar
          theme={theme}
          onToggleTheme={toggleTheme}
          user={user}
        />
      )}

      <Routes>

        {/* หน้า Login สำหรับผู้ที่ยังไม่ได้เข้าสู่ระบบ */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {/* หน้าสมัครสมาชิกสำหรับผู้ที่ยังไม่ได้เข้าสู่ระบบ */}
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        {/* Dashboard: หน้าแรก แสดงสถิติและกราฟ */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Explore: ค้นหา Repository จาก GitHub */}
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />

        {/* Repository Details: แสดงรายละเอียด Repository */}
        <Route
          path="/repo/:owner/:repo"
          element={
            <ProtectedRoute>
              <RepositoryDetails />
            </ProtectedRoute>
          }
        />

        {/* Collections: แสดง Repository ที่บันทึกไว้ */}
        <Route
          path="/collections"
          element={
            <ProtectedRoute>
              <Collections />
            </ProtectedRoute>
          }
        />

        {/* หากเข้า URL ที่ไม่มีอยู่ ให้กลับไปหน้าแรก */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </>
  )
}

// คอมโพเนนต์หลักของเว็บไซต์
function App() {
  return (
    // BrowserRouter ช่วยจัดการ URL และการเปลี่ยนหน้า
    <BrowserRouter>

      {/* AuthProvider แชร์สถานะ Login ให้ทุกหน้า */}
      <AuthProvider>

        {/* LanguageProvider แชร์ภาษาที่เลือกให้ทุกหน้า */}
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>

      </AuthProvider>

    </BrowserRouter>
  )
}

export default App
