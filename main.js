// SECURITY: the API key is read from .env (never hardcoded in the code)
const API_KEY = import.meta.env.VITE_OMDB_KEY;
const API_URL = 'https://www.omdbapi.com/';
// Local mock database (JSON Server). POST never goes to the live API.
const WATCHLIST_URL = 'http://localhost:3001/watchlist';

const titleInput = document.getElementById('titleInput');
const searchBtn = document.getElementById('searchBtn');
const watchlistBtn = document.getElementById('watchlistBtn');
const message = document.getElementById('message');
const result = document.getElementById('result');

let currentMovie = null;

function showMessage(text, isError = false) {
  message.textContent = text; // textContent protects from XSS
  message.classList.toggle('error', isError);
}

// GET request: search for a movie in OMDb
async function searchMovie() {
  const title = titleInput.value.trim();

  // Validate empty input before fetching
  if (!title) {
    showMessage('Please enter a movie title.', true);
    return;
  }

  if (!API_KEY || API_KEY === 'PASTE_YOUR_KEY_HERE') {
    showMessage('API key is missing. Add it to the .env file.', true);
    return;
  }

  showMessage('Loading...');
  result.hidden = true;
  currentMovie = null;

  try {
    const response = await fetch(
      `${API_URL}?apikey=${API_KEY}&t=${encodeURIComponent(title)}`
    ); // GET is the default method

    // Error handling: check response.ok
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    // OMDb returns HTTP 200 even when a movie is not found
    if (data.Response === 'False') {
      throw new Error(data.Error || 'Movie not found');
    }

    currentMovie = {
      title: data.Title,
      year: data.Year,
      rating: data.imdbRating,
      plot: data.Plot,
    };

    // SECURITY: only textContent, never innerHTML
    document.getElementById('titleYear').textContent = `${data.Title} (${data.Year})`;
    document.getElementById('rating').textContent = `⭐ ${data.imdbRating} / 10`;
    document.getElementById('plot').textContent = data.Plot;

    result.hidden = false;
    showMessage('');
  } catch (error) {
    showMessage(`Error: ${error.message}`, true);
  }
}

// POST request: mock "Add to Watchlist" (JSON Server, not the live API)
async function addToWatchlist() {
  if (!currentMovie) return;

  try {
    const response = await fetch(WATCHLIST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentMovie), // payload serialization
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    showMessage(`"${currentMovie.title}" added to watchlist!`);
  } catch (error) {
    showMessage(
      `Error: ${error.message}. Is JSON Server running (npm run server)?`,
      true
    );
  }
}

searchBtn.addEventListener('click', searchMovie);
watchlistBtn.addEventListener('click', addToWatchlist);
titleInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchMovie();
});
