<script>
    document.addEventListener('DOMContentLoaded', () => {
        const dots = document.querySelectorAll('.dot'); // انتخاب نقاط ناوبری
        const sections = document.querySelectorAll('.section'); // انتخاب بخش‌های صفحه
        let currentSection = 0; // شاخص بخش فعلی
        let isScrolling = false; // پرچم برای بررسی در حال اسکرول بودن

        // تابع برای به‌روزرسانی وضعیت نقاط
        function updateDots(index) {
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === index); // فعال‌سازی نقطه مربوط به بخش فعلی
            });
        }

        // تابع برای اسکرول نرم به سکشن
        function smoothScrollToSection(sectionIndex) {
            isScrolling = true;
            sections[sectionIndex].scrollIntoView({ behavior: 'smooth' });
            updateDots(sectionIndex); // به‌روزرسانی نقطه‌ها بعد از اسکرول
            setTimeout(() => { // زمان کوتاه برای پایان اسکرول
                isScrolling = false;
            }, 800);
        }

        // تابع برای مدیریت اسکرول لمسی
        let startY;

        window.addEventListener('touchstart', (event) => {
            startY = event.touches[0].clientY; // دریافت موقعیت شروع لمس
        });

        window.addEventListener('touchmove', (event) => {
            const deltaY = event.touches[0].clientY - startY; // محاسبه تغییرات در محور Y

            if (Math.abs(deltaY) > 50 && !isScrolling) { // فقط در صورت نیاز
                if (deltaY > 50 && currentSection > 0) { // اگر حرکت به سمت بالا باشد
                    currentSection--; // کاهش شاخص بخش
                    smoothScrollToSection(currentSection); // اسکرول به بخش بالا
                } else if (deltaY < -50 && currentSection < sections.length - 1) { // اگر حرکت به سمت پایین باشد
                    currentSection++; // افزایش شاخص بخش
                    smoothScrollToSection(currentSection); // اسکرول به بخش پایین
                }
                startY = event.touches[0].clientY; // به‌روزرسانی موقعیت شروع
            }
        });

        // مدیریت اسکرول با چرخ ماوس
        window.addEventListener('wheel', (event) => {
            event.preventDefault(); // جلوگیری از اسکرول پیش‌فرض

            if (!isScrolling) {
                if (event.deltaY > 0 && currentSection < sections.length - 1) { // اگر چرخ به سمت پایین باشد
                    currentSection++; // افزایش شاخص بخش
                    smoothScrollToSection(currentSection); // اسکرول به بخش پایین
                } else if (event.deltaY < 0 && currentSection > 0) { // اگر چرخ به سمت بالا باشد
                    currentSection--; // کاهش شاخص بخش
                    smoothScrollToSection(currentSection); // اسکرول به بخش بالا
                }
            }
        }, { passive: false }); // جلوگیری از رفتار پیش‌فرض

        // مدیریت کلیک بر روی نقاط ناوبری
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                currentSection = idx; // به‌روزرسانی بخش فعلی
                smoothScrollToSection(currentSection); // اسکرول به بخش مربوطه
            });
        });
    });
</script>
