// จุดเริ่มต้นของแอป (entry point) — Vite จะโหลดไฟล์นี้จาก index.html
import React from 'react'
import ReactDOM from 'react-dom/client'

// คอมโพเนนต์หลักของแอปทั้งหมด
import App from './App'

// สไตล์ส่วนกลาง (Tailwind + ธีม + คลาส CSS ของทุกหน้า)
import './index.css'

// นำ <App /> ไป render ลงใน <div id="root"> ที่อยู่ในไฟล์ index.html
// StrictMode ช่วยเตือนปัญหาที่อาจเกิดขึ้นระหว่างพัฒนา (ไม่มีผลตอน production)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
