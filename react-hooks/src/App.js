import React, { useEffect, useState } from "react";
import "./App.css";
import MovieList from "./components/MovieList";
import Filter from "./components/Filter";

const initialMovies = [
  {
    title: "The Matrix",
    description:
      "A programmer discovers reality is a simulation and joins the fight for freedom.",
    posterURL:
      "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=400&q=80",
    rating: 5,
  },
  {
    title: "Stranger Things",
    description:
      "A group of kids uncovers supernatural mysteries in their small town.",
    posterURL:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=400&q=80",
    rating: 4,
  },
  {
    title: "Inception",
    description:
      "Dream thieves take on a final mission to plant an idea in someone's mind.",
    posterURL:
      "https://images.unsplash.com/photo-1517604690263-1f7e3c1adb45?auto=format&fit=crop&w=400&q=80",
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
      !newMovie.posterURL.trim()
    ) {
      return;
    }

    setMovies((current) => [
      ...current,
      { ...newMovie, rating: Number(newMovie.rating) },
    ]);

    setNewMovie({ title: "", description: "", posterURL: "", rating: 1 });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Movie & TV Show App</h1>
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
            />
            <input
              type="text"
              placeholder="Poster URL"
              value={newMovie.posterURL}
              onChange={(e) => handleInputChange("posterURL", e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={newMovie.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
            <label className="rating-label">
              Rating
              <select
                value={newMovie.rating}
                onChange={(e) => handleInputChange("rating", e.target.value)}
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
  );
}

export default App;
