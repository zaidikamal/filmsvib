// ─── Config ────────────────────────────────────────────────────────────────
const TMDB_API_KEY    = '89247d9fb7c53ca3db276c24c43499cf';
const TMDB_BASE_URL   = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

const SUPABASE_URL = 'https://gphyjarwsmcuohelrkyv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-tytshmgfeHHKgF9b9MglA_nWY7ZmlF';

// ─── State ─────────────────────────────────────────────────────────────────
let currentCategory      = 'all';
let currentCarouselIndex = 0;
let currentPage          = 1;
let isLoading            = false;

// ─── In-Memory API Cache ────────────────────────────────────────────────────
const _apiCache = {};
const _CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function _getCached(key) {
    const entry = _apiCache[key];
    if (!entry) return null;
    if (Date.now() - entry.ts > _CACHE_TTL_MS) { delete _apiCache[key]; return null; }
    return entry.data;
}
function _setCache(key, data) {
    _apiCache[key] = { data, ts: Date.now() };
}

// ─── TMDB Service ───────────────────────────────────────────────────────────
const TMDB = {
    async fetch(endpoint, params = {}) {
        const query = new URLSearchParams({
            api_key: TMDB_API_KEY,
            language: 'ar-SA',
            ...params
        }).toString();
        const cacheKey = endpoint + '?' + query;
        const cached = _getCached(cacheKey);
        if (cached) return cached;

        try {
            const response = await fetch(`${TMDB_BASE_URL}${endpoint}?${query}`);
            if (!response.ok) throw new Error(`TMDB ${response.status}`);
            const data = await response.json();
            _setCache(cacheKey, data);
            return data;
        } catch (error) {
            console.error('TMDB Fetch Error:', error);
            return null;
        }
    },

    async getTrending()        { const d = await this.fetch('/trending/movie/week'); return d ? d.results : []; },
    async getNowPlaying()      { const d = await this.fetch('/movie/now_playing');   return d ? d.results : []; },
    async getGenres()          { const d = await this.fetch('/genre/movie/list');     return d ? d.genres  : []; },
    async search(query)        { const d = await this.fetch('/search/movie', { query }); return d ? d.results : []; },
    async getMovieDetails(id)  { return await this.fetch(`/movie/${id}`, { append_to_response: 'credits,videos' }); },
};

// ─── Supabase Service ───────────────────────────────────────────────────────
const DB = {
    async fetch(table, params = {}) {
        const query = new URLSearchParams(params);
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
                headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
            });
            if (!res.ok) throw new Error('DB Fetch Error');
            return await res.json();
        } catch (e) { console.error(e); return []; }
    },

    async post(table, data) {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(data)
            });
            return res.ok;
        } catch (e) { console.error(e); return false; }
    }
};

// ─── Watchlist Helpers ──────────────────────────────────────────────────────
const WATCHLIST_KEY = 'cinema_watchlist';

function getWatchlist()        { return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '[]'); }
function isInWatchlist(id)     { return getWatchlist().includes(id); }

function _saveWatchlist(list) {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
    updateWatchlistBadge();
}

function toggleWatchlist(movieId) {
    const list  = getWatchlist();
    const index = list.indexOf(movieId);
    const btn   = event.currentTarget;

    if (index === -1) {
        list.push(movieId);
        btn.innerHTML = '<i class="fas fa-check"></i> في المفضلة';
        btn.classList.add('bg-green-600/20', 'border-green-500/40', 'text-green-400');
        btn.classList.remove('bg-white/5', 'border-white/10');
        showToast('تمت الإضافة إلى المفضلة ✔', 'success');
    } else {
        list.splice(index, 1);
        btn.innerHTML = '<i class="fas fa-bookmark"></i> أضف للمفضلة';
        btn.classList.remove('bg-green-600/20', 'border-green-500/40', 'text-green-400');
        btn.classList.add('bg-white/5', 'border-white/10');
        showToast('تمت الإزالة من المفضلة', 'info');
    }
    _saveWatchlist(list);
}

