/* ==========================================================================
   Giro di Pizza - Interactive Logic & Animations
   Optimized for Performance and Stability
   ========================================================================== */

// --- Data ---
const pizzaData = {
    "Campania": {
        num: "No. 01", type: "Pizza Napoletana", stamp: "Дровяная печь", color: "var(--tomato-red)",
        ingredients: "томаты Сан-Марцано · моцарелла · базилик", desc: "Ритуал огня и абсолютной простоты."
    },
    "Lazio": {
        num: "No. 02", type: "Pizza al Taglio", stamp: "Римский хруст", color: "var(--olive-green)",
        ingredients: "хрустящее тесто · масло · сезонные начинки", desc: "Ритм городской улицы."
    },
    "Sicilia": {
        num: "No. 03", type: "Sfincione", stamp: "Рынок Палермо", color: "var(--deep-brick)",
        ingredients: "томат · лук · анчоусы · крошки", desc: "Насыщенный южный вкус."
    },
    "Puglia": {
        num: "No. 04", type: "Focaccia Barese", stamp: "Южное солнце", color: "var(--baked-dough)",
        ingredients: "томаты черри · оливки · морская соль", desc: "Мягкая внутри, хрустящая снаружи."
    },
    "Liguria": {
        num: "No. 05", type: "Sardenaira", stamp: "Прибрежный вкус", color: "var(--basil-green)",
        ingredients: "масло · чеснок · травы · анчоусы", desc: "Элегантная простота побережья."
    },
    "Toscana": {
        num: "No. 06", type: "Schiacciata", stamp: "Деревенское тесто", color: "var(--terracotta-shadow)",
        ingredients: "розмарин · масло · морская соль", desc: "Сдержанность и аромат трав."
    },
    "Emilia-Romagna": {
        num: "No. 07", type: "Piadina", stamp: "Теплая лепешка", color: "var(--tomato-red)",
        ingredients: "прошутто · руккола · мягкий сыр", desc: "Уют Эмилии-Романьи."
    },
    "Calabria": { num: "No. 08", type: "Pizza Calabrese", stamp: "Южный огонь", color: "var(--deep-brick)", ingredients: "ндуйя · перец · томаты", desc: "Острый южный характер." },
    "Veneto": { num: "No. 09", type: "Pizza Veneta", stamp: "Северный стиль", color: "var(--olive-green)", ingredients: "радиккьо · сыр Азиаго", desc: "Мягкая горчинка." },
    "Lombardia": { num: "No. 10", type: "Pizza Milanese", stamp: "Милан", color: "var(--baked-dough)", ingredients: "пышная основа · сыр", desc: "Сдержанный северный стиль." },
    "Piemonte": { num: "No. 11", type: "Pizza al Padellino", stamp: "Турин", color: "var(--tomato-red)", ingredients: "мягкое тесто · томаты", desc: "Туринская пицца на сковороде." },
    "Sardegna": { num: "No. 12", type: "Panada", stamp: "Остров", color: "var(--terracotta-shadow)", ingredients: "мясо · шафран", desc: "Закрытая деревенская выпечка." },
    "Abruzzo": { num: "No. 13", type: "Pizza Abruzzese", stamp: "Горы", color: "var(--basil-green)", ingredients: "пекорино · трюфель", desc: "Лесной аромат." },
    "Marche": { num: "No. 14", type: "Pizza Rossini", stamp: "Пезаро", color: "var(--olive-green)", ingredients: "маргарита · яйцо", desc: "Локальная классика." },
    "Umbria": { num: "No. 15", type: "Torta al Testo", stamp: "Традиция", color: "var(--baked-dough)", ingredients: "лепешка · зелень", desc: "Лепешка на камне." },
    "Trentino-Alto Adige": { num: "No. 16", type: "Pizza Speck", stamp: "Альпы", color: "var(--tomato-red)", ingredients: "спек · горгонзола", desc: "Альпийский рецепт." },
    "Friuli-Venezia Giulia": { num: "No. 17", type: "San Daniele", stamp: "Прошутто", color: "var(--deep-brick)", ingredients: "прошутто · руккола", desc: "Ломтики прошутто на основе." },
    "Basilicata": { num: "No. 18", type: "Schiacciata Lucana", stamp: "Круско", color: "var(--olive-green)", ingredients: "перец круско · чеснок", desc: "Выпечка с сушеным перцем." },
    "Molise": { num: "No. 19", type: "Di Grandinye", stamp: "Рустика", color: "var(--baked-dough)", ingredients: "мука · качокавалло", desc: "Рустикальная пицца." },
    "Valle d'Aosta": { num: "No. 20", type: "Valdostana", stamp: "Горы", color: "var(--terracotta-shadow)", ingredients: "сыр фонтина · ветчина", desc: "Горный рецепт." }
};

