/* ── Supabase Configuration ── */
const SUPABASE_URL = "https://jruemtkygzzawawrqdbe.supabase.co"; // تم إضافة رابط مشروعك هنا
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpydWVtdGt5Z3p6YXdhd3JxZGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMjEwMzksImV4cCI6MjA5NTg5NzAzOX0.A490V8Lb527lg0EojAhGpynuZWuwEEIezc8i1kZzh7E"; // تم إضافة المفتاح

let supabaseClient = null;
if (typeof supabase !== 'undefined') {
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (error) {
        console.warn("Supabase Client Init Error: يرجى إضافة روابط وبيانات صحيحة", error.message);
    }
}

    let span = document.querySelector(".Up");
    let progressBar = document.querySelector(".progress-bar");
    let cards = document.querySelectorAll(".product-card");
    
    function checkCards() {
        let scrollTop = window.scrollY;
        let documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        let progress = (scrollTop / documentHeight) * 100;
        
        if (progressBar) {
            progressBar.style.width = progress + "%";
        }
        
        cards.forEach(function(card) {
            // قيس مسافة الكارت من أعلى الشاشة
            let cardTop = card.getBoundingClientRect().top;
            
            // حدد نقطة الظهور (مثلاً عند 85% من ارتفاع الشاشة الحالي)
            let triggerPoint = window.innerHeight * 0.85;
            
            if (cardTop < triggerPoint) {
                card.classList.add("active"); // اظهر الكارت
            } else {
                card.classList.remove("active"); // اختياري: اخفيه تاني لو المستخدم طلع لفوق
            }
        });
        
        if (span) {
            if(window.scrollY > 1000){
                span.classList.add("show");
            }
            else{
                span.classList.remove("show");
            }
        }
    }

    // فحص الكروت عند تحميل الصفحة لضمان ظهور الكروت المرئية مباشرة دون الحاجة للتمرير أولاً
    checkCards();

    // تشغيل الفحص عند التمرير
    window.onscroll = checkCards;
    
    if (span) {
        span.onclick=function()
        {
            window.scrollTo({
                top:0,
                behavior:"smooth"
            });
        }
    }
    // تفعيل التقييم بالنجوم لكل كارد بشكل مستقل (Per-Card Isolated Star Rating)
    // تفعيل التقييم بالنجوم لكل كارد بشكل مستقل (Per-Card Isolated Star Rating)
    function initStarRatings() {
        let starContainers = document.querySelectorAll(".stars, .stars-container");
        starContainers.forEach(function(container) {
            let stars = container.querySelectorAll(".star");
            stars.forEach(function(star, index) {
                // إذا لم يكن هناك data-index، يتم إضافته تلقائياً بناءً على موقعه
                if (!star.getAttribute("data-index")) {
                    star.setAttribute("data-index", index + 1);
                }
                
                star.style.cursor = "pointer";

                star.onclick = function() {
                    let clickedIndex = parseInt(this.getAttribute("data-index"));
                    
                    // تعديل كلاسات النجوم لهذا الكارد المعين فقط
                    stars.forEach(function(s) {
                        let starIndex = parseInt(s.getAttribute("data-index"));
                        if (starIndex <= clickedIndex) {
                            s.classList.add("glow");
                            s.classList.remove("filled"); // إزالة filled لتفادي تعارض اللون الأصفر مع النيون الأخضر
                            s.classList.remove("half");
                        } else {
                            s.classList.remove("glow");
                            s.classList.remove("filled");
                            s.classList.remove("half");
                        }
                    });
                };
            });
        });
    }

    let exitModal = document.querySelector(".exit-modal");
    let modalShown = false; // لمنع تكرار ظهور النافذة بشكل مزعج لكل مرة يخرج فيها الماوس

    if (exitModal) {
        document.addEventListener("mouseleave", function(e) {
            if (e.clientY < 20 && !modalShown) {
                exitModal.style.display = "flex"; // تفعيل التوسيط بالـ flex
                modalShown = true; // إظهارها مرة واحدة فقط في الجلسة
            }
        });

        // إغلاق النافذة عند الضغط على زر الإغلاق
        let closeBtn = exitModal.querySelector(".close-btn");
        if (closeBtn) {
            closeBtn.onclick = function() {
                exitModal.style.display = "none";
            };
        }

        // إغلاق النافذة عند الضغط في أي مكان خارج كارت الخصم
        exitModal.onclick = function(e) {
            if (e.target === exitModal) {
                exitModal.style.display = "none";
            }
        };
    }

    // تفعيل فتح وإغلاق شريط الفلترة في الموبايل (Mobile Filter Sidebar Toggle)
    let filterToggleBtn = document.querySelector(".filter-toggle-btn");
    let sidebar = document.querySelector(".sidebar");
    let sidebarCloseBtn = document.querySelector(".sidebar-close-btn");

    if (filterToggleBtn && sidebar) {
        filterToggleBtn.onclick = function(e) {
            e.stopPropagation();
            sidebar.classList.toggle("open");
        };
    }

    if (sidebarCloseBtn && sidebar) {
        sidebarCloseBtn.onclick = function(e) {
            e.stopPropagation();
            sidebar.classList.remove("open");
        };
    }

    // إغلاق الفلتر عند الضغط بالخارج (الخلفية المظلمة)
    document.addEventListener("click", function(e) {
        if (sidebar && sidebar.classList.contains("open")) {
            if (!sidebar.contains(e.target) && e.target !== filterToggleBtn) {
                sidebar.classList.remove("open");
            }
        }
    });

    // محاكاة عدد المشاهدين الحاليين للمنتج بشكل تفاعلي (Live Viewers Simulator)
let viewersList = document.querySelectorAll(".viewers-count");
setInterval(function () {
    viewersList.forEach(function(viewer) {
        let randomNumber = Math.floor(Math.random() * (12 - 3 + 1)) + 3;
        viewer.innerHTML = randomNumber;
    });
}, 3000);
// تفعيل تأثير الإمالة ثلاثية الأبعاد (3D Tilt Effect) وإضاءة النيون المتفاعلة مع حركة الماوس
// تفعيل تأثير الإمالة ثلاثية الأبعاد (3D Tilt Effect) وإضاءة النيون المتفاعلة مع حركة الماوس
function initTiltEffect() {
    let cardsList = document.querySelectorAll(".product-card");
    cardsList.forEach(function(cardItem) {
        cardItem.onmousemove = function(e) {
            // جلب أبعاد الكارت (العرض والارتفاع ومكانه في الشاشة)
            let cardRect = cardItem.getBoundingClientRect();
            
            // حسبة مكان الماوس بالظبط داخل الكارت (بالبكسل)
            let x = e.clientX - cardRect.left; 
            let y = e.clientY - cardRect.top; 

            // تحديد منتصف الكارت
            let midCardWidth = cardRect.width / 2;
            let midCardHeight = cardRect.height / 2;
            
            // حساب زوايا الميل (قسمة على 15 لتكون الحركة ناعمة وغير حادة)
            let angleX = -(y - midCardHeight) / 15;
            let angleY = (x - midCardWidth) / 15;

            // تطبيق الميلان ثلاثي الأبعاد وتمرير إحداثيات الماوس للـ CSS للتحكم في الإضاءة
            cardItem.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            cardItem.style.setProperty("--x", `${x}px`);
            cardItem.style.setProperty("--y", `${y}px`);
        };

        // عند خروج الماوس من الكارت، يعود لوضعه الطبيعي وتختفي الإضاءة
        cardItem.onmouseleave = function() {
            cardItem.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
        };
    });
}
// كود صفحة تفاصيل المنتج (Product Details Page Logic)
let qtyInput = document.querySelector(".qty-input");
let addCartBtn = document.querySelector(".p-add-cart-btn");
let totalPriceSpan = document.querySelector(".p-price");
let oldPriceSpan = document.querySelector(".p-price-old");

if (qtyInput && addCartBtn) {
    let basePrice = 150; // قيمة افتراضية احتياطية
    let rawPriceText = "";
    let baseOldPrice = 0;
    let rawOldPriceText = "";

    if (totalPriceSpan) {
        rawPriceText = totalPriceSpan.innerText.trim();
        let parsedPrice = parseFloat(rawPriceText.replace(/[^0-9.]/g, ""));
        if (!isNaN(parsedPrice)) {
            basePrice = parsedPrice;
        }
    }

    if (oldPriceSpan) {
        rawOldPriceText = oldPriceSpan.innerText.trim();
        let parsedOldPrice = parseFloat(rawOldPriceText.replace(/[^0-9.]/g, ""));
        if (!isNaN(parsedOldPrice)) {
            baseOldPrice = parsedOldPrice;
        }
    }

    // دالة لتحديث السعر الكلي بناءً على الكمية المحددة ونظام الخصم
    function updatePrice() {
        let currentQty = parseInt(qtyInput.value);
        if (isNaN(currentQty) || currentQty < 1) {
            currentQty = 1;
        }
        
        // نظام الخصم التلقائي:
        // قطعتين -> خصم 5%
        // 3 قطع أو أكثر -> خصم 10%
        let discountRate = 0;
        if (currentQty === 2) {
            discountRate = 0.05;
        } else if (currentQty >= 3) {
            discountRate = 0.10;
        }

        let baseTotal = currentQty * basePrice;
        let discountedTotal = baseTotal * (1 - discountRate);

        // 1. تحديث السعر الجديد الملون بالنيون
        if (totalPriceSpan && rawPriceText) {
            let formattedPrice = discountedTotal.toFixed(2);
            totalPriceSpan.innerText = rawPriceText.replace(/[0-9.]+/g, formattedPrice);
        }

        // 2. تحديث السعر القديم المشطوب
        if (oldPriceSpan) {
            if (discountRate > 0) {
                // في حالة وجود خصم، نعرض السعر الإجمالي الأصلي (بدون الخصم) مشطوباً
                let formattedOldPrice = baseTotal.toFixed(2);
                oldPriceSpan.innerText = rawPriceText.replace(/[0-9.]+/g, formattedOldPrice);
                oldPriceSpan.style.display = "inline-block";
            } else {
                // إذا كانت قطعة واحدة، نرجع السعر الأصلي المشطوب للمنتج (إن وجد)
                if (rawOldPriceText) {
                    oldPriceSpan.innerText = rawOldPriceText;
                    oldPriceSpan.style.display = "inline-block";
                } else {
                    oldPriceSpan.style.display = "none";
                }
            }
        }

        // 3. تحديث/إضافة بادج الخصم التلقائي
        let discountBadge = document.querySelector(".p-discount-badge");
        if (discountRate > 0) {
            if (!discountBadge && totalPriceSpan) {
                discountBadge = document.createElement("span");
                discountBadge.className = "p-discount-badge";
                totalPriceSpan.parentElement.appendChild(discountBadge);
            }
            if (discountBadge) {
                discountBadge.innerText = `SAVE ${discountRate * 100}%`;
                discountBadge.style.display = "inline-flex";
            }
        } else {
            if (discountBadge) {
                discountBadge.style.display = "none";
            }
        }
    }

    // الاستماع للتغييرات اليدوية في حقل الإدخال
    qtyInput.addEventListener("input", updatePrice);
    qtyInput.addEventListener("change", updatePrice);

    // تفعيل التحديث عند الضغط على أزرار الزيادة والنقصان (+) و (-)
    let qtyBtns = document.querySelectorAll(".qty-btn");
    qtyBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            // استخدام setTimeout لضمان قراءة القيمة الجديدة بعد انتهاء الـ stepUp/stepDown
            setTimeout(updatePrice, 20);
        });
    });

    // تشغيل زرار الـ Add to Cart (تأثير الإشعار الفوري مع طيران المنتج)
    addCartBtn.onclick = function(e) {
        e.preventDefault(); // منع إعادة تحميل الصفحة
        
        let cartBadge = document.querySelector(".cart-badge");
        let cartBtn = cartBadge ? cartBadge.parentElement : null;
        let img = document.querySelector("#main-product-img") || document.querySelector(".p-main-image-wrap img");
        
        if (!cartBadge || !cartBtn || !img) {
            // حل بديل في حال عدم العثور على العناصر
            let finalQty = qtyInput.value;
            showToast(`🔥 عاش يا صلاح! تم إضافة (${finalQty}) قطع من المنتج إلى سلتك بنجاح.`);
            return;
        }

        let qty = parseInt(qtyInput.value) || 1;
        if (qty < 1) qty = 1;

        let successMessage = `🔥 عاش يا صلاح! تم إضافة (${qty}) قطع من المنتج إلى سلتك بنجاح.`;
        animateFly(img, cartBtn, cartBadge, qty, successMessage);
    };

    // تفعيل تبديل الصور من المصغرات (Product Gallery Thumbnails Switcher)
    let thumbBtns = document.querySelectorAll(".thumb-btn");
    let mainProductImg = document.querySelector("#main-product-img") || document.querySelector(".p-main-image-wrap img");

    // دالة لجلب الصورة المعروضة حالياً داخل الحاوية (تدعم الصور الفردية والمتعددة النشطة عبر CSS)
    function getActiveProductImage(imageWrap) {
        if (!imageWrap) return null;
        let imgs = imageWrap.querySelectorAll("img:not(.img-zoom-lens)");
        if (imgs.length === 1) return imgs[0];
        
        for (let img of imgs) {
            let style = window.getComputedStyle(img);
            if (style.display !== 'none' && style.opacity !== '0' && style.visibility !== 'hidden') {
                return img;
            }
        }
        return imgs[0] || null;
    }

    thumbBtns.forEach(function(btn) {
        btn.addEventListener("click", function(e) {
            e.preventDefault();
            
            thumbBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            let thumbImg = btn.querySelector("img");
            if (mainProductImg && thumbImg) {
                if (document.querySelector("#main-product-img")) {
                    mainProductImg.src = thumbImg.src;
                    mainProductImg.style.filter = thumbImg.style.filter || "none";
                }
            }
        });
    });

    // تفعيل العدسة المكبرة لصورة المنتج (Product Image Zoom Loupe)
    let imageWrap = document.querySelector(".p-main-image-wrap");
    if (imageWrap && mainProductImg) {
        let lens = document.createElement("div");
        lens.className = "img-zoom-lens";
        imageWrap.appendChild(lens);

        imageWrap.addEventListener("mouseenter", function() {
            let activeImg = getActiveProductImage(imageWrap);
            if (!activeImg) return;
            
            lens.style.backgroundImage = `url('${activeImg.src}')`;
            lens.style.filter = activeImg.style.filter || "none";
            
            let rect = activeImg.getBoundingClientRect();
            // تكبير بمقدار 2.5 ضعف حجم الحاوية الأصلي
            lens.style.backgroundSize = `${rect.width * 2.5}px ${rect.height * 2.5}px`;
        });

        imageWrap.addEventListener("mousemove", function(e) {
            let activeImg = getActiveProductImage(imageWrap);
            if (!activeImg) return;

            let rect = imageWrap.getBoundingClientRect();
            
            // حساب موقع الماوس بالنسبة للحاوية بالبكسل
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;

            // حساب النسبة المئوية لموقع الماوس
            let percentX = (x / rect.width) * 100;
            let percentY = (y / rect.height) * 100;

            // وضع العدسة في منتصف موقع الماوس
            let lensWidth = lens.offsetWidth || 180;
            let lensHeight = lens.offsetHeight || 180;

            lens.style.left = (x - lensWidth / 2) + "px";
            lens.style.top = (y - lensHeight / 2) + "px";

            // تحديث موقع الخلفية داخل العدسة لتتوافق مع الماوس
            lens.style.backgroundPosition = `${percentX}% ${percentY}%`;
            
            // تحديث الصورة في الخلفية حياً في حال تغيير خيار اللون أثناء وجود الماوس
            lens.style.backgroundImage = `url('${activeImg.src}')`;
            lens.style.filter = activeImg.style.filter || "none";
        });
    }
}

