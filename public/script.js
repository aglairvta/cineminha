let debounceTimer;
const debounceDelay = 300;
function fetchSuggestions(query) {
    fetch(`/api/suggestions?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') {
                const suggestions = data.Search;
                const suggestionsContainer = document.getElementById('suggestions');
                suggestionsContainer.innerHTML = '';
                suggestions.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'suggestion-item';
                    const img = document.createElement('img');
                    img.src = item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/50x75?text=No+Image';
                    img.alt = item.Title;
                    const details = document.createElement('div');
                    details.className = 'details';
                    const title = document.createElement('span');
                    title.className = 'title';
                    title.textContent = item.Title;
                    const year = document.createElement('span');
                    year.className = 'year';
                    year.textContent = `(${item.Year})`;
                    details.appendChild(title);
                    details.appendChild(year);
                    div.appendChild(img);
                    div.appendChild(details);
                    div.dataset.imdbId = item.imdbID;
                    div.addEventListener('click', function() {
                        document.getElementById('contentName').value = this.querySelector('.title').textContent;
                        document.getElementById('suggestions').innerHTML = '';
                    });
                    suggestionsContainer.appendChild(div);
                });
            } else {
                document.getElementById('suggestions').innerHTML = '<p>Nenhuma sugestão encontrada.</p>';
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            document.getElementById('suggestions').innerHTML = '<p>Erro ao buscar sugestões.</p>';
        });
}
document.getElementById('contentName').addEventListener('input', function() {
    clearTimeout(debounceTimer);
    const query = this.value.trim();
    if (query.length < 3) {
        document.getElementById('suggestions').innerHTML = '';
        return;
    }
    debounceTimer = setTimeout(() => {
        fetchSuggestions(query);
    }, debounceDelay);
});
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const contentName = document.getElementById('contentName').value.trim();
    const contentType = document.getElementById('contentType').value;
    fetch(`/api/content?query=${encodeURIComponent(contentName)}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') {
                const imdbId = data.imdbID;
                const embedUrl = `https://embed.warezcdn.com/${contentType}/${imdbId}`;
                console.log("Generated embed URL:", embedUrl);
                document.getElementById('embedContainer').innerHTML = `
                    <iframe src="${embedUrl}" scrolling="no" frameborder="0" allowfullscreen="" webkitallowfullscreen="" mozallowfullscreen=""></iframe>
                `;
            } else {
                document.getElementById('embedContainer').innerHTML = '<p>Conteúdo não encontrado.</p>';
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            document.getElementById('embedContainer').innerHTML = '<p>Erro ao buscar informações do conteúdo.</p>';
        });
});