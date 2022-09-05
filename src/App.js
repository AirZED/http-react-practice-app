import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //handling fatch
  const fetchMovieHandler = useCallback(async (e) => {
    e && e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await fetch(
        "https://dummy-react-movie-app-default-rtdb.firebaseio.com/movies.json"
      );

      if (data.status < 200 || data.status > 300) {
        throw new Error(`${data.status} - Request not successful`);
      }

      const response = await data.json();

      //create array to extract object into
      const loadedMovies = [];

      for (const key in response) {
        loadedMovies.push({
          id: key,
          title: response[key].title,
          openingText: response[key].openingText,
          releaseDate: response[key].release,
        });
      }

      // const transformedData = await response.results.map((each) => {
      //   return {
      //     title: each.title,
      //     id: each.episode_id,
      //     releaseDate: each.release_date,
      //     openingText: each.opening_crawl,
      //   };
      // });
      setMovies(loadedMovies);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  const addMovieHandler = useCallback(
    async (movie) => {
      const response = await fetch(
        "https://dummy-react-movie-app-default-rtdb.firebaseio.com/movies.json",
        {
          method: "POST",
          body: JSON.stringify(movie),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      fetchMovieHandler();
      console.log(data);
    },
    [fetchMovieHandler]
  );

  //Reloads on dependecy changes
  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler]);

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {error && <p>{error}</p>}
        {(isLoading && !error) ||
          (movies.length > 0 && <MoviesList movies={movies} />)}
        {!isLoading && !error && movies.length === 0 && <p>Found no movie</p>}
        {isLoading && !error && <p>Movies is loading</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