function updateWatchlistBadge() {
    const badge = document.getElementById('watchlistBadge');
    if (!badge) return;
    const count = getWatchlist().length;
    if (count > 0) {
        badge.textContent = count > 9 ? '9+' : count;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

// ─── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    initScrollEffects();
    initLazyLoading();
    updateWatchlistBadge();

    // Fetch critical data in parallel
    const [nowPlaying, genres] = await Promise.all([
        TMDB.getNowPlaying(),
        TMDB.getGenres(),
        loadTrending(),
        loadTopRated(),
        loadReviews()
    ]);

    // Populate genre map globally for card labels
    window.globalGenres = {};
    if (genres) {
        genres.forEach(g => window.globalGenres[g.id] = g.name);
        renderGenreFilters(genres);
    }

    if (nowPlaying && nowPlaying.length) updateHero(nowPlaying[0]);

    await loadNewsGrid();
    setupSearch();
});


// ─── Hero ───────────────────────────────────────────────────────────────────
function updateHero(movie) {
    const section = document.getElementById('heroSection');
    const title   = document.getElementById('heroTitle');
    const desc    = document.getElementById('heroDesc');
    const buttons = document.getElementById('heroButtons');

    section.style.backgroundImage = `url('${TMDB_BACKDROP_BASE}${movie.backdrop_path}')`;
    title.innerHTML = `<span class="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-cyan-500 text-glow-purple">${movie.title}</span>`;
    desc.innerText  = movie.overview || 'استمتع بأحدث التغطيات السينمائية المباشرة.';

    buttons.innerHTML = `
        <button onclick="openMovieModal(${movie.id})" class="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 px-8 py-3 rounded-full font-bold neon-red smooth-transition flex items-center gap-2">
            <i class="fas fa-play"></i> اقرأ المزيد
        </button>
        <button onclick="openMovieModal(${movie.id}, true)" class="bg-white/10 hover:bg-white/20 border border-white/30 px-8 py-3 rounded-full font-bold smooth-transition flex items-center gap-2">
            <i class="fas fa-video"></i> شاهد التريلر
        </button>
    `;
    buttons.classList.remove('opacity-0');
}

// ─── Trending Carousel ──────────────────────────────────────────────────────
async function loadTrending() {
    const movies = await TMDB.getTrending();
    if (movies && movies.length) {
        renderCarousel(movies.slice(0, 15));
        startAutoSlide();
    }
}

// ─── Top Rated Section ───────────────────────────────────────────────────────
async function loadTopRated() {
    const data    = await TMDB.fetch('/movie/top_rated', { page: 1 });
    const movies  = data ? data.results.slice(0, 10) : [];
    const grid    = document.getElementById('topRatedGrid');
    if (!grid) return;

    if (!movies.length) { grid.innerHTML = ''; return; }

    grid.innerHTML = movies.map((movie, i) => `
        <div class="movie-card bg-[#12121a] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-yellow-500/30 group"
             onclick="openMovieModal(${movie.id})">
            <div class="relative aspect-[2/3] overflow-hidden">
                <img data-src="${TMDB_IMAGE_BASE}${movie.poster_path}" alt="${movie.title}"
                     class="lazy-image w-full h-full object-cover group-hover:scale-105 smooth-transition">

                <!-- Rank Badge -->
                <div class="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-lg
                    ${i < 3 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black' : 'bg-black/70 text-white border border-white/20'}">
                    ${i + 1}
                </div>

                <!-- Rating -->
                <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/60 to-transparent p-3">
                    <div class="flex items-center gap-1.5">
                        <i class="fas fa-star text-yellow-400 text-xs"></i>
                        <span class="text-sm font-bold">${(movie.vote_average || 0).toFixed(1)}</span>
                        <span class="text-gray-500 text-xs mr-auto">${movie.release_date ? movie.release_date.split('-')[0] : ''}</span>
                    </div>
                </div>

                <!-- Hover overlay -->
                <div class="card-overlay absolute inset-0 bg-black/50 flex items-center justify-center smooth-transition">
                    <div class="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                        <i class="fas fa-play text-black text-sm mr-[-1px]"></i>
                    </div>
                </div>
            </div>
            <div class="p-3">
                <h4 class="font-bold text-sm line-clamp-1 group-hover:text-yellow-400 smooth-transition">${movie.title}</h4>
            </div>
        </div>
    `).join('');

    initLazyLoading();
}


