
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Star,
  GitFork,
  Eye,
  CircleDot,
  ExternalLink,
  ArrowLeft,
  CalendarDays,
  Code2,
  LoaderCircle,
  AlertCircle,
} from 'lucide-react'

// เรียกใช้ระบบแปลภาษา
import { useLanguage } from '../contexts/LanguageContext'

// หน้ารายละเอียดของ Repository หนึ่งตัว
function RepositoryDetails() {
  // ดึง owner และ repo จาก URL
  const { owner, repo } = useParams()

  // ดึงภาษาปัจจุบันและฟังก์ชันแปลข้อความ
  const { language, t } = useLanguage()

  // ===== State =====
  const [repository, setRepository] = useState(null)
  const [languages, setLanguages] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // โหลดข้อมูล Repository จาก GitHub API
  useEffect(() => {
    async function fetchRepository() {
      setLoading(true)
      setError('')
      setRepository(null)
      setLanguages({})

      try {
        // 1) ดึงข้อมูลหลักของ Repository
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`
        )

        // ตรวจสอบว่าดึงข้อมูลสำเร็จหรือไม่
        if (!response.ok) {
          throw new Error(
            response.status === 404 ? 'notFound' : 'loadFailed'
          )
        }

        const data = await response.json()
        setRepository(data)

        // 2) ดึงข้อมูลภาษาที่ใช้ใน Repository
        const languageResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/languages`
        )

        if (languageResponse.ok) {
          const languageData = await languageResponse.json()
          setLanguages(languageData)
        }
      } catch (err) {
        // เก็บรหัส Error เพื่อแสดงข้อความตามภาษาที่เลือก
        setError(
          err.message === 'notFound' ? 'notFound' : 'loadFailed'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRepository()
  }, [owner, repo])

  // แปลงตัวเลขให้อ่านง่ายตามภาษาที่เลือก
  function formatNumber(number = 0) {
    const value = Number(number) || 0

    // ภาษาไทยใช้หน่วย หมื่น แสน และล้าน โดยไม่ปัดเศษขึ้น
    if (language === 'th') {

      // ตัดทศนิยมให้เหลือ 1 ตำแหน่ง
      function formatThaiUnit(divisor, unit) {
        const result = Math.floor(
          (value / divisor) * 10 + Number.EPSILON
        ) / 10

        return `${result.toFixed(1)} ${unit}`
      }

      if (value >= 1000000) {
        return formatThaiUnit(1000000, 'ล้าน')
      }

      if (value >= 100000) {
        return formatThaiUnit(100000, 'แสน')
      }

      if (value >= 10000) {
        return formatThaiUnit(10000, 'หมื่น')
      }

      return new Intl.NumberFormat('th-TH').format(value)
    }

    // ภาษาอังกฤษใช้ K และ M
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }

  // แปลงวันที่ตามภาษาที่เลือก
  function formatDate(date) {
    if (!date) return t('notAvailable')

    return new Date(date).toLocaleDateString(
      language === 'th' ? 'th-TH' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    )
  }

  // เตรียมข้อมูลภาษาและรวมจำนวน Bytes ทั้งหมด
  const languageEntries = Object.entries(languages)

  const totalBytes = languageEntries.reduce(
    (total, [, bytes]) => total + bytes,
    0
  )

  return (
    <main className="container details-page">

      {/* ลิงก์กลับไปหน้า Explore */}
      <Link to="/explore" className="back-link">
        <ArrowLeft size={18} />
        {t('backToExplore')}
      </Link>

      {/* สถานะกำลังโหลด */}
      {loading && (
        <div className="explore-message">
          <LoaderCircle className="loading-icon" size={30} />
          <p>{t('loadingRepositoryDetails')}</p>
        </div>
      )}

      {/* สถานะ Error */}
      {!loading && error && (
        <div className="explore-message error-message">
          <AlertCircle size={30} />

          <h3>{t('somethingWentWrong')}</h3>

          <p>
            {error === 'notFound'
              ? t('repositoryNotFound')
              : t('unableToLoadRepository')}
          </p>
        </div>
      )}

      {/* แสดงข้อมูลเมื่อโหลดสำเร็จ */}
      {!loading && !error && repository && (
        <>
          {/* ส่วนหัวของ Repository */}
          <section className="details-header surface">
            <p className="eyebrow">
              {t('githubRepository')}
            </p>

            <h1>{repository.name}</h1>

            <p className="details-owner">
              {repository.owner.login}
            </p>

            <p className="details-description">
              {repository.description || t('noDescription')}
            </p>

            <a
              className="primary-button github-button"
              href={repository.html_url}
              target="_blank"
              rel="noreferrer"
            >
              {t('viewOnGitHub')}
              <ExternalLink size={17} />
            </a>
          </section>

          {/* การ์ดสถิติ 4 ใบ */}
          <section className="details-stats">

            {/* จำนวน Stars */}
            <article className="surface details-stat-card">
              <Star size={22} />
              <p>{t('stars')}</p>
              <h2>{formatNumber(repository.stargazers_count)}</h2>
            </article>

            {/* จำนวน Forks */}
            <article className="surface details-stat-card">
              <GitFork size={22} />
              <p>{t('forks')}</p>
              <h2>{formatNumber(repository.forks_count)}</h2>
            </article>

            {/* จำนวน Watchers */}
            <article className="surface details-stat-card">
              <Eye size={22} />
              <p>{t('watchers')}</p>
              <h2>{formatNumber(repository.watchers_count)}</h2>
            </article>

            {/* จำนวน Open Issues */}
            <article className="surface details-stat-card">
              <CircleDot size={22} />
              <p>{t('openIssues')}</p>
              <h2>{formatNumber(repository.open_issues_count)}</h2>
            </article>

          </section>

          {/* เนื้อหาหลัก 2 คอลัมน์ */}
          <section className="details-content">

            {/* แผงสัดส่วนภาษาโปรแกรม */}
            <article className="surface details-panel">
              <h2>
                <Code2 size={20} />
                {t('languages')}
              </h2>

              {languageEntries.length === 0 ? (
                <p className="muted">
                  {t('languageInformationUnavailable')}
                </p>
              ) : (
                <div className="language-list">
                  {languageEntries
                    // เรียงภาษาที่ใช้มากที่สุดขึ้นก่อน
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, bytes]) => {

                      // คำนวณเปอร์เซ็นต์ของแต่ละภาษา
                      const percentage = totalBytes
                        ? (bytes / totalBytes) * 100
                        : 0

                      return (
                        <div className="language-item" key={name}>
                          <div className="language-item-heading">
                            <span>{name}</span>
                            <span>{percentage.toFixed(1)}%</span>
                          </div>

                          {/* แถบ Progress แสดงสัดส่วนของภาษา */}
                          <div className="language-track">
                            <div
                              className="language-fill"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </article>

            {/* แผงข้อมูลทั่วไปของ Repository */}
            <article className="surface details-panel">
              <h2>
                <CalendarDays size={20} />
                {t('repositoryInformation')}
              </h2>

              {/* ภาษาหลัก */}
              <div className="info-row">
                <span>{t('primaryLanguage')}</span>
                <strong>
                  {repository.language || t('notSpecified')}
                </strong>
              </div>

              {/* วันที่สร้าง */}
              <div className="info-row">
                <span>{t('created')}</span>
                <strong>{formatDate(repository.created_at)}</strong>
              </div>

              {/* วันที่อัปเดตล่าสุด */}
              <div className="info-row">
                <span>{t('lastUpdated')}</span>
                <strong>{formatDate(repository.updated_at)}</strong>
              </div>

              {/* Branch เริ่มต้น */}
              <div className="info-row">
                <span>{t('defaultBranch')}</span>
                <strong>
                  {repository.default_branch || t('notSpecified')}
                </strong>
              </div>

              {/* License */}
              <div className="info-row">
                <span>{t('license')}</span>
                <strong>
                  {repository.license?.name || t('notSpecified')}
                </strong>
              </div>
            </article>

          </section>
        </>
      )}

    </main>
  )
}

export default RepositoryDetails
