import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  const ListHeaderComponent = () => (
    <View>
      <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

      <SearchBar
        onPress={() => router.push("/search")}
        placeholder="Search for a movie"
      />

      {trendingMovies && (
        <View className="mt-10">
          <Text className="text-lg text-white font-bold mb-3">Trending Movies</Text>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="w-4" />}
            data={trendingMovies}
            renderItem={({ item, index }) => <TrendingCard movie={item} index={index} />}
            className="mb-4 mt-3"
            keyExtractor={(item) => item.movie_id.toString()}
          />
        </View>
      )}

      <Text className="text-lg text-white font-bold mt-5 mb-3">Latest Movies</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" resizeMode="cover" />

      {moviesLoading || trendingLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : moviesError || trendingError ? (
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-white">
            {moviesError?.message || trendingError?.message}
          </Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MovieCard movie={item} />}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 20,
            paddingRight: 5,
            marginBottom: 10,
          }}
          className="px-5 pb-32"
          contentContainerStyle={{ paddingBottom: 10 }}
          ListHeaderComponent={ListHeaderComponent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