// ── كود تحريك طيران المنتجات إلى السلة (Fly to Cart Script) ──

// دالة لإظهار إشعار نيون مميز (Toast Notification)
function showToast(message) {
    // إزالة أي توست موجود مسبقاً لمنع التراكم على الشاشة
    let oldToast = document.querySelector(".neon-toast");
    if (oldToast) {
        oldToast.remove();
    }

    let toast = document.createElement("div");
    toast.className = "neon-toast";
    toast.innerHTML = message;
    document.body.appendChild(toast);
    
    // إظهاره بتأثير حركة سلس
    setTimeout(() => {
        toast.classList.add("show");
    }, 50);

    // إخفاؤه وحذفه بعد 3 ثوانٍ
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// الدالة المسؤولة عن تحريك الصورة وتحديث العداد وإظهار الإشعار
function animateFly(img, target, badge, qty, successMessage) {
    // 1. أخذ نسخة من الصورة
    let clone = img.cloneNode(true);
    let imgRect = img.getBoundingClientRect();
    let targetRect = target.getBoundingClientRect();

    // 2. ضبط التنسيقات الابتدائية للنسخة الطائرة
    clone.style.position = "fixed";
    clone.style.left = imgRect.left + "px";
    clone.style.top = imgRect.top + "px";
    clone.style.width = imgRect.width + "px";
    clone.style.height = imgRect.height + "px";
    clone.style.zIndex = "9999";
    clone.style.borderRadius = "50%";
    clone.style.objectFit = "cover";
    clone.style.pointerEvents = "none";
    clone.style.boxShadow = "0 0 20px var(--neon)";
    clone.style.border = "2px solid var(--neon)";
    clone.style.transition = "all 0.9s cubic-bezier(0.25, 1, 0.5, 1)";

    document.body.appendChild(clone);

    // 3. بدء عملية الطيران في الإطار التالي
    requestAnimationFrame(function() {
        clone.style.left = (targetRect.left + targetRect.width / 2 - 15) + "px";
        clone.style.top = (targetRect.top + targetRect.height / 2 - 15) + "px";
        clone.style.width = "30px";
        clone.style.height = "30px";
        clone.style.opacity = "0.2";
        clone.style.transform = "rotate(720deg) scale(0.5)";
    });

    // 4. بعد انتهاء الطيران، احذف النسخة وحدث السلة مع تأثير هزاز وتنبيه
    setTimeout(function() {
        clone.remove();
        
        // تحديث الرقم في السلة
        let currentCount = parseInt(badge.innerText) || 0;
        badge.innerText = currentCount + qty;
        
        // تأثير اهتزاز وتوهج للسلة
        target.classList.add("shake-cart");
        setTimeout(function() {
            target.classList.remove("shake-cart");
        }, 500);

        // إظهار التنبيه النيون
        showToast(successMessage);
    }, 900);
}

// تفعيل تأثير طيران الكروت في الصفحة الرئيسية (index.html)
// تفعيل تأثير طيران الكروت في الصفحة الرئيسية (index.html)
function initFlyToCart() {
    let globalCartBadge = document.querySelector(".cart-badge");
    let globalCartBtn = globalCartBadge ? globalCartBadge.parentElement : null;

    if (globalCartBadge && globalCartBtn) {
        let cardCartBtns = document.querySelectorAll(".btn-cart");
        cardCartBtns.forEach(function(btn) {
            btn.addEventListener("click", function(e) {
                e.preventDefault();
                
                // البحث عن الكارت الحاضن والصورة
                let card = btn.closest(".product-card");
                if (!card) return;
                let img = card.querySelector(".card-image img");
                if (!img) return;

                let productName = card.querySelector(".card-title a")?.innerText || "المنتج";
                let successMessage = `🔥 تم إضافة <strong>${productName}</strong> إلى سلتك بنجاح!`;

                animateFly(img, globalCartBtn, globalCartBadge, 1, successMessage);
            });
        });
    }
}

// ── فلترة المنتجات بالبحث الحي والشرائط الجانبية والترتيب والرقاقات (Catalog Filters, Sorting & Active Chips) ──
function initLiveSearch() {
    let searchInput = document.querySelector(".nav-search input");
    let searchForm = document.querySelector(".nav-search");
    let cardsList = document.querySelectorAll(".product-card");
    let catalogMeta = document.querySelector(".catalog-meta");
    let filterItems = document.querySelectorAll(".sidebar .filter-item");
    let priceSlider = document.querySelector(".price-slider");
    let priceVal = document.querySelector(".price-val");
    let brandCheckboxes = document.querySelectorAll(".sidebar input[name='brand']");
    let ratingCheckboxes = document.querySelectorAll(".sidebar input[name='rating']");
    let activeFiltersContainer = document.querySelector(".active-filters");
    let sortSelect = document.querySelector(".sort-select");
    let initialMetaText = catalogMeta ? catalogMeta.innerHTML : "";

    if (!searchInput) return;

    let currentCategory = "all products";
    let currentSearchQuery = "";
    
    // Pagination & Infinite Scroll state
    let paginationLimit = 8;
    let isPaginationLoading = false;
    
    // حفظ البيانات الأصلية والترتيب لكروت المنتجات لتمكين الفلترة والفرز السريع
    let productCardsData = [];
    if (cardsList.length > 0) {
        cardsList.forEach(function(card, index) {
            let title = card.querySelector(".card-title")?.innerText || "";
            let category = card.querySelector(".card-category")?.innerText || "";
            let priceText = card.querySelector(".price-current")?.innerText || "0";
            let price = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;
            
            let ratingAttr = card.querySelector(".stars")?.getAttribute("aria-label") || "";
            let ratingMatch = ratingAttr.match(/[0-9.]+/);
            let rating = ratingMatch ? parseFloat(ratingMatch[0]) : 4.8;
            
            let isNew = card.querySelector(".badge-new") !== null || card.querySelector(".badge-hot") !== null;
            
            productCardsData.push({
                element: card,
                title: title,
                titleLower: title.toLowerCase(),
                categoryLower: category.toLowerCase().trim(),
                price: price,
                rating: rating,
                isNew: isNew,
                originalIndex: index
            });
        });
    }

    // دالة لتنفيذ الفلترة والفرز المشترك (البحث، الأقسام، الماركات، التقييم، نطاق السعر، والترتيب)
    function applyCombinedFilters(keepLimit = false) {
        if (!keepLimit) {
            paginationLimit = 8;
        }
        
        let selectedBrands = Array.from(brandCheckboxes).filter(cb => cb.checked).map(cb => cb.value.toLowerCase());
        let selectedRatings = Array.from(ratingCheckboxes).filter(cb => cb.checked).map(cb => parseFloat(cb.value));
        let maxPrice = priceSlider ? parseInt(priceSlider.value) : 750;
        let sortOption = sortSelect ? sortSelect.value : "Featured";

        let filteredCards = productCardsData.filter(function(cardData) {
            // 1. الفلترة حسب القسم
            let matchesCategory = (currentCategory === "all products" || cardData.categoryLower === currentCategory);
            
            // 2. الفلترة حسب البحث الحي
            let matchesSearch = (cardData.titleLower.includes(currentSearchQuery) || cardData.categoryLower.includes(currentSearchQuery));
            
            // 3. الفلترة حسب السعر
            let matchesPrice = (maxPrice >= 750 || cardData.price <= maxPrice);
            
            // 4. الفلترة حسب الماركة التجارية
            let matchesBrand = true;
            if (selectedBrands.length > 0) {
                matchesBrand = selectedBrands.some(brand => cardData.titleLower.includes(brand));
            }

            // 5. الفلترة حسب التقييم
            let matchesRating = true;
            if (selectedRatings.length > 0) {
                let minRating = Math.min(...selectedRatings);
                matchesRating = cardData.rating >= minRating;
            }

            return matchesCategory && matchesSearch && matchesPrice && matchesBrand && matchesRating;
        });

        // 6. عملية فرز المنتجات (Sorting)
        if (sortOption === "Price: Low to High") {
            filteredCards.sort((a, b) => a.price - b.price);
        } else if (sortOption === "Price: High to Low") {
            filteredCards.sort((a, b) => b.price - a.price);
        } else if (sortOption === "Top Rated") {
            filteredCards.sort((a, b) => b.rating - a.rating);
        } else if (sortOption === "Newest") {
            filteredCards.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        } else {
            // Featured
            filteredCards.sort((a, b) => a.originalIndex - b.originalIndex);
        }

        // 7. تحديث عرض المنتجات في الـ DOM
        productCardsData.forEach(cardData => {
            cardData.element.style.display = "none";
            cardData.element.classList.remove("active");
            cardData.element.removeAttribute("data-paginated-hidden");
        });

        let productGrid = document.querySelector(".product-grid");
        if (productGrid) {
            filteredCards.forEach(function(cardData, index) {
                if (index < paginationLimit) {
                    cardData.element.style.display = "";
                    setTimeout(() => {
                        cardData.element.classList.add("active");
                    }, 10);
                } else {
                    cardData.element.style.display = "none";
                    cardData.element.setAttribute("data-paginated-hidden", "true");
                }
                productGrid.appendChild(cardData.element);
            });
        }

        let totalMatched = filteredCards.length;
        let currentlyShowing = Math.min(paginationLimit, totalMatched);

        // 8. تحديث نص نتائج الفلترة في الكتالوج (مثال: 6 products found — Showing 1–6)
        if (catalogMeta) {
            catalogMeta.innerHTML = `<strong>${totalMatched}</strong> products found &mdash; Showing 1&ndash;${currentlyShowing}`;
        }

        let visibleCount = totalMatched;

        // 9. تحديث رقاقات الفلترة النشطة (Active Filter Chips)
        if (activeFiltersContainer) {
            activeFiltersContainer.innerHTML = "";

            // أ) رقاقة القسم
            if (currentCategory !== "all products") {
                let activeItem = document.querySelector(".sidebar .filter-item.active");
                let categoryDisplay = activeItem ? activeItem.innerText.split("\n")[0].trim() : currentCategory;
                createFilterChip(`Category: ${categoryDisplay}`, "category", currentCategory);
            }

            // ب) رقاقة البحث
            if (currentSearchQuery !== "") {
                createFilterChip(`Search: "${currentSearchQuery}"`, "search", currentSearchQuery);
            }

            // ج) رقاقة نطاق السعر
            if (maxPrice < 750) {
                createFilterChip(`Under $${maxPrice}`, "price", maxPrice);
            }

            // د) رقاقات الماركات
            Array.from(brandCheckboxes).filter(cb => cb.checked).forEach(cb => {
                let brandLabel = cb.parentNode.innerText.trim();
                createFilterChip(brandLabel, "brand", cb.value);
            });

            // هـ) رقاقات التقييم
            Array.from(ratingCheckboxes).filter(cb => cb.checked).forEach(cb => {
                createFilterChip(`${cb.value}★ & up`, "rating", cb.value);
            });

            // إظهار أو إخفاء حاوية الرقاقات
            if (activeFiltersContainer.children.length > 0) {
                activeFiltersContainer.style.display = "flex";
            } else {
                activeFiltersContainer.style.display = "none";
            }
        }

        // دالة مساعدة لإنشاء رقاقة الفلترة
        function createFilterChip(text, type, value) {
            let chip = document.createElement("div");
            chip.className = "filter-chip";
            chip.innerHTML = `${text} <span class="remove" aria-label="Remove filter">&#10005;</span>`;
            
            chip.querySelector(".remove").addEventListener("click", function() {
                removeFilterByType(type, value);
            });
            activeFiltersContainer.appendChild(chip);
        }

        // دالة مساعدة لإلغاء تفعيل الفلتر عند إزالة الرقاقة
        function removeFilterByType(type, value) {
            if (type === "category") {
                currentCategory = "all products";
                let firstFilterItem = document.querySelector(".sidebar .filter-item");
                if (firstFilterItem) {
                    filterItems.forEach(i => {
                        i.classList.remove("active");
                        i.removeAttribute("aria-current");
                    });
                    firstFilterItem.classList.add("active");
                    firstFilterItem.setAttribute("aria-current", "page");
                }
            } else if (type === "search") {
                currentSearchQuery = "";
                if (searchInput) searchInput.value = "";
            } else if (type === "price") {
                if (priceSlider) {
                    priceSlider.value = 750;
                    if (priceVal) priceVal.textContent = "Any Price";
                }
            } else if (type === "brand") {
                let checkbox = Array.from(brandCheckboxes).find(cb => cb.value.toLowerCase() === value.toLowerCase());
                if (checkbox) checkbox.checked = false;
            } else if (type === "rating") {
                let checkbox = Array.from(ratingCheckboxes).find(cb => cb.value === value.toString());
                if (checkbox) checkbox.checked = false;
            }

            applyCombinedFilters();
        }

        // معالجة حالة عدم وجود نتائج فلترة
        let noResults = document.querySelector(".no-search-results");
        if (visibleCount === 0) {
            if (!noResults && productGrid) {
                noResults = document.createElement("div");
                noResults.className = "no-search-results";
                noResults.innerHTML = `
                    <span class="no-results-icon">🔍</span>
                    <h3>No products found</h3>
                    <p>We couldn't find anything matching your filters. Try adjusting your sidebar selections or search term.</p>
                `;
                productGrid.appendChild(noResults);
            } else if (noResults) {
                noResults.querySelector("p").innerText = `We couldn't find anything matching your filters. Try adjusting your sidebar selections or search term.`;
                noResults.style.display = "flex";
            }
        } else {
            if (noResults) {
                noResults.style.display = "none";
            }
        }
    }

    // 1. الاستماع لحدث الكتابة في خانة البحث (البحث الحي)
    searchInput.addEventListener("input", function(e) {
        currentSearchQuery = e.target.value.toLowerCase().trim();
        if (cardsList.length > 0) {
            applyCombinedFilters();
        }
    });

    // 2. الاستماع للضغط على الأقسام في القائمة الجانبية (Sidebar Categories)
    filterItems.forEach(function(item) {
        item.addEventListener("click", function(e) {
            e.preventDefault();

            // تعديل الكلاس النشط (Active)
            filterItems.forEach(i => {
                i.classList.remove("active");
                i.removeAttribute("aria-current");
            });
            item.classList.add("active");
            item.setAttribute("aria-current", "page");

            // جلب القسم المختار
            currentCategory = item.innerText.split("\n")[0].trim().toLowerCase();

            if (cardsList.length > 0) {
                applyCombinedFilters();
            }

            // إغلاق الشريط الجانبي في الموبايل تلقائياً بعد الاختيار
            let sidebar = document.querySelector(".sidebar");
            if (sidebar && sidebar.classList.contains("open")) {
                sidebar.classList.remove("open");
            }
        });
    });

    // 3. الاستماع لتغيير نطاق السعر (Price Range Slider)
    if (priceSlider) {
        priceSlider.addEventListener("input", function() {
            let val = parseInt(priceSlider.value);
            if (priceVal) {
                if (val >= 750) {
                    priceVal.textContent = "Any Price";
                } else {
                    priceVal.textContent = "$" + val;
                }
            }
            if (cardsList.length > 0) {
                applyCombinedFilters();
            }
        });
    }

    // 4. الاستماع لخيارات الماركات التجارية (Brand Checkboxes)
    brandCheckboxes.forEach(function(cb) {
        cb.addEventListener("change", function() {
            if (cardsList.length > 0) {
                applyCombinedFilters();
            }
        });
    });

    // 5. الاستماع لحدث تصفية التقييمات (Rating Checkboxes)
    ratingCheckboxes.forEach(function(cb) {
        cb.addEventListener("change", function() {
            if (cardsList.length > 0) {
                applyCombinedFilters();
            }
        });
    });

    // 6. الاستماع لحدث الفرز والترتيب (Sort Dropdown)
    if (sortSelect) {
        sortSelect.addEventListener("change", function() {
            if (cardsList.length > 0) {
                applyCombinedFilters();
            }
        });
    }

    // 7. منع إعادة تحميل الصفحة عند الضغط على Enter
    if (searchForm && cardsList.length > 0) {
        searchForm.addEventListener("submit", function(e) {
            e.preventDefault();
        });
    }

    // 8. قراءة كلمة البحث من الرابط (URL Parameter)
    let urlParams = new URLSearchParams(window.location.search);
    let urlQuery = urlParams.get("q");
    if (urlQuery && cardsList.length > 0) {
        searchInput.value = urlQuery;
        currentSearchQuery = urlQuery.toLowerCase().trim();
    }

    // 10. Infinite Scroll / Lazy Load Pagination
    window.addEventListener("scroll", function() {
        if (isPaginationLoading) return;
        
        let hiddenCards = document.querySelectorAll("[data-paginated-hidden='true']");
        if (hiddenCards.length === 0) return;
        
        let scrollHeight = document.documentElement.scrollHeight;
        let clientHeight = window.innerHeight;
        let scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        if (scrollHeight - clientHeight - scrollTop < 150) {
            loadNextPage();
        }
    });

    function loadNextPage() {
        isPaginationLoading = true;
        
        let productGrid = document.querySelector(".product-grid");
        if (!productGrid) return;
        
        let skeletonContainer = document.createElement("div");
        skeletonContainer.className = "skeleton-container no-print";
        skeletonContainer.style.display = "contents"; 
        
        for (let i = 0; i < 4; i++) {
            let skeletonCard = document.createElement("div");
            skeletonCard.className = "skeleton-card";
            skeletonCard.innerHTML = `
                <div class="skeleton-image"></div>
                <div class="skeleton-text skeleton-title"></div>
                <div class="skeleton-text skeleton-category"></div>
                <div class="skeleton-text skeleton-price"></div>
                <div class="skeleton-button"></div>
            `;
            skeletonContainer.appendChild(skeletonCard);
        }
        
        productGrid.appendChild(skeletonContainer);
        
        setTimeout(() => {
            skeletonContainer.remove();
            paginationLimit += 8;
            applyCombinedFilters(true);
            checkCards();
            isPaginationLoading = false;
            showNeonToast("⚡ More Gear Loaded", "Next set of elite items are ready.");
        }, 1000);
    }

    // التشغيل المبدئي للفلترة المشتركة لمراعاة العناصر المحددة مسبقاً (Default brand checks, etc.)
    if (cardsList.length > 0) {
        applyCombinedFilters();
    }
}

// تشغيل دالة البحث والفلترة المشتركة (سيتم التشغيل من خلال دالة displayProducts)
// initLiveSearch();

// ── تأثير الوهج المغناطيسي التفاعلي لأزرار النافبار (Magnetic Glow Navbar Buttons) ──
function initMagneticGlow() {
    let navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach(function(btn) {
        btn.addEventListener("mousemove", function(e) {
            let rect = btn.getBoundingClientRect();
            // حساب إحداثيات الماوس بدقة بالنسبة لموضع الزر
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;

            btn.style.setProperty("--x", x + "px");
            btn.style.setProperty("--y", y + "px");
        });
    });
}

// تشغيل تأثير الوهج المغناطيسي للأزرار
initMagneticGlow();

// ── شريط المقارنة السريع بين المنتجات (Quick Product Comparison) ──
function initProductComparison() {
    let compareCheckboxes = document.querySelectorAll(".compare-checkbox-hidden");
    let comparisonBar = document.getElementById("comparison-bar");
    let compBarItems = document.getElementById("comp-bar-items");
    let compClearBtn = document.getElementById("comp-clear-btn");
    let compCompareBtn = document.getElementById("comp-compare-btn");
    
    let compModal = document.getElementById("comparison-modal");
    let compModalClose = document.getElementById("comp-modal-close");
    let compTable = document.getElementById("comp-table");

    if (!comparisonBar || !compBarItems) return; // لضمان العمل في صفحة الكتالوج فقط

    let compareList = [];

    // دالة لتحديث شريط المقارنة السفلي
    function updateComparisonBar() {
        compBarItems.innerHTML = "";

        // بناء 3 خانات (Slots) للمقارنة
        for (let i = 0; i < 3; i++) {
            let slot = document.createElement("div");
            slot.className = "comp-item-slot";
            
            if (compareList[i]) {
                slot.classList.add("filled");
                slot.innerHTML = `
                    <img src="${compareList[i].image}" alt="${compareList[i].title}">
                    <button class="comp-item-remove" data-id="${compareList[i].id}" aria-label="Remove item">&times;</button>
                `;
                
                // تفعيل حذف منتج من الخانة
                slot.querySelector(".comp-item-remove").addEventListener("click", function() {
                    let itemId = this.getAttribute("data-id");
                    removeProductFromCompare(itemId);
                });
            } else {
                slot.innerHTML = `<span style="color: var(--text-muted); font-size: 1.2rem;">+</span>`;
            }
            compBarItems.appendChild(slot);
        }

        // إظهار أو إخفاء شريط المقارنة بناءً على عدد العناصر
        if (compareList.length > 0) {
            comparisonBar.classList.add("open");
        } else {
            comparisonBar.classList.remove("open");
        }

        // تفعيل زر المقارنة فقط عند اختيار منتجين على الأقل
        compCompareBtn.disabled = compareList.length < 2;
    }

    // إزالة منتج من القائمة وإلغاء تحديد صندوق الاختيار
    function removeProductFromCompare(id) {
        compareList = compareList.filter(item => item.id !== id);
        
        // إلغاء التحديد في الكارت المناسب
        compareCheckboxes.forEach(function(checkbox) {
            let card = checkbox.closest(".product-card");
            let title = card.querySelector(".card-title a")?.innerText || "";
            if (title === id) {
                checkbox.checked = false;
            }
        });

        updateComparisonBar();
    }

    // الاستماع لصناديق المقارنة في كروت المنتجات
    compareCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener("change", function() {
            let card = checkbox.closest(".product-card");
            if (!card) return;

            let title = card.querySelector(".card-title a")?.innerText || "";
            let image = card.querySelector(".card-image img")?.src || "";
            let price = card.querySelector(".price-current")?.innerText || "";
            let category = card.querySelector(".card-category")?.innerText || "";
            let rating = card.querySelector(".stars")?.getAttribute("aria-label") || "4.8 out of 5";

            if (checkbox.checked) {
                // الحد الأقصى هو 3 منتجات
                if (compareList.length >= 3) {
                    checkbox.checked = false;
                    showToast("⚠️ الحد الأقصى للمقارنة هو 3 منتجات فقط!");
                    return;
                }
                
                // إضافة المنتج للقائمة
                compareList.push({
                    id: title,
                    title: title,
                    image: image,
                    price: price,
                    category: category,
                    rating: rating,
                    link: card.querySelector(".card-title a")?.href || "#"
                });
            } else {
                // إزالة المنتج
                compareList = compareList.filter(item => item.id !== title);
            }

            updateComparisonBar();
        });
    });

    // زر مسح الكل (Clear All)
    if (compClearBtn) {
        compClearBtn.addEventListener("click", function() {
            compareList = [];
            compareCheckboxes.forEach(checkbox => checkbox.checked = false);
            updateComparisonBar();
        });
    }

    // فتح نافذة المقارنة (Compare Now)
    if (compCompareBtn) {
        compCompareBtn.addEventListener("click", function() {
            if (compareList.length < 2) return;

            // بناء جدول المقارنة ديناميكياً
            buildCompareTable();
            
            // فتح المودال
            if (compModal) {
                compModal.classList.add("open");
            }
        });
    }

    // إغلاق نافذة المقارنة
    if (compModalClose && compModal) {
        compModalClose.addEventListener("click", function() {
            compModal.classList.remove("open");
        });
        
        // إغلاق المودال عند الضغط بالخارج
        compModal.addEventListener("click", function(e) {
            if (e.target === compModal) {
                compModal.classList.remove("open");
            }
        });
    }

    // دالة بناء جدول المقارنة
    function buildCompareTable() {
        if (!compTable) return;

        // توليد الأعمدة بناءً على طول القائمة
        let headerCols = "";
        let categoryCols = "";
        let priceCols = "";
        let ratingCols = "";
        let actionCols = "";

        compareList.forEach(function(item) {
            let match = item.rating.match(/[0-9.]+/);
            let ratingNumber = match ? match[0] : "4.8";

            headerCols += `
                <td>
                    <img class="comp-product-img" src="${item.image}" alt="${item.title}">
                    <div class="comp-product-name">${item.title}</div>
                </td>
            `;
            categoryCols += `<td>${item.category}</td>`;
            priceCols += `<td class="comp-price-val">${item.price}</td>`;
            ratingCols += `<td class="comp-rating-val">★ ${ratingNumber}</td>`;
            actionCols += `
                <td style="text-align: center;">
                    <a href="${item.link}" class="btn-primary" style="padding: 8px 16px; font-size: 0.8rem; text-decoration: none; display: inline-block;">View Item</a>
                </td>
            `;
        });

        compTable.innerHTML = `
            <thead>
                <tr class="comp-header-row">
                    <th>Product</th>
                    ${headerCols}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>Category</th>
                    ${categoryCols}
                </tr>
                <tr>
                    <th>Price</th>
                    ${priceCols}
                </tr>
                <tr>
                    <th>Rating</th>
                    ${ratingCols}
                </tr>
                <tr>
                    <th>Action</th>
                    ${actionCols}
                </tr>
            </tbody>
        `;
    }
}

