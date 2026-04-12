// preloader.js
(function() {
    if (sessionStorage.getItem('arquitectura_preloader_seen')) return;
    sessionStorage.setItem('arquitectura_preloader_seen', 'true');

    const style = document.createElement('style');
    style.innerHTML = `
        #arch-preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: #050505; /* Deep rich black for better LED contrast */
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: opacity 0.6s cubic-bezier(0.2, 1, 0.3, 1), transform 0.6s cubic-bezier(0.2, 1, 0.3, 1);
        }
        .arch-preloader-hidden {
            opacity: 0;
            transform: scale(1.1); /* Zoom effect out */
            pointer-events: none;
        }
        
        /* 3D LED Glow */
        .arch-svg {
            filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
        }
        .arch-svg path {
            fill: none;
            stroke-linejoin: round;
            stroke-linecap: round;
        }

        /* Terreno / Grid */
        .terrain path {
            stroke: rgba(255, 255, 255, 0.25);
            stroke-width: 1;
        }
        /* Fierros / Rebar */
        .rebar path {
            stroke: rgba(255, 255, 255, 0.9);
            stroke-width: 1.5;
        }
        
        /* Muros / Walls */
        .wall-l {
            fill: rgba(255, 255, 255, 0.95);
            clip-path: inset(100% 0 0 0);
        }
        .wall-r {
            fill: rgba(255, 255, 255, 0.45);
            clip-path: inset(100% 0 0 0);
        }

        /* Drawing Animation for Terrain only */
        .draw-line path {
            stroke-dasharray: 600;
            stroke-dashoffset: 600;
            animation: drawPath 0.5s cubic-bezier(0.2, 1, 0.3, 1) forwards;
        }
        @keyframes drawPath {
            to { stroke-dashoffset: 0; }
        }

        /* Rebar Drop Animation */
        .rebar {
            opacity: 0;
            transform: translateY(-200px);
            animation: dropIn 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes dropIn {
            0% { transform: translateY(-300px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(0); opacity: 1; }
        }

        /* Wall Vaciado (Pouring from top to bottom) */
        .wall-l {
            fill: rgba(255, 255, 255, 0.95);
            clip-path: inset(0 0 100% 0);
        }
        .wall-r {
            fill: rgba(255, 255, 255, 0.45);
            clip-path: inset(0 0 100% 0);
        }
        .fill-wall {
            animation: fillWallPour 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes fillWallPour {
            to { clip-path: inset(0 0 0 0); }
        }

        /* Timing Sequencing */
        .delay-0 path { animation-delay: 0.0s; } /* Terrain */
        
        /* Fierros caen (Fingers drop) */
        .delay-1 { animation-delay: 0.15s; } /* F1 Rebar */
        .delay-2 { animation-delay: 0.25s; } /* F2 Rebar */
        .delay-3 { animation-delay: 0.35s; } /* F3 Rebar */
        
        /* Concreto se vacía (Concrete pours) */
        .delay-4 { animation-delay: 0.65s; } /* F1 Walls */
        .delay-5 { animation-delay: 0.80s; } /* F2 Walls */
        .delay-6 { animation-delay: 0.95s; } /* F3 Walls */

        body.preloader-active {
            overflow: hidden;
            height: 100vh;
        }
    `;
    document.head.appendChild(style);

    const svgHTML = `
        <div id="arch-preloader">
            <svg class="arch-svg" width="300" height="300" viewBox="0 0 300 300">
                <!-- TERRENO 3D -->
                <g class="terrain draw-line delay-0">
                    <path d="M 150 240 L 50 190 L 150 140 L 250 190 Z" />
                    <path d="M 150 260 L 10 190 L 150 120 L 290 190 Z" />
                    <path d="M 50 190 L 250 190" />
                    <path d="M 150 260 L 150 120" />
                </g>
                
                <!-- FIERROS -->
                <!-- F1 -->
                <g class="rebar draw-line delay-1">
                    <path d="M 150 220 L 150 180 M 90 190 L 90 150 M 210 190 L 210 150 M 150 160 L 150 120"/>
                    <path d="M 150 180 L 90 150 L 150 120 L 210 150 Z" />
                </g>
                <!-- F2 -->
                <g class="rebar draw-line delay-2">
                    <path d="M 150 180 L 150 140 M 90 150 L 90 110 M 210 150 L 210 110 M 150 120 L 150 80"/>
                    <path d="M 150 140 L 90 110 L 150 80 L 210 110 Z" />
                </g>
                <!-- F3 -->
                <g class="rebar draw-line delay-3">
                    <path d="M 150 140 L 150 100 M 90 110 L 90 70 M 210 110 L 210 70 M 150 80 L 150 40"/>
                    <path d="M 150 100 L 90 70 L 150 40 L 210 70 Z" />
                </g>

                <!-- MUROS -->
                <g class="walls">
                    <polygon class="wall-l fill-wall delay-4" points="150,220 90,190 90,150 150,180" />
                    <polygon class="wall-r fill-wall delay-4" points="150,220 210,190 210,150 150,180" />
                    
                    <polygon class="wall-l fill-wall delay-5" points="150,180 90,150 90,110 150,140" />
                    <polygon class="wall-r fill-wall delay-5" points="150,180 210,150 210,110 150,140" />
                    
                    <polygon class="wall-l fill-wall delay-6" points="150,140 90,110 90,70 150,100" />
                    <polygon class="wall-r fill-wall delay-6" points="150,140 210,110 210,70 150,100" />
                </g>
            </svg>
        </div>
    `;
    
    const insertPreloader = () => {
        document.body.classList.add('preloader-active');
        document.body.insertAdjacentHTML('afterbegin', svgHTML);
        
        // Final animation triggers at 0.80s and lasts 0.40s (1.20s total)
        // We give an extra 300ms buffer then execute hide
        setTimeout(() => {
            const preloader = document.getElementById('arch-preloader');
            if(preloader) {
                preloader.classList.add('arch-preloader-hidden');
                document.body.classList.remove('preloader-active');
                
                setTimeout(() => {
                    preloader.remove();
                }, 600); 
            }
        }, 1500); 
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertPreloader);
    } else {
        insertPreloader();
    }
})();
