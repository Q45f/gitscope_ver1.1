import { useEffect, useState } from 'react'
import {
  Search,
  Star,
  GitFork,
  ExternalLink,
  Bookmark,
  Trash2,
  LoaderCircle,
} from 'lucide-react'

import {
  getFavorites,
  removeFavorite,
} from '../services/favoritesAPI'

import { useLanguage } from '../contexts/LanguageContext'

function Collections() {
  const { language, t } = useLanguage()

  const [favorites, setFavorites] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingIds, setDeletingIds] = useState([])

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getFavorites()
        setFavorites(data)
      } catch (err) {
        console.error('Load collections error:', err)
        setError('loadFailed')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  async function handleRemove(repoId) {
    if (deletingIds.includes(repoId)) return

    setDeletingIds((prev) => [...prev, repoId])
    setError('')

    try {
      await removeFavorite(repoId)
      setFavorites((prev) =>
        prev.filter((repo) => repo.repo_id !== repoId)
      )
    } catch (err) {
      console.error('Remove favorite error:', err)
      setError('removeFailed')
    } finally {
      setDeletingIds((prev) =>
        prev.filter((id) => id !== repoId)
      )
    }
  }

  function formatNumber(number = 0) {
    const value = Number(number) || 0

    if (language === 'th') {
      function formatThaiUnit(divisor, unit) {
        const result = Math.floor(
          (value / divisor) * 10 + Number.EPSILON
        ) / 10

        return `${result.toFixed(1)} ${unit}`
      }

      if (value >= 1000000) return formatThaiUnit(1000000, 'ล้าน')
      if (value >= 100000) return formatThaiUnit(100000, 'แสน')
      if (value >= 10000) return formatThaiUnit(10000, 'หมื่น')

      return new Intl.NumberFormat('th-TH').format(value)
    }

    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }

  const filteredFavorites = favorites.filter((repo) => {
    const searchText = query.toLowerCase()

    return (
      repo.full_name.toLowerCase().includes(searchText) ||
      (repo.language || '').toLowerCase().includes(searchText)
    )
  })

  return (
    <main className="container explore-page">

      {/* ส่วนหัวของหน้า (แก้คำสะกดจากภาพ 7.png "OPEN SWORD" เป็น "open-source" ใน LanguageContext แล้ว) */}
      <section className="explore-header">
        <p className="eyebrow">
          {t('yourPersonalCollection')}
        </p>

        <h1>{t('myCollections')}</h1>

        <p className="muted">
          {t('collectionsDescription')}
        </p>
      </section>

      {/* [แก้ไข] การ์ดสรุปจำนวน Repository พร้อมไอคอน Bookmark ทึบสีขาวด้านขวาตามภาพ 7.png */}
      <div className="collection-summary">
        <div>
          <span className="muted">
            {t('savedRepositories')}
          </span>

          <h2>{favorites.length}</h2>
        </div>

        <Bookmark size={36} fill="currentColor" />
      </div>

      {/* [แก้ไข] เพิ่มคลาส collections-search-bar เพื่อเว้นระยะห่างด้านล่างก่อนถึงกริดการ์ดตามภาพ 7.png */}
      <div className="explore-search collections-search-bar">
        <Search size={21} />

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('searchCollectionsPlaceholder')}
        />
      </div>

      {error && (
        <div className="explore-message error-message">
          <p>
            {error === 'loadFailed'
              ? t('collectionsLoadFailed')
              : t('collectionsRemoveFailed')}
          </p>
        </div>
      )}

      {loading && (
        <div className="explore-message">
          <LoaderCircle className="loading-icon" size={30} />
          <p>{t('loadingCollections')}</p>
        </div>
      )}

      {!loading && !error && favorites.length === 0 && (
        <div className="explore-message">
          <Bookmark size={40} fill="currentColor" />

          <h3>{t('emptyCollection')}</h3>

          <p className="muted">
            {t('emptyCollectionDescription')}
          </p>
        </div>
      )}

      {!loading &&
        favorites.length > 0 &&
        filteredFavorites.length === 0 && (
          <div className="explore-message">
            <Search size={32} />

            <h3>{t('noCollectionResults')}</h3>

            <p className="muted">
              {t('tryAnotherCollectionSearch')}
            </p>
          </div>
        )}

      {/* รายการการ์ด Repository */}
      {!loading && filteredFavorites.length > 0 && (
        <section className="repository-grid">
          {filteredFavorites.map((repo) => (
            <article
              className="surface repository-card"
              key={repo.repo_id}
            >
              <div className="repo-card-heading">
                <div>
                  <h2>{repo.full_name}</h2>

                  <p className="muted">
                    {t('savedRepository')}
                  </p>
                </div>

                <div className="repo-card-actions">
                  {/* ปุ่มลบรายการโปรด */}
                  <button
                    type="button"
                    className="bookmark-button saved"
                    disabled={deletingIds.includes(repo.repo_id)}
                    onClick={() => handleRemove(repo.repo_id)}
                    title={t('removeFromCollections')}
                    aria-label={t('removeFromCollections')}
                  >
                    {deletingIds.includes(repo.repo_id) ? (
                      <LoaderCircle
                        size={18}
                        className="loading-icon"
                      />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>

                  {/* ลิงก์เปิด Repository บน GitHub ในแท็บใหม่ */}
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${repo.full_name} on GitHub`}
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>

              <p className="repo-description">
                {repo.description || t('collectionsNoDescription')}
              </p>

              <div className="repo-card-footer">
                <div className="repo-stats">
                  <span>
                    <Star size={16} />
                    {formatNumber(repo.stars)}
                  </span>

                  <span>
                    <GitFork size={16} />
                    {formatNumber(repo.forks)}
                  </span>
                </div>

                <span className="repo-language">
                  {repo.language || t('otherLanguage')}
                </span>
              </div>
            </article>
          ))}
        </section>
      )}

    </main>
  )
}

export default Collections