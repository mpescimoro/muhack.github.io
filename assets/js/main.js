// Mobile Menu Toggle
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.getElementById('mobileNav');
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
}

// Lazy Loading per immagini nei contenuti
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.article-body img, .post-content img, .about-content img').forEach(function(img) {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
});

// Dark Mode
(function() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    function getPreferredTheme() {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
    
    // Set initial theme
    setTheme(getPreferredTheme());
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const current = html.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
})();

// Search Overlay con lunr.js
(function() {
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchToggle || !searchOverlay) return;
    
    let posts = [];
    let lunrIndex = null;
    
    // Load posts data e costruisci indice lunr
    fetch('/search.json')
        .then(r => r.json())
        .then(data => {
            posts = data;
            // Costruisci indice lunr
            lunrIndex = lunr(function() {
                this.ref('url');
                this.field('title', { boost: 10 });
                this.field('author', { boost: 5 });
                this.field('categories', { boost: 3 });
                this.field('content');
                
                data.forEach(doc => {
                    this.add(doc);
                });
            });
        })
        .catch(() => {});
    
    function openSearch() {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchInput.focus(), 100);
    }
    
    function closeSearch() {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
        searchInput.value = '';
        searchResults.innerHTML = '';
    }
    
    function doSearch(query) {
        if (!query || query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }
        
        let results = [];
        
        if (lunrIndex) {
            // Usa lunr per ricerca fuzzy
            try {
                const lunrResults = lunrIndex.search(query + '*');
                results = lunrResults.slice(0, 8).map(r => {
                    return posts.find(p => p.url === r.ref);
                }).filter(Boolean);
            } catch(e) {
                // Fallback a ricerca semplice se lunr fallisce
                const q = query.toLowerCase();
                results = posts.filter(p => 
                    p.title.toLowerCase().includes(q) || 
                    (p.author && p.author.toLowerCase().includes(q))
                ).slice(0, 8);
            }
        } else {
            // Fallback se lunr non caricato
            const q = query.toLowerCase();
            results = posts.filter(p => 
                p.title.toLowerCase().includes(q) || 
                (p.content && p.content.toLowerCase().includes(q)) ||
                (p.categories && p.categories.toLowerCase().includes(q)) ||
                (p.author && p.author.toLowerCase().includes(q))
            ).slice(0, 8);
        }
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">Nessun risultato per "' + query + '"</div>';
            return;
        }
        
        searchResults.innerHTML = results.map(p => `
            <a href="${p.url}" class="search-result-item">
                <div class="search-result-title">${p.title}</div>
                ${p.subtitle ? `<div class="search-result-excerpt">${p.subtitle}</div>` : ''}
                <div class="search-result-meta">${p.date} ${p.author ? '• @' + p.author : ''} ${p.categories ? '• ' + p.categories : ''}</div>
            </a>
        `).join('');
    }
    
    searchToggle.addEventListener('click', openSearch);
    searchClose.addEventListener('click', closeSearch);
    
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === searchOverlay) closeSearch();
    });
    
    searchInput.addEventListener('input', function() {
        doSearch(this.value);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (searchOverlay.classList.contains('active')) {
                closeSearch();
            }
            const mobileNav = document.getElementById('mobileNav');
            if (mobileNav && mobileNav.classList.contains('active')) {
                toggleMenu();
            }
        }
        // Ctrl/Cmd + K to open search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchOverlay.classList.contains('active')) {
                closeSearch();
            } else {
                openSearch();
            }
        }
    });
})();
