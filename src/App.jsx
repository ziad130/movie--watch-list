import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'movie-watch-list-v1';

function createMovieId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadMovies() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved.filter(movie =>
      typeof movie.id === 'string' && typeof movie.title === 'string' &&
      typeof movie.review === 'string' && Number.isInteger(movie.rating) &&
      movie.rating >= 1 && movie.rating <= 5
    ) : [];
  } catch {
    return [];
  }
}

function StarRating({ value, onChange }) {
  return (
    <div className="rating-picker" role="group" aria-label="Movie rating">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          className={star <= value ? 'star selected' : 'star'}
          aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
          aria-pressed={value === star}
          onClick={() => onChange(star)}
        >
          <span aria-hidden="true">{star <= value ? '⭐' : '☆'}</span>
        </button>
      ))}
      <span className="rating-value">{value}/5</span>
    </div>
  );
}

export default function App() {
  const [movies, setMovies] = useState(loadMovies);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(3);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [movies]);

  function addMovie(event) {
    event.preventDefault();
    if (!title.trim()) return;
    const movie = {
      id: createMovieId(),
      title: title.trim(),
      review: review.trim(),
      rating,
    };
    setMovies(current => [movie, ...current]);
    setTitle('');
    setReview('');
    setRating(3);
  }

  function updateMovie(id, changes) {
    setMovies(current => current.map(movie =>
      movie.id === id ? { ...movie, ...changes } : movie
    ));
  }

  const average = movies.length
    ? (movies.reduce((total, movie) => total + movie.rating, 0) / movies.length).toFixed(1)
    : '—';

  return (
    <main className="app">
      <header className="page-header">
        <div className="eyebrow">YOUR PERSONAL FILM JOURNAL</div>
        <h1>Movies watch list<span>.</span></h1>
        <p>Keep the movies. Capture the feeling. Give them your stars.</p>
      </header>

      <div className="layout">
        <section className="panel add-panel" aria-labelledby="add-heading">
          <span className="section-kicker">NEXT ENTRY</span>
          <h2 id="add-heading">Add a movie</h2>
          <form onSubmit={addMovie}>
            <label htmlFor="movie-title">Movie title</label>
            <input id="movie-title" value={title} onChange={event => setTitle(event.target.value)}
              placeholder="What did you watch?" required maxLength={150} />
            <label htmlFor="movie-review">Your review <span className="optional">(optional)</span></label>
            <textarea id="movie-review" value={review} onChange={event => setReview(event.target.value)}
              placeholder="What stayed with you?" rows={4} maxLength={2000} />
            <span className="field-label">Your rating</span>
            <StarRating value={rating} onChange={setRating} />
            <button className="primary" type="submit">+ Add to watch list</button>
          </form>
          <p className="save-note">{storageError ? 'Browser storage is unavailable. Changes last only for this session.' : 'Your list is saved automatically in this browser.'}</p>
        </section>

        <section className="collection" aria-labelledby="collection-heading">
          <div className="collection-header">
            <div><span className="section-kicker">THE COLLECTION</span><h2 id="collection-heading">Your movies</h2></div>
            <div className="stats" aria-live="polite"><span><strong>{movies.length}</strong> movies</span><span><strong>{average}</strong> avg. rating</span></div>
          </div>
          {movies.length === 0 ? (
            <div className="empty-state"><span className="empty-icon" aria-hidden="true">🎬</span><h3>Your opening scene awaits</h3><p>Add your first movie and start a collection<br />of stories worth remembering.</p></div>
          ) : (
            <ul className="movie-list">
              {movies.map(movie => (
                <li className="panel movie-card" key={movie.id}>
                  <div className="movie-top"><h3>{movie.title}</h3><button className="remove" type="button"
                    aria-label={`Remove ${movie.title}`} onClick={() => setMovies(current => current.filter(item => item.id !== movie.id))}>Remove</button></div>
                  <div className="saved-rating" aria-label={`${movie.rating} out of 5 stars`}><span aria-hidden="true">{'⭐'.repeat(movie.rating)}</span><span>{movie.rating}/5</span></div>
                  <details>
                    <summary>Edit review & rating</summary>
                    <label htmlFor={`review-${movie.id}`}>Your review</label>
                    <textarea id={`review-${movie.id}`} rows={3} maxLength={2000} value={movie.review}
                      onChange={event => updateMovie(movie.id, { review: event.target.value })} />
                    <StarRating value={movie.rating} onChange={value => updateMovie(movie.id, { rating: value })} />
                  </details>
                  <p className="review">{movie.review || 'No review yet. Add your thoughts using “Edit review & rating”.'}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <footer>Good films deserve to be remembered.</footer>
    </main>
  );
}
