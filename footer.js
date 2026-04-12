document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Global Footer
    const footerHTML = `
    <footer class="w-full border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 mt-auto transition-colors duration-300">
        <div class="flex flex-col md:flex-row justify-between items-center px-8 py-12 w-full gap-6 max-w-[1920px] mx-auto">
            <div class="text-lg font-black text-black dark:text-white uppercase tracking-tighter font-headline">AGÜERO ARCHITECTS</div>
            <div class="flex gap-8">
                <a href="https://www.instagram.com/agueroarchitects/?hl=es-la" target="_blank" class="nav-link">Instagram</a>
                <a href="https://www.facebook.com/AgueroArquitectos" target="_blank" class="nav-link">Facebook</a>
                <a href="#" class="nav-link">Privacidad</a>
            </div>
            <div class="font-manrope tracking-[0.05em] uppercase text-[10px] text-zinc-400 dark:text-zinc-600">
                © ${new Date().getFullYear()} AGÜERO ARCHITECTS. ALL RIGHTS RESERVED.
            </div>
        </div>
    </footer>
    `;
    
    // Create a wrapper for footer if it doesn't exist, else append just before closing body
    const footerContainer = document.createElement('div');
    footerContainer.innerHTML = footerHTML;
    document.body.appendChild(footerContainer.firstElementChild);

    // 2. Intersection Observer for fade-in animations on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply a distinct elegant animation for titles vs bodies
                const isTitle = entry.target.tagName.match(/^H[1-6]$/i) || !!entry.target.querySelector('h1, h2, h3, h4, h5, h6') || entry.target.classList.contains('font-headline');
                
                if (isTitle) {
                    entry.target.classList.add('animate-title-reveal');
                } else {
                    entry.target.classList.add('animate-body-fade');
                }
                
                entry.target.classList.remove('opacity-0', 'animate-on-scroll');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate on scroll (anything with 'animate-on-scroll' class or standard sections)
    const animateElements = document.querySelectorAll('.animate-on-scroll, section:not(:first-child)');
    animateElements.forEach(el => {
        el.classList.add('opacity-0'); // ensure it's hidden initially before scroll
        scrollObserver.observe(el);
    });

    // 3. Mobile Menu Toggle Logic
    const menuBtn = document.querySelector('nav button');
    const navLinks = document.querySelector('nav .hidden.md\\:flex'); // Escape the selector
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
             navLinks.classList.toggle('hidden');
             navLinks.classList.toggle('flex');
             navLinks.classList.toggle('flex-col');
             navLinks.classList.toggle('absolute');
             navLinks.classList.toggle('top-full');
             navLinks.classList.toggle('left-0');
             navLinks.classList.toggle('w-full');
             navLinks.classList.toggle('bg-white');
             navLinks.classList.toggle('dark:bg-black');
             navLinks.classList.toggle('p-8');
             navLinks.classList.toggle('gap-6');
        });
    }

    // Add page transition class to body for smooth initial load
    document.body.classList.add('page-transition');

    // Fast Cross-page simple transition
    const internalLinks = document.querySelectorAll('a[href]:not([target="_blank"])');
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = e.currentTarget.getAttribute('href');
            
            if (target && !target.startsWith('#') && !target.startsWith('http')) {
                e.preventDefault();
                
                // Add a swift slide + fade out effect before unmounting the old page
                document.body.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.2, 1, 0.3, 1)';
                document.body.style.opacity = '0';
                document.body.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    window.location.href = target;
                }, 300);
            }
        });
    });
});

