import React from "react";
import "./MovieCard.css";

function MovieCard({ movie }) {
  const { title, description, posterURL, rating } = movie;

  return (
    <article className="movie-card">
      <img className="movie-poster" src={posterURL} alt={title} />
      <div className="movie-details">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="movie-rating">Rating: {rating} / 5</div>
      </div>
    </article>
  );
}

export default MovieCard;
