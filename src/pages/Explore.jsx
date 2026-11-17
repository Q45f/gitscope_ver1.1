import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Search,
  Star,
  GitFork,
  ExternalLink,
  LoaderCircle,
  Bookmark,
} from 'lucide-react'

import { searchRepositories } from '../services/githubAPI'

import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../services/favoritesAPI'

import { useLanguage } from '../contexts/LanguageContext'

// รายการคำแนะนำสำหรับช่วยผู้ใช้ค้นหา Repository
// [หมายเหตุ] แก้คำสะกดจากในภาพตัวอย่าง 5.png ("databace" -> "database") ให้ถูกต้องสมบูรณ์
const SEARCH_SUGGESTIONS = [
  'Python',
  'PHP',
  'PostgreSQL',
  'PostgreSQL database',
  'pg',
  'React',
  'React Native',
  'Next.js',
  'Node.js',
  'JavaScript',
  'TypeScript',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'Machine Learning',
  'Artificial Intelligence',
]

function Explore() {
  const navigate = useNavigate()
  const { language, t } = useLanguage()

  const [query, setQuery] = useState('')
  const [repositories, setRepositories] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [languageFilter, setLanguageFilter] = useState('all')
  const [sort, setSort] = useState('stars')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const [savedIds, setSavedIds] = useState([])
  const [savingIds, setSavingIds] = useState([])
  const [favoriteError, setFavoriteError] = useState('')

  useEffect(() => {
    async function loadFavorites() {
      try {
        const data = await getFavorites()
        setSavedIds(data.map((item) => Number(item.repo_id)))
      } catch (error) {
        console.error('Failed to load favorites:', error.message)
      }
    }

    loadFavorites()
  }, [])

  async function handleToggleFavorite(event, repo) {
    event.stopPropagation()

    if (savingIds.includes(repo.id)) {
      return
    }

    setFavoriteError('')
    setSavingIds((prev) => [...prev, repo.id])

    try {
      if (savedIds.includes(repo.id)) {
        await removeFavorite(repo.id)
        setSavedIds((prev) => prev.filter((id) => id !== repo.id))
      } else {
        await addFavorite(repo)
        setSavedIds((prev) =>
          prev.includes(repo.id) ? prev : [...prev, repo.id]
        )
      }
    } catch (error) {
      console.error('Favorite error:', error)
      setFavoriteError(error.message || t('favoriteUpdateError'))
    } finally {
      setSavingIds((prev) => prev.filter((id) => id !== repo.id))
    }
  }

  const filteredSuggestions = SEARCH_SUGGESTIONS.filter((suggestion) =>
    suggestion.toLowerCase().startsWith(query.trim().toLowerCase())
  ).slice(0, 6)

  async function performSearch(nextSort = sort, searchQuery = query) {
    if (!searchQuery.trim()) {
      setError(t('enterSearchKeyword'))
      return
    }

    setLoading(true)
    setError('')
    setHasSearched(true)
    setLanguageFilter('all')

    try {
      const data = await searchRepositories({
        query: searchQuery.trim(),
        sort: nextSort,
        order: 'desc',
        page: 1,
        perPage: 30,
      })

      setRepositories(data.items)
      setTotalCount(data.totalCount)
    } catch (err) {
      setRepositories([])
      setTotalCount(0)
      setError(err.message || t('searchFailed'))
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(event) {
    event.preventDefault()
    performSearch(sort)
  }

  const filteredRepositories = repositories.filter((repo) => {
    if (languageFilter === 'all') return true
    return repo.language === languageFilter
  })

  const availableLanguages = [
    ...new Set(
      repositories.map((repo) => repo.language).filter(Boolean)
    ),
  ].sort()

  function formatNumber(number) {
    return new Intl.NumberFormat(
      language === 'th' ? 'th-TH' : 'en-US',
      {
        notation: 'compact',
        maximumFractionDigits: 1,
      }
    ).format(number || 0)
  }

  return (
    <main className="container explore-page">

      {/* ส่วนหัวของหน้า (แก้คำสะกดจากภาพตัวอย่าง "DISCOCER" -> "DISCOVER" เรียบร้อย) */}
      <section className="explore-header">
        <p className="eyebrow">
          DISCOVER OPEN SOURCE
        </p>

        <h1>{t('exploreRepositoriesTitle')}</h1>

        <p className="muted">
          {t('exploreDescription')}
        </p>
      </section>

      {/* กล่องค้นหาทรงแคปซูลพร้อมระบบแนะนำคำค้นหา */}
      <div
        className="explore-search-container"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setShowSuggestions(false)
          }
        }}
      >
        <form
          className="explore-search"
          onSubmit={(event) => {
            handleSearch(event)
            setShowSuggestions(false)
          }}
        >
          <Search size={22} />

          <input
            type="text"
            value={query}
            onFocus={() => setShowSuggestions(true)}
            onChange={(event) => {
              setQuery(event.target.value)
              setShowSuggestions(true)
            }}
            placeholder={t('searchPlaceholder')}
            autoComplete="off"
          />

          {/* [แก้ไข] ปุ่มค้นหาเป็นตัวพิมพ์ใหญ่ "SEARCH" ตามภาพ 4.jpg */}
          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? t('searching') : t('search').toUpperCase()}
          </button>
        </form>

        {/* รายการคำแนะนำใต้ช่องค้นหาตามภาพ 5.png */}
        {showSuggestions &&
          query.trim() &&
          filteredSuggestions.length > 0 && (
            <div className="search-suggestions">
              {filteredSuggestions.map((suggestion) => (
                <button
                  type="button"
                  className="search-suggestion-item"
                  key={suggestion}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setQuery(suggestion)
                    setShowSuggestions(false)
                    performSearch(sort, suggestion)
                  }}
                >
                  <Search size={17} />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          )}
      </div>

      {/* แถบตัวกรองและเรียงลำดับ */}
      {hasSearched && (
        <section className="explore-controls">
          <div className="filter-group">
            <label htmlFor="language-filter">
              {t('languageFilter')}
            </label>

            <select
              id="language-filter"
              value={languageFilter}
              onChange={(event) => {
                setLanguageFilter(event.target.value)
              }}
            >
              <option value="all">
                {t('allLanguages')}
              </option>

              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-filter">
              {t('sortBy')}
            </label>

            <select
              id="sort-filter"
              value={sort}
              onChange={(event) => {
                const nextSort = event.target.value
                setSort(nextSort)
                if (query.trim()) {
                  performSearch(nextSort)
                }
              }}
            >
              <option value="stars">{t('mostStars')}</option>
              <option value="forks">{t('mostForks')}</option>
              <option value="updated">{t('recentlyUpdated')}</option>
            </select>
          </div>

          <span className="muted result-count">
            {formatNumber(totalCount)} {t('repositoriesFound')}
          </span>
        </section>
      )}

      {favoriteError && (
        <div className="explore-message error-message">
          <p>{favoriteError}</p>
        </div>
      )}

      {loading && (
        <div className="explore-message">
          <LoaderCircle className="loading-icon" size={30} />
          <p>{t('searchingGitHubRepositories')}</p>
        </div>
      )}

      {!loading && error && (
        <div className="explore-message error-message">
          <p>{error}</p>
        </div>
      )}

      {/* ผลการค้นหา */}
      {!loading && !error && hasSearched && (
        <>
          {filteredRepositories.length === 0 ? (
            <div className="explore-message">
              <Search size={32} />
              <h3>{t('noRepositoriesFound')}</h3>
              <p className="muted">{t('tryAnotherKeyword')}</p>
            </div>
          ) : (
            <section className="repository-grid">
              {filteredRepositories.map((repo) => (
                <article
                  className="surface repository-card"
                  key={repo.id}
                  onClick={() =>
                    navigate(`/repo/${repo.owner.login}/${repo.name}`)
                  }
                  role="link"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      navigate(`/repo/${repo.owner.login}/${repo.name}`)
                    }
                  }}
                >
                  <div className="repo-card-heading">
                    <div>
                      <h2>{repo.full_name}</h2>
                      <p className="muted">{repo.owner.login}</p>
                    </div>

                    <div className="repo-card-actions">
                      <button
                        type="button"
                        className={`bookmark-button ${
                          savedIds.includes(repo.id) ? 'saved' : ''
                        }`}
                        disabled={savingIds.includes(repo.id)}
                        onClick={(event) =>
                          handleToggleFavorite(event, repo)
                        }
                        aria-label={
                          savedIds.includes(repo.id)
                            ? t('removeFromFavorites')
                            : t('addToFavorites')
                        }
                        title={
                          savedIds.includes(repo.id)
                            ? t('removeFromFavorites')
                            : t('addToFavorites')
                        }
                      >
                        <Bookmark
                          size={18}
                          fill={
                            savedIds.includes(repo.id)
                              ? 'currentColor'
                              : 'none'
                          }
                        />
                      </button>

                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        aria-label={`Open ${repo.full_name} on GitHub`}
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  </div>

                  <p className="repo-description">
                    {repo.description || t('noDescription')}
                  </p>

                  <div className="repo-card-footer">
                    <div className="repo-stats">
                      <span>
                        <Star size={16} />
                        {formatNumber(repo.stargazers_count)}
                      </span>

                      <span>
                        <GitFork size={16} />
                        {formatNumber(repo.forks_count)}
                      </span>
                    </div>

                    <span className="repo-language">
                      {repo.language || t('other')}
                    </span>
                  </div>
                </article>
              ))}
            </section>
          )}
        </>
      )}

      {/* [แก้ไข] หน้าจอเริ่มต้นก่อนค้นหา ใส่ไอคอน Bookmark สีขาวทึบตามภาพ 4.jpg */}
      {!hasSearched && (
        <div className="explore-message">
          <Bookmark size={38} fill="currentColor" />

          <h3>{t('findFavoriteProject')}</h3>

          <p className="muted">
            {t('enterKeywordToExplore')}
          </p>
        </div>
      )}

    </main>
  )
}

export default Explore