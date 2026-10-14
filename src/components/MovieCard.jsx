import React from 'react'

function MovieCard({ movie:{title , poster_path ,release_date , id , vote_average , original_language} }) {
  return (
    <div className="movie-card">
        <img src={ poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : `/No-Poster.png`} alt={title} />
        <div className="mt-4">
            <h3 className='mt-5'>{title}</h3>
        <div className="content">
        <div className="rating">
            <img src="/public/star.svg" alt="" />
            <p>{Number(vote_average).toFixed(1)}</p>
            <span>•</span>
            <span className="lang">{original_language}</span>
            <span>•</span>
            <span className="year">{release_date.split('-')[0]}</span>
        </div>
        </div>
        </div>
        
    </div>
  )
}

export default MovieCard