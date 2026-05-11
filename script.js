const pizzaData = {
    "Campania": { type: "Pizza Napoletana", ingredients: "Томаты Сан-Марцано, Моцарелла, Базилик", desc: "Классика из Неаполя." },
    "Lazio": { type: "Pizza al Taglio", ingredients: "Хрустящее тесто, Масло, Топпинги", desc: "Римская прямоугольная пицца." },
    "Sicilia": { type: "Sfincione", ingredients: "Томатный соус, Лук, Анчоусы", desc: "Толстое пористое тесто Палермо." },
    "Piemonte": { type: "Al Padellino", ingredients: "Мягкое тесто, Томаты, Сыр", desc: "Туринская круглая пицца." },
    "Liguria": { type: "Sardenaira", ingredients: "Томаты, Чеснок, Оливки, Анчоусы", desc: "Лигурийская классика без сыра." },
    "Puglia": { type: "Focaccia Barese", ingredients: "Тесто, Помидоры черри, Оливки", desc: "Хрустящие края, томаты в тесте." },
    "Toscana": { type: "Schiacciata", ingredients: "Масло, Морская соль, Розмарин", desc: "Плоский хлеб." },
    "Emilia-Romagna": { type: "Piadina", ingredients: "Лепешка, Прошутто, Рукола", desc: "Горячая лепешка Эмилии-Романьи." },
    "Sardegna": { type: "Panada", ingredients: "Мясо или Угорь, Шафран", desc: "Закрытый пирог-пицца." },
    "Veneto": { type: "Pizza Veneta", ingredients: "Радиккьо, Азиаго", desc: "Венецианская элегантность." },
    "Lombardia": { type: "Milanese", ingredients: "Пышное тесто, Моцарелла", desc: "Запеченная в сковороде." },
    "Calabria": { type: "Calabrese", ingredients: "Ндуйя, Перец, Томаты", desc: "Огненный вкус юга." },
    "Marche": { type: "Rossini", ingredients: "Маргарита, Яйцо, Майонез", desc: "Оригинальная пицца Пезаро." },
    "Abruzzo": { type: "Pizza Abruzzese", ingredients: "Трюфель, Сыр Пекорино", desc: "Лесной аромат." },
    "Umbria": { type: "Torta al Testo", ingredients: "Колбасы, Зелень", desc: "Лепешка на камне." },
    "Trentino-Alto Adige": { type: "Pizza Speck", ingredients: "Спек, Горгонзола", desc: "Альпийский рецепт." },
    "Friuli-Venezia Giulia": { type: "San Daniele", ingredients: "Прошутто, Рукола", desc: "Ломтики прошутто на основе." },
    "Basilicata": { type: "Schiacciata Lucana", ingredients: "Перец Круско, Чеснок", desc: "Выпечка с сушеным перцем." },
    "Molise": { type: "Di Grandinye", ingredients: "Мука, Качокавалло", desc: "Рустикальная пицца." },
    "Valle d'Aosta": { type: "Valdostana", ingredients: "Сыр Фонтина, Ветчина", desc: "Горный рецепт." }
};

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
    const tl = gsap.timeline();
    tl.to(".loader-title", { opacity: 1, y: 0, duration: 1, ease: "power2.out" })
      .to(".loader-subtitle", { opacity: 1, duration: 0.5 }, "-=0.5")
      .to(".loader", { yPercent: -100, duration: 0.8, ease: "power4.inOut", delay: 0.5 })
      .from(".hero-content", { y: 50, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.3");

    initMap();
    initTasteCards();
});

gsap.to(".parallax-bg", { yPercent: 20, ease: "none", scrollTrigger: { trigger: ".section-hero", start: "top top", end: "bottom top", scrub: true } });

let lastScroll = 0;
window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    const header = document.querySelector(".editorial-header");
    if (currentScroll > lastScroll && currentScroll > 100) { gsap.to(header, { yPercent: -100, duration: 0.3 }); }
    else { gsap.to(header, { yPercent: 0, duration: 0.3 }); }
    lastScroll = currentScroll;
});

gsap.utils.toArray('.journey-item').forEach((item, i) => {
    const img = item.querySelector('.journey-image img');
    const text = item.querySelector('.journey-text');
    gsap.to(img, { yPercent: 15, ease: "none", scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(text, { y: 50, opacity: 0, duration: 1, scrollTrigger: { trigger: item, start: "top 70%" } });
});

function initTasteCards() {
    const track = document.querySelector(".cards-track");
    const cards = gsap.utils.toArray(".taste-card");
    cards.forEach(card => { card.style.setProperty('--rand', Math.random()); });
    gsap.to(track, { x: () => -(track.scrollWidth - document.documentElement.clientWidth) + "px", ease: "none", scrollTrigger: { trigger: ".section-cards", pin: true, scrub: 1, start: "center center", end: () => "+=" + track.scrollWidth } });
}

const width = 800;
const height = 800;
function initMap() {
    const svg = d3.select("#d3-map-container").append("svg").attr("viewBox", `0 0 ${width} ${height}`).attr("preserveAspectRatio", "xMidYMid meet").style("width", "100%").style("height", "100%");
    const projection = d3.geoAlbers().center([12.5, 42]).rotate([0, 0]).parallels([35, 47]).scale(3800).translate([width / 2, height / 2]);
    const path = d3.geoPath().projection(projection);

    // Важно: теперь карта загружается по прямой ссылке из интернета!
    d3.json("https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_regions.geojson").then(function(italy) {
        const regions = svg.selectAll("path").data(italy.features).enter().append("path").attr("d", path).attr("class", "region").attr("id", d => d.properties.reg_name).on("mouseenter", handleMouseEnter).on("click", handleClick);
        ScrollTrigger.create({ trigger: ".section-map", start: "top 60%", onEnter: () => { gsap.fromTo(regions.nodes(), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: "power2.out" }); }, once: true });
    }).catch(err => console.error("Map loading error:", err));
}

function handleMouseEnter(event, d) { if(!d3.select(this).classed("active")) { this.parentNode.appendChild(this); } }

let regionCounter = 1;
function handleClick(event, d) {
    const regionEl = d3.select(this);
    const svg = d3.select("#d3-map-container svg");
    svg.selectAll(".region").classed("active", false);
    regionEl.classed("active", true);
    this.parentNode.appendChild(this);
    updateVintageCard(d.properties.reg_name);
}

function updateVintageCard(regionName) {
    const card = document.getElementById("region-card");
    const numEl = document.querySelector(".region-number");
    const titleEl = document.getElementById("region-title");
    const typeEl = document.getElementById("pizza-type");
    const ingEl = document.getElementById("pizza-ingredients");
    const descEl = document.getElementById("pizza-desc");
    let data = pizzaData[regionName];
    if (!data) { for (let key in pizzaData) { if (regionName.includes(key) || key.includes(regionName)) { data = pizzaData[key]; break; } } }
    if(!data) { data = { type: "Tradizione Locale", ingredients: "Сыры, Масло", desc: "Местный рецепт." }; }

    gsap.to(card, {
        rotationY: 90, duration: 0.3, ease: "power1.in",
        onComplete: () => {
            regionCounter++;
            numEl.textContent = `No. ${regionCounter.toString().padStart(2, '0')}`;
            titleEl.textContent = regionName;
            typeEl.textContent = data.type;
            ingEl.textContent = data.ingredients;
            descEl.textContent = data.desc;
            gsap.to(card, { rotationY: 0, duration: 0.4, ease: "back.out(1.5)" });
        }
    });
}