function renderCarousel(movies) {
    const track = document.getElementById('carouselTrack');
    track.innerHTML = movies.map(movie => `
        <div class="movie-card flex-shrink-0 w-72 md:w-80 cursor-pointer" onclick="openMovieModal(${movie.id})">
            <div class="relative rounded-2xl overflow-hidden aspect-[2/3]">
                <img data-src="${TMDB_IMAGE_BASE}${movie.poster_path}" alt="${movie.title}" class="lazy-image w-full h-full object-cover">
                <div class="card-overlay absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-4">
                    <h4 class="font-bold text-lg leading-tight mb-2">${movie.title}</h4>
                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-lg backdrop-blur-md">
                            <i class="fas fa-star text-yellow-400 text-xs"></i>
                            <span class="text-sm font-bold text-white">${(movie.vote_average || 0).toFixed(1)}</span>
                        </div>
                        <span class="text-xs text-gray-400">${movie.release_date ? movie.release_date.split('-')[0] : ''}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    initLazyLoading();
}

let autoSlideTimer;
function startAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(() => moveCarousel(1), 5000);
}

function moveCarousel(direction) {
    const track         = document.getElementById('carouselTrack');
    const cardWidth     = window.innerWidth < 768 ? 288 : 320;
    const gap           = 24;
    const containerW    = document.querySelector('.carousel-container').offsetWidth;
    const maxOffset     = track.scrollWidth - containerW;

    currentCarouselIndex += direction;
    if (currentCarouselIndex < 0) currentCarouselIndex = 0;

    let offset = currentCarouselIndex * (cardWidth + gap);
    if (offset > maxOffset) { offset = 0; currentCarouselIndex = 0; }

    track.style.transform = `translateX(${offset}px)`;
    if (direction !== 0) startAutoSlide();
}

// ─── Genre Filters ──────────────────────────────────────────────────────────
function renderGenreFilters(genres) {
    const container = document.getElementById('genres');
    const SHOW_IDS  = [28, 12, 16, 35, 80, 18, 14, 27, 9648, 10749, 878, 53, 37];
    const filtered  = genres.filter(g => SHOW_IDS.includes(g.id));

    container.innerHTML = `<button onclick="changeCategory('all')" class="category-pill active px-6 py-2 rounded-full text-sm font-bold">الكل</button>`;
    filtered.forEach(genre => {
        container.innerHTML += `<button onclick="changeCategory('${genre.id}')" class="category-pill px-6 py-2 rounded-full text-sm font-bold" data-id="${genre.id}">${genre.name}</button>`;
    });
}

async function changeCategory(cat) {
    currentCategory = cat;
    currentPage     = 1;
    document.querySelectorAll('.category-pill').forEach(btn => {
        btn.classList.remove('active');
        const onc = btn.getAttribute('onclick') || '';
        if ((cat === 'all' && btn.innerText.trim() === 'الكل') || onc.includes(`'${cat}'`)) {
            btn.classList.add('active');
        }
    });
    document.getElementById('newsGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
    await loadNewsGrid();
}

// ─── News Grid ──────────────────────────────────────────────────────────────
async function loadNewsGrid(isMore = false) {
    if (isLoading) return;
    const grid = document.getElementById('newsGrid');
    const btn  = document.querySelector('button[onclick="loadMoreNews()"]');

    if (!isMore) {
        currentPage    = 1;
        grid.innerHTML = Array(6).fill('<div class="animate-pulse bg-white/5 rounded-2xl aspect-[16/9] w-full"></div>').join('');
    } else {
        isLoading         = true;
        btn.innerHTML     = '<i class="fas fa-spinner fa-spin ml-2"></i> جاري التحميل...';
        btn.disabled      = true;
    }

    const endpoint = currentCategory === 'all' ? '/movie/popular' : '/discover/movie';
    const params   = currentCategory === 'all' ? { page: currentPage } : { with_genres: currentCategory, page: currentPage };

    const data    = await TMDB.fetch(endpoint, params);
    const results = data ? data.results : [];

    if (!isMore) grid.innerHTML = '';

    if (results && results.length) {
        renderNewsGrid(results, isMore);
        currentPage++;
    } else if (!isMore) {
        grid.innerHTML = '<div class="col-span-full text-center py-20 text-gray-500">لا توجد أفلام في هذا التصنيف.</div>';
    }

    if (isMore) {
        isLoading     = false;
        btn.innerHTML = '<i class="fas fa-plus ml-2"></i> عرض المزيد';
        btn.disabled  = false;
    }
}

async function loadMoreNews() { await loadNewsGrid(true); }

function renderNewsGrid(movies, append = false) {
    const grid = document.getElementById('newsGrid');
    const html = movies.map((movie, index) => `
        <article class="movie-card bg-[#12121a] rounded-2xl overflow-hidden cursor-pointer animate-fade-in-up border border-white/5 hover:border-purple-500/20"
            style="animation-delay:${index * 0.04}s" onclick="openMovieModal(${movie.id})">
            <div class="relative aspect-video overflow-hidden">
                <img data-src="${TMDB_IMAGE_BASE}${movie.backdrop_path || movie.poster_path}" alt="${movie.title}" class="lazy-image w-full h-full object-cover">
                <div class="card-overlay absolute inset-0 flex items-center justify-center smooth-transition">
                    <div class="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                        <i class="fas fa-play text-2xl"></i>
                    </div>
                </div>
                <div class="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                    <i class="fas fa-star text-yellow-400 text-[10px]"></i>
                    <span class="text-xs font-bold">${(movie.vote_average || 0).toFixed(1)}</span>
                </div>
            </div>
            <div class="p-5">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-gray-500 text-xs font-bold uppercase tracking-wider">${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
                    <span class="text-xs text-gray-600">+${(movie.vote_count || 0).toLocaleString()} تقييم</span>
                </div>
                <h4 class="font-bold text-lg mb-2 hover:text-purple-400 smooth-transition line-clamp-1">${movie.title}</h4>
                <p class="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">${movie.overview || 'لا يوجد ملخص متاح.'}</p>
                <div class="flex flex-wrap gap-1">
                    ${(movie.genre_ids || []).slice(0, 2).map(id => `
                        <span class="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400">${window.globalGenres?.[id] || ''}</span>
                    `).join('')}
                </div>
            </div>
        </article>
    `).join('');

    if (append) grid.insertAdjacentHTML('beforeend', html);
    else        grid.innerHTML = html;

    initLazyLoading();
}

// ─── Reviews ────────────────────────────────────────────────────────────────
async function loadReviews() {
    const container = document.querySelector('#reviews .grid');
    if (!container) return;
    container.innerHTML = '<div class="col-span-full text-center py-10 text-gray-500"><i class="fas fa-spinner fa-spin text-2xl"></i></div>';

    const reviews = await DB.fetch('movie_reviews', { order: 'created_at.desc', limit: 6 });

    if (reviews && reviews.length > 0) {
        container.innerHTML = reviews.map(review => `
            <div class="review-card p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 smooth-transition animate-fade-in-up">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-red-600 rounded-full flex items-center justify-center font-bold text-lg">
                        ${(review.reviewer_name || 'ز')[0]}
                    </div>
                    <div>
                        <h5 class="font-bold">${review.reviewer_name || 'زائر مجهول'}</h5>
                        <p class="text-gray-400 text-xs">${new Date(review.created_at).toLocaleDateString('ar-EG', { year:'numeric', month:'short', day:'numeric' })}</p>
                    </div>
                </div>
                <div class="star-rating flex text-yellow-400 text-sm gap-0.5 mb-3">
                    ${generateStars(review.rating)}
                </div>
                <p class="text-gray-300 leading-relaxed text-sm">${review.review_text || 'لم يتم ترك أي تعليق.'}</p>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<div class="col-span-full text-center py-10 text-gray-400">لا توجد تقييمات حتى الآن. كن أول من يقيم!</div>';
    }
}

