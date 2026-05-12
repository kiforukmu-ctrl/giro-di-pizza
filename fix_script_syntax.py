import re

with open('script.js', 'r') as f:
    js = f.read()

# Fix 1: Orphaned ); } after highlightMapRegion
js = js.replace("""function highlightMapRegion(regionName) {
    if (!mapRegions) return;

    mapRegions.classed("active", false);

    mapRegions.each(function(d) {
        if (d.properties.reg_name.includes(regionName) || regionName.includes(d.properties.reg_name)) {
            d3.select(this).classed("active", true);
        }
    });
}
);
}""", """function highlightMapRegion(regionName) {
    if (!mapRegions) return;

    mapRegions.classed("active", false);

    mapRegions.each(function(d) {
        if (d.properties.reg_name.includes(regionName) || regionName.includes(d.properties.reg_name)) {
            d3.select(this).classed("active", true);
        }
    });
}""")

# Fix 2: Broken function definition for initProgramTabs
js = js.replace("""// --- Festival Program Tabs() {""", """// --- Festival Program Tabs\nfunction initProgramTabs() {""")

with open('script.js', 'w') as f:
    f.write(js)