// --- Global Variables ---
let mapSvg, mapProjection, mapPath, mapRegions;
const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.innerWidth <= 768;

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    // Only register GSAP if reduced motion is false
    if (!isReducedMotion) {
        gsap.registerPlugin(ScrollTrigger);
    }

    initLoader();
    initMap();
    initAtlas();
    initProgramTabs();

    // Ensure all images are loaded before initializing complex scroll triggers
    Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => {
        if (!isReducedMotion) {
            initScrollAnimations();
            initMagneticButtons();
            initHeaderThemeLogic();
            ScrollTrigger.refresh();
        }
    });
});

// Refresh ScrollTrigger on window resize to prevent broken layouts
window.addEventListener('resize', () => {
    if (!isReducedMotion) {
        // Debounce refresh
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    }
});

// --- Loader & Intro Sequence ---
function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    if (isReducedMotion) {
        loader.style.display = 'none';
        return;
    }

    const tl = gsap.timeline();

    tl.to("#loader-bar", { width: "100%", duration: 1, ease: "power2.inOut" })
      .to("#loader", { yPercent: -100, duration: 0.8, ease: "power3.inOut", delay: 0.1 })
      .add("heroReveal", "-=0.4")

      // Hero reveal
      .from(".hero-bg-img", { scale: 1.1, duration: 1.5, ease: "power2.out" }, "heroReveal")
      .from(".hero-title .word", { y: "100%", duration: 0.8, stagger: 0.05, ease: "power3.out" }, "heroReveal")
      .from(".reveal-text", { opacity: 0, y: 15, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "heroReveal+=0.2");
}

// --- Header Theme Logic ---
function initHeaderThemeLogic() {
    const header = document.getElementById('header');
    if (!header) return;

    // Change header theme based on section background
    document.querySelectorAll('[data-header-theme]').forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: "top 80px", // Offset by header height
            end: "bottom 80px",
            onEnter: () => setHeaderTheme(section.dataset.headerTheme),
            onEnterBack: () => setHeaderTheme(section.dataset.headerTheme),
        });
    });

    function setHeaderTheme(theme) {
        if (theme === 'dark') {
            header.classList.remove('header--light');
            header.classList.add('header--dark');
        } else {
            header.classList.remove('header--dark');
            header.classList.add('header--light');
        }
    }

    // Hide/Show on scroll direction
    const showAnim = gsap.from(header, {
      yPercent: -100,
      paused: true,
      duration: 0.3,
      ease: "power2.out"
    }).progress(1);

    ScrollTrigger.create({
      start: "top top",
      end: 99999,
      onUpdate: (self) => {
        if (self.direction === -1) { showAnim.play(); } // scrolling up
        else if (self.direction === 1 && self.scrollY > 150) { showAnim.reverse(); } // scrolling down
      }
    });
}

// --- Magnetic Buttons ---
function initMagneticButtons() {
    if (isMobile) return; // Disable on touch devices

    const magnets = document.querySelectorAll('.magnetic-btn');

    magnets.forEach(magnet => {
        const strength = magnet.getAttribute('data-strength') || 15;

        magnet.addEventListener('mousemove', (e) => {
            const bounding = magnet.getBoundingClientRect();
            const mouseX = e.clientX - bounding.left;
            const mouseY = e.clientY - bounding.top;

            gsap.to(magnet, {
                x: ((mouseX / bounding.width) - 0.5) * strength,
                y: ((mouseY / bounding.height) - 0.5) * strength,
                ease: "power2.out",
                duration: 0.3
            });
        });

        magnet.addEventListener('mouseleave', () => {
            gsap.to(magnet, { x: 0, y: 0, ease: "elastic.out(1, 0.3)", duration: 0.7 });
        });
    });
}

// --- D3 Interactive Map ---
function initMap() {
    const container = document.getElementById('d3-map-container');
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 800;

    mapSvg = d3.select("#d3-map-container")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "100%");

    mapProjection = d3.geoAlbers()
        .center([12.5, 42])
        .rotate([0, 0])
        .parallels([35, 47])
        .scale(width * 4)
        .translate([width / 2, height / 2]);

    mapPath = d3.geoPath().projection(mapProjection);

    d3.json("https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_regions.geojson")
      .then(function(italy) {

        mapRegions = mapSvg.selectAll("path")
            .data(italy.features)
            .enter()
            .append("path")
            .attr("d", mapPath)
            .attr("class", "region")
            // .attr("id", d => "map-" + d.properties.reg_name.replace(/[^a-zA-Z0-9]/g, '-')) // Optional, not strictly needed
            .on("click", handleRegionClick);

        // Map intro animation (only if not reduced motion)
        if (!isReducedMotion) {
            ScrollTrigger.create({
                trigger: ".section-map",
                start: "top 70%",
                onEnter: () => {
                    gsap.fromTo(mapRegions.nodes(),
                        { opacity: 0 },
                        { opacity: 1, duration: 0.5, stagger: 0.01, ease: "power1.out" }
                    );
                },
                once: true
            });
        }

    }).catch(err => console.error("Map loading error:", err));
}

