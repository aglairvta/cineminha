let currentPage = 1;
const apiKey = ''; 

async function fetchMovies(page, query = '') {
    const url = query 
        ? `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`
        : `https://www.omdbapi.com/?s=movie&page=${page}&apikey=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.Response === 'True') {
        return data.Search;
    } else {
        return [];
    }
}

async function displayMovies(query = '') {
    const movies = await fetchMovies(currentPage, query);
    const movieContainer = document.getElementById('movieContainer');
    movieContainer.innerHTML = '';

    if (movies.length === 0) {
        movieContainer.innerHTML = '<p>Nenhum filme encontrado.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.className = 'movie-item';
        movieDiv.dataset.imdbId = movie.imdbID;

        const img = document.createElement('img');
        img.src = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x225?text=No+Image';
        img.alt = movie.Title;

        const title = document.createElement('span');
        title.textContent = movie.Title;

        movieDiv.appendChild(img);
        movieDiv.appendChild(title);
        movieDiv.addEventListener('click', (event) => {
            event.stopPropagation();
            loadEmbed(movie.imdbID, movie.Type);
        });
        movieContainer.appendChild(movieDiv);
    });
}

function loadEmbed(imdbId, type) {
    const baseEmbedUrl = 'https://embed.warezcdn.link';
    const embedUrl = type === 'movie' 
        ? `${baseEmbedUrl}/filme/${imdbId}` 
        : `${baseEmbedUrl}/serie/${imdbId}`;
    
    // Limpa o iframe anterior
    document.getElementById('embedContainer').innerHTML = '';
    
    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.scrolling = 'no';
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts'); 


    iframe.addEventListener('load', () => {
        const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        const links = innerDoc.getElementsByTagName('a');
        for (let link of links) {
            link.onclick = (event) => {
                event.preventDefault(); 
            };
        }
    });

    document.getElementById('embedContainer').appendChild(iframe);
}

document.getElementById('nextButton').addEventListener('click', () => {
    currentPage++;
    const query = document.getElementById('searchInput').value.trim();
    displayMovies(query);
});

document.getElementById('prevButton').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        const query = document.getElementById('searchInput').value.trim();
        displayMovies(query);
    }
});

document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    currentPage = 1; 
    document.getElementById('embedContainer').innerHTML = '';
    displayMovies(query);
});


document.getElementById('pageTitle').addEventListener('click', () => {
    location.reload(); 
});

displayMovies();