// تشغيل نظام المقارنة (سيتم التشغيل من خلال دالة displayProducts)
// initProductComparison();

// دالة محاكاة تتبع الشحن الفوري
function initOrderTrackingSimulator() {
    // 1. Create and inject tracking modal HTML dynamically
    if (document.getElementById("tracking-modal")) return;

    let modalHTML = `
      <div class="tracking-modal" id="tracking-modal" role="dialog" aria-modal="true" aria-label="Order Tracking Simulator">
        <div class="tracking-modal-overlay" id="tracking-modal-overlay"></div>
        <div class="tracking-modal-content">
          <div class="tracking-modal-header">
            <h2 class="tracking-modal-title">Live Order <span>Tracking</span></h2>
            <button class="tracking-modal-close" id="tracking-modal-close" aria-label="Close tracking modal">&times;</button>
          </div>
          <div class="tracking-modal-body">
            <p class="tracking-modal-desc">Enter your order ID below to simulate tracking status (e.g. 1020, 2026, 777 or any number).</p>
            
            <div class="tracking-form-row">
              <input type="text" class="tracking-input" id="tracking-order-input" placeholder="Order ID (e.g., 1020)" aria-label="Order ID" />
              <button class="btn-primary tracking-btn" id="tracking-submit-btn"><span>Track</span></button>
            </div>
            
            <div class="tracking-results" id="tracking-results-container">
              <!-- Results, loader and stepper will be injected here dynamically -->
            </div>
          </div>
        </div>
      </div>
    `;

    let wrapper = document.createElement("div");
    wrapper.innerHTML = modalHTML;
    document.body.appendChild(wrapper.firstElementChild);

    // 2. Select Elements
    let modal = document.getElementById("tracking-modal");
    let closeBtn = document.getElementById("tracking-modal-close");
    let overlay = document.getElementById("tracking-modal-overlay");
    let orderInput = document.getElementById("tracking-order-input");
    let submitBtn = document.getElementById("tracking-submit-btn");
    let resultsContainer = document.getElementById("tracking-results-container");

    // 3. Bind Open Events to Support Links and Inject Footer Widgets
    document.querySelectorAll("a").forEach(function(link) {
        if (link.textContent.trim().toLowerCase().includes("track my order")) {
            // Bind click handler to the link itself
            link.addEventListener("click", function(e) {
                e.preventDefault();
                openModal();
            });

            // Inject the footer input widget right after the list item parent
            let parentLi = link.closest("li");
            if (parentLi) {
                let trackingLi = document.createElement("li");
                trackingLi.className = "footer-track-li";
                trackingLi.style.marginTop = "12px";
                trackingLi.innerHTML = `
                  <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px; letter-spacing: 0.5px;">Track Your Order</span>
                  <div class="footer-track-box">
                    <input type="text" class="footer-track-input" placeholder="Order ID (e.g., 1020)" aria-label="Order ID to track" />
                    <button class="footer-track-btn">Track</button>
                  </div>
                `;
                
                // Append after parentLi
                parentLi.parentNode.insertBefore(trackingLi, parentLi.nextSibling);
                
                // Bind event listeners for this footer widget
                let footerInput = trackingLi.querySelector(".footer-track-input");
                let footerBtn = trackingLi.querySelector(".footer-track-btn");
                
                function handleFooterTrack() {
                    let val = footerInput.value.trim();
                    if (val) {
                        openModal();
                        orderInput.value = val;
                        triggerTracking();
                    } else {
                        openModal();
                    }
                }
                
                footerBtn.addEventListener("click", function(e) {
                    e.preventDefault();
                    handleFooterTrack();
                });
                
                footerInput.addEventListener("keydown", function(e) {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        handleFooterTrack();
                    }
                });
            }
        }
    });

    // 4. Modal Open & Close Functions
    function openModal() {
        modal.classList.add("open");
        orderInput.value = "";
        resultsContainer.innerHTML = "";
        orderInput.disabled = false;
        submitBtn.disabled = false;
        orderInput.focus();
    }

    function closeModal() {
        modal.classList.remove("open");
    }

    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);

    // 5. Submit Event Handler
    submitBtn.addEventListener("click", function() {
        triggerTracking();
    });

    orderInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            triggerTracking();
        }
    });

    function triggerTracking() {
        let orderId = orderInput.value.trim();
        if (!orderId) {
            resultsContainer.innerHTML = `
                <div class="tracking-error" style="margin-top: 15px;">
                    <span>⚠️</span>
                    <span>Please enter a valid Order ID.</span>
                </div>
            `;
            return;
        }

        // Disable UI
        orderInput.disabled = true;
        submitBtn.disabled = true;

        // Show Neon Loader
        resultsContainer.innerHTML = `
            <div class="tracking-loader-wrap">
                <div class="tracking-spinner"></div>
                <div class="tracking-loader-text">Connecting to shipping nodes...</div>
            </div>
        `;

        // Simulate 2-second API Latency
        setTimeout(function() {
            // Re-enable UI
            orderInput.disabled = false;
            submitBtn.disabled = false;
            
            // Render the tracking result
            renderTrackingResults(orderId);
        }, 2000);
    }

    // 6. Dynamic Result Generation
    function renderTrackingResults(id) {
        let cleanId = id.replace(/[^a-zA-Z0-9]/g, "");
        let orderData = {
            id: cleanId,
            item: "Neon Gaming Gear Pack",
            date: "June 01, 2026",
            statusText: "Processing (جاري التجهيز)",
            statusVal: 2, // 1: Received, 2: Processing, 3: Shipped/Out for delivery
            estDelivery: "2-3 Business Days"
        };

        // Predefined configurations for specific IDs
        if (cleanId === "1020") {
            orderData.item = "Razer Wolverine V3 Pro Wireless";
            orderData.statusText = "Out for Delivery (خرج للشحن)";
            orderData.statusVal = 3;
            orderData.estDelivery = "Today by 6:00 PM";
        } else if (cleanId === "2026") {
            orderData.item = "ASUS ROG Swift 360Hz OLED 27\"";
            orderData.statusText = "Processing (جاري التجهيز)";
            orderData.statusVal = 2;
            orderData.estDelivery = "June 03, 2026";
        } else if (cleanId === "777") {
            orderData.item = "Logitech G915 TKL Lightspeed Wireless";
            orderData.statusText = "Order Received (تم الاستلام)";
            orderData.statusVal = 1;
            orderData.estDelivery = "June 05, 2026";
        } else {
            // Generate semi-random item based on input
            let products = [
                "SteelSeries Arctis Nova Pro Wireless",
                "Razer BlackShark V2 Pro Wireless",
                "Logitech G502 X Plus Wireless",
                "MSI Optix MPG341QR 34\" Ultrawide",
                "Razer Blade 16 RTX 5090 Ultra"
            ];
            let index = Math.abs(hashCode(cleanId)) % products.length;
            orderData.item = products[index];
            
            // Semi-random status assignment
            let statusMod = Math.abs(hashCode(cleanId)) % 3;
            if (statusMod === 0) {
                orderData.statusText = "Order Received (تم الاستلام)";
                orderData.statusVal = 1;
            } else if (statusMod === 1) {
                orderData.statusText = "Processing (جاري التجهيز)";
                orderData.statusVal = 2;
            } else {
                orderData.statusText = "Out for Delivery (خرج للشحن)";
                orderData.statusVal = 3;
            }
        }

        // Stepper markup construction
        let step1Class = orderData.statusVal >= 1 ? (orderData.statusVal === 1 ? "active" : "completed") : "pending";
        let step2Class = orderData.statusVal >= 2 ? (orderData.statusVal === 2 ? "active" : "completed") : "pending";
        let step3Class = orderData.statusVal >= 3 ? (orderData.statusVal === 3 ? "active" : "completed") : "pending";

        let linePercentage = 0;
        if (orderData.statusVal === 1) linePercentage = 0;
        else if (orderData.statusVal === 2) linePercentage = 50;
        else if (orderData.statusVal === 3) linePercentage = 100;

        resultsContainer.innerHTML = `
            <div class="tracking-info-card" style="margin-top: 20px;">
              <div class="tracking-info-item">
                <span class="tracking-info-label">Product Name</span>
                <span class="tracking-info-value">${orderData.item}</span>
              </div>
              <div class="tracking-info-item">
                <span class="tracking-info-label">Estimated Delivery</span>
                <span class="tracking-info-value">${orderData.estDelivery}</span>
              </div>
              <div class="tracking-info-item" style="grid-column: span 2;">
                <span class="tracking-info-label">Shipping Status</span>
                <span class="tracking-info-value status-glow">${orderData.statusText}</span>
              </div>
            </div>

            <div class="tracking-stepper">
              <div class="stepper-progress-line" style="height: ${linePercentage}%;"></div>
              
              <!-- Step 1 -->
              <div class="stepper-step ${step1Class}">
                <div class="step-marker">${orderData.statusVal > 1 ? "&#10003;" : "1"}</div>
                <div class="step-details">
                  <span class="step-title">تم الاستلام ➔ Order Received</span>
                  <span class="step-desc">We have received your order details and payment.</span>
                </div>
              </div>

              <!-- Step 2 -->
              <div class="stepper-step ${step2Class}">
                <div class="step-marker">${orderData.statusVal > 2 ? "&#10003;" : "2"}</div>
                <div class="step-details">
                  <span class="step-title">جاري التجهيز ➔ Processing</span>
                  <span class="step-desc">Your gaming gear is being packaged and prepared in our warehouse.</span>
                </div>
              </div>

              <!-- Step 3 -->
              <div class="stepper-step ${step3Class}">
                <div class="step-marker">${orderData.statusVal > 3 ? "&#10003;" : "3"}</div>
                <div class="step-details">
                  <span class="step-title">خرج للشحن ➔ Out for Delivery</span>
                  <span class="step-desc">The package has been handed to our express courier for delivery.</span>
                </div>
              </div>
            </div>
        `;
    }

    function hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }
}

