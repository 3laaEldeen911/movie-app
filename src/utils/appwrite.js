import { Client, TablesDB, ID, Query } from 'appwrite'

const DATABASE_ID = import.meta.env.VITE_APPWRITE_MOVIES_DATABASE_ID
const TABLE_ID = import.meta.env.VITE_APPWRITE_MOVIES_TABLE_ID
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID

if (!DATABASE_ID || !TABLE_ID || !PROJECT_ID) {
  throw new Error('Missing Appwrite environment variables')
}

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(PROJECT_ID)

const tablesDB = new TablesDB(client)

const getPosterUrl = (posterPath) => {
  return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : ''
}

export const updateSearchCount = async (searchTerm, movie) => {
  if (
    typeof searchTerm !== 'string' ||
    !searchTerm.trim() ||
    movie?.id == null
  ) {
    throw new Error('A search term and a valid movie are required')
  }

  const normalizedSearchTerm = searchTerm.trim().toLowerCase()

  const result = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    queries: [
      Query.equal('searchTerm', normalizedSearchTerm),
      Query.limit(1),
    ],
  })

  if (result.rows.length > 0) {
    const row = result.rows[0]

    const currentCount =
      typeof row.count === 'number' &&
      Number.isFinite(row.count) &&
      row.count >= 0
        ? row.count
        : 0

    await tablesDB.updateRow({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      rowId: row.$id,
      data: {
        count: currentCount + 1,
      },
    })
  } else {
    await tablesDB.createRow({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      rowId: ID.unique(),
      data: {
        searchTerm: normalizedSearchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: getPosterUrl(movie.poster_path),
      },
    })
  }

  return { success: true }
}

export const getTrandingMovies = async () => {
  const result = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    queries: [Query.orderDesc('count'), Query.limit(5)],
  })

  return result.rows
}
