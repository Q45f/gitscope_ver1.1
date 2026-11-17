// client ของ Supabase (ฐานข้อมูลที่ใช้เก็บรายการโปรด)
// หมายเหตุ: ไฟล์ ./supabase ไม่ได้อยู่ในชุดไฟล์ที่ส่งมา แต่ต้องมีอยู่ในโปรเจกต์
import { supabase } from './supabase'

// ดึงรายการ Repository ที่บันทึกไว้ทั้งหมดจากตาราง 'favorites'
export async function getFavorites() {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    // เรียงจากที่บันทึกล่าสุดขึ้นก่อน
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

// บันทึก Repository ลงตาราง 'favorites'
// repo = ข้อมูล repo ที่ได้จาก GitHub API
export async function addFavorite(repo) {
  const { data, error } = await supabase
    .from('favorites')
    // แปลงชื่อฟิลด์ของ GitHub ให้ตรงกับชื่อคอลัมน์ในฐานข้อมูล
    .insert({
      repo_id: repo.id,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
    })
    // .select().single() ให้ส่งแถวที่เพิ่งเพิ่มกลับมา (1 แถว)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// ลบ Repository ออกจากรายการที่บันทึกไว้ โดยอ้างอิงจาก repo_id
export async function removeFavorite(repoId) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('repo_id', repoId)

  if (error) {
    throw error
  }
}