// تشغيل نظام تتبع الشحن
initOrderTrackingSimulator();

// دالة تشغيل نظام الإشعارات
function initNotificationsCenter() {
    let bellBtn = document.querySelector('a[aria-label="Notifications"]');
    if (!bellBtn) return; // Exit if not found on the page

    // Create wrapper to prevent nesting dropdown inside anchor tag (which causes click issues)
    let wrapper = document.createElement("div");
    wrapper.className = "notif-badge-container";
    wrapper.style.position = "relative";
    
    // Insert wrapper before bellBtn
    bellBtn.parentNode.insertBefore(wrapper, bellBtn);
    // Move bellBtn into wrapper
    wrapper.appendChild(bellBtn);

    // Create the dropdown and append it to wrapper
    let dropdown = document.createElement("div");
    dropdown.className = "notifications-dropdown";
    dropdown.innerHTML = `
        <div class="notif-header">
            <h3>Notifications</h3>
            <div style="display: flex; align-items: center; gap: 15px;">
                <button class="notif-clear-all">Clear All</button>
                <button class="notif-close-btn" aria-label="Close notifications">&times;</button>
            </div>
        </div>
        <div class="notif-list" id="notif-items-list"></div>
    `;
    document.body.appendChild(dropdown);

    let listContainer = dropdown.querySelector("#notif-items-list");
    let clearAllBtn = dropdown.querySelector(".notif-clear-all");

    // Notifications state
    let notifications = [
        {
            id: 1,
            type: "order",
            icon: "📦",
            title: "Order Shipped!",
            desc: "Your order #1020 has been shipped and is out for delivery.",
            time: "10m ago",
            unread: true
        },
        {
            id: 2,
            type: "deal",
            icon: "⚡",
            title: "Cyber Deal Unlocked",
            desc: "Use coupon code NEON50 for 50% off select mechanical keyboards.",
            time: "2h ago",
            unread: true
        },
        {
            id: 3,
            type: "system",
            icon: "🔒",
            title: "Security Alert",
            desc: "Your account security settings were updated successfully.",
            time: "1d ago",
            unread: false
        }
    ];

    function updateBadge() {
        let unreadCount = notifications.filter(n => n.unread).length;
        let existingBadge = bellBtn.querySelector(".notif-badge");
        
        if (unreadCount > 0) {
            if (!existingBadge) {
                let badge = document.createElement("span");
                badge.className = "notif-badge";
                bellBtn.appendChild(badge);
            }
        } else {
            removeBadge();
        }
    }

    function removeBadge() {
        let existingBadge = bellBtn.querySelector(".notif-badge");
        if (existingBadge) {
            existingBadge.remove();
        }
    }

    function renderNotifications() {
        listContainer.innerHTML = "";
        
        if (notifications.length === 0) {
            listContainer.innerHTML = `
                <div class="notif-empty">
                    <span>🔔</span>
                    <p>No new notifications</p>
                </div>
            `;
            removeBadge();
            return;
        }

        notifications.forEach(notif => {
            let item = document.createElement("div");
            item.className = `notif-item ${notif.unread ? "unread" : ""}`;
            item.setAttribute("data-id", notif.id);
            item.innerHTML = `
                <div class="notif-icon">${notif.icon}</div>
                <div class="notif-content">
                    <div class="notif-title">${notif.title}</div>
                    <div class="notif-desc">${notif.desc}</div>
                    <div class="notif-time">${notif.time}</div>
                </div>
            `;
            
            item.addEventListener("click", function(e) {
                e.stopPropagation();
                if (notif.unread) {
                    notif.unread = false;
                    item.classList.remove("unread");
                    updateBadge();
                }
            });
            
            listContainer.appendChild(item);
        });

        updateBadge();
    }

    // Handle close button click
    let closeBtn = dropdown.querySelector(".notif-close-btn");
    if (closeBtn) {
        closeBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            dropdown.classList.remove("open");
            document.body.classList.remove("notif-open");
        });
    }

    // Toggle dropdown
    bellBtn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        let isOpen = dropdown.classList.toggle("open");
        
        if (isOpen) {
            document.body.classList.add("notif-open");
            // Mark all as read when opening
            notifications.forEach(n => {
                n.unread = false;
            });
            renderNotifications();
        } else {
            document.body.classList.remove("notif-open");
        }
    });

    // Clear all notifications
    clearAllBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        notifications = [];
        renderNotifications();
    });

    // Close on clicking outside
    document.addEventListener("click", function(e) {
        if (!wrapper.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove("open");
            document.body.classList.remove("notif-open");
        }
    });

    // Render initial list
    renderNotifications();

    // Dynamic Esports Notifications Pool for Periodic Broadcasts
    const notificationPool = [
        {
            type: "deal",
            icon: "⚡",
            title: "Flash Sale Alert!",
            desc: "SteelSeries Arctis Nova Pro is now 30% off for the next 2 hours. Don't miss out!",
            toastTitle: "🔔 Flash Sale Alert!",
            toastDesc: "SteelSeries Arctis Nova Pro is 30% off! Check notifications."
        },
        {
            type: "deal",
            icon: "⌨️",
            title: "Limited Drop Live!",
            desc: "Razer BlackWidow V4 Pro Phantom Edition is now in stock. Only 200 units worldwide!",
            toastTitle: "⌨️ Limited Drop Live!",
            toastDesc: "Razer Phantom Edition mechanical keyboard is in stock! Check details."
        },
        {
            type: "deal",
            icon: "🎁",
            title: "Monthly Gear Giveaway!",
            desc: "Enter the NeonTech monthly giveaway today to win a free next-gen VR headset. Winners announced Friday!",
            toastTitle: "🎁 Gear Giveaway!",
            toastDesc: "Win a free next-gen VR headset! Enter before Friday."
        },
        {
            type: "deal",
            icon: "🔥",
            title: "Exclusive Gamer Discount!",
            desc: "Use discount coupon code DOCK15 to get 15% off any premium mousepad or elite gaming accessory.",
            toastTitle: "🔥 Exclusive Gamer Discount!",
            toastDesc: "Get 15% off premium mousepads and accessories now!"
        },
        {
            type: "deal",
            icon: "🎮",
            title: "Elite Controller Restocked!",
            desc: "The premium drift-free Elite Controller with hall-effect sticks is back in stock. Order now before it's gone!",
            toastTitle: "🎮 Elite Controller Restocked!",
            toastDesc: "Esports elite drift-free controllers are back in stock! Order now."
        },
        {
            type: "deal",
            icon: "💡",
            title: "Pro Setup Guide Published!",
            desc: "Learn how to calibrate your mouse DPI and monitor Hz for peak competitive gameplay. Read our setup manual inside!",
            toastTitle: "💡 Pro Setup Guide!",
            toastDesc: "Calibrate your DPI and Hz for esports peak performance. Read now!"
        }
    ];

    function triggerIncomingNotification(forcedPoolIndex = null) {
        // Pick a random notification from the pool or use specified index
        let poolIndex = forcedPoolIndex !== null ? forcedPoolIndex : Math.floor(Math.random() * notificationPool.length);
        let selectedItem = notificationPool[poolIndex];

        let newNotif = {
            id: Date.now(),
            type: selectedItem.type,
            icon: selectedItem.icon,
            title: selectedItem.title,
            desc: selectedItem.desc,
            time: "Just now",
            unread: true
        };
        
        notifications.unshift(newNotif);
        renderNotifications();
        
        if (!document.body.classList.contains("notif-open") && !dropdown.classList.contains("open")) {
            updateBadge();
        } else {
            newNotif.unread = false;
            renderNotifications();
        }
        
        playNotificationSound();
        showNeonToast(selectedItem.toastTitle, selectedItem.toastDesc, function() {
            dropdown.classList.add("open");
            document.body.classList.add("notif-open");
            notifications.forEach(n => n.unread = false);
            renderNotifications();
            updateBadge();
        });
    }

    // Trigger first demo notification after 15 seconds for instant user wow factor
    setTimeout(function() {
        triggerIncomingNotification(0); // Trigger the SteelSeries Flash Sale Alert first
    }, 15000);

    // Schedule subsequent notifications to trigger every 10 minutes (600,000 milliseconds)
    setInterval(function() {
        triggerIncomingNotification();
    }, 600000);
}

