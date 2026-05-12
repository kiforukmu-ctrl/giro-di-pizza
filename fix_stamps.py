import re

with open('styles.css', 'r') as f:
    css = f.read()

stamp_css = """
.stamp-light { color: var(--warm-cream); border-color: var(--warm-cream); }
.stamp-dark { color: var(--dark-wood); border-color: var(--dark-wood); }
.stamp-olive { color: var(--olive-green); border-color: var(--olive-green); }
.stamp-terracotta { color: var(--tomato-red); border-color: var(--tomato-red); }
.stamp-light-olive { color: var(--olive-green); border-color: var(--olive-green); }
.stamp-light-brick { color: var(--deep-brick); border-color: var(--deep-brick); }
"""

if "stamp-light" not in css:
    css += stamp_css

with open('styles.css', 'w') as f:
    f.write(css)
