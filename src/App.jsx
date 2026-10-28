import { useState, useEffect } from 'react'
import './App.css'
import Search from './components/Search'
import Loader from './components/loader'
import MovieCard from './components/MovieCard'
import { useDebounce } from 'react-use'
import { getTrandingMovies, updateSearchCount } from './utils/appwrite'

function App() {
  const API_BASE_URL = 'https://api.themoviedb.org/3'

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY

  const API_OPTIONS = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
  }

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [search, setSearch] = useState('')
  const [trendingMovies, setTrendingMovies] = useState([])
  const [moviesList, setMoviesList] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  // UPDATED 1: استخدام debounce لتقليل طلبات البحث المتكررة
  useDebounce(() => setDebouncedSearchTerm(search), 1500, [search])

  // UPDATED 2: استقبال signal عشان نقدر نلغي الطلب القديم
  const fetchMovies = async (query = '', signal) => {
    setLoading(true)

    // UPDATED 3: مسح رسالة الخطأ القديمة قبل كل طلب
    setErrorMessage(null)

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

      // UPDATED 4: تمرير signal للـ fetch
      const response = await fetch(endpoint, {
        ...API_OPTIONS,
        signal,
      })

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }

      const data = await response.json()

      const results = Array.isArray(data.results) ? data.results : []

      setMoviesList(results)

      if (query.trim() && results.length > 0) {
        updateSearchCount(query, results[0]).catch((error) => {
          setErrorMessage(error.message || 'Failed to update search statistics')
        })
      }
    } catch (error) {
      if (error.name === 'AbortError') return

      setErrorMessage(
        error.message || 'An error occurred while fetching movies'
      )
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }

  const fetchTrendingMovies = async () => {
    try {
      const trendingList = await getTrandingMovies()
      setTrendingMovies(trendingList)
    } catch (error) {
      setErrorMessage(error.message || 'Failed to fetch trending movies')
    }
  }

  useEffect(() => {
    fetchTrendingMovies()
  }, [])

  // UPDATED 9: إلغاء الطلب السابق عند تغير البحث أو إزالة الـ Component
  useEffect(() => {
    const controller = new AbortController()

    fetchMovies(debouncedSearchTerm, controller.signal)

    // إلغاء الطلب السابق عند تغير debouncedSearchTerm
    return () => controller.abort()
  }, [debouncedSearchTerm])

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img
              // UPDATED 10: في Vite ملفات public تُستدعى من جذر الموقع
              src="/hero-img.png"
              alt="hero"
              className="hero-img"
            />

            <h1>
              Find <span className="text-gradient">Movies</span> You Will Enjoy
              With Hassle
            </h1>

            <Search className="" search={search} setSearch={setSearch} />
          </header>

          <section className="trending">
            <h2 className="text-2xl font-bold mb-4 mt-20">Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => {
                return (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="all-movies">
            <h2 className="text-2xl font-bold mb-4 ">All Movies</h2>

            {loading ? (
              <Loader />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {moviesList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default App
