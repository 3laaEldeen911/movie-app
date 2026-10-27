function MovieCard({
  movie: { title, poster_path, release_date, vote_average, original_language },
}) {
  return (
    <div className="movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : '/No-Poster.png'
        }
        alt={title}
      />
      <div className="mt-4">
        <h3 className="mt-5">{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="/star.svg" alt="" />
            <p>
              {Number.isFinite(vote_average) ? vote_average.toFixed(1) : 'N/A'}
            </p>
            <span>•</span>
            <span className="lang">{original_language || 'N/A'}</span>
            <span>•</span>
            <span className="year">{release_date?.split('-')[0] || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
