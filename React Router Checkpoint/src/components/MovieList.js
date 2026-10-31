import React from "react";
import MovieCard from "./MovieCard";

function MovieList({ movies }) {
  if (!movies.length) {
    return (
      <p className="empty-message">No movies match the current filters.</p>
    );
  }

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

export default MovieList;
