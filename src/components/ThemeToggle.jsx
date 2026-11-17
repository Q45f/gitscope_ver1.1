import { Sun, Moon } from 'lucide-react'

// ปุ่มสลับธีม light/dark
// props: theme = ธีมปัจจุบัน, onToggle = ฟังก์ชันที่เรียกเมื่อกดปุ่ม
function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {/* ธีมสว่างอยู่ → แสดงไอคอนพระจันทร์ (กดเพื่อไปโหมดมืด)
          ธีมมืดอยู่ → แสดงไอคอนพระอาทิตย์ (กดเพื่อไปโหมดสว่าง) */}
      {theme === 'light' ? (
        <Moon size={19} />
      ) : (
        <Sun size={19} />
      )}
    </button>
  )
}

export default ThemeToggle

