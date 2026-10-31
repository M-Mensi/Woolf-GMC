import React from "react";

function Filter({ titleFilter, ratingFilter, onTitleChange, onRatingChange }) {
  return (
    <div className="filter-panel">
      <div className="filter-field">
        <label htmlFor="title-filter">Search by title</label>
        <input
          id="title-filter"
          type="text"
          value={titleFilter}
          placeholder="Type a movie title"
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="rating-filter">Minimum rating</label>
        <select
          id="rating-filter"
          value={ratingFilter}
          onChange={(e) => onRatingChange(Number(e.target.value))}
        >
          <option value={0}>All ratings</option>
          <option value={1}>1+</option>
          <option value={2}>2+</option>
          <option value={3}>3+</option>
          <option value={4}>4+</option>
          <option value={5}>5</option>
        </select>
      </div>
    </div>
  );
}

export default Filter;
