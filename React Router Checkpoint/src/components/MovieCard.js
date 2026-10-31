import React from "react";
import { Link } from "react-router-dom";
import "./MovieCard.css";

function MovieCard({ movie }) {
  const { id, title, description, posterURL, rating } = movie;

  return (
    <Link className="movie-card" to={`/movies/${id}`}>
      <img className="movie-poster" src={posterURL} alt={title} />
      <div className="movie-details">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="movie-rating">Rating: {rating} / 5</div>
      </div>
    </Link>
  );
}

export default MovieCard;
