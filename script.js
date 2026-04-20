document.addEventListener('DOMContentLoaded', () => {

    console.log("%cDarkNews — базовый понятный JS загружен", "color: #e30613; font-weight: bold;");

    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

 
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Задержка, чтобы карточки появлялись по очереди
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, index * 80);
            }
        });
    }, { 
        threshold: 0.15 
    });


    document.querySelectorAll('.news-card').forEach(card => {
        observer.observe(card);
    });

    
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.news-card');
        
        if (card) {
          
            if (e.target.closest('.read-more')) {
                return;
            }

            const title = encodeURIComponent(card.dataset.title || "");
            const category = encodeURIComponent(card.dataset.category || "");
            const image = encodeURIComponent(card.dataset.image || "");

            window.location.href = `article.html?title=${title}&category=${category}&image=${image}`;
        }
    });

        document.addEventListener('click', (e) => {
        const btn = e.target.closest('.read-more');
        if (btn) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            btn.appendChild(ripple);

            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;

            setTimeout(() => ripple.remove(), 700);
        }
    });

    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const term = searchInput.value.toLowerCase().trim();

            document.querySelectorAll('.news-card').forEach(card => {
                const titleEl = card.querySelector('h3');
                if (titleEl) {
                    const isMatch = titleEl.textContent.toLowerCase().includes(term);
                    card.style.display = isMatch ? 'block' : 'none';
                }
            });
        });
    }

    
    const ticker = document.getElementById('ticker');
    if (ticker) {
        const originalText = ticker.innerHTML;
        ticker.innerHTML = originalText + " &nbsp;&nbsp;&nbsp;••&nbsp;&nbsp;&nbsp; " + originalText;
    }

    
    const favoritesKey = 'darknews_favorites';

    function saveToFavorites(card) {
        let favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];
        
        const newsItem = {
            title: card.dataset.title,
            category: card.dataset.category,
            image: card.dataset.image
        };

        if (!favorites.some(item => item.title === newsItem.title)) {
            favorites.push(newsItem);
            localStorage.setItem(favoritesKey, JSON.stringify(favorites));
            alert('Новость добавлена в избранное!');
        } else {
            alert('Эта новость уже в избранном!');
        }
    }


    document.querySelectorAll('.news-card').forEach(card => {
        const favBtn = document.createElement('button');
        favBtn.textContent = '★';
        favBtn.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(0,0,0,0.75);
            color: #fff;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 20px;
            cursor: pointer;
            z-index: 10;
        `;

        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();        // чтобы не срабатывал переход на статью
            saveToFavorites(card);
        });

        card.style.position = 'relative';
        card.appendChild(favBtn);
    });

    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});