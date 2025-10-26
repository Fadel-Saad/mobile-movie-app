import { Client, ID, Query, TablesDB } from "react-native-appwrite";

// set up appwrite
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const tablesDB = new TablesDB(client);

// track searches made by a user

export async function updateSearchCount(query: string, movie: Movie) {
  try {
    // return all rows where the query matches the search term table attribute
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.equal("searchTerm", query)],
    });

    // check if a record already exists to update the count
    // else add it to the records
    if (result.rows.length > 1) {
      const existingMovie = result.rows[0];

      await tablesDB.updateRow(DATABASE_ID, TABLE_ID, existingMovie.$id, {
        count: existingMovie.count + 1,
      });
    } else {
      await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: {
          searchTerm: query,
          movie_id: movie.id,
          count: 1,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          title: movie.title,
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTrendingMovies(): Promise<TrendingMovie[] | undefined> {
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.limit(5), Query.orderDesc("count")],
    });

    return result.rows as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
}
