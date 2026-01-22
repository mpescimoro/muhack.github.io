(function() {
    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    const postCards = document.querySelectorAll('.post-card');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            filterTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            const filter = this.dataset.filter;
            let visibleCount = 0;
            
            postCards.forEach((card, index) => {
                const category = card.dataset.category;
                const show = filter === 'all' || category === filter;
                card.style.display = show ? '' : 'none';
                
                // Update featured class
                card.classList.remove('featured');
                if (show) {
                    if (visibleCount === 0) {
                        card.classList.add('featured');
                    }
                    visibleCount++;
                }
            });
        });
    });

    // Infinite scroll
    const loadMore = document.getElementById('loadMore');
    const postsList = document.getElementById('postsList');
    
    if (!loadMore || !postsList) return;

    const allPosts = Array.from(postCards);
    const postsPerPage = 10;
    let page = 1;
    
    // Initially hide posts beyond first page
    allPosts.forEach((post, i) => {
        if (i >= postsPerPage) post.style.display = 'none';
    });

    // Hide load more if not enough posts
    if (allPosts.length <= postsPerPage) {
        loadMore.innerHTML = '<span class="load-more-text">— Tutti i post caricati —</span>';
    }

    function loadMorePosts() {
        const start = page * postsPerPage;
        const end = start + postsPerPage;
        let loaded = 0;

        allPosts.slice(start, end).forEach(post => {
            post.style.display = '';
            loaded++;
        });

        page++;

        if (end >= allPosts.length) {
            loadMore.innerHTML = '<span class="load-more-text">— Tutti i post caricati —</span>';
            window.removeEventListener('scroll', checkScroll);
        }
    }

    function checkScroll() {
        const rect = loadMore.getBoundingClientRect();
        if (rect.top < window.innerHeight + 200) {
            loadMorePosts();
        }
    }

    window.addEventListener('scroll', checkScroll);
})();
