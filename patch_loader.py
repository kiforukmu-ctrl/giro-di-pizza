import re

with open('script.js', 'r') as f:
    js = f.read()

js = re.sub(r'function initLoader\(\) \{ document\.getElementById\("loader"\)\.style\.display = "none"; \}',
"""function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    if (isReducedMotion) {
        loader.style.display = 'none';
        return;
    }

    const tl = gsap.timeline();

    tl.to("#loader-bar", { width: "100%", duration: 1, ease: "power2.inOut" })
      .to("#loader", { yPercent: -100, duration: 0.8, ease: "power3.inOut", delay: 0.1, onComplete: () => { document.getElementById('loader').style.display = 'none'; } })
      .add("heroReveal", "-=0.4")

      // Hero reveal
      .from(".hero-bg-img", { scale: 1.1, duration: 1.5, ease: "power2.out" }, "heroReveal")
      .from(".hero-title .word", { y: "100%", duration: 0.8, stagger: 0.05, ease: "power3.out" }, "heroReveal")
      .from(".reveal-text", { opacity: 0, y: 15, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "heroReveal+=0.2");
}""", js)

with open('script.js', 'w') as f:
    f.write(js)
