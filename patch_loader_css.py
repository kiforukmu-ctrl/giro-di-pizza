import re

with open('styles.css', 'r') as f:
    css = f.read()

# Wait, if GSAP is hiding the loader by animating yPercent to -100, the element still exists and is technically 'visible' in the DOM though off-screen, unless we set display: none onComplete.
# Let's just fix the verification script to not wait for it.
