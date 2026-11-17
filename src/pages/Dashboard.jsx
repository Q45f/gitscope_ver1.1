import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  BookOpen,
  Star,
  Code2,
  GitFork,
  ArrowUpRight,
  LoaderCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'

// คอมโพเนนต์กราฟจาก Recharts
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'

import { searchRepositories } from '../services/githubAPI'

// เรียกใช้ระบบแปลภาษา
import { useLanguage } from '../contexts/LanguageContext'

// ชุดสีสำหรับกราฟวงกลม
const CHART_COLORS = [
  '#3B82F6',
  '#8B5CF6',
  '#06B6D4',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#64748B',
]

// แปลงตัวเลขให้อ่านง่ายตามภาษาที่เลือก โดยใช้วิธีตัดเศษเหมือนกัน
function formatNumber(number, language) {
  const value = Number(number) || 0

  // ฟังก์ชันตัดเศษให้เหลือทศนิยม 1 ตำแหน่ง
  function truncateNumber(value, divisor) {
    return (Math.floor((value / divisor) * 10) / 10).toFixed(1)
  }

  // ภาษาไทย: ใช้หน่วย หมื่น แสน ล้าน และพันล้าน
  if (language === 'th') {
    if (value >= 1000000000) {
      return `${truncateNumber(value, 1000000000)} พันล้าน`
    }

    if (value >= 1000000) {
      return `${truncateNumber(value, 1000000)} ล้าน`
    }

    if (value >= 100000) {
      return `${truncateNumber(value, 100000)} แสน`
    }

    if (value >= 10000) {
      // ใช้ทศนิยม 2 ตำแหน่ง เพื่อให้เทียบกับ K ได้แม่นยำขึ้น
      const result = Math.floor(value / 100) / 100

      return `${result.toFixed(2)} หมื่น`
    }

    return new Intl.NumberFormat('th-TH').format(value)
  }

  // ภาษาอังกฤษ: ใช้หน่วย K, M และ B โดยตัดเศษเหมือนภาษาไทย
  if (value >= 1000000000) {
    return `${truncateNumber(value, 1000000000)}B`
  }

  if (value >= 1000000) {
    return `${truncateNumber(value, 1000000)}M`
  }

  if (value >= 1000) {
    return `${truncateNumber(value, 1000)}K`
  }

  return new Intl.NumberFormat('en-US').format(value)
}

