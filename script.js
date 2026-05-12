/* ==========================================================================
   Giro di Pizza - Interactive Logic & Animations
   Using GSAP, ScrollTrigger, and D3.js
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
    "Umbria": { num: "No. 15", type: "Torta al Testo", stamp: "Традиция", color: "var(--baked-dough)", ingredients: "лепешка · зелень", desc: "Лепешка на камне." }
};

// --- Initialization ---
gsap.registerPlugin(ScrollTrigger);

let mapSvg, mapProjection, mapPath, mapRegions;

document.addEventListener("DOMContentLoaded", () => {
    initCursor();
    initLoader();
    initMap();
    initAtlas();
    initProgramTabs();

    // Defer heavy animations slightly
    setTimeout(() => {
        initScrollAnimations();
        initMagneticButtons();
    }, 100);
});

// --- Loader & Intro Sequence ---
function initLoader() {
    const tl = gsap.timeline();

    tl.to("#loader-bar", { width: "100%", duration: 1.5, ease: "power2.inOut" })
      .to("#loader", { yPercent: -100, duration: 1, ease: "power4.inOut", delay: 0.2 })
      .add("heroReveal", "-=0.5")

      // Hero reveal
      .from(".hero-bg-img", { scale: 1.2, duration: 2, ease: "power2.out" }, "heroReveal")
      .from(".hero-title .word", { y: "100%", duration: 1, stagger: 0.1, ease: "power3.out" }, "heroReveal")
      .from(".reveal-text", { opacity: 0, y: 20, duration: 1, stagger: 0.1, ease: "power2.out" }, "heroReveal+=0.3");
}

// --- Custom Cursor ---
function initCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    // Check if device supports hover
    if (window.matchMedia("(pointer: coarse)").matches) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    const speed = 0.2;

    window.addEventListener("mousemove", e => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    gsap.ticker.add(() => {
        const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
        pos.x += (mouse.x - pos.x) * dt;
        pos.y += (mouse.y - pos.y) * dt;
        gsap.set(cursor, { x: pos.x, y: pos.y });
    });

    // Hover states
    document.querySelectorAll('a, button, .magnetic-btn').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover-btn'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover-btn'));
    });

    const mapContainer = document.getElementById('d3-map-container');
    if (mapContainer) {
        mapContainer.addEventListener('mouseenter', () => cursor.classList.add('hover-map'));
        mapContainer.addEventListener('mouseleave', () => cursor.classList.remove('hover-map'));
    }
}

// --- Magnetic Buttons ---
function initMagneticButtons() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const magnets = document.querySelectorAll('.magnetic-btn');

    magnets.forEach(magnet => {
        const strength = magnet.getAttribute('data-strength') || 20;

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

        // Add subtle shadow filter
        const defs = mapSvg.append("defs");
        const filter = defs.append("filter").attr("id", "drop-shadow").attr("height", "130%");
        filter.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", 3).attr("result", "blur");
        filter.append("feOffset").attr("dx", 2).attr("dy", 5).attr("result", "offsetBlur");
        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "offsetBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        mapRegions = mapSvg.selectAll("path")
            .data(italy.features)
            .enter()
            .append("path")
            .attr("d", mapPath)
            .attr("class", "region")
            .attr("id", d => "map-" + d.properties.reg_name.replace(/[^a-zA-Z0-9]/g, '-'))
            .style("filter", "url(#drop-shadow)")
            .on("mouseenter", handleRegionHover)
            .on("click", handleRegionClick);

        // Map intro animation
        ScrollTrigger.create({
            trigger: ".section-map",
            start: "top 70%",
            onEnter: () => {
                gsap.fromTo(mapRegions.nodes(),
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: "power2.out" }
                );
            },
            once: true
        });

    }).catch(err => console.error("Map loading error:", err));
}

function handleRegionHover(event, d) {
    if(!d3.select(this).classed("active")) {
        this.parentNode.appendChild(this); // Bring to front
    }
}

function handleRegionClick(event, d) {
    const regionName = d.properties.reg_name;
    highlightMapRegion(regionName);
    updatePassportCard(regionName);
}

function highlightMapRegion(regionName) {
    if (!mapRegions) return;

    mapRegions.classed("active", false);

    let matchedPath = null;
    mapRegions.each(function(d) {
        if (d.properties.reg_name.includes(regionName) || regionName.includes(d.properties.reg_name)) {
            matchedPath = this;
        }
    });

    if (matchedPath) {
        d3.select(matchedPath).classed("active", true);
        matchedPath.parentNode.appendChild(matchedPath);
    }
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

    if(!data) return; // Ignore if no data

    // Animate card content change
    gsap.to(card, {
        opacity: 0, y: 10, duration: 0.2, ease: "power1.in",
        onComplete: () => {
            document.getElementById("passport-num").textContent = data.num;
            document.getElementById("passport-region").textContent = regionName;
            document.getElementById("passport-pizza").textContent = data.type;
            document.getElementById("passport-ingredients").textContent = data.ingredients;
            document.getElementById("passport-stamp").textContent = data.stamp;

            // Optional: Change icon color based on region
            const icon = document.querySelector(".passport-stamp-icon svg path");
            if(icon) icon.setAttribute("fill", data.color);

            gsap.to(card, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
        }
    });
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

    // Horizontal Scroll via ScrollTrigger
    if (window.innerWidth > 1024) {
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

            // Small reveal animation for items
            gsap.from(`#${targetId} .menu-item`, {
                y: 10, opacity: 0, duration: 0.4, stagger: 0.05, ease: "power2.out"
            });
        });
    });
}

// --- Advanced Scroll Animations ---
function initScrollAnimations() {

    // Header hide/show on scroll direction
    const showAnim = gsap.from('.editorial-header', {
      yPercent: -100,
      paused: true,
      duration: 0.3
    }).progress(1);

    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        if (self.direction === -1) { showAnim.play(); } // scrolling up
        else if (self.direction === 1 && self.scrollY > 100) { showAnim.reverse(); } // scrolling down
      }
    });

    // Parallax Images
    gsap.utils.toArray('.prlx-img').forEach(img => {
        gsap.to(img, {
            yPercent: 15,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true }
        });
    });

    // Slower Parallax for Chefs
    gsap.utils.toArray('.prlx-img-slow').forEach(img => {
        gsap.to(img, {
            yPercent: 10,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true }
        });
    });

    // Image Reveals (Wipe effect)
    gsap.utils.toArray('.img-reveal-wrapper').forEach(wrapper => {
        // Create an overlay div
        const overlay = document.createElement('div');
        overlay.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:var(--dark-wood); z-index:2; transform-origin:bottom;";
        wrapper.appendChild(overlay);
        wrapper.style.position = "relative";

        gsap.to(overlay, {
            scaleY: 0,
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: { trigger: wrapper, start: "top 80%" }
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