function handleRegionClick(event, d) {
    const regionName = d.properties.reg_name;
    highlightMapRegion(regionName);
    updatePassportCard(regionName);
}

function highlightMapRegion(regionName) {
    if (!mapRegions) return;

    mapRegions.classed("active", false);

    mapRegions.each(function(d) {
        if (d.properties.reg_name.includes(regionName) || regionName.includes(d.properties.reg_name)) {
            d3.select(this).classed("active", true);
            // Optimization: avoid appendChild (DOM manipulation) on hover/scroll if possible.
            // Only do it on click or if necessary for z-index layering.
        }
    });
}

function updatePassportCard(rawRegionName) {
    const card = document.getElementById("region-passport");

    // Loose matching
    let data = pizzaData[rawRegionName];
    let regionName = rawRegionName;
    if (!data) {
        for (let key in pizzaData) {
            if (rawRegionName.includes(key) || key.includes(rawRegionName)) {
                data = pizzaData[key];
                regionName = key;
                break;
            }
        }
    }

    if(!data) return;

    if (isReducedMotion) {
        setCardData(data, regionName);
    } else {
        gsap.to(card, {
            opacity: 0.5, scale: 0.98, duration: 0.15, ease: "power1.in",
            onComplete: () => {
                setCardData(data, regionName);
                gsap.to(card, { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out" });
            }
        });
    }
}

function setCardData(data, regionName) {
    document.getElementById("passport-num").textContent = data.num;
    document.getElementById("passport-region").textContent = regionName;
    document.getElementById("passport-pizza").textContent = data.type;
    document.getElementById("passport-ingredients").textContent = data.ingredients;
    document.getElementById("passport-stamp").textContent = data.stamp;

    const icon = document.querySelector(".passport-stamp-icon svg path");
    if(icon) icon.setAttribute("fill", data.color);
}

// --- Pizza Atlas (Horizontal Scroll) ---
function initAtlas() {
    const track = document.getElementById("atlas-track");
    if (!track) return;

    let html = '';
    for (const [region, data] of Object.entries(pizzaData)) {
        html += `
            <div class="atlas-card">
                <div class="atlas-card-head">
                    <span class="atlas-reg font-sans">${region}</span>
                    <span class="atlas-no font-display italic">${data.num.replace('No. ', '')}</span>
                </div>
                <h3 class="atlas-card-title font-display">${data.type}</h3>
                <p class="atlas-card-ing font-text italic">${data.ingredients}</p>
                <div class="atlas-card-stamp font-sans" style="border-color:${data.color}; color:${data.color}">${data.stamp}</div>
            </div>
        `;
    }
    track.innerHTML = html;

    // Horizontal Scroll via ScrollTrigger - Disable on mobile
    if (!isMobile && !isReducedMotion) {
        gsap.to(track, {
            x: () => -(track.scrollWidth - document.querySelector('.atlas-horizontal-scroll').clientWidth) + "px",
            ease: "none",
            scrollTrigger: {
                trigger: ".section-atlas",
                pin: true,
                scrub: 1,
                start: "center center",
                end: () => "+=" + track.scrollWidth,
                invalidateOnRefresh: true
            }
        });
    }
}

// --- Festival Program Tabs ---
function initProgramTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.program-day');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');

            if (!isReducedMotion) {
                gsap.from(`#${targetId} .menu-item`, {
                    y: 10, opacity: 0, duration: 0.3, stagger: 0.05, ease: "power1.out"
                });
            }
        });
    });
}

// --- Advanced Scroll Animations ---
function initScrollAnimations() {

    // Parallax Images
    gsap.utils.toArray('.prlx-img').forEach(img => {
        gsap.to(img, {
            yPercent: 15,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true }
        });
    });

    gsap.utils.toArray('.prlx-img-slow').forEach(img => {
        gsap.to(img, {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true }
        });
    });

    // Image Reveals (Wipe effect)
    gsap.utils.toArray('.img-reveal-wrapper').forEach(wrapper => {
        const overlay = document.createElement('div');
        overlay.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:var(--warm-cream); z-index:2; transform-origin:top;";
        wrapper.appendChild(overlay);
        wrapper.style.position = "relative";

        gsap.to(overlay, {
            scaleY: 0,
            duration: 1,
            ease: "power2.inOut",
            scrollTrigger: { trigger: wrapper, start: "top 75%" }
        });
    });

    // Route Mechanic: Sync Map with Regional Journey
    const chapters = document.querySelectorAll('.chapter-spread');
    chapters.forEach(chapter => {
        const regionName = chapter.querySelector('.chapter-region').textContent.split(',')[0].trim();

        ScrollTrigger.create({
            trigger: chapter,
            start: "top center",
            end: "bottom center",
            onEnter: () => { highlightMapRegion(regionName); updatePassportCard(regionName); },
            onEnterBack: () => { highlightMapRegion(regionName); updatePassportCard(regionName); }
        });
    });
}
