import re

with open('styles.css', 'r') as f:
    css = f.read()

# Fix header mix-blend-mode issue
css = re.sub(r'mix-blend-mode: difference;', '/* Removed mix-blend-mode for Tilda compatibility */', css)
css = re.sub(r'mix-blend-mode:\s*exclusion;', '/* Removed mix-blend-mode for Tilda compatibility */', css)
css = re.sub(r'\.editorial-header\s*{[^}]+}',
    '.editorial-header { position: fixed; top: 0; left: 0; width: 100%; padding: 1.5rem 5vw; display: flex; justify-content: center; z-index: var(--z-header); transition: background-color 0.4s var(--ease-out-expo), color 0.4s var(--ease-out-expo), transform 0.4s var(--ease-out-expo); }',
    css)

# Fix horizontal scroll (remove pinning specifics if they were there, and ensure overflow-x: auto)
css = re.sub(r'\.atlas-horizontal-scroll\s*{[^}]+}',
    '.atlas-horizontal-scroll { width: 100%; padding-top: 2rem; padding-bottom: 4rem; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; }\n.atlas-horizontal-scroll::-webkit-scrollbar { display: none; }',
    css)
css = re.sub(r'\.atlas-card\s*{', '.atlas-card { scroll-snap-align: start; flex-shrink: 0; ', css)

# Fix 100svh minimum height
css = re.sub(r'\.section-hero\s*{[^}]+}',
    '.section-hero { position: relative; min-height: 100svh; display: flex; align-items: flex-end; padding: var(--section-pad); padding-bottom: 8vw; overflow: hidden; }',
    css)

# Replace broken image styling (add is-img-error class styling)
css += '''
/* --- Image Fallbacks --- */
.is-img-error img { display: none !important; }
.img-fallback { display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: var(--baked-dough); color: var(--dark-wood); align-items: center; justify-content: center; text-align: center; padding: 1rem; }
.is-img-error .img-fallback { display: flex; }
'''

with open('styles.css', 'w') as f:
    f.write(css)