// ─── Movie Modal ─────────────────────────────────────────────────────────────
async function openMovieModal(movieId, autoPlayTrailer = false) {
    const modal   = document.getElementById('movieModal');
    const content = document.getElementById('modalContent');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    content.innerHTML = '<div class="p-20 text-center"><i class="fas fa-spinner fa-spin text-4xl text-purple-600"></i></div>';

    const movie = await TMDB.getMovieDetails(movieId);
    if (!movie) {
        content.innerHTML = '<div class="p-20 text-center text-red-400">تعذّر تحميل بيانات الفيلم.</div>';
        return;
    }

    const trailer = movie.videos?.results?.find(v => v.type === 'Trailer') || movie.videos?.results?.[0];
    const cast    = movie.credits?.cast?.slice(0, 8) || [];
    const inList  = isInWatchlist(movie.id);

    content.innerHTML = `
        <div>
            <div id="trailerPlaceholder" class="aspect-video relative overflow-hidden rounded-t-2xl">
                <img src="${TMDB_BACKDROP_BASE}${movie.backdrop_path}" alt="${movie.title}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-[#1a1a24] via-[#1a1a24]/40 to-transparent"></div>
                ${trailer ? `
                <button onclick="playTrailer('${trailer.key}')" class="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/50 smooth-transition">
                    <div class="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center neon-red animate-pulse-glow">
                        <i class="fas fa-play text-2xl mr-[-2px]"></i>
                    </div>
                </button>` : ''}
            </div>
            <div class="p-6 md:p-10 -mt-20 relative z-10">
                <div class="flex flex-col md:flex-row md:items-end gap-6 mb-8">
                    <div class="relative -mt-16 md:-mt-28 flex-shrink-0">
                        <img src="${TMDB_IMAGE_BASE}${movie.poster_path}" class="w-36 md:w-52 rounded-xl shadow-2xl border border-white/10 mx-auto md:mx-0" alt="${movie.title}">
                        <div class="absolute -bottom-3 -left-3 bg-yellow-500 text-black px-3 py-1 rounded-lg font-black italic shadow-xl text-lg">
                            ${(movie.vote_average || 0).toFixed(1)}
                        </div>
                    </div>
                    <div class="flex-1 text-center md:text-right">
                        <h2 class="text-3xl md:text-4xl font-bold mb-1 leading-tight">${movie.title}</h2>
                        <p class="text-gray-400 mb-4 italic text-sm">${movie.original_title}</p>
                        <div class="flex flex-wrap gap-2 justify-center md:justify-start">
                            ${(movie.genres || []).map(g => `<span class="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs font-bold">${g.name}</span>`).join('')}
                            <span class="flex items-center gap-1 text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-300">
                                <i class="fas fa-calendar text-gray-500"></i> ${movie.release_date || '—'}
                            </span>
                            <span class="flex items-center gap-1 text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-300">
                                <i class="fas fa-clock text-gray-500"></i> ${movie.runtime || '—'} دقيقة
                            </span>
                        </div>
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-8">
                    <div class="md:col-span-2 space-y-8">
                        <!-- Overview -->
                        <div class="bg-white/5 p-6 rounded-2xl border border-white/5">
                            <h4 class="font-bold text-xl mb-4 flex items-center gap-2">
                                <div class="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-red-500 rounded-full"></div>
                                قصة الفيلم
                            </h4>
                            <p class="text-gray-300 leading-relaxed text-base">${movie.overview || 'لا يوجد ملخص باللغة العربية.'}</p>
                        </div>

                        <!-- Cast -->
                        ${cast.length ? `
                        <div>
                            <h4 class="font-bold text-xl mb-5">طاقم العمل</h4>
                            <div class="grid grid-cols-4 gap-3">
                                ${cast.map(c => `
                                    <div class="text-center">
                                        <div class="aspect-square rounded-xl overflow-hidden mb-2 border border-white/10">
                                            <img src="${c.profile_path ? TMDB_IMAGE_BASE + c.profile_path : 'https://placehold.co/200x200/1a1a24/666?text=؟'}" class="w-full h-full object-cover" alt="${c.name}">
                                        </div>
                                        <p class="font-bold text-xs truncate">${c.name}</p>
                                        <p class="text-[10px] text-gray-500 truncate">${c.character}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>` : ''}
                    </div>

                    <div class="space-y-4">
                        <!-- Stats -->
                        <div class="bg-black/40 p-5 rounded-2xl border border-white/5">
                            <h4 class="font-bold mb-4 text-purple-400 text-sm uppercase tracking-wider">إحصائيات</h4>
                            <div class="space-y-3">
                                <div class="flex justify-between items-center text-sm">
                                    <span class="text-gray-400">الحالة</span>
                                    <span class="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs font-bold">${movie.status || '—'}</span>
                                </div>
                                <div class="flex justify-between items-center text-sm">
                                    <span class="text-gray-400">الميزانية</span>
                                    <span class="text-yellow-400 font-bold text-xs">${movie.budget ? '$' + (movie.budget/1e6).toFixed(1) + 'M' : 'غير معلوم'}</span>
                                </div>
                                <div class="flex justify-between items-center text-sm">
                                    <span class="text-gray-400">الإيرادات</span>
                                    <span class="text-green-400 font-bold text-xs">${movie.revenue ? '$' + (movie.revenue/1e6).toFixed(1) + 'M' : 'غير معلوم'}</span>
                                </div>
                                <div class="pt-3 border-t border-white/5">
                                    <div class="flex justify-between mb-2 text-sm">
                                        <span class="text-gray-400">تقييم الجمهور</span>
                                        <span class="font-black text-white text-lg">${(movie.vote_average || 0).toFixed(1)}</span>
                                    </div>
                                    <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div class="h-full bg-gradient-to-r from-purple-600 to-red-500 rounded-full transition-all duration-700" style="width:${(movie.vote_average || 0)*10}%"></div>
                                    </div>
                                    <p class="text-[10px] text-gray-500 mt-1">${(movie.vote_count || 0).toLocaleString()} تقييم</p>
                                </div>
                            </div>
                        </div>

                        <!-- Watchlist + Review -->
                        <button id="watchlistBtn" onclick="toggleWatchlist(${movie.id})"
                            class="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold border smooth-transition
                            ${inList ? 'bg-green-600/20 border-green-500/40 text-green-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}">
                            ${inList ? '<i class="fas fa-check"></i> في المفضلة' : '<i class="fas fa-bookmark"></i> أضف للمفضلة'}
                        </button>

                        <div class="bg-gradient-to-br from-purple-900/20 to-transparent p-5 rounded-2xl border border-purple-500/20">
                            <h4 class="font-bold mb-4 text-sm">أضف تقييمك</h4>
                            <div class="flex flex-col gap-3" id="ratingContainer">
                                <input type="text" id="reviewerName" placeholder="اسمك (اختياري)"
                                    class="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500">
                                <textarea id="reviewText" placeholder="اكتب رأيك هنا..." rows="3"
                                    class="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 resize-none"></textarea>
                                <div class="flex gap-2 justify-center py-1" id="userRating">
                                    ${[1,2,3,4,5].map(i => `
                                        <button onclick="setRating(${i})" class="text-2xl text-gray-600 hover:text-yellow-400 smooth-transition hover:scale-110">
                                            <i class="far fa-star"></i>
                                        </button>
                                    `).join('')}
                                </div>
                                <button onclick="submitReview(${movie.id})"
                                    class="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 py-2.5 rounded-xl font-bold smooth-transition">
                                    إرسال التقييم
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    if (autoPlayTrailer && trailer) playTrailer(trailer.key);
}

function playTrailer(key) {
    document.getElementById('trailerPlaceholder').innerHTML = `
        <iframe src="https://www.youtube.com/embed/${key}?autoplay=1"
            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen class="w-full h-full absolute inset-0"></iframe>
    `;
}

function closeModal() {
    document.getElementById('movieModal').classList.remove('active');
    document.body.style.overflow = '';
}

// ─── Rating / Review ────────────────────────────────────────────────────────
function setRating(rating) {
    document.querySelectorAll('#userRating button i').forEach((star, i) => {
        star.className = i < rating ? 'fas fa-star text-yellow-400' : 'far fa-star';
    });
    window.currentSelectedRating = rating * 2;
}

async function submitReview(movieId) {
    if (!window.currentSelectedRating) return alert('برجاء اختيار عدد النجوم أولاً');
    const name = document.getElementById('reviewerName').value.trim() || 'زائر مجهول';
    const text = document.getElementById('reviewText').value.trim();
    const btn  = event.currentTarget;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    btn.disabled  = true;

    const ok = await DB.post('movie_reviews', {
        movie_id: movieId,
        rating: window.currentSelectedRating,
        reviewer_name: name,
        review_text: text,
        created_at: new Date().toISOString()
    });

    if (ok) {
        btn.innerHTML = '<i class="fas fa-check"></i> تم بنجاح!';
        btn.classList.add('bg-green-600');
        setTimeout(() => {
            document.getElementById('ratingContainer').innerHTML =
                '<div class="text-center text-green-400 py-4 font-bold animate-fade-in-up"><i class="fas fa-star ml-2"></i>شكرًا لتقييمك الرائع!</div>';
            loadReviews();
        }, 1500);
    } else {
        btn.innerHTML = 'فشل الإرسال — حاول مجدداً';
        btn.disabled  = false;
    }
}

// ─── Newsletter ─────────────────────────────────────────────────────────────
async function handleNewsletter(event) {
    event.preventDefault();
    const btn   = event.target.querySelector('button[type="submit"]');
    const email = event.target.querySelector('input[type="email"]').value;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled  = true;
    const ok = await DB.post('newsletter', { email, subscribed_at: new Date().toISOString() });
    if (ok) {
        document.getElementById('newsletterForm').classList.add('hidden');
        document.getElementById('newsletterSuccess').classList.remove('hidden');
    } else {
        btn.innerHTML = 'حاول مجدداً';
        btn.disabled  = false;
    }
}

// ─── Search ─────────────────────────────────────────────────────────────────
function setupSearch() {
    const input   = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    let timer;

    input.addEventListener('keydown', async e => {
        if (e.key === 'Enter') {
            const q = input.value.trim();
            if (!q) return;
            results.classList.add('hidden');
            const grid = document.getElementById('newsGrid');
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            grid.innerHTML = '<div class="col-span-full text-center py-20"><i class="fas fa-spinner fa-spin text-4xl text-purple-600"></i></div>';
            const movies = await TMDB.search(q);
            if (movies && movies.length) renderNewsGrid(movies);
            else grid.innerHTML = `<div class="col-span-full text-center py-20 text-gray-500"><i class="fas fa-search text-4xl mb-4 block"></i>لا توجد نتائج لـ "${q}"</div>`;
        }
        if (e.key === 'Escape') results.classList.add('hidden');
    });

    input.addEventListener('input', () => {
        clearTimeout(timer);
        const q = input.value.trim();
        if (q.length < 2) { results.classList.add('hidden'); return; }
        timer = setTimeout(async () => {
            const movies = await TMDB.search(q);
            if (!movies || !movies.length) { results.classList.add('hidden'); return; }
            results.innerHTML = movies.slice(0, 6).map(m => `
                <div class="p-3 hover:bg-white/10 cursor-pointer rounded-xl flex items-center gap-3 smooth-transition" onclick="openMovieModal(${m.id}); document.getElementById('searchResults').classList.add('hidden');">
                    <img src="${m.poster_path ? TMDB_IMAGE_BASE + m.poster_path : 'https://placehold.co/40x60/1a1a24/666?text=؟'}" class="w-10 h-14 object-cover rounded-lg flex-shrink-0">
                    <div class="overflow-hidden">
                        <p class="font-bold text-sm truncate">${m.title}</p>
                        <p class="text-[10px] text-gray-500">${m.release_date ? m.release_date.split('-')[0] : ''} • ⭐ ${(m.vote_average || 0).toFixed(1)}</p>
                    </div>
                </div>
            `).join('');
            results.classList.remove('hidden');
        }, 350);
    });

    document.addEventListener('click', e => {
        if (!input.contains(e.target) && !results.contains(e.target)) results.classList.add('hidden');
    });
}

// ─── Utilities ───────────────────────────────────────────────────────────────
function initLazyLoading() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const img = entry.target;
            img.src   = img.dataset.src;
            img.onload  = () => img.classList.add('loaded');
            img.onerror = () => img.src = 'https://placehold.co/500x750/1a1a24/333?text=N/A';
            observer.unobserve(img);
        });
    }, { rootMargin: '100px' });

    document.querySelectorAll('.lazy-image:not(.loaded)').forEach(img => observer.observe(img));
}