// Sound chime helper using Web Audio API
function playNotificationSound() {
    try {
        let AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        let ctx = new AudioContext();
        
        // Tone 1 (A5)
        let osc1 = ctx.createOscillator();
        let gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(880, ctx.currentTime);
        gain1.gain.setValueAtTime(0.04, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.12);
        
        // Tone 2 (C6)
        setTimeout(() => {
            let osc2 = ctx.createOscillator();
            let gain2 = ctx.createGain();
            osc2.type = "sine";
            osc2.frequency.setValueAtTime(1046.5, ctx.currentTime);
            gain2.gain.setValueAtTime(0.04, ctx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start();
            osc2.stop(ctx.currentTime + 0.2);
        }, 80);
    } catch (e) {
        console.warn("AudioContext blocked or not supported:", e);
    }
}

// Custom Alert System
function showCustomAlert(title, message, type = 'info') {
    let icon = "🔔";
    if (type === 'success') icon = "🎉";
    else if (type === 'error') icon = "⚠️";
    else if (type === 'warning') icon = "🚨";
    else if (type === 'info') icon = "ℹ️";

    const existingOverlay = document.querySelector(".custom-alert-overlay");
    if (existingOverlay) {
        existingOverlay.remove();
    }

    const overlay = document.createElement("div");
    overlay.className = "custom-alert-overlay";

    const card = document.createElement("div");
    card.className = `custom-alert-card alert-${type}`;
    card.innerHTML = `
        <span class="custom-alert-icon">${icon}</span>
        <h3 class="custom-alert-title">${title}</h3>
        <p class="custom-alert-message">${message}</p>
        <button class="custom-alert-btn">موافق</button>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.classList.add("open");
    });

    const closeAlert = () => {
        overlay.classList.remove("open");
        setTimeout(() => {
            overlay.remove();
        }, 350);
    };

    card.querySelector(".custom-alert-btn").addEventListener("click", closeAlert);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            closeAlert();
        }
    });
}

// Neon toast banner helper
function showNeonToast(title, message, onClickCallback) {
    let toastContainer = document.querySelector(".neon-toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.className = "neon-toast-container";
        document.body.appendChild(toastContainer);
    }
    
    let toast = document.createElement("div");
    toast.className = "neon-toast";
    
    toast.innerHTML = `
        <div class="neon-toast-header">
            <span>${title}</span>
            <span class="toast-close">&times;</span>
        </div>
        <div class="neon-toast-message">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });
    
    toast.addEventListener("click", function(e) {
        if (e.target.classList.contains("toast-close")) {
            closeToast();
            return;
        }
        if (typeof onClickCallback === "function") {
            onClickCallback();
        }
        closeToast();
    });
    
    function closeToast() {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        }, 400);
    }
    
    setTimeout(closeToast, 6000);
}

