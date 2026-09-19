/* =====================================================
   Стройсервис — интерактив сайта
   ===================================================== */

(function () {
    'use strict';

    /* ---------- Progress bar + header scroll ---------- */
    var header = document.getElementById('header');
    var progressBar = document.getElementById('progressBar');

    function onScroll() {
        var scrollY = window.scrollY || window.pageYOffset;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

        if (progressBar) progressBar.style.width = progress + '%';
        if (header) {
            if (scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Hero slider ---------- */
    var slider = document.getElementById('heroSlider');
    var dotsWrap = document.getElementById('heroDots');
    var prevBtn = document.getElementById('heroPrev');
    var nextBtn = document.getElementById('heroNext');

    if (slider) {
        var slides = slider.querySelectorAll('.hero-slide');
        var current = 0;
        var timer = null;
        var intervalTime = 6000;

        slides.forEach(function (_, i) {
            var dot = document.createElement('span');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', function () { goTo(i); restart(); });
            dotsWrap.appendChild(dot);
        });
        var dots = dotsWrap.querySelectorAll('span');

        function goTo(index) {
            slides[current].classList.remove('active');
            dots[current].classList.remove('active');
            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
            dots[current].classList.add('active');
        }

        function restart() {
            clearInterval(timer);
            timer = setInterval(function () { goTo(current + 1); }, intervalTime);
        }

        if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); restart(); });
        if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); restart(); });

        restart();

        /* Keyboard navigation */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') { goTo(current - 1); restart(); }
            if (e.key === 'ArrowRight') { goTo(current + 1); restart(); }
        });
    }

    /* ---------- Mobile menu ---------- */
    var burger = document.getElementById('burger');
    var mobileMenu = document.getElementById('mobileMenu');

    if (burger && mobileMenu) {
        burger.addEventListener('click', function () {
            burger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                burger.classList.remove('open');
                mobileMenu.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    /* ---------- Counters ---------- */
    var counters = document.querySelectorAll('.stat-value[data-target]');

    function animateCounter(el) {
        var target = parseFloat(el.dataset.target);
        var suffix = el.dataset.suffix || '';
        var decimals = parseInt(el.dataset.decimals || '0', 10);
        var duration = 1800;
        var startTime = null;

        function step(ts) {
            if (!startTime) startTime = ts;
            var elapsed = ts - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var value = target * eased;
            el.textContent = value.toFixed(decimals).replace('.', ',') + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    if (counters.length) {
        var statsSection = document.querySelector('.stats');
        var statsStarted = false;
        function checkStats() {
            if (!statsSection || statsStarted) return;
            var rect = statsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight - 60) {
                statsStarted = true;
                counters.forEach(animateCounter);
            }
        }
        window.addEventListener('scroll', checkStats, { passive: true });
        checkStats();
    }

    /* ---------- Reveal / scroll animations ---------- */
    var revealEls = document.querySelectorAll('.js-reveal, .js-scroll');

    function checkReveal() {
        revealEls.forEach(function (el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 30) {
                el.classList.add('visible');
            }
        });
    }
    window.addEventListener('scroll', checkReveal, { passive: true });
    window.addEventListener('load', checkReveal);
    checkReveal();

    /* ---------- Testimonials slider ---------- */
    var testiTrack = document.getElementById('testiTrack');
    if (testiTrack) {
        var cards = testiTrack.querySelectorAll('.testi-card');
        var tIndex = 0;
        var tPrev = document.querySelector('[data-testi="prev"]');
        var tNext = document.querySelector('[data-testi="next"]');

        function tGo(i) {
            tIndex = (i + cards.length) % cards.length;
            testiTrack.style.transform = 'translateX(-' + (tIndex * 100) + '%)';
        }
        if (tPrev) tPrev.addEventListener('click', function () { tGo(tIndex - 1); });
        if (tNext) tNext.addEventListener('click', function () { tGo(tIndex + 1); });
    }

    /* ---------- Objects filter ---------- */
    var filterBtns = document.querySelectorAll('.filter-btn');
    var objectCards = document.querySelectorAll('.object-card');

    if (filterBtns.length) {
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                var filter = btn.dataset.filter;
                objectCards.forEach(function (card) {
                    var cat = card.dataset.category;
                    var show = filter === 'all' || cat === filter;
                    card.style.display = show ? 'block' : 'none';
                    if (show) {
                        card.classList.remove('visible');
                        void card.offsetWidth;
                        card.classList.add('visible');
                    }
                });
            });
        });
    }

    /* ---------- Lightbox ---------- */
    var lightbox = document.getElementById('lightbox');
    if (lightbox) {
        var lbImg = document.getElementById('lbImg');
        var lbItems = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox-src]'));
        var lbIndex = 0;

        function openLb(index) {
            lbIndex = (index + lbItems.length) % lbItems.length;
            lbImg.src = lbItems[lbIndex].dataset.lightboxSrc;
            lightbox.classList.add('open');
            document.body.classList.add('no-scroll');
        }
        function closeLb() {
            lightbox.classList.remove('open');
            document.body.classList.remove('no-scroll');
        }

        lbItems.forEach(function (item, i) {
            item.addEventListener('click', function () { openLb(i); });
        });

        document.getElementById('lbClose').addEventListener('click', closeLb);
        document.getElementById('lbPrev').addEventListener('click', function (e) { e.stopPropagation(); openLb(lbIndex - 1); });
        document.getElementById('lbNext').addEventListener('click', function (e) { e.stopPropagation(); openLb(lbIndex + 1); });
        lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLb();
            if (e.key === 'ArrowLeft') openLb(lbIndex - 1);
            if (e.key === 'ArrowRight') openLb(lbIndex + 1);
        });
    }

    /* ---------- Contact form (demo submit) ---------- */
    var forms = document.querySelectorAll('[data-form]');
    forms.forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var success = document.getElementById('formSuccess');
            if (success) {
                form.style.display = 'none';
                success.classList.add('show');
            } else {
                form.querySelector('[data-submit]').textContent = 'Отправлено!';
            }
        });
    });

    /* ---------- Year in footer ---------- */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

})();