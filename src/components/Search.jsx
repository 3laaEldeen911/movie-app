function Search({ search, setSearch }) {
  return (
    <div className="search">
      <div>
        <img
          src="/Vector.svg"
          className="search-icon"
          alt="search-icon"
        />
        <input
          className="search-input"
          type="text"
          placeholder="search for your favorite movie"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  )
}

export default Search