// دالة تشغيل نظام السلة
function initCartSystem() {
    let itemsContainer = document.getElementById("cart-items-container");
    let subtotalEl = document.getElementById("cart-subtotal");
    let totalEl = document.getElementById("cart-total");
    let badgeEl = document.querySelector(".cart-badge");
    let drawer = document.getElementById("cart-drawer");
    let closeBtn = document.getElementById("cart-close");
    let overlay = document.getElementById("cart-overlay");
    let cartBtn = document.querySelector('a[aria-label*="Shopping cart"]') || (badgeEl ? badgeEl.closest("a") : null);
    let checkoutBtn = document.getElementById("checkout-btn");

    // Load cart state from localStorage
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('neontech_cart')) || [];
    } catch (e) {
        console.warn("Error parsing cart from localStorage:", e);
        cart = [];
    }

    function saveCart() {
        try {
            localStorage.setItem('neontech_cart', JSON.stringify(cart));
        } catch (e) {
            console.warn("Error writing cart to localStorage:", e);
        }
    }

    function openCartDrawer() {
        if (drawer) drawer.classList.add("open");
    }

    function closeCartDrawer() {
        if (drawer) drawer.classList.remove("open");
    }

    function renderCart() {
        if (!itemsContainer) return;
        
        let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (badgeEl) {
            badgeEl.textContent = totalQty;
            badgeEl.style.display = totalQty > 0 ? "flex" : "none";
        }
        
        let cartLink = document.querySelector('a[aria-label*="Shopping cart"]') || (badgeEl ? badgeEl.closest("a") : null);
        if (cartLink) {
            cartLink.setAttribute("aria-label", `Shopping cart, ${totalQty} items`);
        }
        
        if (cart.length === 0) {
            itemsContainer.innerHTML = `
                <div class="cart-empty-state">
                    <span class="empty-icon">&#128722;</span>
                    <p>Your cart is empty</p>
                    <a href="#" class="btn-primary" id="cart-shop-now" style="text-align: center; text-decoration: none; display: inline-block; margin-top: 15px; padding: 10px 20px;">Shop Now</a>
                </div>
            `;
            if (subtotalEl) subtotalEl.textContent = "$0.00";
            if (totalEl) totalEl.textContent = "$0.00";
            
            let shopNow = itemsContainer.querySelector("#cart-shop-now");
            if (shopNow) {
                shopNow.addEventListener("click", function(e) {
                    e.preventDefault();
                    closeCartDrawer();
                });
            }
            return;
        }
        
        itemsContainer.innerHTML = "";
        let subtotal = 0;
        
        cart.forEach(item => {
            let itemPriceTotal = item.price * item.quantity;
            subtotal += itemPriceTotal;
            
            let metaText = "";
            let optionsKeys = Object.keys(item.options || {});
            if (optionsKeys.length > 0) {
                metaText = optionsKeys.map(k => `${k}: ${item.options[k]}`).join(" | ");
            }
            
            let itemDiv = document.createElement("div");
            itemDiv.className = "cart-item";
            itemDiv.setAttribute("data-id", item.id);
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-img" />
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    ${metaText ? `<div class="cart-item-meta">${metaText}</div>` : ""}
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-actions" style="margin-top: 8px;">
                        <div class="cart-item-qty">
                            <button class="cart-item-qty-btn qty-dec">&minus;</button>
                            <input type="text" class="cart-item-qty-input" value="${item.quantity}" readonly />
                            <button class="cart-item-qty-btn qty-inc">&plus;</button>
                        </div>
                        <button class="cart-item-remove">Remove</button>
                    </div>
                </div>
            `;
            
            let decBtn = itemDiv.querySelector(".qty-dec");
            let incBtn = itemDiv.querySelector(".qty-inc");
            let removeBtn = itemDiv.querySelector(".cart-item-remove");
            
            decBtn.addEventListener("click", function() {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    cart = cart.filter(i => i.id !== item.id);
                }
                saveCart();
                renderCart();
            });
            
            incBtn.addEventListener("click", function() {
                if (item.quantity < 10) {
                    item.quantity += 1;
                    saveCart();
                    renderCart();
                } else {
                    showNeonToast("⚠️ Limit Reached", "Maximum of 10 items allowed per product.");
                }
            });
            
            removeBtn.addEventListener("click", function() {
                cart = cart.filter(i => i.id !== item.id);
                saveCart();
                renderCart();
            });
            
            itemsContainer.appendChild(itemDiv);
        });
        
        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
    }

    // Toggle bindings
    if (cartBtn) {
        cartBtn.addEventListener("click", function(e) {
            e.preventDefault();
            openCartDrawer();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeCartDrawer);
    }

    if (overlay) {
        overlay.addEventListener("click", closeCartDrawer);
    }

    // Event delegation for "Add to Cart" on catalog product cards
    document.body.addEventListener("click", function(e) {
        let btn = e.target.closest(".btn-cart");
        if (btn) {
            e.preventDefault();
            let card = btn.closest(".product-card");
            if (card) {
                addToCartFromCard(card);
            }
        }
    });

    function addToCartFromCard(card) {
        let titleEl = card.querySelector(".card-title a") || card.querySelector(".card-title");
        let title = titleEl ? titleEl.textContent.trim() : "Neon Product";
        let priceEl = card.querySelector(".price-current");
        let priceText = priceEl ? priceEl.textContent.trim() : "$0.00";
        let price = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;
        let imgEl = card.querySelector(".card-image img");
        let img = imgEl ? imgEl.getAttribute("src") : "./images/placeholder.png";
        
        let id = title.replace(/\s+/g, "-").toLowerCase();
        
        let existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: id,
                title: title,
                price: price,
                image: img,
                quantity: 1,
                options: {}
            });
        }
        
        saveCart();
        renderCart();
        openCartDrawer();
        showNeonToast("🛒 Added to Cart", `${title} has been added to your gear cart.`);
    }

    // Event delegation for options form submission (detail page)
    document.body.addEventListener("submit", function(e) {
        let form = e.target.closest(".p-options-form");
        if (form) {
            e.preventDefault();
            addToCartFromForm(form);
        }
    });

    document.body.addEventListener("click", function(e) {
        let btn = e.target.closest(".p-add-cart-btn");
        if (btn) {
            let form = btn.closest("form");
            if (!form) {
                e.preventDefault();
                addToCartFromForm(null);
            }
        }
    });

    function addToCartFromForm(form) {
        let titleEl = document.querySelector(".p-title");
        let title = titleEl ? titleEl.textContent.trim() : "Neon Product";
        let priceEl = document.querySelector(".p-price");
        let priceText = priceEl ? priceEl.textContent.trim() : "$0.00";
        let price = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;
        
        // Find active visible main image
        let visibleImg = Array.from(document.querySelectorAll(".p-main-img")).find(el => window.getComputedStyle(el).display !== "none");
        let imgEl = visibleImg || document.querySelector(".p-main-image-wrap img") || document.querySelector("#main-product-img");
        let img = imgEl ? imgEl.getAttribute("src") : "./images/placeholder.png";
        
        let qtyEl = document.querySelector(".qty-input");
        let qty = qtyEl ? parseInt(qtyEl.value) : 1;
        if (isNaN(qty) || qty < 1) qty = 1;
        
        // Options
        let colorRadio = document.querySelector('input[name="color-opt"]:checked');
        let colorVal = colorRadio ? colorRadio.value : "";
        let colorLabel = "";
        if (colorRadio) {
            let labelContainer = colorRadio.closest(".option-group");
            if (labelContainer) {
                let selectedValEl = labelContainer.querySelector(".selected-val");
                if (selectedValEl) colorLabel = selectedValEl.textContent.trim();
            }
            if (!colorLabel) colorLabel = colorRadio.value;
        }
        
        let switchRadio = document.querySelector('input[name="switch-opt"]:checked');
        let switchVal = switchRadio ? switchRadio.value : "";
        let switchLabel = "";
        if (switchRadio) {
            let labelContainer = switchRadio.closest(".option-group");
            if (labelContainer) {
                let selectedValEl = labelContainer.querySelector(".selected-val");
                if (selectedValEl) switchLabel = selectedValEl.textContent.trim();
            }
            if (!switchLabel) {
                let pillBtn = switchRadio.nextElementSibling;
                if (pillBtn && pillBtn.classList.contains("opt-pill-btn")) {
                    switchLabel = pillBtn.textContent.trim();
                }
            }
            if (!switchLabel) switchLabel = switchRadio.value;
        }
        
        let options = {};
        if (colorLabel) options.Color = colorLabel;
        if (switchLabel) options.Switch = switchLabel;
        
        let optionsStr = [colorVal, switchVal].filter(Boolean).join("-");
        let id = title.replace(/\s+/g, "-").toLowerCase() + (optionsStr ? "-" + optionsStr : "");
        
        let existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += qty;
        } else {
            cart.push({
                id: id,
                title: title,
                price: price,
                image: img,
                quantity: qty,
                options: options
            });
        }
        
        saveCart();
        renderCart();
        openCartDrawer();
        showNeonToast("🛒 Added to Cart", `${qty}x ${title} added to your gear cart.`);
    }

    // WhatsApp Checkout — إتمام الشراء عبر الواتساب
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function() {
            if (cart.length === 0) {
                showNeonToast("⚠️ Empty Cart", "Please add items to your cart before checking out.");
                return;
            }
            openInvoiceModal();
        });
    }

    // Render initial cart state
    renderCart();
}

// تشغيل نظام الإشعارات
initNotificationsCenter();

// تشغيل نظام السلة (تم إلغاء التفعيل المباشر ليتم التحكم به عبر كود التحميل والـ fetch)
// initCartSystem();

// دالة تحديث أرقام الكتالوج الجانبية ديناميكياً
function updateSidebarCategoryCounts() {
    let cards = document.querySelectorAll(".product-card");
    let counts = {
        "all products": 0
    };
    
    cards.forEach(card => {
        let categoryEl = card.querySelector(".card-category");
        if (categoryEl) {
            let categoryName = categoryEl.textContent.trim().toLowerCase();
            counts[categoryName] = (counts[categoryName] || 0) + 1;
            counts["all products"] += 1;
        }
    });
    
    let filterItems = document.querySelectorAll(".sidebar .filter-item");
    filterItems.forEach(item => {
        let countEl = item.querySelector(".filter-count");
        if (countEl) {
            let clone = item.cloneNode(true);
            let cloneCountEl = clone.querySelector(".filter-count");
            if (cloneCountEl) cloneCountEl.remove();
            
            let text = clone.textContent.trim().toLowerCase();
            
            if (text.includes("all products")) text = "all products";
            else if (text.includes("controllers")) text = "controllers";
            else if (text.includes("monitors")) text = "monitors";
            else if (text.includes("headsets")) text = "headsets";
            else if (text.includes("keyboards")) text = "keyboards";
            else if (text.includes("mice")) text = "mice";
            else if (text.includes("laptops")) text = "laptops";
            else if (text.includes("graphics cards")) text = "graphics cards";
            else if (text.includes("vr headsets")) text = "vr headsets";
            else if (text.includes("gaming chairs")) text = "gaming chairs";
            
            let countVal = counts[text] || 0;
            countEl.textContent = countVal;
        }
    });
}

// ── Local JSON Products Fetch & Setup ──
const localAPI = "./products.json";

function getProductLink(category) {
    const cat = category.toLowerCase().trim();
    if (cat === "controllers") return "product-controller.html";
    if (cat === "monitors") return "product-monitor.html";
    if (cat === "headsets") return "product-headset.html";
    if (cat === "keyboards") return "product-details.html";
    if (cat === "mice") return "product-mouse.html";
    if (cat === "laptops") return "product-laptop.html";
    if (cat === "graphics cards") return "product-gpu.html";
    if (cat === "vr headsets") return "product-vr.html";
    if (cat === "gaming chairs") return "product-chair.html";
    return "product-details.html";
}

function renderStarsHTML(rate) {
    let starsHTML = '';
    const fullStars = Math.floor(rate);
    const hasHalf = (rate % 1) >= 0.25 && (rate % 1) < 0.75;
    const additionalFull = (rate % 1) >= 0.75 ? 1 : 0;
    const totalFilled = fullStars + additionalFull;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= totalFilled) {
            starsHTML += '<span class="star filled">&#9733;</span>';
        } else if (i === totalFilled + 1 && hasHalf) {
            starsHTML += '<span class="star half">&#9733;</span>';
        } else {
            starsHTML += '<span class="star">&#9733;</span>';
        }
    }
    return starsHTML;
}

function createProductCardHTML(product) {
    const link = getProductLink(product.category);
    const rating = (4.0 + (product.id * 7 % 11) / 10).toFixed(1);
    const ratingCount = Math.floor(100 + (product.id * 149 % 4800));
    const starsHTML = renderStarsHTML(parseFloat(rating));
    
    let badgeHTML = '';
    if (product.id % 4 === 1) {
        badgeHTML = '<span class="card-badge badge-new">New</span>';
    } else if (product.id % 4 === 2) {
        badgeHTML = '<span class="card-badge badge-hot">Hot</span>';
    } else if (product.id % 4 === 3) {
        badgeHTML = '<span class="card-badge badge-sale">-20%</span>';
    }
    
    let pricingHTML = '';
    if (product.id % 4 === 3) {
        const originalPrice = (product.price * 1.25).toFixed(2);
        pricingHTML = `
            <span class="price-original">$${originalPrice}</span>
            <span class="price-current">$${product.price.toFixed(2)}</span>
        `;
    } else {
        pricingHTML = `
            <span class="price-current">$${product.price.toFixed(2)}</span>
        `;
    }

    return `
        <article class="product-card" data-api-id="${product.id}">
          ${badgeHTML}
          <label class="card-wishlist" aria-label="Add to wishlist">
            <input type="checkbox" class="wishlist-checkbox-hidden" />
            <span class="heart-icon">&#9825;</span>
          </label>
          <label class="card-compare" aria-label="Compare product">
            <input type="checkbox" class="compare-checkbox-hidden" />
            <svg class="compare-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 3 21 8 16 13" />
              <line x1="21" y1="8" x2="9" y2="8" />
              <polyline points="8 21 3 16 8 11" />
              <line x1="3" y1="16" x2="15" y2="16" />
            </svg>
          </label>
          <div class="card-image" aria-hidden="true">
            <a href="${link}"><img src="${product.image}" alt="${product.title}"></a>
          </div>
          <div class="card-body">
            <div class="card-category" style="text-transform: capitalize;">${product.category}</div>
            <h3 class="card-title"><a href="${link}">${product.title}</a></h3>
            <div class="card-rating">
              <div class="stars" aria-label="${rating} out of 5 stars">
                ${starsHTML}
              </div>
              <span class="rating-count">(${ratingCount})</span>
            </div>
            <p class="viewers-text">Live: <span class="viewers-count">5</span> Gamers</p>
          </div>
          <div class="card-footer">
            <div class="card-pricing">
              ${pricingHTML}
            </div>
            <button class="btn-cart"><span>Add to Cart</span></button>
          </div>
        </article>
    `;
}

function displayProducts(products) {
    const grid = document.querySelector(".product-grid");
    if (!grid) return;
    
    const banner = grid.querySelector(".featured-banner");
    grid.innerHTML = "";
    if (banner) {
        grid.appendChild(banner);
    }
    
    products.forEach(product => {
        const cardHTML = createProductCardHTML(product);
        grid.insertAdjacentHTML("beforeend", cardHTML);
    });
    
    // تحديث مرجع الكروت للإينيميشن والتفاعل
    cards = document.querySelectorAll(".product-card");
}

function fetchGamingProducts() {
    fetch(localAPI)
        .then(response => {
            if (!response.ok) {
                throw new Error("الملف مش قادر يقراه المتصفح!");
            }
            return response.json();
        })
        .then(products => {
            // الداتا الجيمنج وصلت هنا!
            displayProducts(products);
        })
        .catch(error => {
            console.error("فيه غلطة في سحب داتا الجيمنج يا صلاح:", error);
        })
        .finally(() => {
            // تشغيل جميع الأنظمة المعتمدة على الكروت بعد الرندرة
            initLiveSearch();
            initProductComparison();
            updateSidebarCategoryCounts();
            initCartSystem();
            initStarRatings();
            initTiltEffect();
            initFlyToCart();
            checkCards();
        });
}

// بدء السلسلة
const isCatalogPage = document.querySelector(".product-grid") !== null;
if (isCatalogPage) {
    fetchGamingProducts();
} else {
    // تشغيل الأنظمة مباشرة في الصفحات التفصيلية
    initLiveSearch();
    initProductComparison();
    initCartSystem();
    initStarRatings();
    initTiltEffect();
    initFlyToCart();
}

/* ── Supabase Auth Logic ── */
function initAuth() {
    if (!supabaseClient) return;

    const authModal = document.getElementById("auth-modal");
    if (!authModal) return;

    const authBtn = document.getElementById("user-account-btn");
    const closeBtn = document.getElementById("auth-modal-close");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const forgotForm = document.getElementById("forgot-password-form");
    const updateForm = document.getElementById("update-password-form");
    const loggedInDiv = document.getElementById("auth-logged-in");
    
    const switchSignup = document.getElementById("switch-to-signup");
    const switchLogin = document.getElementById("switch-to-login");
    const switchForgot = document.getElementById("switch-to-forgot");
    const forgotToLogin = document.getElementById("forgot-to-login");
    
    const logoutBtn = document.getElementById("logout-btn");
    const displayUserName = document.getElementById("auth-user-name");
    const navUserName = document.getElementById("user-display-name");

    function hideAllForms() {
        if(loginForm) loginForm.style.display = "none";
        if(signupForm) signupForm.style.display = "none";
        if(forgotForm) forgotForm.style.display = "none";
        if(updateForm) updateForm.style.display = "none";
        if(loggedInDiv) loggedInDiv.style.display = "none";
    }

    // Open/Close Modal
    if (authBtn) {
        authBtn.addEventListener("click", (e) => {
            e.preventDefault();
            authModal.classList.add("open");
            // If we are not in recovery mode, check user normally
            if (updateForm && updateForm.style.display === "block") {
                // Keep update form visible if recovery mode
            } else {
                checkUser();
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            authModal.classList.remove("open");
        });
    }

    // Switch Forms
    if (switchSignup) {
        switchSignup.addEventListener("click", (e) => {
            e.preventDefault();
            hideAllForms();
            signupForm.style.display = "block";
        });
    }
    if (switchLogin) {
        switchLogin.addEventListener("click", (e) => {
            e.preventDefault();
            hideAllForms();
            loginForm.style.display = "block";
        });
    }
    if (switchForgot) {
        switchForgot.addEventListener("click", (e) => {
            e.preventDefault();
            hideAllForms();
            forgotForm.style.display = "block";
        });
    }
    if (forgotToLogin) {
        forgotToLogin.addEventListener("click", (e) => {
            e.preventDefault();
            hideAllForms();
            loginForm.style.display = "block";
        });
    }

    // Check User State
    async function checkUser() {
        const { data: { user } } = await supabaseClient.auth.getUser();
        
        // Don't hide all forms if we are in password recovery mode!
        if (updateForm && updateForm.style.display === "block") return;
        
        hideAllForms();
        if (user) {
            loggedInDiv.style.display = "block";
            const name = user.user_metadata?.display_name || user.email.split('@')[0];
            if (displayUserName) displayUserName.textContent = name;
            if (navUserName) {
                navUserName.textContent = name;
                navUserName.style.display = "inline";
            }
        } else {
            loginForm.style.display = "block";
            if (navUserName) navUserName.style.display = "none";
        }
    }

    // Check Recovery Mode using event listener
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
            authModal.classList.add("open");
            hideAllForms();
            if(updateForm) updateForm.style.display = "block";
        }
    });

    // Initial check (delayed slightly to allow onAuthStateChange to fire if recovery)
    setTimeout(async () => {
        const hash = window.location.hash;
        if (!hash.includes("type=recovery")) {
            checkUser();
        }
    }, 500);

    // Sign Up
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("signup-email").value;
            const password = document.getElementById("signup-password").value;
            const confirmPassword = document.getElementById("signup-password-confirm").value;
            const name = document.getElementById("signup-name").value;

            if (password !== confirmPassword) {
                showCustomAlert("حماية الحساب", "كلمتا المرور غير متطابقتين!", "error");
                return;
            }

            if (password.length < 6) {
                showCustomAlert("حماية الحساب", "يجب أن تكون كلمة المرور 6 أحرف على الأقل.", "error");
                return;
            }

            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: name
                    }
                }
            });

            if (error) {
                showCustomAlert("خطأ في إنشاء الحساب", error.message, "error");
            } else {
                showCustomAlert("نجاح التسجيل", "تم إنشاء حسابك في NeonTech بنجاح! يرجى تسجيل الدخول الآن.", "success");
                hideAllForms();
                loginForm.style.display = "block";
            }
        });
    }

    // Login
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                showCustomAlert("خطأ في تسجيل الدخول", "البريد الإلكتروني أو كلمة المرور غير صحيحة، أو حدثت مشكلة: " + error.message, "error");
            } else {
                checkUser();
            }
        });
    }

    // Forgot Password
    if (forgotForm) {
        forgotForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("forgot-email").value;
            const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + window.location.pathname
            });

            if (error) {
                showCustomAlert("خطأ في استعادة الحساب", error.message, "error");
            } else {
                showCustomAlert("استعادة كلمة المرور", "تم إرسال رابط استعادة كلمة المرور لـ NeonTech إلى بريدك الإلكتروني بنجاح!", "success");
                hideAllForms();
                loginForm.style.display = "block";
            }
        });
    }

    // Update Password
    if (updateForm) {
        updateForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const newPassword = document.getElementById("update-password").value;
            const confirmNewPassword = document.getElementById("update-password-confirm").value;

            if (newPassword !== confirmNewPassword) {
                showCustomAlert("تحديث كلمة المرور", "كلمتا المرور غير متطابقتين!", "error");
                return;
            }

            if (newPassword.length < 6) {
                showCustomAlert("تحديث كلمة المرور", "يجب أن تكون كلمة المرور 6 أحرف على الأقل.", "error");
                return;
            }

            const { error } = await supabaseClient.auth.updateUser({
                password: newPassword
            });

            if (error) {
                showCustomAlert("خطأ في التحديث", "حدث خطأ أثناء تحديث كلمة المرور: " + error.message, "error");
            } else {
                showCustomAlert("تم التحديث", "تم تحديث كلمة مرور حسابك في NeonTech بنجاح!", "success");
                hideAllForms();
                checkUser();
                
                // Clear the hash from URL so it doesn't trigger recovery again
                window.history.replaceState(null, null, window.location.pathname);
            }
        });
    }
    // Google OAuth
    const googleBtns = document.querySelectorAll(".google-signin-btn");
    googleBtns.forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            const { data, error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + window.location.pathname
                }
            });
            if (error) {
                showCustomAlert("تسجيل الدخول - NeonTech", "حدث خطأ في تسجيل دخول NeonTech عبر جوجل: " + error.message, "error");
            }
        });
    });

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            const { error } = await supabaseClient.auth.signOut();
            if (error) {
                console.error("Logout Error:", error);
            } else {
                checkUser();
            }
        });
    }
}

initAuth();

/* ── Featured Banner: Shop Now & Learn More ── */
(function () {
    var shopNowBtn = document.getElementById("featured-shop-now");
    var learnMoreBtn = document.getElementById("featured-learn-more");
    var pimModal = document.getElementById("product-info-modal");
    var pimOverlay = document.getElementById("pim-overlay");
    var pimClose = document.getElementById("pim-close");
    var pimCloseBtns = pimModal ? pimModal.querySelectorAll(".pim-close-btn") : [];
    var pimAddCart = pimModal ? pimModal.querySelector(".pim-add-cart") : null;

    function openModal() {
        if (pimModal) {
            pimModal.classList.add("open");
            document.body.style.overflow = "hidden";
        }
    }

    function closeModal() {
        if (pimModal) {
            pimModal.classList.remove("open");
            document.body.style.overflow = "";
        }
    }

    if (shopNowBtn) {
        shopNowBtn.addEventListener("click", function () {
            var grid = document.querySelector(".product-grid");
            if (grid) {
                grid.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    }

    if (learnMoreBtn) {
        learnMoreBtn.addEventListener("click", openModal);
    }

    if (pimClose) {
        pimClose.addEventListener("click", closeModal);
    }

    pimCloseBtns.forEach(function (btn) {
        btn.addEventListener("click", closeModal);
    });

    if (pimOverlay) {
        pimOverlay.addEventListener("click", closeModal);
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && pimModal && pimModal.classList.contains("open")) {
            closeModal();
        }
    });

    if (pimAddCart) {
        pimAddCart.addEventListener("click", function () {
            closeModal();
            var cartBtn = document.querySelector(".nav-btn[aria-label*='cart']") ||
                          document.querySelector(".nav-btn[aria-label*='Cart']");
            if (cartBtn) {
                setTimeout(function () { cartBtn.click(); }, 200);
            }
        });
    }
}());

/* ── Newsletter Subscription Handler ── */
function initNewsletterSubscription() {
    const newsletterForm = document.querySelector(".newsletter-form");
    if (!newsletterForm) return;

    newsletterForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector("input[type='email']");
        if (!emailInput) return;

        const email = emailInput.value.trim();
        if (!email) return;

        // Simple validation check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showCustomAlert("📬 اشتراك النشرة البريدية", "يرجى إدخال بريد إلكتروني صحيح وصالح.", "warning");
            return;
        }

        try {
            if (supabaseClient) {
                // Attempt to insert to database table 'newsletter'
                const { error } = await supabaseClient.from('newsletter').insert([{ email }]);
                if (error) {
                    console.log("Supabase insert bypassed (local simulation fallback):", error.message);
                }
            }

            // Fallback & client-side persistence
            let subscribers = JSON.parse(localStorage.getItem("neontech_subscribers") || "[]");
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem("neontech_subscribers", JSON.stringify(subscribers));
            }

            // Success alert
            showCustomAlert(
                "📬 تم الاشتراك بنجاح!",
                `شكراً لك يا بطل! تم الاشتراك بالبريد الإلكتروني <strong style="color: #00ff87;">${email}</strong> في نشرة NeonTech البريدية بنجاح. استعد للحصول على أقوى عروض الجيمنج الحصرية!`,
                "success"
            );

            // Clear input
            emailInput.value = "";

        } catch (err) {
            console.error("Newsletter submission error:", err);
            showCustomAlert("📬 اشتراك النشرة البريدية", "تم تسجيل اشتراكك بنجاح في NeonTech! شكراً لانضمامك إلينا.", "success");
            emailInput.value = "";
        }
    });
}

initNewsletterSubscription();

/* ── PWA: Service Worker Registration ── */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then((registration) => {
                    console.log('⚡ [PWA] Service Worker registered successfully with scope:', registration.scope);
                })
                .catch((error) => {
                    console.warn('⚠️ [PWA] Service Worker registration failed:', error);
                });
        });
    }
}

registerServiceWorker();

/* ── Interactive RGB Gear Customizer ── */
function initRGBCustomizer() {
    if (document.getElementById("rgb-customizer")) return;
    
    const customizer = document.createElement("div");
    customizer.id = "rgb-customizer";
    customizer.className = "rgb-customizer-container no-print";
    customizer.innerHTML = `
        <button class="rgb-toggle-btn" aria-label="Toggle RGB Customizer">
            <svg class="rgb-gear-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
        </button>
        <div class="rgb-menu">
            <div class="rgb-menu-header">
                <h4>RGB GEAR GLOW</h4>
                <button class="rgb-close-btn">&times;</button>
            </div>
            <p class="rgb-menu-subtitle">Customize NeonTech's gaming atmosphere:</p>
            <div class="rgb-options">
                <button class="rgb-option-btn theme-green active" data-theme="default" aria-label="Cyber Green">
                    <span class="color-dot" style="background: #00ff87; color: #00ff87;"></span> Green
                </button>
                <button class="rgb-option-btn theme-pink" data-theme="pink" aria-label="Cyber Pink">
                    <span class="color-dot" style="background: #ff007f; color: #ff007f;"></span> Pink
                </button>
                <button class="rgb-option-btn theme-cyan" data-theme="cyan" aria-label="Arctic Cyan">
                    <span class="color-dot" style="background: #00f0ff; color: #00f0ff;"></span> Cyan
                </button>
                <button class="rgb-option-btn theme-gold" data-theme="gold" aria-label="Glorious Gold">
                    <span class="color-dot" style="background: #ffde00; color: #ffde00;"></span> Gold
                </button>
            </div>
            <div style="height: 1px; background: rgba(255,255,255,0.08); margin: 12px 0;"></div>
            <p class="rgb-menu-subtitle" style="margin-bottom: 8px;">Base UI Theme:</p>
            <div style="display: flex; gap: 8px;">
                <button class="rgb-option-btn theme-mode-btn dark active" data-mode="dark" style="flex: 1; justify-content: center; padding: 6px; font-family: inherit; font-size: 0.82rem;">
                    🌙 Dark
                </button>
                <button class="rgb-option-btn theme-mode-btn light" data-mode="light" style="flex: 1; justify-content: center; padding: 6px; font-family: inherit; font-size: 0.82rem;">
                    ☀️ Light
                </button>
            </div>
            <div style="height: 1px; background: rgba(255,255,255,0.08); margin: 12px 0;"></div>
            <a href="viewer-3d.html" class="rgb-option-btn" style="justify-content: center; text-decoration: none; font-weight: bold; border-color: var(--neon); color: var(--neon); box-shadow: 0 0 8px rgba(0, 255, 135, 0.2); font-size: 0.82rem;">
                🎮 3D HOLOGRAM ROOM
            </a>
        </div>
    `;
    
    document.body.appendChild(customizer);
    
    const toggleBtn = customizer.querySelector(".rgb-toggle-btn");
    const closeBtn = customizer.querySelector(".rgb-close-btn");
    
    toggleBtn.addEventListener("click", () => {
        customizer.classList.toggle("open");
    });
    
    closeBtn.addEventListener("click", () => {
        customizer.classList.remove("open");
    });
    
    document.addEventListener("click", (e) => {
        if (!customizer.contains(e.target) && customizer.classList.contains("open")) {
            customizer.classList.remove("open");
        }
    });
    
    // RGB Glow Options
    const optionBtns = customizer.querySelectorAll(".rgb-option-btn[data-theme]");
    const savedTheme = localStorage.getItem("neontech-rgb-theme") || "default";
    applyThemeClass(savedTheme);
    
    optionBtns.forEach(btn => {
        const theme = btn.getAttribute("data-theme");
        if (theme === savedTheme) {
            optionBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        }
        
        btn.addEventListener("click", () => {
            optionBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const selectedTheme = btn.getAttribute("data-theme");
            localStorage.setItem("neontech-rgb-theme", selectedTheme);
            applyThemeClass(selectedTheme);
            
            showNeonToast("🎮 RGB Profile Synced", `Atmosphere shifted to ${btn.innerText.trim()}.`);
        });
    });
    
    function applyThemeClass(theme) {
        document.body.classList.remove("theme-pink", "theme-cyan", "theme-gold");
        if (theme === "pink") {
            document.body.classList.add("theme-pink");
        } else if (theme === "cyan") {
            document.body.classList.add("theme-cyan");
        } else if (theme === "gold") {
            document.body.classList.add("theme-gold");
        }
    }
    
    // Base Theme Mode setup (Light / Dark UI)
    const modeBtns = customizer.querySelectorAll(".theme-mode-btn");
    const savedMode = localStorage.getItem("neontech_theme") || "dark";
    applyThemeMode(savedMode);
    
    modeBtns.forEach(btn => {
        const mode = btn.getAttribute("data-mode");
        if (mode === savedMode) {
            modeBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        }
        
        btn.addEventListener("click", () => {
            modeBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const selectedMode = btn.getAttribute("data-mode");
            localStorage.setItem("neontech_theme", selectedMode);
            applyThemeMode(selectedMode);
            
            if (selectedMode === "light") {
                showNeonToast("☀️ Light Mode Activated", "Atmosphere shifted to a bright workspace.");
            } else {
                showNeonToast("🌙 Dark Mode Activated", "Atmosphere shifted to deep stealth mode.");
            }
        });
    });
    
    function applyThemeMode(mode) {
        if (mode === "light") {
            document.body.classList.add("light-theme");
        } else {
            document.body.classList.remove("light-theme");
        }
    }
}

initRGBCustomizer();

/* ── Interactive Invoice Modal & Checkout ── */
let activeDiscountPercent = 0;
let appliedPromoCode = "";

function initInvoiceModal() {
    if (document.getElementById("invoice-modal")) return;
    
    const modal = document.createElement("div");
    modal.id = "invoice-modal";
    modal.className = "invoice-modal-overlay no-print";
    modal.innerHTML = `
        <div class="invoice-modal-content">
            <div class="invoice-header">
                <div class="invoice-logo">
                    <div class="logo-icon" style="width:32px; height:32px; display:inline-block; vertical-align:middle; margin-right:8px;">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#00ff87"/>
                        </svg>
                    </div>
                    <span>Neon<span style="color:#00ff87">Tech</span></span>
                </div>
                <div class="invoice-meta">
                    <h3>RETAIL INVOICE</h3>
                    <p>Date: <span id="invoice-date">--/--/----</span></p>
                    <p>Order: <span id="invoice-id">#NT-XXXXX</span></p>
                </div>
            </div>
            
            <div class="invoice-separator"></div>
            
            <div class="invoice-billing">
                <div>
                    <strong>Billed To:</strong>
                    <p id="invoice-user-name">Guest Gamer</p>
                    <p id="invoice-user-email">guest@neontech.com</p>
                </div>
                <div style="text-align: right;">
                    <strong>Seller Details:</strong>
                    <p>NeonTech Gaming Store</p>
                    <p>Salah Khaled — Owner</p>
                    <p>salah@neontech.com</p>
                </div>
            </div>
            
            <div class="invoice-separator"></div>
            
            <table class="invoice-table">
                <thead>
                    <tr>
                        <th style="text-align: left;">Product / Gear</th>
                        <th style="text-align: center;">Qty</th>
                        <th style="text-align: right;">Unit Price</th>
                        <th style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody id="invoice-items">
                </tbody>
            </table>
            
            <div class="invoice-separator"></div>
            
            <div class="invoice-summary-section">
                <div class="promo-code-container">
                    <label for="invoice-promo-input">Enter Promo Code:</label>
                    <div class="promo-input-group">
                        <input type="text" id="invoice-promo-input" placeholder="e.g. SALAH10" aria-label="Promo code input" />
                        <button id="invoice-promo-apply-btn">Apply</button>
                    </div>
                    <p id="invoice-promo-status"></p>
                </div>
                
                <div class="invoice-totals">
                    <div class="totals-row">
                        <span>Subtotal:</span>
                        <span id="invoice-subtotal">$0.00</span>
                    </div>
                    <div class="totals-row discount-row" style="display: none; color: #ff007f;">
                        <span>Discount (<span id="invoice-discount-percent">0</span>%):</span>
                        <span id="invoice-discount-val">-$0.00</span>
                    </div>
                    <div class="totals-row">
                        <span>VAT (15%):</span>
                        <span id="invoice-tax">$0.00</span>
                    </div>
                    <div class="totals-row">
                        <span>Shipping:</span>
                        <span style="color: #00ff87; font-weight: bold;">FREE</span>
                    </div>
                    <div class="invoice-separator" style="margin: 8px 0;"></div>
                    <div class="totals-row grand-total-row">
                        <span>Grand Total:</span>
                        <span id="invoice-grand-total">$0.00</span>
                    </div>
                </div>
            </div>
            
            <div class="invoice-separator"></div>
            
            <div class="invoice-footer-notes">
                <p>⚠️ Thank you for choosing NeonTech! Elite support is available 24/7 via Discord or WhatsApp.</p>
                <p style="font-size: 0.7rem; opacity: 0.6; margin-top: 4px;">This is a computer generated invoice and requires no signature.</p>
            </div>
            
            <div class="invoice-actions no-print">
                <button class="invoice-btn-cancel">Close</button>
                <button class="invoice-btn-print">Print Receipt</button>
                <button class="invoice-btn-whatsapp">Send on WhatsApp</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector(".invoice-btn-cancel").addEventListener("click", () => {
        modal.classList.remove("open");
    });
    
    modal.querySelector("#invoice-promo-apply-btn").addEventListener("click", applyPromoCode);
    modal.querySelector(".invoice-btn-print").addEventListener("click", () => window.print());
    modal.querySelector(".invoice-btn-whatsapp").addEventListener("click", sendWhatsAppOrder);
}

function openInvoiceModal() {
    initInvoiceModal();
    
    const modal = document.getElementById("invoice-modal");
    if (!modal) return;
    
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    modal.querySelector("#invoice-date").textContent = dateStr;
    
    const randomId = Math.floor(10000 + Math.random() * 90000);
    modal.querySelector("#invoice-id").textContent = `#NT-${randomId}`;
    
    let userName = "Guest Gamer";
    let userEmail = "guest@neontech.com";
    
    if (supabaseClient) {
        supabaseClient.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                userName = user.user_metadata?.full_name || user.email.split("@")[0];
                userEmail = user.email;
                modal.querySelector("#invoice-user-name").textContent = userName;
                modal.querySelector("#invoice-user-email").textContent = userEmail;
            }
        });
    }
    
    modal.querySelector("#invoice-user-name").textContent = userName;
    modal.querySelector("#invoice-user-email").textContent = userEmail;
    
    const itemsTbody = modal.querySelector("#invoice-items");
    itemsTbody.innerHTML = "";
    
    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <div class="invoice-item-title">${item.title}</div>
                <div class="invoice-item-option">${item.options ? item.options : 'Standard Edition'}</div>
            </td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right;">$${item.price.toFixed(2)}</td>
            <td style="text-align: right;">$${itemTotal.toFixed(2)}</td>
        `;
        itemsTbody.appendChild(row);
    });
    
    activeDiscountPercent = 0;
    appliedPromoCode = "";
    modal.querySelector("#invoice-promo-input").value = "";
    modal.querySelector("#invoice-promo-status").textContent = "";
    modal.querySelector("#invoice-promo-status").className = "";
    modal.querySelector(".discount-row").style.display = "none";
    
    updateInvoiceTotals(subtotal);
    modal.classList.add("open");
}

function updateInvoiceTotals(subtotal) {
    const modal = document.getElementById("invoice-modal");
    if (!modal) return;
    
    const discountVal = subtotal * (activeDiscountPercent / 100);
    const taxableAmount = subtotal - discountVal;
    const taxVal = taxableAmount * 0.15;
    const grandTotal = taxableAmount + taxVal;
    
    modal.querySelector("#invoice-subtotal").textContent = `$${subtotal.toFixed(2)}`;
    
    if (activeDiscountPercent > 0) {
        modal.querySelector("#invoice-discount-percent").textContent = activeDiscountPercent;
        modal.querySelector("#invoice-discount-val").textContent = `-$${discountVal.toFixed(2)}`;
        modal.querySelector(".discount-row").style.display = "flex";
    } else {
        modal.querySelector(".discount-row").style.display = "none";
    }
    
    modal.querySelector("#invoice-tax").textContent = `$${taxVal.toFixed(2)}`;
    modal.querySelector("#invoice-grand-total").textContent = `$${grandTotal.toFixed(2)}`;
}

function applyPromoCode() {
    const modal = document.getElementById("invoice-modal");
    if (!modal) return;
    
    const promoInput = modal.querySelector("#invoice-promo-input").value.trim().toUpperCase();
    const promoStatus = modal.querySelector("#invoice-promo-status");
    
    if (promoInput === "") {
        promoStatus.textContent = "Please enter a code.";
        promoStatus.className = "error";
        return;
    }
    
    if (promoInput === "SALAH10") {
        activeDiscountPercent = 10;
        appliedPromoCode = "SALAH10";
        promoStatus.textContent = "🎉 Code applied! 10% discount deducted.";
        promoStatus.className = "success";
        
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        updateInvoiceTotals(subtotal);
        
        showNeonToast("🎟️ Coupon Activated", "10% off has been applied to your invoice.");
    } else {
        promoStatus.textContent = "❌ Invalid code. Try SALAH10!";
        promoStatus.className = "error";
    }
}

function sendWhatsAppOrder() {
    const modal = document.getElementById("invoice-modal");
    if (!modal) return;
    
    const orderId = modal.querySelector("#invoice-id").textContent;
    const subtotalText = modal.querySelector("#invoice-subtotal").textContent;
    const taxText = modal.querySelector("#invoice-tax").textContent;
    const grandTotalText = modal.querySelector("#invoice-grand-total").textContent;
    
    let itemLines = "";
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        itemLines += `🎮 ${item.title} (${item.options ? item.options : 'Standard'})\n`;
        itemLines += `   Qty: ${item.quantity} x $${item.price.toFixed(2)} = $${itemTotal.toFixed(2)}\n`;
    });
    
    let message = `السلام عليكم، حابب أطلب الأدوات دي من موقع Neon Tech:\n\n`;
    message += `📋 *تفاصيل الطلب (${orderId})*:\n`;
    message += `----------------------------------------\n`;
    message += itemLines;
    message += `----------------------------------------\n`;
    
    message += `💰 *Subtotal*: ${subtotalText}\n`;
    if (activeDiscountPercent > 0) {
        message += `🎟️ *Discount (${activeDiscountPercent}%)*: ${appliedPromoCode} (-${modal.querySelector("#invoice-discount-val").textContent})\n`;
    }
    message += `📊 *VAT (15%)*: ${taxText}\n`;
    message += `🚚 *Shipping*: FREE\n`;
    message += `💸 *Grand Total*: *${grandTotalText}*\n\n`;
    message += `💳 *طريقة الدفع*: كاش عند الاستلام أو Instapay\n\n`;
    message += `شكرًا NeonTech!`;
    
    const whatsappNumber = "966500438424";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    const whatsappBtn = modal.querySelector(".invoice-btn-whatsapp");
    whatsappBtn.disabled = true;
    const originalText = whatsappBtn.innerHTML;
    whatsappBtn.innerHTML = `<span>Redirecting...</span>`;
    
    setTimeout(() => {
        window.open(whatsappUrl, "_blank");
        
        cart = [];
        saveCart();
        renderCart();
        closeCartDrawer();
        
        modal.classList.remove("open");
        
        whatsappBtn.disabled = false;
        whatsappBtn.innerHTML = originalText;
        
        playNotificationSound();
        showNeonToast("📱 Order Dispatched", "Your checkout sheet is opened in WhatsApp!");
    }, 1200);
}