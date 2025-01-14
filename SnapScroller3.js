<script>
    document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    function isInElementorEditor() {
    return (
    body.classList.contains('elementor-editor-active') ||
    body.classList.contains('e-route-panel-editor-layout')
    );
}

    function checkElementorEditor() {
    if (isInElementorEditor()) {
    body.style.overflow = 'visible';
} else {
    body.style.overflow = 'hidden';
}
}

    checkElementorEditor();

    const observer = new MutationObserver(() => {
    checkElementorEditor();
});

    observer.observe(body, {attributes: true, attributeFilter: ['class']});

    const dots = document.querySelectorAll('.dot');
    const sections = document.querySelectorAll('.section');
    let currentSection = 0;
    let isScrolling = false;
    let lastScrollTime = 0;
    const SCROLL_DELAY = 1000;
    const DELTA_THRESHOLD = 10;

    function updateDots(index) {
    dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === index);
});
}

    function smoothScrollToSection(sectionIndex) {
    isScrolling = true;
    sections[sectionIndex].scrollIntoView({behavior: 'smooth'});
    updateDots(sectionIndex);
    localStorage.setItem('currentSection', sectionIndex); // ذخیره شماره سکشن فعلی
    setTimeout(() => {
    isScrolling = false;
}, 800);
}

    function restoreScrollPosition() {
    const savedSectionIndex = parseInt(localStorage.getItem('currentSection'), 10);

    if (!isNaN(savedSectionIndex) && savedSectionIndex >= 0 && savedSectionIndex < sections.length) {
    currentSection = savedSectionIndex;
    sections[currentSection].scrollIntoView({behavior: 'auto'}); // اسکرول به سکشن ذخیره‌شده
    updateDots(currentSection);
}
}

    window.addEventListener(
    'wheel',
    (event) => {
    const now = new Date().getTime();

    if (now - lastScrollTime < SCROLL_DELAY) return;
    if (Math.abs(event.deltaY) < DELTA_THRESHOLD) return;

    lastScrollTime = now;

    if (!isScrolling) {
    if (event.deltaY > 0 && currentSection < sections.length - 1) {
    currentSection++;
} else if (event.deltaY < 0 && currentSection > 0) {
    currentSection--;
}
    smoothScrollToSection(currentSection);
}
},
{passive: false}
    );

    let startY;

    window.addEventListener('touchstart', (event) => {
    startY = event.touches[0].clientY;
});

    window.addEventListener('touchmove', (event) => {
    const deltaY = event.touches[0].clientY - startY;

    if (Math.abs(deltaY) > 50 && !isScrolling) {
    if (deltaY > 50 && currentSection > 0) {
    currentSection--;
    smoothScrollToSection(currentSection);
} else if (deltaY < -50 && currentSection < sections.length - 1) {
    currentSection++;
    smoothScrollToSection(currentSection);
}
    startY = event.touches[0].clientY;
}
});

    dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
    currentSection = idx;
    smoothScrollToSection(currentSection);
});
});

    window.addEventListener('scroll', () => {
    if (isScrolling) return;

    let closestSectionIndex = 0;
    let minDistance = Infinity;

    sections.forEach((section, index) => {
    const distance = Math.abs(section.getBoundingClientRect().top);
    if (distance < minDistance) {
    minDistance = distance;
    closestSectionIndex = index;
}
});

    if (closestSectionIndex !== currentSection) {
    currentSection = closestSectionIndex;
    updateDots(currentSection);
    localStorage.setItem('currentSection', currentSection); // ذخیره سکشن فعلی هنگام اسکرول
}
});

    // بازیابی موقعیت اسکرول هنگام بارگذاری صفحه
    restoreScrollPosition();
});
</script>