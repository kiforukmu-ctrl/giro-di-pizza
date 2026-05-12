import re

with open('styles.css', 'r') as f:
    css = f.read()

# Make sure grid layouts have no empty halves
css = re.sub(r'\.chapter-spread\s*{[^}]+}',
    '.chapter-spread { display: grid; grid-template-columns: 1fr 1fr; width: 100%; overflow: hidden; align-items: stretch; }\n.chapter-content { display: flex; flex-direction: column; justify-content: center; padding: clamp(48px, 6vw, 96px); height: 100%; }\n.chapter-image { height: 100%; position: relative; }',
    css)

with open('styles.css', 'w') as f:
    f.write(css)
