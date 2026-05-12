import re

with open('styles.css', 'r') as f:
    css = f.read()

# Make sure .img-wrapper fills the space
css += '''
.img-wrapper { width: 100%; height: 100%; position: relative; overflow: hidden; }
.img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
'''

with open('styles.css', 'w') as f:
    f.write(css)
