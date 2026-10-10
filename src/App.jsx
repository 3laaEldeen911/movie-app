import { useState , useEffect } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Search from './components/Search'

function App() {

  const API_BASE_URL ="https://api.themoviedb.org/3/discover/movie";
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_OPTIONS ={method: "GET" , headers:{accept:"appliction/json" , Authorization:`Bearer ${API_KEY}`}};


  const fetchMovies = async () => {
  try{
      const endpoint = `${API_BASE_URL}?sort_by=popularity.desc`;
      const response = await fetch(endpoint , API_OPTIONS);
      const data = await response.json();

      
      console.log(data);
  }
  catch(error){
  console.log(`error: ${error}`);
  }

  
  
  }
  useEffect(() => {
    fetchMovies();
  }, [])

  const [search, setSearch] = useState("")

 
  return (
    <>
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="../public/hero-img.png" alt="hero" className='hero-img' />
            <h1>Find <span className='text-gradient'>Movies</span> You Will Enjoy With Hassle</h1>
            <Search className="" search={search} setSearch={setSearch} />
          </header>
        </div>
      </div>
    </main>
    </>
  )
}

export default App