function generateStars(rating) {
    const r = (rating || 0) / 2;
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= r)          stars += '<i class="fas fa-star"></i>';
        else if (i - 0.5 <= r) stars += '<i class="fas fa-star-half-alt"></i>';
        else                 stars += '<i class="far fa-star text-gray-600"></i>';
    }
    return stars;
}

function initScrollEffects() {
    const btt = document.getElementById('backToTop');
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) { btt.classList.replace('opacity-0','opacity-100'); btt.classList.replace('invisible','visible'); }
        else                      { btt.classList.replace('opacity-100','opacity-0'); btt.classList.replace('visible','invisible'); }
        if (window.scrollY > 50) nav.classList.add('bg-black/95','shadow-lg');
        else                     nav.classList.remove('bg-black/95','shadow-lg');
    }, { passive: true });
}

function scrollToTop()     { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
    menu.classList.toggle('animate-fade-in-up');
}

// Close modal on backdrop click
document.addEventListener('click', e => {
    const modal = document.getElementById('movieModal');
    if (e.target === modal) closeModal();
});
// Close modal on Escape key
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ─── Toast Notification System ──────────────────────────────────────────────
(function injectToastContainer() {
    if (document.getElementById('toastContainer')) return;
    const container = document.createElement('div');
    container.id = 'toastContainer';
    document.body.appendChild(container);
})();

/**
 * Show a toast notification.
 * @param {string} message  - Text to display.
 * @param {'success'|'info'|'error'} type - Icon/border colour preset.
 * @param {number} duration - Auto-dismiss in ms (default 3 000).
 */
function showToast(message, type = 'info', duration = 3000) {
    const icons = {
        success : 'fas fa-check-circle text-green-400',
        info    : 'fas fa-info-circle text-purple-400',
        error   : 'fas fa-exclamation-circle text-red-400'
    };
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="${icons[type] || icons.info} text-base flex-shrink-0"></i><span>${message}</span>`;
    container.appendChild(toast);
    // Remove after animation completes
    setTimeout(() => { toast.remove(); }, duration + 350);
}