// หน้า Dashboard: แสดงสถิติและกราฟของ Repository
function Dashboard() {
  const navigate = useNavigate()

  // ดึงภาษาปัจจุบันและฟังก์ชันแปลข้อความ
  const { language, t } = useLanguage()

  // ===== State =====
  const [repositories, setRepositories] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // โหลด Repository ยอดนิยมจาก GitHub API
  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      try {
        setLoading(true)
        setError('')

        const data = await searchRepositories({
          query: 'stars:>1000',
          sort: 'stars',
          order: 'desc',
          page: 1,
          perPage: 30,
        })

        if (!isMounted) return

        setRepositories(data.items)
        setTotalCount(data.totalCount)
      } catch (err) {
        if (!isMounted) return

        setError(err.message || 'Unable to load dashboard data.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    // ป้องกันการเปลี่ยน State หลังออกจากหน้า
    return () => {
      isMounted = false
    }
  }, [])

  // ===== คำนวณสถิติจาก Repository ที่โหลดมา =====

  // รวมจำนวน Stars ทั้งหมด
  const totalStars = repositories.reduce(
    (total, repo) => total + repo.stargazers_count,
    0
  )

  // รวมจำนวน Forks ทั้งหมด
  const totalForks = repositories.reduce(
    (total, repo) => total + repo.forks_count,
    0
  )

  // นับจำนวน Repository แยกตามภาษา
  const languages = repositories.reduce((result, repo) => {
    const languageName = repo.language || 'Other'

    result[languageName] = (result[languageName] || 0) + 1

    return result
  }, {})

  // แปลงข้อมูลภาษาให้อยู่ในรูปแบบที่ Recharts ใช้ได้
  const languageData = Object.entries(languages)
    .map(([name, count]) => ({
      // แปลคำว่า Other ตามภาษาที่เลือก
      name: name === 'Other' ? t('other') : name,
      count,
    }))
    .sort((a, b) => b.count - a.count)

  // ภาษาที่พบมากที่สุด
  const mostPopularLanguage = languageData[0]?.name || 'N/A'

  // ข้อมูลการ์ดสถิติ 4 ใบ
  const stats = [
    {
      title: t('repositoriesFound'),
      value: formatNumber(totalCount, language),
      description: t('matchingGitHubSearch'),
      icon: BookOpen,
    },
    {
      title: t('totalRepositoryStars'),
      value: formatNumber(totalStars, language),
      description: t('acrossLoadedRepositories'),
      icon: Star,
    },
    {
      title: t('languages'),
      value: languageData.length,
      description: t('languagesIdentified'),
      icon: Code2,
    },
    {
      title: t('totalForks'),
      value: formatNumber(totalForks, language),
      description: t('acrossLoadedRepositories'),
      icon: GitFork,
    },
  ]

  // ข้อมูลกราฟแท่งของ Repository 5 อันดับแรก
  const chartRepositories = repositories.slice(0, 5).map((repo) => ({
    name:
      repo.name.length > 16
        ? `${repo.name.slice(0, 16)}...`
        : repo.name,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
  }))

  return (
    <main className="container dashboard">
      {/* ส่วนต้อนรับ */}
      <section className="welcome-section">
        <p className="eyebrow">GITHUB REPOSITORY EXPLORER</p>

        <h1>{t('discoverOpenSource')}</h1>

        <p className="muted welcome-description">
          {t('welcomeDescription')}
        </p>
      </section>

      {/* สถานะกำลังโหลด */}
      {loading && (
        <div className="dashboard-status">
          <LoaderCircle size={30} className="loading-icon" />
          <p>{t('loadingGitHubStatistics')}</p>
        </div>
      )}

      {/* สถานะ Error พร้อมปุ่มลองใหม่ */}
      {!loading && error && (
        <div className="dashboard-status dashboard-error">
          <AlertCircle size={30} />

          <h3>{t('unableToLoadDashboard')}</h3>

          <p>{error}</p>

          <button
            className="primary-button"
            onClick={() => window.location.reload()}
          >
            {t('tryAgain')}
          </button>
        </div>
      )}

      {/* แสดงข้อมูลเมื่อโหลดสำเร็จ */}
      {!loading && !error && (
        <>
          {/* การ์ดสถิติ 4 ใบ */}
          <section className="stats-grid">
            {stats.map((stat) => {
              // เรียกใช้ไอคอนของการ์ดแต่ละใบ
              const Icon = stat.icon

              return (
                <div className="surface stat-card" key={stat.title}>
                  <div className="stat-top">
                    <span className="muted">{stat.title}</span>

                    <span className="stat-icon">
                      <Icon size={20} />
                    </span>
                  </div>

                  <h2>{stat.value}</h2>

                  <p className="muted">{stat.description}</p>
                </div>
              )
            })}
          </section>

          {/* ส่วนวิเคราะห์ Repository */}
          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <h2>{t('repositoryInsights')}</h2>

                <p className="muted">{t('analyticsDescription')}</p>
              </div>

              <span className="muted section-period">
                {t('top30Results')}
              </span>
            </div>

            <div className="insights-grid">
              {/* กราฟวงกลมแสดงสัดส่วนภาษา */}
              <div className="surface insight-card">
                <h3>{t('languageDistribution')}</h3>

                <p className="muted">
                  {t('programmingLanguagesInRepositories')}
                </p>

                {languageData.length > 0 ? (
                  <>
                    <div className="dashboard-chart">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={languageData}
                            dataKey="count"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={3}
                          >
                            {/* กำหนดสีให้แต่ละภาษา */}
                            {languageData.map((entry, index) => (
                              <Cell
                                key={entry.name}
                                fill={
                                  CHART_COLORS[
                                    index % CHART_COLORS.length
                                  ]
                                }
                              />
                            ))}
                          </Pie>

                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <p className="muted chart-note">
                      {t('mostCommonLanguage')}: {mostPopularLanguage}
                    </p>
                  </>
                ) : (
                  <div className="placeholder-chart">
                    <Code2 size={34} />
                    <span>{t('noLanguageData')}</span>
                  </div>
                )}
              </div>

              {/* รายการ Repository ที่มี Stars มากที่สุด */}
              <div className="surface insight-card">
                <h3>{t('popularRepositories')}</h3>

                <p className="muted">{t('mostStarredProjects')}</p>

                {repositories.length > 0 ? (
                  <div className="popular-repository-list">
                    {repositories.slice(0, 5).map((repo) => (
                      <div
                        className="popular-repository"
                        key={repo.id}
                        onClick={() =>
                          navigate(
                            `/repo/${repo.owner.login}/${repo.name}`
                          )
                        }
                        role="link"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            navigate(
                              `/repo/${repo.owner.login}/${repo.name}`
                            )
                          }
                        }}
                      >
                        <div className="popular-repository-info">
                          <strong>{repo.full_name}</strong>

                          <span className="muted">
                            {repo.language || t('other')}
                          </span>
                        </div>

                        <div className="popular-repository-stars">
                          <Star size={15} />
                          {formatNumber(repo.stargazers_count, language)}
                        </div>

                        <ExternalLink
                          size={15}
                          className="popular-repository-arrow"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="placeholder-chart">
                    <Star size={34} />
                    <span>{t('noRepositoriesAvailable')}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* กราฟแท่งเปรียบเทียบ Stars กับ Forks */}
          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <h2>{t('starsForksComparison')}</h2>

                <p className="muted">{t('compareEngagement')}</p>
              </div>
            </div>

            <div className="surface dashboard-bar-card">
              {chartRepositories.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartRepositories}
                    margin={{
                      top: 15,
                      right: 10,
                      left: 5,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(15, 23, 42, 0.08)"
                    />

                    {/* แกน X แสดงชื่อ Repository */}
                    <XAxis
                      dataKey="name"
                      tick={{
                        fill: 'var(--text-secondary)',
                        fontSize: 11,
                      }}
                    />

                    {/* แกน Y แสดงจำนวน Stars และ Forks */}
                    <YAxis
                      tick={{
                        fill: 'var(--text-secondary)',
                        fontSize: 11,
                      }}
                      tickFormatter={(value) =>
                        formatNumber(value, language)
                      }
                    />

                    <Tooltip
                      formatter={(value) =>
                        formatNumber(value, language)
                      }
                    />

                    <Legend />

                    {/* [แก้ไข] ปรับมุมโค้งด้านบนของแท่งกราฟเป็น [10, 10, 0, 0] ให้โค้งมนเหมือนภาพ 3.jpg */}
                    <Bar
                      dataKey="stars"
                      name={t('stars')}
                      fill="#3B82F6"
                      radius={[10, 10, 0, 0]}
                    />

                    {/* [แก้ไข] ปรับสีแท่ง Forks เป็นสีฟ้าอมเขียว (#06B6D4) และมุมโค้ง [10, 10, 0, 0] ให้เข้ากับธีม */}
                    <Bar
                      dataKey="forks"
                      name={t('forks')}
                      fill="#06B6D4"
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="placeholder-chart">
                  <Star size={34} />
                  <span>{t('noChartData')}</span>
                </div>
              )}
            </div>
          </section>

          {/* ส่วนชวนไปหน้า Explore */}
          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <h2>{t('startExploring')}</h2>

                <p className="muted">{t('findFavoriteProject')}</p>
              </div>

              <button
                className="dashboard-explore-link"
                onClick={() => navigate('/explore')}
              >
                {t('exploreRepositories')}
                <ArrowUpRight size={18} />
              </button>
            </div>
          </section>
        </>
      )}
    </main>
  )
}

export default Dashboard