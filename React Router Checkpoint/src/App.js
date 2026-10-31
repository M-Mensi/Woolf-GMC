import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import "./App.css";
import MovieList from "./components/MovieList";
import Filter from "./components/Filter";

const initialMovies = [
  {
    id: "1",
    title: "The Matrix",
    description:
      "A programmer discovers reality is a simulation and joins the fight for freedom.",
    posterURL:
      "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=400&q=80",
    trailerLink: "https://www.youtube.com/embed/vKQi3bBA1y8",
    rating: 5,
  },
  {
    id: "2",
    title: "Stranger Things",
    description:
      "A group of kids uncovers supernatural mysteries in their small town.",
    posterURL:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=400&q=80",
    trailerLink: "https://www.youtube.com/embed/b9EkMc79ZSU",
    rating: 4,
  },
  {
    id: "3",
    title: "Inception",
    description:
      "Dream thieves take on a final mission to plant an idea in someone's mind.",
    posterURL:
      "https://images.unsplash.com/photo-1517604690263-1f7e3c1adb45?auto=format&fit=crop&w=400&q=80",
    trailerLink: "https://www.youtube.com/embed/YoHD9XEInc0",
    rating: 5,
  },
];

function App() {
  const [movies, setMovies] = useState(initialMovies);
  const [titleFilter, setTitleFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [newMovie, setNewMovie] = useState({
    title: "",
    description: "",
    posterURL: "",
    trailerLink: "",
    rating: 1,
  });

  const filteredMovies = movies.filter((movie) => {
    const titleMatches = movie.title
      .toLowerCase()
      .includes(titleFilter.toLowerCase());
    const ratingMatches = movie.rating >= ratingFilter;
    return titleMatches && ratingMatches;
  });

  useEffect(() => {
    document.title = `Movies (${filteredMovies.length})`;
  }, [filteredMovies.length]);

  const handleInputChange = (field, value) => {
    setNewMovie((current) => ({ ...current, [field]: value }));
  };

  const handleAddMovie = (event) => {
    event.preventDefault();

    if (
      !newMovie.title.trim() ||
      !newMovie.description.trim() ||
      !newMovie.posterURL.trim() ||
      !newMovie.trailerLink.trim()
    ) {
      return;
    }

    setMovies((current) => {
      const nextId =
        current.reduce(
          (highestId, movie) => Math.max(highestId, Number(movie.id) || 0),
          0
        ) + 1;

      return [
        ...current,
        {
          ...newMovie,
          id: String(nextId),
          rating: Number(newMovie.rating),
        },
      ];
    });

    setNewMovie({
      title: "",
      description: "",
      posterURL: "",
      trailerLink: "",
      rating: 1,
    });
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="App">
            <header className="App-header">
              <h1>My Movie &amp; TV Show App</h1>
              <p>Use the form to add favorites, and filter by title or rating.</p>
            </header>

            <main className="app-body">
              <section className="movie-form-section">
                <h2>Add a new movie or show</h2>
                <form className="movie-form" onSubmit={handleAddMovie}>
                  <input
                    type="text"
                    placeholder="Title"
                    value={newMovie.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                  <input
                    type="url"
                    placeholder="Poster URL"
                    value={newMovie.posterURL}
                    onChange={(e) =>
                      handleInputChange("posterURL", e.target.value)
                    }
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={newMovie.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    required
                  />
                  <input
                    type="url"
                    placeholder="Trailer embed URL (for example, https://www.youtube.com/embed/...)"
                    value={newMovie.trailerLink}
                    onChange={(e) =>
                      handleInputChange("trailerLink", e.target.value)
                    }
                    required
                  />
                  <label className="rating-label">
                    Rating
                    <select
                      value={newMovie.rating}
                      onChange={(e) =>
                        handleInputChange("rating", e.target.value)
                      }
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                  </label>
                  <button type="submit">Add Movie</button>
                </form>
              </section>

              <section className="filter-section">
                <h2>Filter movies</h2>
                <Filter
                  titleFilter={titleFilter}
                  ratingFilter={ratingFilter}
                  onTitleChange={setTitleFilter}
                  onRatingChange={setRatingFilter}
                />
              </section>

              <section className="movie-list-section">
                <h2>Movie list</h2>
                <MovieList movies={filteredMovies} />
              </section>
            </main>
          </div>
        }
      />
      <Route
        path="/movies/:movieId"
        element={<MovieDetails movies={movies} />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function MovieDetails({ movies }) {
  const { movieId } = useParams();
  const movie = movies.find((item) => item.id === movieId);

  if (!movie) {
    return <NotFound />;
  }

  return (
    <div className="App">
      <main className="detail-page">
        <Link className="back-link" to="/">
          &larr; Back to home
        </Link>
        <article className="movie-detail">
          <img
            className="detail-poster"
            src={movie.posterURL}
            alt={movie.title}
          />
          <div className="detail-copy">
            <h1>{movie.title}</h1>
            <p className="movie-rating">Rating: {movie.rating} / 5</p>
            <p>{movie.description}</p>
          </div>
          <section className="trailer-section">
            <h2>Trailer</h2>
            <div className="trailer-frame">
              <iframe
                src={movie.trailerLink}
                title={`${movie.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <div className="App">
      <main className="detail-page">
        <h1>Movie not found</h1>
        <Link className="back-link" to="/">
          &larr; Back to home
        </Link>
      </main>
    </div>
  );
}

export default App;
