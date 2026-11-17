import { useEffect, useState } from 'react'

// Custom Hook สำหรับจัดการธีม light/dark และจำค่าไว้ในเบราว์เซอร์
export function useTheme() {
  // อ่านธีมที่เคยบันทึกไว้จาก localStorage ถ้าไม่มีให้ใช้ 'light'
  // (ส่งฟังก์ชันให้ useState เพื่อให้อ่านค่าแค่ครั้งแรกครั้งเดียว)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('gitscope-theme') || 'light'
  })

  // ทุกครั้งที่ theme เปลี่ยน:
  // 1) เพิ่ม/ลบคลาส 'dark' ที่ <html> เพื่อให้ตัวแปรสีใน CSS (.dark) ทำงาน
  // 2) บันทึกธีมลง localStorage เพื่อจำไว้ครั้งหน้า
  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      theme === 'dark'
    )

    localStorage.setItem('gitscope-theme', theme)
  }, [theme])

  // สลับธีมระหว่าง light กับ dark
  function toggleTheme() {
    setTheme(currentTheme =>
      currentTheme === 'light' ? 'dark' : 'light'
    )
  }

  return {
    theme,
    toggleTheme,
  }
}
