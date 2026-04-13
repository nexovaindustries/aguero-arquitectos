// ══ AGÜERO ARCHITECTS — Global Engine ════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

    // ══════════════════════════════════════════════════════════════
    // 1. FOOTER
    // ══════════════════════════════════════════════════════════════
    const footerEl = document.createElement('footer');
    footerEl.style.cssText = 'width:100%;border-top:1px solid #e4e4e7;background:#fafafa;margin-top:auto;';
    footerEl.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;
                    padding:3rem 2rem;gap:1.5rem;max-width:1920px;margin:0 auto;">
            <div style="font-size:1.1rem;font-weight:900;text-transform:uppercase;
                        letter-spacing:-0.03em;font-family:'Manrope',sans-serif;">AGÜERO ARCHITECTS</div>
            <div style="display:flex;gap:2rem;">
                <a href="https://www.instagram.com/agueroarchitects/?hl=es-la" target="_blank" class="nav-link">Instagram</a>
                <a href="https://www.facebook.com/AgueroArquitectos"           target="_blank" class="nav-link">Facebook</a>
                <a href="#" class="nav-link">Privacidad</a>
            </div>
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.15em;
                        color:#a1a1aa;font-family:'Manrope',sans-serif;">
                © ${new Date().getFullYear()} AGÜERO ARCHITECTS. ALL RIGHTS RESERVED.
            </div>
        </div>`;
    document.body.appendChild(footerEl);

    // ══════════════════════════════════════════════════════════════
    // 2. SCROLL PROGRESS BAR
    // ══════════════════════════════════════════════════════════════
    const bar = document.createElement('div');
    bar.id = 'scroll-bar';
    document.body.appendChild(bar);
    window.addEventListener('scroll', () => {
        const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
        bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });

    // ══════════════════════════════════════════════════════════════
    // 3. CURSOR — BULLETPROOF
    //
    //  CAUSA DEL BUG ANTERIOR:
    //    body.classList.add('page-transition') aplicaba la animación
    //    CSS "pgFadeIn" que tenía transform:translateY() en body.
    //    Con fill-mode "forwards", body PERMANECÍA con transform:translateY(0)
    //    → todos los hijos position:fixed se posicionaban relativo al body
    //    (no al viewport) → el cursor "se iba" al hacer scroll.
    //
    //  FIX DEFINITIVO:
    //    1. pgFadeIn ya no usa transform (solo opacity) — ver style.css
    //    2. Los elementos del cursor se adjuntan al <html>, NO al <body>.
    //       Así ningún transform en body puede afectarlos jamás.
    //    3. Sin will-change en los elementos del cursor.
    // ══════════════════════════════════════════════════════════════
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    if (!isTouch) {
        const html = document.documentElement; // ← ADJUNTAR A <HTML>, NO A <BODY>

        // Dot
        const dotEl = document.createElement('div');
        dotEl.id = 'cursor-dot';
        html.appendChild(dotEl);

        // Ring con corchetes arquitectónicos
        const ringEl = document.createElement('div');
        ringEl.id = 'cursor-ring';
        ringEl.innerHTML = `
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Crosshair lines -->
            <line x1="26" y1="0"  x2="26" y2="8"  stroke="#ffffff" stroke-width="1"/>
            <line x1="26" y1="44" x2="26" y2="52" stroke="#ffffff" stroke-width="1"/>
            <line x1="0"  y1="26" x2="8"  y2="26" stroke="#ffffff" stroke-width="1"/>
            <line x1="44" y1="26" x2="52" y2="26" stroke="#ffffff" stroke-width="1"/>
            <!-- Outer circle -->
            <circle cx="26" cy="26" r="18" stroke="#ffffff" stroke-width="1.4" fill="none"/>
            <!-- North arrow: filled left half -->
            <polygon points="26,6 20,32 26,27" fill="#ffffff"/>
            <!-- North arrow: outlined right half -->
            <polygon points="26,6 32,32 26,27" stroke="#ffffff" stroke-width="1.2" fill="none"/>
            <!-- N label -->
            <text x="26" y="43" text-anchor="middle" font-family="Georgia,serif" font-size="8" font-weight="bold" fill="#ffffff">N</text>
        </svg>`;
        html.appendChild(ringEl);

        const DOT_HALF  = 3;
        const RING_HALF = 26;
        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let rx = mx, ry = my;
        let rScale = 1, targetScale = 1;
        let dotSize = 6, targetDotSize = 6;

        // Dot: movimiento inmediato (sin lag)
        window.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
            dotEl.style.transform = `translate(${mx - DOT_HALF}px,${my - DOT_HALF}px)`;
        }, { passive: true });

        // Ring + scale: lerp suavizado vía RAF continuo
        (function tick() {
            rx     += (mx          - rx)     * 0.13;
            ry     += (my          - ry)     * 0.13;
            rScale += (targetScale - rScale) * 0.10;
            dotSize+= (targetDotSize - dotSize) * 0.12;
            ringEl.style.transform =
                `translate(${rx - RING_HALF}px,${ry - RING_HALF}px) scale(${rScale})`;
            // Ajustar tamaño del dot sin mover su posición
            const half = dotSize / 2;
            dotEl.style.width  = dotSize + 'px';
            dotEl.style.height = dotSize + 'px';
            dotEl.style.transform = `translate(${mx - half}px,${my - half}px)`;
            requestAnimationFrame(tick);
        })();

        // Hover en links / botones → ring crece, dot crece
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => {
                targetScale   = 1.75;
                targetDotSize = 10;
                const svg = ringEl.querySelector('svg');
                if (svg) svg.style.filter = 'drop-shadow(0 0 8px rgba(255,255,255,1))';
            });
            el.addEventListener('mouseleave', () => {
                targetScale   = 1;
                targetDotSize = 6;
                const svg = ringEl.querySelector('svg');
                if (svg) svg.style.filter = '';
            });
        });

        // Hover en imágenes → ring se contrae
        document.querySelectorAll('img').forEach(el => {
            el.addEventListener('mouseenter', () => { targetScale = 0.55; });
            el.addEventListener('mouseleave', () => { targetScale = 1; });
        });
    }

    // ══════════════════════════════════════════════════════════════
    // 4. GSAP — ANIMACIONES Y EFECTOS
    // ══════════════════════════════════════════════════════════════
    if (typeof gsap === 'undefined') {
        new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                e.target.classList.add('animate-body-fade');
                e.target.classList.remove('opacity-0', 'animate-on-scroll');
                obs.unobserve(e.target);
            });
        }, { threshold: 0.1 }).observe(
            ...document.querySelectorAll('.animate-on-scroll')
        );
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ── Entrada de página: SOLO opacidad — NUNCA transform en body
    gsap.fromTo(document.body,
        { opacity: 0 },
        { opacity: 1, duration: 0.55, ease: 'power2.out', clearProps: 'opacity' }
    );

    // ── Nav shrink al hacer scroll
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    // ── Parallax hero image
    const heroImg = document.querySelector('.h-screen img.absolute, section:first-child img.absolute');
    if (heroImg) {
        gsap.to(heroImg, {
            yPercent: 28, ease: 'none',
            scrollTrigger: {
                trigger: heroImg.closest('section'),
                start: 'top top', end: 'bottom top', scrub: 2
            }
        });
    }

    // ── Parallax imágenes internas (no hero)
    document.querySelectorAll('section .relative img:not(.absolute)').forEach(img => {
        gsap.to(img, {
            y: -35, ease: 'none',
            scrollTrigger: {
                trigger: img.closest('section'),
                start: 'top bottom', end: 'bottom top', scrub: 1.5
            }
        });
    });

    // ── h1 reveal
    document.querySelectorAll('h1').forEach(el => {
        if (el.closest('[style*="animation"]') || el.closest('.animate-fade-in-up')) return;
        gsap.fromTo(el,
            { yPercent: 100, opacity: 0, skewY: 3 },
            { yPercent: 0, opacity: 1, skewY: 0, duration: 1.3, ease: 'power4.out',
              scrollTrigger: { trigger: el, start: 'top 92%', once: true } }
        );
    });

    // ── h2 / h3 slide
    document.querySelectorAll('h2, h3').forEach(el => {
        gsap.fromTo(el,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
        );
    });

    // ── Imágenes: clip-path + scale reveal (desktop only — avoid clipping on mobile)
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
        document.querySelectorAll('.overflow-hidden').forEach(wrap => {
            if (wrap.closest('.project-hover-img, nav, #arch-preloader')) return;
            const img = wrap.querySelector('img');
            if (!img) return;
            gsap.fromTo(wrap,
                { clipPath: 'inset(14% 6% 14% 6%)' },
                { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power3.out',
                  scrollTrigger: { trigger: wrap, start: 'top 87%', once: true } }
            );
            gsap.fromTo(img,
                { scale: 1.14, opacity: 0.5 },
                { scale: 1, opacity: 1, duration: 2.1, ease: 'power3.out',
                  scrollTrigger: { trigger: wrap, start: 'top 87%', once: true } }
            );
        });
    }

    // ── Párrafos
    document.querySelectorAll('p').forEach(el => {
        if (el.closest('.animate-fade-in-up, .animate-on-scroll')) return;
        gsap.fromTo(el,
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 93%', once: true } }
        );
    });

    // ── Project items
    const projectItems = document.querySelectorAll('.project-item');
    if (projectItems.length) {
        gsap.fromTo(projectItems,
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.9, ease: 'power2.out', stagger: 0.08,
              scrollTrigger: { trigger: projectItems[0], start: 'top 88%', once: true } }
        );
    }

    // ── Letter-spacing hover en project items
    projectItems.forEach(item => {
        const h = item.querySelector('h3');
        if (!h) return;
        item.addEventListener('mouseenter', () =>
            gsap.to(h, { letterSpacing: '0.05em', duration: 0.4, ease: 'power2.out' })
        );
        item.addEventListener('mouseleave', () =>
            gsap.to(h, { letterSpacing: '-0.05em', duration: 0.4, ease: 'power2.out' })
        );
    });

    // ── Animate-on-scroll
    document.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
        gsap.fromTo(el,
            { y: 65, opacity: 0, scale: 0.97 },
            { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out',
              delay: (i % 3) * 0.13,
              scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
        );
    });

    // ── Bento / valores
    const bentoCells = document.querySelectorAll('.trigger-hover');
    if (bentoCells.length) {
        gsap.fromTo(bentoCells,
            { y: 50, opacity: 0, scale: 0.93 },
            { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out', stagger: 0.14,
              scrollTrigger: { trigger: bentoCells[0], start: 'top 85%', once: true } }
        );
    }

    // ── Índice de proyectos
    document.querySelectorAll('.group.py-8').forEach((el, i) => {
        gsap.fromTo(el,
            { x: 55, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: i * 0.07,
              scrollTrigger: { trigger: el, start: 'top 90%', once: true } }
        );
    });

    // ── Tilt 3D y botones magnéticos solo en desktop
    if (!isMobile) {
        document.querySelectorAll('[class*="col-span"] .overflow-hidden').forEach(card => {
            const img = card.querySelector('img');
            if (!img) return;
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const xP = (e.clientX - r.left) / r.width  - 0.5;
                const yP = (e.clientY - r.top)  / r.height - 0.5;
                gsap.to(card, { rotateY: xP * 9, rotateX: -yP * 9, transformPerspective: 700, duration: 0.35, ease: 'power2.out' });
                gsap.to(img,  { x: xP * 7, y: yP * 7, duration: 0.35, ease: 'power2.out' });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'power3.out' });
                gsap.to(img,  { x: 0, y: 0, duration: 0.7, ease: 'power3.out' });
            });
        });

        document.querySelectorAll('a.inline-block, a[class*="px-12"], button[type="submit"]').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const r = btn.getBoundingClientRect();
                gsap.to(btn, {
                    x: (e.clientX - r.left - r.width  / 2) * 0.27,
                    y: (e.clientY - r.top  - r.height / 2) * 0.27,
                    duration: 0.35, ease: 'power2.out'
                });
            });
            btn.addEventListener('mouseleave', () =>
                gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
            );
        });
    }

    // ── Stats count-up
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = +el.dataset.count;
        const obj = { v: 0 };
        gsap.to(obj, {
            v: target, duration: 2.5, ease: 'power2.out',
            onUpdate() { el.textContent = Math.round(obj.v); },
            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        });
    });

    // ── Marquee
    document.querySelectorAll('.marquee-track').forEach(t => { t.innerHTML += t.innerHTML; });

    // ══════════════════════════════════════════════════════════════
    // 5. MOBILE MENU — Full-screen slide-in overlay
    // ══════════════════════════════════════════════════════════════
    const menuBtn = document.querySelector('nav button.md\\:hidden, nav button:not([class*="md:"])');
    if (menuBtn) {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Build overlay
        const overlay = document.createElement('div');
        overlay.id = 'mobile-menu-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.innerHTML = `
            <div id="mobile-menu-inner">
                <button id="mobile-menu-close" aria-label="Cerrar menú">
                    <span class="material-symbols-outlined">close</span>
                </button>
                <nav id="mobile-menu-nav">
                    <a href="index.html"      class="mob-link${currentPage === 'index.html'      ? ' mob-active' : ''}">Inicio</a>
                    <a href="proyectos.html"  class="mob-link${currentPage === 'proyectos.html'  ? ' mob-active' : ''}">Proyectos</a>
                    <a href="servicios.html"  class="mob-link${currentPage === 'servicios.html'  ? ' mob-active' : ''}">Servicios</a>
                    <a href="nosotros.html"   class="mob-link${currentPage === 'nosotros.html'   ? ' mob-active' : ''}">Sobre Nosotros</a>
                    <a href="contacto.html"   class="mob-link${currentPage === 'contacto.html'   ? ' mob-active' : ''}">Contacto</a>
                </nav>
                <div id="mobile-menu-socials">
                    <a href="https://www.instagram.com/agueroarchitects/?hl=es-la" target="_blank">Instagram</a>
                    <a href="https://www.facebook.com/AgueroArquitectos" target="_blank">Facebook</a>
                </div>
            </div>
        `;

        // Inject styles
        const style = document.createElement('style');
        style.textContent = `
            #mobile-menu-overlay {
                position: fixed;
                inset: 0;
                z-index: 9998;
                background: #0a0a0a;
                display: flex;
                flex-direction: column;
                justify-content: center;
                transform: translateX(100%);
                transition: transform 0.55s cubic-bezier(0.77,0,0.175,1);
                pointer-events: none;
                overflow: hidden;
            }
            #mobile-menu-overlay.is-open {
                transform: translateX(0);
                pointer-events: auto;
            }
            #mobile-menu-inner {
                padding: 2rem 2.5rem;
                display: flex;
                flex-direction: column;
                height: 100%;
                justify-content: center;
                position: relative;
            }
            #mobile-menu-close {
                position: absolute;
                top: 1.5rem;
                right: 1.5rem;
                background: none;
                border: none;
                cursor: pointer;
                padding: 0.5rem;
                color: #fff;
                line-height: 1;
            }
            #mobile-menu-close .material-symbols-outlined {
                font-size: 2rem;
            }
            #mobile-menu-nav {
                display: flex;
                flex-direction: column;
                gap: 0;
            }
            .mob-link {
                display: block;
                font-family: 'Manrope', sans-serif;
                font-size: clamp(2.2rem, 9vw, 4.5rem);
                font-weight: 900;
                letter-spacing: -0.04em;
                text-transform: uppercase;
                color: rgba(255,255,255,0.75);
                text-decoration: none;
                padding: 0.6rem 0;
                border-bottom: 1px solid rgba(255,255,255,0.07);
                opacity: 0;
                transform: translateX(50px);
                transition: opacity 0.4s ease, transform 0.4s ease, color 0.2s ease;
            }
            .mob-link:hover { color: #E8B84B; }
            .mob-link.mob-active { color: #E8B84B; }
            #mobile-menu-overlay.is-open .mob-link {
                opacity: 1;
                transform: translateX(0);
            }
            #mobile-menu-overlay.is-open .mob-link:nth-child(1) { transition-delay: 0.12s; }
            #mobile-menu-overlay.is-open .mob-link:nth-child(2) { transition-delay: 0.19s; }
            #mobile-menu-overlay.is-open .mob-link:nth-child(3) { transition-delay: 0.26s; }
            #mobile-menu-overlay.is-open .mob-link:nth-child(4) { transition-delay: 0.33s; }
            #mobile-menu-overlay.is-open .mob-link:nth-child(5) { transition-delay: 0.40s; }
            #mobile-menu-socials {
                margin-top: 3rem;
                display: flex;
                gap: 2rem;
            }
            #mobile-menu-socials a {
                font-family: 'Manrope', sans-serif;
                font-size: 0.65rem;
                letter-spacing: 0.22em;
                text-transform: uppercase;
                color: rgba(255,255,255,0.4);
                text-decoration: none;
                transition: color 0.2s;
            }
            #mobile-menu-socials a:hover { color: #E8B84B; }
            /* Decorative corner */
            #mobile-menu-overlay::before {
                content: '';
                position: absolute;
                bottom: -8rem;
                right: -8rem;
                width: 22rem;
                height: 22rem;
                border: 1px solid rgba(232,184,75,0.08);
                transform: rotate(45deg);
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
        document.documentElement.appendChild(overlay);

        let menuOpen = false;

        function openMenu() {
            menuOpen = true;
            overlay.classList.add('is-open');
            overlay.setAttribute('aria-hidden', 'false');
            menuBtn.querySelector('.material-symbols-outlined').textContent = 'close';
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            menuOpen = false;
            overlay.classList.remove('is-open');
            overlay.setAttribute('aria-hidden', 'true');
            menuBtn.querySelector('.material-symbols-outlined').textContent = 'menu';
            document.body.style.overflow = '';
        }

        menuBtn.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
        document.getElementById('mobile-menu-close').addEventListener('click', closeMenu);

        // Close on link click
        overlay.querySelectorAll('.mob-link').forEach(a => {
            a.addEventListener('click', closeMenu);
        });

        // Close on Escape key
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && menuOpen) closeMenu();
        });
    }

    // ══════════════════════════════════════════════════════════════
    // 6. WHATSAPP FLOATING BUTTON
    // ══════════════════════════════════════════════════════════════
    const waBtn = document.createElement('a');
    waBtn.id        = 'wa-float-btn';
    waBtn.href      = 'https://wa.me/51975813687';
    waBtn.target    = '_blank';
    waBtn.rel       = 'noopener noreferrer';
    waBtn.setAttribute('aria-label', 'Contactar por WhatsApp');
    waBtn.innerHTML = `
        <svg id="wa-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.1 1.518 5.82L.057 23.428a.5.5 0 00.615.615l5.608-1.461A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.003-1.371l-.358-.213-3.724.97.993-3.619-.234-.372A9.795 9.795 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
        </svg>
        <span id="wa-label">WhatsApp</span>
    `;

    const waStyle = document.createElement('style');
    waStyle.textContent = `
        #wa-float-btn {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            z-index: 9000;
            display: flex;
            align-items: center;
            gap: 0.65rem;
            background: #111;
            color: #fff;
            border: 1px solid rgba(255,255,255,0.12);
            padding: 0.75rem 1.2rem 0.75rem 1rem;
            text-decoration: none;
            font-family: 'Manrope', sans-serif;
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            cursor: pointer;
            transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 4px 24px rgba(0,0,0,0.35);
        }
        #wa-float-btn:hover {
            background: #E8B84B;
            border-color: #E8B84B;
            color: #000;
            transform: translateY(-3px);
            box-shadow: 0 8px 32px rgba(232,184,75,0.35);
        }
        #wa-float-btn #wa-icon {
            width: 1.1rem;
            height: 1.1rem;
            flex-shrink: 0;
            transition: color 0.3s ease;
        }
        @media (max-width: 640px) {
            #wa-float-btn {
                bottom: 1.25rem;
                right: 1.25rem;
                padding: 0.7rem;
            }
            #wa-label { display: none; }
            #wa-float-btn #wa-icon { width: 1.3rem; height: 1.3rem; }
        }
    `;
    document.head.appendChild(waStyle);
    document.documentElement.appendChild(waBtn);

    // ══════════════════════════════════════════════════════════════
    // 7. TRANSICIÓN DE PÁGINA — SOLO OPACIDAD

    //    NUNCA usar transform/y en body (rompe position:fixed del cursor)
    // ══════════════════════════════════════════════════════════════
    document.body.classList.add('page-transition');

    document.querySelectorAll('a[href]:not([target="_blank"])').forEach(link => {
        link.addEventListener('click', e => {
            const href = e.currentTarget.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('http')) {
                e.preventDefault();
                gsap.to(document.body, {
                    opacity: 0, duration: 0.3, ease: 'power2.in',
                    onComplete: () => { window.location.href = href; }
                });
            }
        });
    });

});
