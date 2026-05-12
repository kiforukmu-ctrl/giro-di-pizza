import re

with open('styles.css', 'r') as f:
    css = f.read()

# Add missing width: 100% and proper flex layout for .header-inner
css += '''
.editorial-header { display: flex; justify-content: center; width: 100%; padding: 1.5rem 5vw; }
.header-inner { width: 100%; max-width: var(--container-max); display: flex; justify-content: space-between; align-items: center; }
.header-left, .header-right { flex: 1; }
.header-center { flex: 2; text-align: center; }
.header-right { text-align: right; }
'''

with open('styles.css', 'w') as f:
    f.write(css)
