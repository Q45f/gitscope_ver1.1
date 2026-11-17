// URL หลักของ GitHub REST API
const BASE_URL = 'https://api.github.com'

// ค้นหา Repository จาก GitHub
// พารามิเตอร์:
//   query   = คำค้นหา (รองรับ syntax ของ GitHub เช่น 'stars:>1000')
//   sort    = เรียงตาม 'stars' | 'forks' | 'updated'
//   order   = 'desc' (มากไปน้อย) หรือ 'asc'
//   page    = หน้าที่ต้องการ
//   perPage = จำนวนผลลัพธ์ต่อหน้า
export async function searchRepositories({
  query,
  sort = 'stars',
  order = 'desc',
  page = 1,
  perPage = 12,
}) {
  // สร้าง query string อย่างปลอดภัย (URLSearchParams จะ encode ให้เอง)
  const params = new URLSearchParams({
    q: query,
    sort,
    order,
    page: String(page),
    per_page: String(perPage),
  })

  const response = await fetch(
    `${BASE_URL}/search/repositories?${params}`
  )

  // ถ้า request ไม่สำเร็จ ให้แปลงรหัสสถานะเป็นข้อความที่ผู้ใช้เข้าใจ
  if (!response.ok) {
    // 403 = เรียก API เกินโควตา (rate limit) ของ GitHub
    if (response.status === 403) {
      throw new Error(
        'GitHub API limit reached. Please try again later.'
      )
    }

    // 422 = คำค้นหาไม่ถูกต้อง
    if (response.status === 422) {
      throw new Error('Invalid search query.')
    }

    throw new Error('Unable to fetch repositories from GitHub.')
  }

  const data = await response.json()

  // ส่งกลับเฉพาะข้อมูลที่แอปใช้: จำนวนผลลัพธ์ทั้งหมด และรายการ repo
  return {
    totalCount: data.total_count,
    items: data.items,
  }
}
