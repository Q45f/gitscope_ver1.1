
import { createContext, useContext, useEffect, useState } from 'react'

// ใช้ Supabase Client ตัวเดิมที่โปรเจกต์เชื่อมต่อไว้อยู่แล้ว
import { supabase } from '../services/supabase'

// สร้าง Context สำหรับแชร์ข้อมูลผู้ใช้ไปยังทุกหน้า
const AuthContext = createContext(null)

// Provider เป็นตัวกลางจัดการสถานะ Login ของทั้งเว็บไซต์
export function AuthProvider({ children }) {
  // เก็บข้อมูลผู้ใช้ที่ Login อยู่ หากยังไม่ Login จะเป็น null
  const [user, setUser] = useState(null)

  // ใช้ตรวจสอบว่าระบบกำลังเช็ก Session อยู่หรือไม่
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ตรวจสอบว่าคอมโพเนนต์ยังทำงานอยู่หรือไม่
    let isMounted = true

    // ตรวจสอบ Session ที่อาจถูกบันทึกไว้จากการ Login ครั้งก่อน
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession()

      if (!isMounted) return

      if (error) {
        console.error('Session error:', error.message)
      }

      // ถ้ามี Session ให้เก็บข้อมูลผู้ใช้ไว้ใน State
      setUser(data.session?.user ?? null)
      setLoading(false)
    }

    checkSession()

    // ติดตามการเปลี่ยนแปลงสถานะ Authentication เช่น Login และ Logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // ยกเลิกการติดตามเมื่อคอมโพเนนต์ถูกถอดออก
    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  // ส่งข้อมูลผู้ใช้และสถานะการตรวจสอบให้คอมโพเนนต์ลูก
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook สำหรับเรียกใช้ข้อมูล Authentication ในหน้าอื่น
export function useAuth() {
  const context = useContext(AuthContext)

  // แจ้งเตือนหากเรียกใช้ Hook นอก AuthProvider
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
