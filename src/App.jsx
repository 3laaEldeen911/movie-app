import { useState, useEffect } from 'react'
import './App.css'
import Search from './components/Search'
import Loader from './components/loader'
import MovieCard from './components/MovieCard'
import { useDebounce } from 'react-use'

function App() {
  const API_BASE_URL = 'https://api.themoviedb.org/3'
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY
  const API_OPTIONS = {
    method: 'GET',
    headers: { accept: 'application/json', Authorization: `Bearer ${API_KEY}` },
  }

  const APPWRITE_PROJECT_NAME = 'Movie_App'
  const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1'
  const API_PROJECT_KEY = import.meta.env.VITE_PROJECT_ID
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [search, setSearch] = useState('')
  const [moviesList, setMoviesList] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  useDebounce(() => setDebouncedSearchTerm(search), 1500, [search])

  const fetchMovies = async (query = '') => {
    setLoading(true)
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      const response = await fetch(endpoint, API_OPTIONS)

      if (!response.ok) {
        throw new Error(response.status || 'Failed to fetch movies')
      }
      const data = await response.json()

      if (data.response === 'False') {
        throw new Error(data.error || 'Failed to fetch movies')
      }

      setMoviesList(data.results)
    } catch (error) {
      setErrorMessage(
        error.message || 'An error occurred while fetching movies'
      )
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  console.log(moviesList)

  return (
    <>
      <main>
        <div className="pattern">
          <div className="wrapper">
            <header>
              <img
                src="../public/hero-img.png"
                alt="hero"
                className="hero-img"
              />
              <h1>
                Find <span className="text-gradient">Movies</span> You Will
                Enjoy With Hassle
              </h1>
              <Search className="" search={search} setSearch={setSearch} />
            </header>

            <section className="all-movies">
              <h2 className="text-2xl font-bold mb-4 mt-20">All Movies</h2>

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
    </>
  )
}

export default App
