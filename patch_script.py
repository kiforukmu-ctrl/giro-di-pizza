import re

with open('script.js', 'r') as f:
    js = f.read()

# 1. Remove custom cursor completely
js = re.sub(r'function initCustomCursor\(\) \{.*?(?=// ---)', '', js, flags=re.DOTALL)
js = re.sub(r'initCustomCursor\(\);', '', js)

# 2. Fix the horizontal scroll function (remove GSAP pinning for Atlas)
new_atlas = """
// --- Pizza Atlas (Standard Horizontal Scroll/Swipe) ---
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
}
"""
js = re.sub(r'// --- Pizza Atlas.*?function initProgramTabs', new_atlas + '\n// --- Festival Program Tabs', js, flags=re.DOTALL)

# 3. Optimize D3 Hover interactions (no DOM changes like appendChild)
new_highlight = """
function highlightMapRegion(regionName) {
    if (!mapRegions) return;

    mapRegions.classed("active", false);

    mapRegions.each(function(d) {
        if (d.properties.reg_name.includes(regionName) || regionName.includes(d.properties.reg_name)) {
            d3.select(this).classed("active", true);
        }
    });
}
"""
js = re.sub(r'function highlightMapRegion\([^}]+}[^}]+}', new_highlight, js)

with open('script.js', 'w') as f:
    f.write(js)
