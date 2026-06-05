document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    // ۱. هندل کردن اسکرول نرم زمان کلیک روی نوبار ثابت
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if(targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 40, // ایجاد فضای خالی مناسب تا منوی بالا
                    behavior: 'smooth'
                });
            }
        });
    });

    // ۲. سیستم ScrollSpy هوشمند (تشخیص خودکار موقعیت اسکرول و فعال‌سازی آیتم نوبار مربوطه)
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // محدوده طلایی برای فعال شدن زمان رسیدن به وسط صفحه
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // پاک کردن وضعیت فعال قبلی
                navLinks.forEach(link => link.classList.remove('active'));
                
                // پیدا کردن و روشن کردن آیتم متناظر در منو
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-item[href="#${id}"]`);
                if(activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // ۳. قابلیت آکاردئونی بخش تجربیات تدریس (TA) به صورت پیش‌فرض باز و بسته شونده
    const taItems = document.querySelectorAll('.ta-header');
    taItems.forEach(header => {
        header.addEventListener('click', function() {
            const parent = this.parentElement;
            const icon = this.querySelector('.toggle-icon');
            
            // اگر از قبل باز است، آن را ببندد
            if(parent.classList.contains('active-ta')) {
                parent.classList.remove('active-ta');
                // حذف بخش بادی در صورتی که ساختار داینامیک کامل‌تر شود، در اینجا صرفا استایل تغییر می‌کند
                icon.textContent = '+';
            } else {
                // بقیه آیتم‌ها را ببندد
                document.querySelectorAll('.ta-item').forEach(item => {
                    item.classList.remove('active-ta');
                    const ti = item.querySelector('.toggle-icon');
                    if(ti) ti.textContent = '+';
                });
                // آیتم کلیک شده را باز کند
                parent.classList.add('active-ta');
                icon.textContent = '×';
            }
        });
    });// این تکه کد را به انتهای کدهای داخل فایل script.js (قبل از بسته شدن پرانتز آخر DOMContentLoaded) اضافه کنید:

// سیستم هوشمند تشخیص نزدیک شدن موس به لبه سمت راست صفحه
window.addEventListener('mousemove', (e) => {
    // محاسبه فاصله موس تا داخلی‌ترین لبه سمت راست مرورگر
    const distanceFromRight = window.innerWidth - e.clientX;
    
    // اگر موس در محدوده ۴۰ پیکسلی لبه راست بود، اسکرول‌بار ظاهر شود
    if (distanceFromRight <= 40) {
        document.documentElement.classList.add('show-scrollbar');
    } else {
        document.documentElement.classList.remove('show-scrollbar');
    }
});
});
