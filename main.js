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

// دالة التحقق من تسجيل الدخول قبل أي عملية (إضافة للسلة أو شراء)
async function requireAuth(onSuccess) {
    let loggedIn = false;
    
    // 1. فحص حالة الـ UI أولاً (وهو الفحص الأكثر أماناً ومزامنة مع العميل)
    const loggedInDiv = document.getElementById("auth-logged-in");
    if (loggedInDiv && window.getComputedStyle(loggedInDiv).display !== "none") {
        loggedIn = true;
    }
    
    // 2. محاولة الفحص عبر Supabase Client إذا لم يكن متأكداً من الـ UI
    if (!loggedIn && supabaseClient) {
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session && session.user) {
                loggedIn = true;
            }
        } catch (error) {
            console.warn("Supabase session check error:", error);
        }
    }
    
    // 3. محاولة الفحص عبر LocalStorage مع التحقق من انتهاء الصلاحية
    if (!loggedIn) {
        try {
            const sbTokenKey = Object.keys(localStorage).find(key => key.startsWith("sb-") && key.endsWith("-auth-token"));
            if (sbTokenKey) {
                const tokenData = JSON.parse(localStorage.getItem(sbTokenKey));
                const now = Math.floor(Date.now() / 1000);
                if (tokenData && tokenData.user && tokenData.expires_at && tokenData.expires_at > now) {
                    loggedIn = true;
                }
            }
        } catch (e) {
            console.warn("LocalStorage auth check error:", e);
        }
    }
    
    // 4. اتخاذ القرار بناءً على حالة تسجيل الدخول
    if (loggedIn) {
        onSuccess();
    } else {
        showCustomAlert(
            "تسجيل الدخول مطلوب 🎮",
            "يجب عليك تسجيل الدخول أولاً لتتمكن من إضافة المنتجات إلى السلة أو الشراء!",
            "warning"
        );
        const authModal = document.getElementById("auth-modal");
        if (authModal) {
            authModal.classList.add("open");
            // إظهار فورمة تسجيل الدخول وإخفاء الباقي
            const loginForm = document.getElementById("login-form");
            const signupForm = document.getElementById("signup-form");
            const forgotForm = document.getElementById("forgot-password-form");
            const updateForm = document.getElementById("update-password-form");
            const loggedInDiv = document.getElementById("auth-logged-in");
            if (loginForm) loginForm.style.display = "block";
            if (signupForm) signupForm.style.display = "none";
            if (forgotForm) forgotForm.style.display = "none";
            if (updateForm) updateForm.style.display = "none";
            if (loggedInDiv) loggedInDiv.style.display = "none";
        }
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
    setInterval(function () {
        let viewersList = document.querySelectorAll(".viewers-count");
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
            // التحقق مما إذا كان الزر عبارة عن label مرتبط بخيار لون راديو
            let labelFor = btn.getAttribute("for");
            if (labelFor) {
                let radioInput = document.getElementById(labelFor);
                if (radioInput) {
                    radioInput.checked = true;
                    // تفعيل حدث change لتشغيل ممعالجات الراديو ديناميكياً
                    radioInput.dispatchEvent(new Event('change', { bubbles: true }));
                    
                    // تمييز المصغر النشط
                    thumbBtns.forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                    return; // نترك مستمع الراديو يقوم بباقي العمل لتفادي التكرار
                }
            }
            
            // السلوك الافتراضي للمنتجات ذات الصورة الواحدة (مثل RTX 5090)
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

    // تفعيل معالجة تبديل خيارات الألوان من خلال الراديو مباشرة (Product Colors Form Switcher)
    let colorRadioButtons = document.querySelectorAll('input[name="color-opt"]');
    if (colorRadioButtons.length > 0) {
        colorRadioButtons.forEach(function(radio) {
            radio.addEventListener("change", function() {
                let val = radio.value;
                
                // 1. تبديل الصورة الرئيسية للمنتج (إخفاء الكل وإظهار المختار بـ JS كدعم إضافي للـ CSS)
                let allMainImgs = document.querySelectorAll(".p-main-image-wrap .p-main-img");
                if (allMainImgs.length > 0) {
                    allMainImgs.forEach(img => {
                        img.style.display = "none";
                    });
                    let selectedImg = document.querySelector(`.p-main-image-wrap .img-${val}`);
                    if (selectedImg) {
                        selectedImg.style.display = "block";
                    }
                }
                
                // 2. تحديث نص اسم اللون المحدد في الواجهة
                let labelContainer = radio.closest(".option-group");
                if (labelContainer) {
                    let selectedValEl = labelContainer.querySelector(".selected-val");
                    if (selectedValEl) {
                        let colorNames = {
                            "carbon": "Carbon Black",
                            "white": "White Edition",
                            "red": "Red Edition",
                            "blue": "Blue Edition"
                        };
                        // تعديل مسمى اللون للكرسي Titan Evo
                        if (document.title.includes("Secretlab") || document.title.includes("Titan")) {
                            colorNames["carbon"] = "Stealth Black";
                        }
                        
                        let engColor = colorNames[val] || val;
                        const activeLang = localStorage.getItem("neontech_lang") || "en";
                        if (activeLang === "ar") {
                            selectedValEl.textContent = staticPhrases[engColor.toLowerCase()] || engColor;
                        } else {
                            selectedValEl.textContent = engColor;
                        }
                    }
                }
                
                // 3. مزامنة كلاس active مع المصغر النشط
                let thumbBtns = document.querySelectorAll(".p-thumb-grid .thumb-btn");
                thumbBtns.forEach(btn => btn.classList.remove("active"));
                
                let matchingThumb = document.querySelector(`.p-thumb-grid .thumb-btn[for="${radio.id}"]`);
                if (matchingThumb) {
                    matchingThumb.classList.add("active");
                }
            });
        });
    }

    // تفعيل معالجة تبديل الخيارات وتحديث النص ديناميكياً مع دعم الترجمة الفورية للعربية (Dynamic Bilingual Option Selections Switcher)
    document.addEventListener("change", function(e) {
        if (e.target && e.target.closest(".option-selectors") && e.target.type === "radio") {
            const radio = e.target;
            const group = radio.closest(".option-group");
            if (!group) return;
            const selectedValEl = group.querySelector(".selected-val");
            if (!selectedValEl) return;
            
            const activeLang = localStorage.getItem("neontech_lang") || "en";
            
            // Get option display text from pill button or input value
            const pillBtn = radio.nextElementSibling;
            let displayVal = "";
            if (pillBtn && pillBtn.classList.contains("opt-pill-btn")) {
                displayVal = pillBtn.textContent.trim();
            } else {
                displayVal = radio.value;
            }
            
            if (activeLang === "ar") {
                let rawValue = radio.value;
                let valueMapping = {
                    "carbon": "Carbon Black",
                    "white": "White Edition",
                    "red": "Red Edition",
                    "blue": "Blue Edition",
                    "1000": "1000Hz (Standard)",
                    "8000": "8000Hz (Dongle Needed)",
                    "128": "128GB Storage",
                    "512": "512GB Storage (+$120)",
                    "standard": "Standard Soft Strap",
                    "elite": "Elite Battery Strap (+$100)",
                    "leatherette": "Premium Leatherette",
                    "fabric": "Breathable Fabric Mesh",
                    "regular": "Regular (170-189cm)",
                    "xl": "XL (190-200cm)",
                    "small": "Small (Under 170cm)",
                    "gl-tactile": "GL Tactile (Quiet)",
                    "gl-clicky": "GL Clicky (Audible)",
                    "gl-linear": "GL Linear (Smooth)",
                    "founders": "Founders Edition (Triple-Slot Fan)",
                    "triple-fan": "Custom OC (Triple-Slot Fan)",
                    "liquid": "Liquid Cooled AIO",
                    "32gb": "32GB GDDR7",
                    "48gb": "48GB GDDR7",
                    "matte": "Anti-Glare Matte",
                    "glossy": "Glossy AR Glass",
                    "27-360": "27\" WQHD 360Hz",
                    "32-240": "32\" 4K UHD 240Hz",
                    "dual-mode": "Dual Mini-LED (UHD+ 120Hz / FHD+ 240Hz)",
                    "oled-mode": "QHD OLED 240Hz",
                    "32gb-2tb": "32GB RAM + 2TB SSD",
                    "64gb-4tb": "64GB RAM + 4TB SSD",
                    "standard-grip": "Standard Grip",
                    "sticky-grip": "Pro Sticky Grip",
                    "hybrid-leather": "NEO Hybrid Leatherette",
                    "softweave": "SoftWeave Plus Fabric",
                    "nappa": "Premium Napa Leather"
                };
                
                let englishVal = valueMapping[rawValue] || displayVal;
                if (rawValue === "carbon" && (document.title.includes("Secretlab") || document.title.includes("Titan"))) {
                    englishVal = "Stealth Black";
                }
                
                let translatedVal = staticPhrases[englishVal.toLowerCase().trim()] || displayVal;
                selectedValEl.textContent = translatedVal;
            } else {
                selectedValEl.textContent = displayVal;
            }
        }
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
                requireAuth(() => {
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
            const activeLang = localStorage.getItem("neontech_lang") || "en";
            if (activeLang === "ar") {
                showNeonToast("⚡ تم تحميل المزيد من العتاد", "المجموعة التالية من الأجهزة الاحترافية جاهزة الآن.");
            } else {
                showNeonToast("⚡ More Gear Loaded", "Next set of elite items are ready.");
            }
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
                    <img class="comp-product-img" src="${item.image}" alt="${getTranslatedProductTitle(item.title)}">
                    <div class="comp-product-name">${getTranslatedProductTitle(item.title)}</div>
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
        const activeLang = localStorage.getItem("neontech_lang") || "en";
        
        // Translate header elements
        const headerTitle = dropdown.querySelector(".notif-header h3");
        if (headerTitle) {
            headerTitle.textContent = activeLang === "ar" ? "الإشعارات" : "Notifications";
        }
        const clearBtn = dropdown.querySelector(".notif-clear-all");
        if (clearBtn) {
            clearBtn.textContent = activeLang === "ar" ? "مسح الكل" : "Clear All";
        }
        
        if (notifications.length === 0) {
            listContainer.innerHTML = `
                <div class="notif-empty">
                    <span>🔔</span>
                    <p>${activeLang === "ar" ? "لا توجد إشعارات جديدة" : "No new notifications"}</p>
                </div>
            `;
            removeBadge();
            return;
        }

        const notifMap = {
            "order shipped!": { title: "تم شحن الطلب! 📦", desc: "طلبك رقم #1020 تم شحنه وهو في طريقه إليك الآن." },
            "cyber deal unlocked": { title: "عرض خاص مكشوف ⚡", desc: "استخدم كود الخصم NEON50 للحصول على خصم 50% على لوحات المفاتيح الميكانيكية المحددة." },
            "security alert": { title: "تنبيه أمني 🔒", desc: "تم تحديث إعدادات الأمان الخاصة بحسابك بنجاح." },
            "flash sale alert!": { title: "تنبيه تخفيض خاطف! ⚡", desc: "سماعة SteelSeries Arctis Nova Pro الآن بخصم 30% للساعتين القادمتين. لا تفوت العرض!" },
            "limited drop live!": { title: "إصدار محدود متوفر الآن! ⌨️", desc: "لوحة مفاتيح Razer BlackWidow V4 Pro Phantom Edition متوفرة الآن في المخزون. 200 قطعة فقط!" },
            "monthly gear giveaway!": { title: "سحب الجوائز الشهري! 🎁", desc: "شارك في سحب NeonTech الشهري اليوم للفوز بنظارة واقع افتراضي حديثة مجانية. تُعلن النتائج يوم الجمعة!" },
            "exclusive gamer discount!": { title: "خصم حصري للاعبين! 🔥", desc: "استخدم كود الخصم DOCK15 للحصول على خصم 15% على أي لوحة ماوس فاخرة أو إكسسوار قيمنق." },
            "elite controller restocked!": { title: "إعادة توفر أداة التحكم الاحترافية! 🎮", desc: "أداة التحكم الاحترافية الخالية من عيوب الانجراف متوفرة الآن في المخزون. اطلبها قبل النفاد!" },
            "pro setup guide published!": { title: "نشر دليل إعداد منصة الاحتراف! 💡", desc: "تعرف على كيفية ضبط معدل DPI للماوس وتردد الشاشة Hz للحصول على أفضل أداء تنافسي. اقرأ الدليل الآن!" }
        };

        notifications.forEach(notif => {
            let item = document.createElement("div");
            item.className = `notif-item ${notif.unread ? "unread" : ""}`;
            item.setAttribute("data-id", notif.id);
            
            let displayTitle = notif.title;
            let displayDesc = notif.desc;
            
            if (activeLang === "ar") {
                const cleanTitle = notif.title.replace(/[^\w\s!?]/g, "").trim().toLowerCase();
                if (notifMap[cleanTitle]) {
                    displayTitle = notifMap[cleanTitle].title;
                    displayDesc = notifMap[cleanTitle].desc;
                } else {
                    for (let key in notifMap) {
                        if (notif.title.toLowerCase().includes(key)) {
                            displayTitle = notifMap[key].title;
                            displayDesc = notifMap[key].desc;
                            break;
                        }
                    }
                }
            }

            item.innerHTML = `
                <div class="notif-icon">${notif.icon}</div>
                <div class="notif-content">
                    <div class="notif-title">${displayTitle}</div>
                    <div class="notif-desc">${displayDesc}</div>
                    <div class="notif-time">${activeLang === "ar" ? "منذ قليل" : notif.time}</div>
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
        // إذا تم عرض الإشعار بالفعل في هذه الجلسة، لا تعرض أي إشعارات تلقائية أخرى
        if (sessionStorage.getItem('neontech_notif_shown')) {
            return;
        }

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
        const activeLang = localStorage.getItem("neontech_lang") || "en";
        let displayToastTitle = selectedItem.toastTitle;
        let displayToastDesc = selectedItem.toastDesc;
        
        if (activeLang === "ar") {
            const notifMap = {
                "flash sale alert!": { title: "تنبيه تخفيض خاطف! ⚡", desc: "سماعة SteelSeries Arctis Nova Pro بخصم 30%!" },
                "limited drop live!": { title: "إصدار محدود متوفر الآن! ⌨️", desc: "لوحة مفاتيح رايزر بلاك ويدو فانتوم متوفرة الآن!" },
                "monthly gear giveaway!": { title: "سحب الجوائز الشهري! 🎁", desc: "اربح نظارة واقع افتراضي مجانية!" },
                "exclusive gamer discount!": { title: "خصم حصري للاعبين! 🔥", desc: "خصم 15% على إكسسوارات القيمنق!" },
                "elite controller restocked!": { title: "أداة تحكم احترافية متوفرة! 🎮", desc: "أدوات التحكم الاحترافية عادت للمخزون!" },
                "pro setup guide published!": { title: "دليل الاحتراف متوفر! 💡", desc: "اضبط الـ DPI ومعدل التحديث كالمحترفين!" }
            };
            const cleanTitle = selectedItem.title.replace(/[^\w\s!?]/g, "").trim().toLowerCase();
            if (notifMap[cleanTitle]) {
                displayToastTitle = notifMap[cleanTitle].title;
                displayToastDesc = notifMap[cleanTitle].desc;
            }
        }
        
        showNeonToast(displayToastTitle, displayToastDesc, function() {
            dropdown.classList.add("open");
            document.body.classList.add("notif-open");
            notifications.forEach(n => n.unread = false);
            renderNotifications();
            updateBadge();
        });

        // حفظ علامة تفيد بأنه تم عرض الإشعار بنجاح في الجلسة الحالية لمنع التكرار المزعج
        sessionStorage.setItem('neontech_notif_shown', 'true');
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

    // Expose these to window so that global functions like openInvoiceModal and sendWhatsAppOrder can access them!
    window.cart = cart;
    window.saveCart = saveCart;
    window.renderCart = renderCart;
    window.closeCartDrawer = closeCartDrawer;
    window.setCart = setCart;

    function setCart(newCart) {
        cart = newCart;
        window.cart = cart;
        saveCart();
        renderCart();
    }

    function saveCart() {
        try {
            localStorage.setItem('neontech_cart', JSON.stringify(cart));
            window.cart = cart; // Keep window.cart in sync
            
            // Sync with user-specific session cart in local storage
            if (supabaseClient) {
                supabaseClient.auth.getUser().then(({ data: { user } }) => {
                    if (user) {
                        localStorage.setItem(`sb-${user.id}-cart`, JSON.stringify(cart));
                    }
                });
            }
        } catch (e) {
            console.warn("Error writing cart to localStorage:", e);
        }
    }

    function openCartDrawer() {
        if (drawer) drawer.classList.add("open");
        document.body.classList.add("cart-open");
    }

    function closeCartDrawer() {
        if (drawer) drawer.classList.remove("open");
        document.body.classList.remove("cart-open");
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
        
        const activeLang = localStorage.getItem("neontech_lang") || "en";
        const t = translations[activeLang] || translations.en;

        if (cart.length === 0) {
            itemsContainer.innerHTML = `
                <div class="cart-empty-state">
                    <span class="empty-icon">&#128722;</span>
                    <p>${t.emptyCart}</p>
                    <a href="#" class="btn-primary" id="cart-shop-now" style="text-align: center; text-decoration: none; display: inline-block; margin-top: 15px; padding: 10px 20px;">${t.shopNow}</a>
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
                <img src="${item.image}" alt="${getTranslatedProductTitle(item.title)}" class="cart-item-img" />
                <div class="cart-item-info">
                    <div class="cart-item-title">${getTranslatedProductTitle(item.title)}</div>
                    ${metaText ? `<div class="cart-item-meta">${metaText}</div>` : ""}
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-actions" style="margin-top: 8px;">
                        <div class="cart-item-qty">
                            <button class="cart-item-qty-btn qty-dec">&minus;</button>
                            <input type="text" class="cart-item-qty-input" value="${item.quantity}" readonly />
                            <button class="cart-item-qty-btn qty-inc">&plus;</button>
                        </div>
                        <button class="cart-item-remove">${t.cartRemove || "Remove"}</button>
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
                    const activeLang = localStorage.getItem("neontech_lang") || "en";
                    if (activeLang === "ar") {
                        showNeonToast("⚠️ الحد الأقصى للمنتج", "يُسمح بحد أقصى 10 قطع لكل منتج.");
                    } else {
                        showNeonToast("⚠️ Limit Reached", "Maximum of 10 items allowed per product.");
                    }
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
            requireAuth(() => {
                let card = btn.closest(".product-card");
                if (card) {
                    addToCartFromCard(card);
                }
            });
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
        const activeLang = localStorage.getItem("neontech_lang") || "en";
        if (activeLang === "ar") {
            showNeonToast("🛒 أُضيف إلى السلة", `تم إضافة <strong>${getTranslatedProductTitle(title)}</strong> إلى سلتك بنجاح!`);
        } else {
            showNeonToast("🛒 Added to Cart", `${title} has been added to your gear cart.`);
        }
    }

    // Event delegation for options form submission (detail page)
    document.body.addEventListener("submit", function(e) {
        let form = e.target.closest(".p-options-form");
        if (form) {
            e.preventDefault();
            requireAuth(() => {
                addToCartFromForm(form);
            });
        }
    });

    document.body.addEventListener("click", function(e) {
        let btn = e.target.closest(".p-add-cart-btn");
        if (btn) {
            let form = btn.closest("form");
            if (!form) {
                e.preventDefault();
                requireAuth(() => {
                    addToCartFromForm(null);
                });
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
        
        let cartBadge = document.querySelector(".cart-badge");
        let cartBtn = cartBadge ? cartBadge.parentElement : null;
        const activeLang = localStorage.getItem("neontech_lang") || "en";
        if (imgEl && cartBadge && cartBtn) {
            let successMessage = activeLang === "ar"
                ? `🔥 تم إضافة (${qty}) قطع من ${getTranslatedProductTitle(title)} إلى سلتك بنجاح!`
                : `🔥 Added (${qty}) pieces of ${title} to your cart!`;
            animateFly(imgEl, cartBtn, cartBadge, qty, successMessage);
            setTimeout(() => {
                renderCart();
                openCartDrawer();
            }, 950);
        } else {
            renderCart();
            openCartDrawer();
            if (activeLang === "ar") {
                showNeonToast("🛒 أُضيف إلى السلة", `تم إضافة ${qty}x ${getTranslatedProductTitle(title)} إلى سلتك بنجاح!`);
            } else {
                showNeonToast("🛒 Added to Cart", `${qty}x ${title} added to your gear cart.`);
            }
        }
    }

    // WhatsApp Checkout — إتمام الشراء عبر الواتساب
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function() {
            requireAuth(() => {
                if (cart.length === 0) {
                    const activeLang = localStorage.getItem("neontech_lang") || "en";
                    if (activeLang === "ar") {
                        showNeonToast("⚠️ السلة فارغة", "يرجى إضافة منتجات إلى السلة قبل إتمام الشراء.");
                    } else {
                        showNeonToast("⚠️ Empty Cart", "Please add items to your cart before checking out.");
                    }
                    return;
                }
                openInvoiceModal();
            });
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
    const initialViewers = Math.floor(Math.random() * (12 - 3 + 1)) + 3;
    
    let badgeHTML = '';
    const activeLang = localStorage.getItem("neontech_lang") || "en";
    if (product.id % 4 === 1) {
        badgeHTML = `<span class="card-badge badge-new">${activeLang === "ar" ? "جديد" : "New"}</span>`;
    } else if (product.id % 4 === 2) {
        badgeHTML = `<span class="card-badge badge-hot">🔥 ${activeLang === "ar" ? "شائع" : "Hot"}</span>`;
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

    let transCategory = product.category;
    let transTitle = product.title;
    let transCartText = "Add to Cart";
    let transViewersText = `Live: <span class="viewers-count">${initialViewers}</span> Gamers`;

    if (activeLang === "ar") {
        const catKey = product.category.toLowerCase().trim();
        if (catKey === "controllers") transCategory = "أجهزة التحكم";
        else if (catKey === "monitors") transCategory = "الشاشات";
        else if (catKey === "headsets") transCategory = "سماعات الرأس";
        else if (catKey === "keyboards") transCategory = "لوحات المفاتيح";
        else if (catKey === "mice") transCategory = "الماوسات";
        else if (catKey === "laptops") transCategory = "لاب توب";
        else if (catKey === "graphics cards") transCategory = "كروت الشاشة";
        else if (catKey === "vr headsets") transCategory = "نظارات الواقع الافتراضي";
        else if (catKey === "gaming chairs") transCategory = "كراسي القيمنق";

        const titleLower = product.title.toLowerCase().trim();
        if (titleLower.includes("apex pro")) transTitle = "لوحة مفاتيح ستيل سيريز ايبكس برو";
        else if (titleLower.includes("g915")) transTitle = "لوحة مفاتيح لوجيتك G915 اللاسلكية";
        else if (titleLower.includes("titan evo")) transTitle = "كرسي الألعاب سيكريت لاب تايتان إيفو";
        else if (titleLower.includes("stellar shift")) transTitle = "جهاز تحكم إكس بوكس ستيلر شيفت";
        else if (titleLower.includes("rtx 5090")) transTitle = "كارت شاشة أسوس روج RTX 5090";
        else if (titleLower.includes("arctis nova")) transTitle = "سماعة ستيل سيريز نوفا برو اللاسلكية";
        else if (titleLower.includes("blade 16")) transTitle = "لاب توب رايزر بليد 16 للألعاب";
        else if (titleLower.includes("odyssey oled")) transTitle = "شاشة سامسونج أوديسي OLED G9 منحنية";
        else if (titleLower.includes("superlight 2")) transTitle = "ماوس لوجيتك جي برو سوبرلايت 2";
        else if (titleLower.includes("quest 3")) transTitle = "نظارة الواقع الافتراضي ميتا كويست 3";

        transCartText = "إضافة للسلة";
        transViewersText = `مباشر: <span class="viewers-count">${initialViewers}</span> لاعبين يتصفحون الآن`;
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
            <div class="card-category" style="text-transform: capitalize;">${transCategory}</div>
            <h3 class="card-title"><a href="${link}">${transTitle}</a></h3>
            <div class="card-rating">
              <div class="stars" aria-label="${rating} out of 5 stars">
                ${starsHTML}
              </div>
              <span class="rating-count">(${ratingCount})</span>
            </div>
            <p class="viewers-text">${transViewersText}</p>
          </div>
          <div class="card-footer">
            <div class="card-pricing">
              ${pricingHTML}
            </div>
            <button class="btn-cart"><span>${transCartText}</span></button>
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

    const authBtn = document.getElementById("user-account-btn") || document.querySelector('a[aria-label="User account"]');
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
            if (typeof window.syncUserCart === 'function') {
                window.syncUserCart(user);
            }
        } else {
            loginForm.style.display = "block";
            if (navUserName) navUserName.style.display = "none";
            if (typeof window.syncUserCart === 'function') {
                window.syncUserCart(null);
            }
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
            
            const activeLang = localStorage.getItem("neontech_lang") || "en";
            if (activeLang === "ar") {
                showNeonToast("🎮 تزامن نمط RGB", `تم تحويل جو الغرفة إلى ${btn.innerText.trim()}.`);
            } else {
                showNeonToast("🎮 RGB Profile Synced", `Atmosphere shifted to ${btn.innerText.trim()}.`);
            }
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
            
            const activeLang = localStorage.getItem("neontech_lang") || "en";
            if (selectedMode === "light") {
                if (activeLang === "ar") {
                    showNeonToast("☀️ تفعيل الوضع المضيء", "تم تحويل جو المنصة إلى وضع العمل المضيء.");
                } else {
                    showNeonToast("☀️ Light Mode Activated", "Atmosphere shifted to a bright workspace.");
                }
            } else {
                if (activeLang === "ar") {
                    showNeonToast("🌙 تفعيل الوضع المظلم", "تم تحويل جو المنصة إلى وضع التخفي المظلم.");
                } else {
                    showNeonToast("🌙 Dark Mode Activated", "Atmosphere shifted to deep stealth mode.");
                }
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
    const currentCart = window.cart || [];
    currentCart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <div class="invoice-item-title">${item.title}</div>
                <div class="invoice-item-option">${item.options ? (typeof item.options === 'string' ? item.options : Object.values(item.options).join(' | ')) : 'Standard Edition'}</div>
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
    
    const activeLang = localStorage.getItem("neontech_lang") || "en";
    if (promoInput === "") {
        promoStatus.textContent = activeLang === "ar" ? "يرجى إدخال الكود." : "Please enter a code.";
        promoStatus.className = "error";
        return;
    }
    
    if (promoInput === "SALAH10") {
        activeDiscountPercent = 10;
        appliedPromoCode = "SALAH10";
        promoStatus.textContent = activeLang === "ar" ? "🎉 تم تطبيق الكود! خصم 10% مقتطع." : "🎉 Code applied! 10% discount deducted.";
        promoStatus.className = "success";
        
        let subtotal = 0;
        const currentCart = window.cart || [];
        currentCart.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        updateInvoiceTotals(subtotal);
        
        if (activeLang === "ar") {
            showNeonToast("🎟️ تم تفعيل كود الخصم", "تم تطبيق خصم 10% على فاتورتك بنجاح.");
        } else {
            showNeonToast("🎟️ Coupon Activated", "10% off has been applied to your invoice.");
        }
    } else {
        promoStatus.textContent = activeLang === "ar" ? "❌ كود غير صحيح. جرب SALAH10!" : "❌ Invalid code. Try SALAH10!";
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
    const currentCart = window.cart || [];
    currentCart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const optionText = item.options ? (typeof item.options === 'string' ? item.options : Object.values(item.options).join(' | ')) : 'Standard';
        itemLines += `🎮 ${item.title} (${optionText})\n`;
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
        
        // مسح وتحديث سلة المشتريات بعد نجاح الطلب
        if (typeof window.saveCart === "function") {
            window.cart = [];
            // تحديث المتغير المحلي داخل دالة السلة عبر المزامنة
            const itemsContainer = document.getElementById("cart-items-container");
            // نظراً لأن saveCart() و renderCart() تعتمدان على closure المتغير المحلي cart،
            // سنقوم بإفراغ مصفوفة window.cart وسنقوم أيضاً بإعادة استدعاء دالة تحديث السلة.
            // الأفضل هو إفراغ المصفوفة الأصلية أيضاً:
            if (window.cart) {
                window.cart.length = 0; 
            }
            window.saveCart();
            window.renderCart();
            window.closeCartDrawer();
        }
        
        modal.classList.remove("open");
        
        whatsappBtn.disabled = false;
        whatsappBtn.innerHTML = originalText;
        
        playNotificationSound();
        const activeLang = localStorage.getItem("neontech_lang") || "en";
        if (activeLang === "ar") {
            showNeonToast("📱 إرسال الطلب", "تم فتح تفاصيل الشراء وإعداد الفاتورة في واتساب!");
        } else {
            showNeonToast("📱 Order Dispatched", "Your checkout sheet is opened in WhatsApp!");
        }
    }, 1200);
}

/* ── Premium Advanced Features Integration (Bilingual, Reviews, Cart Sync, Chatbot) ── */

const productTitlesMap = {
    // Keyboards
    "razer blackwidow v4 pro": "لوحة مفاتيح رايزر بلاك ويدو V4 برو",
    "razer blackwidow v4 pro — phantom edition": "لوحة مفاتيح رايزر بلاك ويدو V4 برو — إصدار الفانتوم",
    "razer blackwidow v4 pro - phantom edition": "لوحة مفاتيح رايزر بلاك ويدو V4 برو — إصدار الفانتوم",
    "logitech g915 tkl lightspeed": "لوحة مفاتيح لوجيتك G915 TKL لايت سبيد اللاسلكية",
    "steelseries apex pro tkl": "لوحة مفاتيح ستيل سيريز أبيكس برو TKL ميكانيكية",
    "steelseries apex pro tkl keyboard": "لوحة مفاتيح ستيل سيريز أبيكس برو TKL ميكانيكية",
    "corsair k70 rgb pro mechanical": "لوحة مفاتيح كورسير K70 RGB برو الميكانيكية",
    "corsair k70 rgb pro keyboard": "لوحة مفاتيح كورسير K70 RGB برو الميكانيكية",
    "keychron q1 qmk custom keyboard": "لوحة مفاتيح كيتشرون Q1 QMK المخصصة",
    "hyperx alloy origins core": "لوحة مفاتيح هايبر إكس ألوي أوريجينز كور",
    "ducky one 3 sf rgb mechanical": "لوحة مفاتيح دكي ون 3 SF RGB ميكانيكية",
    "asus rog strix scope ii 96": "لوحة مفاتيح أسوس روج ستريكس سكوب II 96",
    "wooting 60he hall effect keyboard": "لوحة مفاتيح ووتينغ 60HE هول إفكت المغناطيسية",
    "fnatic streak65 ultra-compact rgb": "لوحة مفاتيح فناتيك ستريك 65 الترا المدمجة",
    "razer huntsman v3 pro keyboard": "لوحة مفاتيح رايزر هانتسمان V3 برو",
    "razer huntsman v3 pro tkl": "لوحة مفاتيح رايزر هانتسمان V3 برو TKL",

    // Mice
    "logitech g pro x superlight 2": "ماوس لوجيتك جي برو إكس سوبرلايت 2 ديكس اللاسلكي",
    "razer deathadder v3 pro wireless": "ماوس رايزر ديف أدر V3 برو اللاسلكي",
    "razer deathadder v3 hyperspeed": "ماوس رايزر ديف أدر V3 هايبر سبيد اللاسلكي",
    "steelseries aerox 3 wireless": "ماوس ستيل سيريز أيروكس 3 اللاسلكي",
    "corsair dark core rgb pro wireless": "ماوس كورسير دارك كور RGB برو اللاسلكي",
    "corsair dark core rgb pro mouse": "ماوس كورسير دارك كور RGB برو اللاسلكي",
    "glorious model o 2 wireless": "ماوس غلوريوس موديل O 2 اللاسلكي",
    "logitech g502 x plus lightspeed": "ماوس لوجيتك G502 X بلس لايت سبيد اللاسلكي",
    "logitech g502 x plus wireless": "ماوس لوجيتك G502 X بلس لايت سبيد اللاسلكي",
    "razer basilisk v3 pro wireless": "ماوس رايزر بازيليسك V3 برو اللاسلكي",
    "pulsar x2 wireless gaming mouse": "ماوس بولسار X2 اللاسلكي الاحترافي",
    "finalmouse ultralightx wireless": "ماوس فاينال ماوس ألترا لايت X الخفيف للغاية",
    "asus rog harpe ace aim lab edition": "ماوس أسوس روج هاربي إس إيم لابد اللاسلكي",

    // Headsets
    "steelseries arctis nova pro wireless": "سماعة ستيل سيريز أركتيس نوفا برو اللاسلكية",
    "razer blackshark v2 pro wireless": "سماعة رايزر بلاك شارك V2 برو اللاسلكية",
    "logitech g pro x 2 lightspeed wireless": "سماعة لوجيتك جي برو إكس 2 اللاسلكية الاحترافية",
    "logitech g pro x 2 wireless": "سماعة لوجيتك جي برو إكس 2 اللاسلكية الاحترافية",
    "corsair virtuoso rgb wireless xt": "سماعة كورسير فيرتوزو RGB اللاسلكية XT الفاخرة",
    "hyperx cloud iii wireless gaming": "سماعة هايبر إكس كلاود III اللاسلكية للألعاب",
    "astro a50 wireless gen 4 + base": "سماعة أسترو A50 اللاسلكية الجيل الرابع مع القاعدة",
    "epos h6pro closed acoustic headset": "سماعة إيبوس H6PRO الاحترافية المغلقة",
    "beyerdynamic mmx 300 pro headset": "سماعة بيردايناميك MMX 300 برو الاحترافية",
    "sennheiser game zero gaming headset": "سماعة سنهايزر جيم زيرو الاحترافية للألعاب",
    "jbl quantum one wired usb headset": "سماعة جي بي إل كوانتوم ون السلكية الاحترافية USB",

    // Monitors
    "asus rog swift pg27aqn 27\" 360hz": "شاشة أسوس روج ستريكس سويفت PG27AQN قياس 27 بوصة 360 هرتز",
    "msi meg 342c qd-oled 34\" ultrawide": "شاشة إم إس آي ميج 342C QD-OLED قياس 34 بوصة عريضة",
    "corsair xeneon 27qhd240 oled 27\"": "شاشة كورسير زينون OLED قياس 27 بوصة 240 هرتز",
    "samsung odyssey g9 49\" dqhd curved": "شاشة سامسونج أوديسي OLED G9 منحنية قياس 49 بوصة",
    "samsung odyssey oled g9": "شاشة سامسونج أوديسي OLED G9 منحنية قياس 49 بوصة",
    "lg ultragear 27gr95qe 27\" oled": "شاشة إل جي ألترا جير 27 بوصة OLED بدقة عالية",
    "benq zowie xl2546x 24.5\" 240hz": "شاشة بينكيو زوي XL2546X قياس 24.5 بوصة 240 هرتز",
    "alienware aw3225qf 32\" qd-oled 4k": "شاشة إيلين وير AW3225QF قياس 32 بوصة QD-OLED 4K",
    "acer predator x28 28\" 4k 155hz": "شاشة أسير بريداتور X28 قياس 28 بوصة 4K 155 هرتز",
    "gigabyte m27q x 27\" 240hz ips": "شاشة جيجابايت M27Q X قياس 27 بوصة 240 هرتز IPS",
    "viewsonic xg2431 24\" 240hz ips": "شاشة فيوسونيك XG2431 قياس 24 بوصة 240 هرتز IPS",

    // Controllers
    "xbox elite wireless controller series 2": "يد تحكم إكس بوكس إيليت اللاسلكية الإصدار الثاني",
    "steelseries stratus duo": "يد تحكم ستيل سيريز ستراتوس ديو اللاسلكية",
    "steelseries stratus duo wireless": "يد تحكم ستيل سيريز ستراتوس ديو اللاسلكية",
    "logitech f710 wireless gamepad": "يد تحكم لوجيتك F710 اللاسلكية للكمبيوتر",
    "logitech g f710 wireless controller": "يد تحكم لوجيتك F710 اللاسلكية للكمبيوتر",
    "sony dualsense edge wireless ps5": "يد تحكم سوني دبل سينس إيدج اللاسلكية للبلايستيشن 5",
    "razer wolverine v2 chroma xbox": "يد تحكم رايزر ولفيرين V2 كروما إكس بوكس",
    "8bitdo ultimate bluetooth controller": "يد تحكم 8 بت دو ألتيميت اللاسلكية مع بلوتوث",
    "scuf instinct pro xbox controller": "يد تحكم سكوف إنستينكت برو المخصصة للإكس بوكس",
    "nacon revolution 5 pro ps5/pc": "يد تحكم ناكون ريفولوشن 5 برو للبلايستيشن 5 والكمبيوتر",
    "turtle beach stealth ultra xbox": "يد تحكم تيرتل بيتش ستيلث الترا اللاسلكية للإكس بوكس",
    "powera spectra infinity enhanced": "يد تحكم باور إيه سبيكترا إنفينيتي السلكية المحسنة",

    // Gaming Chairs
    "secretlab titan evo 2026 series": "كرسي سيكريت لاب تايتان إيفو 2026 المريح",
    "secretlab titan evo 2026": "كرسي سيكريت لاب تايتان إيفو 2026 المريح",
    "razer iskur v2 ergonomic gaming chair": "كرسي الألعاب رايزر إيسكور V2 المريح",
    "razer iskur v2 gaming chair": "كرسي الألعاب رايزر إيسكور V2 المريح",
    "corsair tc200 leatherette gaming chair": "كرسي ألعاب كورسير TC200 من الجلد الفاخر",
    "herman miller x logitech embody": "كرسي هيرمان ميلر × لوجيتك إمبودي الصحي الفاخر",
    "noblechairs hero st gaming chair": "كرسي ألعاب نوبل تشيرز هيرو ST الفخم",
    "andaseat kaiser 3 xl ergonomic": "كرسي ألعاب أندا سيت قيصر 3 XL المريح للغاية",
    "dxracer craft pro classic gaming": "كرسي ألعاب دي إكس ريسر كرافت برو الكلاسيكي",
    "cougar armor titan pro royal": "كرسي ألعاب كوجار أرمور تايتان برو رويال الملكي",
    "akracing masters series pro luxury": "كرسي ألعاب إيه كي ريسينغ ماسترز برو الفاخر",
    "vertagear sl5800 hygennx edition": "كرسي ألعاب فيرتا جير SL5800 هيدجيم إكس الطبي",

    // Laptops
    "asus rog strix scar 18 rtx 4090": "لاب توب أسوس روج ستريكس سكار 18 مع كارت RTX 4090",
    "msi titan 18 hx i9 rtx 4090": "لاب توب إم إس آي تايتان 18 HX مع معالج i9 وكارت RTX 4090",
    "razer blade 16 rtx 4080 qhd+ 240hz": "لاب توب رايزر بليد 16 مع كارت RTX 4080 وشاشة 240 هرتز",
    "razer blade 16 rtx 5090": "لاب توب رايزر بليد 16 مع كارت RTX 5090 الخارق",
    "alienware m18 r2 i9 rtx 4090": "لاب توب إيلين وير m18 R2 مع معالج i9 وكارت RTX 4090",
    "lenovo legion pro 7i 16\" rtx 4080": "لاب توب لينوفو ليجن برو 7i قياس 16 بوصة مع كارت RTX 4080",
    "acer predator helios 18 rtx 4080": "لاب توب أسير بريداتور هليوس 18 مع كارت RTX 4080",
    "hp omen 17 i9 rtx 4070 ti 240hz": "لاب توب إتش بي أومين 17 مع معالج i9 وكارت RTX 4070 Ti",
    "gigabyte aorus 17x rtx 4090 uhd+": "لاب توب جيجابايت أوروس 17X مع كارت RTX 4090 وشاشة UHD+",
    "asus rog zephyrus g16 rtx 4070": "لاب توب أسوس روج زيفيروس G16 مع كارت RTX 4070",
    "msi raider ge78 hx 16\" rtx 4080": "لاب توب إم إس آي ريدر GE78 HX قياس 16 بوصة مع كارت RTX 4080",
    
    // VR Headsets
    "meta quest 3 512gb": "نظارة الواقع الافتراضي ميتا كويست 3 مساحة 512 جيجا",
    
    // Graphics cards
    "asus rog strix geforce rtx 5090": "كارت الشاشة أسوس روج ستريكس جيفورس RTX 5090",
    
    // Additional missing product titles for catalog cards and detail pages
    "razer wolverine v3 pro wireless": "يد تحكم رايزر ولفيرين V3 برو اللاسلكية",
    "razer wolverine v3 pro": "يد تحكم رايزر ولفيرين V3 برو اللاسلكية",
    "asus rog swift 360hz oled 27\"": "شاشة أسوس روج سويفت 360 هرتز OLED قياس 27 بوصة",
    "msi optix mpg341qr 34\" ultrawide": "شاشة إم إس آي أوبتكس MPG341QR قياس 34 بوصة عريضة",
    "razer blade 16 rtx 5090 ultra": "لاب توب رايزر بليد 16 مع كارت RTX 5090 ألترا الخارق",
    "asus rog zephyrus g14 laptop": "لاب توب أسوس روج زيفيروس G14 للألعاب",
    "nvidia geforce rtx 5090 fe": "كارت الشاشة إنفيديا جيفورس RTX 5090 إصدار المؤسسين (FE)",
    "asus rog matrix rtx 4090": "كارت الشاشة أسوس روج ماتريكس RTX 4090",
    "meta quest 3 pro vr headset": "نظارة الواقع الافتراضي ميتا كويست 3 برو المتطورة",
    "htc vive pro 2 system": "نظام نظارة الواقع الافتراضي إتش تي سي فايف برو 2 المتكامل",
    "corsair xeneon flex oled 45\"": "شاشة كورسير زينون فليكس القابلة للانحناء OLED قياس 45 بوصة"
};

function getTranslatedProductTitle(title) {
    const activeLang = localStorage.getItem("neontech_lang") || "en";
    if (activeLang !== "ar") return title;
    
    const lower = title.toLowerCase().replace(/\s+/g, " ").trim();
    if (productTitlesMap[lower]) return productTitlesMap[lower];
    
    for (let key in productTitlesMap) {
        if (lower.includes(key)) {
            return productTitlesMap[key];
        }
    }
    return title;
}

// 1. Translations Dictionary Map for Bilingual (En/Ar) Layout
const translations = {
    en: {
        searchPlaceholder: "Search products, brands…",
        categoriesTitle: "Categories",
        allProducts: "All Products",
        controllers: "Controllers",
        monitors: "Monitors",
        headsets: "Headsets",
        keyboards: "Keyboards",
        mice: "Mice",
        laptops: "Laptops",
        graphicsCards: "Graphics Cards",
        vrHeadsets: "VR Headsets",
        gamingChairs: "Gaming Chairs",
        brandsTitle: "Brands",
        ratingTitle: "Minimum Rating",
        priceRangeTitle: "Price Range",
        sortBy: "Sort By:",
        featured: "Featured",
        priceLowHigh: "Price: Low to High",
        priceHighLow: "Price: High to Low",
        topRated: "Top Rated",
        newest: "Newest",
        writeReview: "Write a Review",
        submitReview: "Submit Review",
        yourRating: "Your Rating:",
        reviewPlaceholder: "Share your experience with this gaming gear...",
        reviewTitlePlaceholder: "Review Title (e.g., Ultimate performance!)",
        reviewerNamePlaceholder: "Your Name",
        addToCart: "Add to Cart",
        buyNow: "Proceed to Checkout",
        qtyLabel: "Quantity:",
        specsTab: "Specifications",
        reviewsTab: "Reviews",
        descTab: "Description",
        exitTitle: "🔥 WAIT, DON'T LEAK THE LOOT!",
        exitDesc: "Salah got you an exclusive 10% discount on all elite gear. Use code:",
        exitClose: "No thanks, I pay full price",
        exitGet: "Claim Loot",
        invoiceTitle: "RETAIL INVOICE",
        invoiceBilledTo: "Billed To:",
        invoiceSeller: "Seller Details:",
        invoiceSellerName: "NeonTech Gaming Store",
        invoiceOwner: "Salah Khaled — Owner",
        invoicePromoLabel: "Enter Promo Code:",
        invoicePromoBtn: "Apply",
        invoiceSubtotal: "Subtotal:",
        invoiceTax: "VAT (15%):",
        invoiceShipping: "Shipping:",
        invoiceShippingFree: "FREE",
        invoiceGrandTotal: "Grand Total:",
        invoiceClose: "Close",
        invoicePrint: "Print Receipt",
        invoiceWhatsApp: "Send on WhatsApp",
        liveViewers: "Live: {count} Gamers",
        emptyCart: "Your cart is empty",
        shopNow: "Shop Now",
        cartTitle: "Your Cart",
        cartRemove: "Remove",
        limitReached: "Maximum of 10 items allowed per product."
    },
    ar: {
        searchPlaceholder: "ابحث عن الأجهزة، الماركات...",
        categoriesTitle: "الأقسام",
        allProducts: "كل المنتجات",
        controllers: "أجهزة التحكم",
        monitors: "الشاشات",
        headsets: "سماعات الرأس",
        keyboards: "لوحات المفاتيح",
        mice: "الماوسات",
        laptops: "لاب توب",
        graphicsCards: "كروت الشاشة",
        vrHeadsets: "نظارات الواقع الافتراضي",
        gamingChairs: "كراسي القيمنق",
        brandsTitle: "الماركات",
        ratingTitle: "الحد الأدنى للتقييم",
        priceRangeTitle: "نطاق السعر",
        sortBy: "ترتيب حسب:",
        featured: "المميز",
        priceLowHigh: "السعر: من الأقل للأعلى",
        priceHighLow: "السعر: من الأعلى للأقل",
        topRated: "الأعلى تقييماً",
        newest: "الأحدث",
        writeReview: "اكتب تقييمًا",
        submitReview: "إرسال التقييم",
        yourRating: "تقييمك بالنجوم:",
        reviewPlaceholder: "شاركنا تجربتك للأداة الجيمنج...",
        reviewTitlePlaceholder: "عنوان المراجعة (مثال: أداء جبار!)",
        reviewerNamePlaceholder: "اسمك الكريم",
        addToCart: "إضافة للسلة",
        buyNow: "إتمام الشراء",
        qtyLabel: "الكمية:",
        specsTab: "المواصفات",
        reviewsTab: "المراجعات",
        descTab: "الوصف",
        exitTitle: "🔥 استنى يا بطل! متضيعش الجيم!",
        exitDesc: "صلا مروق عليك بخصم 10% إضافي على كل الأدوات والعتاد. استخدم الكود:",
        exitClose: "لا شكرًا، حابب أشتري بالسعر الكامل",
        exitGet: "احصل على الخصم",
        invoiceTitle: "فاتورة مبيعات",
        invoiceBilledTo: "فاتورة إلى:",
        invoiceSeller: "بيانات البائع:",
        invoiceSellerName: "متجر نيون تك للجيمنج",
        invoiceOwner: "صلاح خالد — المالك",
        invoicePromoLabel: "أدخل كود الخصم:",
        invoicePromoBtn: "تطبيق",
        invoiceSubtotal: "المجموع الفرعي:",
        invoiceTax: "ضريبة القيمة المضافة (15%):",
        invoiceShipping: "الشحن:",
        invoiceShippingFree: "مجاني",
        invoiceGrandTotal: "المجموع الكلي:",
        invoiceClose: "إغلاق",
        invoicePrint: "طباعة الفاتورة",
        invoiceWhatsApp: "أرسل عبر الواتساب",
        liveViewers: "مباشر: {count} لاعبين يتصفحون الآن",
        emptyCart: "سلة المشتريات فارغة",
        shopNow: "تصفح المتجر",
        cartTitle: "سلتك",
        cartRemove: "حذف",
        limitReached: "الحد الأقصى هو 10 قطع لكل منتج."
    }
};

// 2. Global Translation Engine
const staticPhrases = {
    // Specs keys
    "connectivity": "الاتصال",
    "switches": "المفاتيح",
    "actuation distance": "مسافة التشغيل",
    "actuation force": "قوة الضغط",
    "battery life": "عمر البطارية",
    "materials": "المواد",
    "dimensions": "الأبعاد",
    "weight": "الوزن",
    "warranty": "الضمان",
    "sensor": "المستشعر",
    "resolution": "الدقة",
    "ips": "السرعة (IPS)",
    "acceleration": "التسارع",
    "polling rate": "معدل الاستطلاع",
    "panel type": "نوع اللوحة",
    "aspect ratio": "نسبة العرض",
    "refresh rate": "معدل التحديث",
    "response time": "زمن الاستجابة",
    "brightness": "السطوع",
    "contrast ratio": "نسبة التباين",
    "color gamut": "تدرج الألوان",
    "audio drivers": "مشغلات الصوت",
    "frequency response": "استجابة التردد",
    "impedance": "المقاومة",
    "microphone": "الميكروفون",
    "gpu architecture": "معمارية معالج الرسوميات",
    "cuda cores": "نواة كودا (CUDA Cores)",
    "boost clock": "سرعة المعالج القصوى",
    "memory size": "حجم الذاكرة",
    "memory type": "نوع الذاكرة",
    "memory bus": "ناقل الذاكرة",
    "power requirements": "متطلبات الطاقة",
    "cpu": "المعالج",
    "ram": "الذاكرة العشوائية (RAM)",
    "storage": "التخزين",
    "operating system": "نظام التشغيل",
    "tracking": "التتبع",
    "ipd range": "نطاق IPD",
    "foam interface": "بطانة الوجه",
    "upholstery": "الكسوة الخارجية",
    "armrests": "المساند الجانبية",
    "reclines": "إمالة الظهر",
    "gas lift class": "مساعد الغاز",
    "weight capacity": "حمولة الوزن القصوى",

    // Common specifications table values
    "lightspeed 1ms wireless / bluetooth / usb wired": "اتصال لاسلكي لايت سبيد 1 ملي ثانية / بلوتوث / سلكي USB",
    "low-profile gl mechanical switches (tactile / linear / clicky)": "مفاتيح ميكانيكية GL منخفضة الارتفاع (Tactile / Linear / Clicky)",
    "up to 40 hours (100% rgb brightness)": "حتى 40 ساعة (بسطوع كامل للإضاءة)",
    "aircraft-grade 5052 aluminum top plate, steel-reinforced base": "لوحة علوية من الألومنيوم المستخدم في الطائرات فئة 5052، قاعدة معززة بالفولاذ",
    "hero 2 sensor": "مستشعر HERO 2 الاحترافي",
    "100 – 32,000 dpi": "100 - 32,000 نقطة لكل بوصة (DPI)",
    "500 ips": "500 بوصة في الثانية (IPS)",
    "40g": "40 جيجا (التسارع)",
    "8000 hz (0.125ms) wireless lightspeed": "8000 هرتز (0.125 ملي ثانية) لاسلكي لايت سبيد",
    "hybrid lightforce switches (optical-mechanical)": "مفاتيح هجينة لايت فورس (بصرية-ميكانيكية)",
    "up to 95 hours (constant motion)": "حتى 95 ساعة من الحركة المستمرة",
    "ergonomic right-handed (dex design)": "تصميم مريح لليد اليمنى (تصميم ديكس)",
    "hero 25k sensor": "مستشعر HERO 25K الاحترافي",
    "lightspeed wireless / usb-c wired": "لاسلكي لايت سبيد / سلكي USB-C",
    "up to 95 hours": "حتى 95 ساعة",
    "ultra-lightweight 60g": "خفيف الوزن للغاية 60 جرام",
    "analog optical switches (rapid trigger / adjustable actuation 0.1-4.0mm)": "مفاتيح بصرية تناظرية (تأثير التشغيل السريع / تشغيل قابل للتعديل 0.1-4.0 مم)",
    "detachable braided fiber usb-c": "كابل USB-C مغطى بألياف مضفرة قابل للفصل",
    "double-shot pbt keycaps, magnetic wrist rest": "أغطية مفاتيح PBT مزدوجة الحقن، مسند معصم مغناطيسي",
    "onboard profile storage, aluminum construction": "ذاكرة داخلية لحفظ الإعدادات، هيكل ألومنيوم متين",
    "customized gateron custom gaming switches": "مفاتيح ألعاب مخصصة من جاتيرون",
    "dual-mode wireless (2.4ghz / bluetooth 5.2)": "اتصال لاسلكي ثنائي الوضع (2.4 جيجاهرتز / بلوتوث 5.2)",
    "up to 300 hours (rgb off) / 100 hours (rgb on)": "حتى 300 ساعة (بدون إضاءة) / 100 ساعة (مع إضاءة)",
    "pbt side-printed keycaps, aircraft alloy frame": "أغطية مفاتيح PBT مطبوعة جانبياً، إطار من سبيكة الطائرات",
    "high-density sound absorbing foam padding": "حشوة فوم عالية الكثافة لامتصاص الضوضاء",
    "custom co-designed opto-mechanical switches": "مفاتيح بصرية ميكانيكية مصممة خصيصاً بالتعاون",
    "detachable custom type-c braided cable": "كابل مغطى بألياف مضفرة قابل للفصل Type-C",
    "dye-subbed premium pbt cherry-profile keycaps": "أغطية مفاتيح PBT ممتازة ومقاومة للبهتان بتصميم كرزي",
    "solid steel build with integrated dual-mode soundproofing": "هيكل فولاذي صلب مع عزل صوتي متكامل ثنائي الوضع",

    // Stock
    "in stock — ready to ship": "متوفر في المخزون — جاهز للشحن الفوري",
    "in stock": "متوفر في المخزون",
    
    // Trust tags
    "free express shipping": "شحن سريع مجاني",
    "arrives in 2-3 business days": "يصلك خلال 2-3 أيام عمل",
    "2-year logitech warranty": "ضمان سنتين من لوجيتك",
    "original authorized manufacturer replacement warranty": "ضمان استبدال معتمد من الشركة المصنعة الأصلية",
    "secure checkout": "تشيك أوت آمن ومحمي 100%",
    "bank-level instapay or cash on delivery security": "حماية بيانات بنكية، كاش عند الاستلام أو إنستاباي",
    "secure payment checkout": "بوابة دفع مشفرة بالكامل",
    "certified elite vendor guarantee": "ضمان الوكيل المعتمد الأصلي",

    // Colors
    "color: ": "اللون: ",
    "carbon black": "أسود كاربون",
    "white edition": "الإصدار الأبيض",
    "red edition": "الإصدار الأحمر",
    "blue edition": "الإصدار الأزرق",
    "stealth black": "أسود متخفي (Stealth)",
    "royal blue": "أزرق ملكي",
    "ash grey": "رمادي رماد",
    "neo pink": "وردي نيون",
    "stellar shift": "تأثير ستيلر شيفت",
    "electric volt": "فولت كهربائي",
    "shock blue": "أزرق صاعق",
    "pulse red": "أحمر نابض",

    // Switches options labels
    "switch type: ": "نوع المفاتيح: ",
    "gl tactile (quiet)": "GL Tactile (هادئة بنقرة خفيفة)",
    "gl clicky (audible)": "GL Clicky (صوت نقرة مسموع وجذاب)",
    "gl linear (smooth)": "GL Linear (حركة ناعمة خطية وسريعة)",
    
    // Button span texts
    "add to cart": "إضافة للسلة",
    "proceed to checkout": "إتمام الشراء",
    
    // Additional specs and option keys
    "form factor": "تصميم الهيكل",
    "right-handed ergonomic": "تصميم مريح لليد اليمنى",
    "hyperspeed wireless / usb-c wired": "لاسلكي هايبر سبيد / سلكي USB-C",
    "focus x 26k optical sensor": "مستشعر Focus X 26K البصري",
    "26,000 dpi": "26,000 DPI",
    "50 g": "50 G (تسارع)",
    "optical mouse switches gen-3 (90m clicks)": "مفاتيح ماوس بصرية الجيل الثالث (90 مليون نقرة)",
    "up to 100 hours (1000hz polling)": "حتى 100 ساعة (معدل استطلاع 1000 هرتز)",
    "55 g": "55 جرام",
    "122.2 mm x 64.8 mm x 41.3 mm": "122.2 مم × 64.8 مم × 41.3 مم",
    "polling rate": "معدل الاستطلاع",
    "1000hz": "1000 هرتز",
    "8000hz": "8000 هرتز",
    "1000hz (standard)": "1000 هرتز (افتراضي)",
    "8000hz (dongle needed)": "8000 هرتز (يتطلب دنجل)",
    "color: carbon black": "اللون: أسود كاربون",
    "color: white edition": "اللون: الإصدار الأبيض",
    "color: red edition": "اللون: الإصدار الأحمر",
    "color: blue edition": "اللون: الإصدار الأزرق",
    "carbon black": "أسود كاربون",
    "white edition": "الإصدار الأبيض",
    "red edition": "الإصدار الأحمر",
    "blue edition": "الإصدار الأزرق",
    "stealth black": "أسود متخفي (Stealth)",
    "128gb storage": "128 جيجا بايت تخزين",
    "512gb storage (+$120)": "512 جيجا بايت تخزين (+ $120)",
    "standard soft strap": "حزام مريح قياسي",
    "elite battery strap (+$100)": "حزام النخبة مع بطارية (+ $100)",
    "premium leatherette": "جلد فاخر",
    "breathable fabric mesh": "قماش شبكي جيد التهوية",
    "regular (170-189cm)": "قياسي (170-189 سم)",
    "xl (190-200cm)": "XL عريض (190-200 سم)",
    "small (under 170cm)": "صغير (أقل من 170 سم)",
    "gl tactile (quiet)": "GL Tactile (نقرة هادئة ملموسة)",
    "gl clicky (audible)": "GL Clicky (نقرة صوتية مسموعة)",
    "gl linear (smooth)": "GL Linear (حركة ناعمة سريعة)",
    "founders edition (triple-slot fan)": "نسخة فاوندرز (مروحة ثلاثية الفتحات)",
    "custom oc (triple-slot fan)": "مروحة ثلاثية مكسورة السرعة (OC)",
    "liquid cooled aio": "تبريد مائي متكامل AIO",
    "32gb gddr7": "32 جيجا بايت GDDR7",
    "48gb gddr7": "48 جيجا بايت GDDR7",
    "anti-glare matte": "مضاد للتوهج مطفي",
    "glossy ar glass": "زجاج AR لامع",
    "27\" wqhd 360hz": "27 بوصة WQHD بتردد 360 هرتز",
    "32\" 4k uhd 240hz": "32 بوصة 4K UHD بتردد 240 هرتز",
    "dual mini-led (uhd+ 120hz / fhd+ 240hz)": "Mini-LED ثنائي (UHD+ 120Hz / FHD+ 240Hz)",
    "qhd oled 240hz": "شاشة QHD OLED بتردد 240 هرتز",
    "32gb ram + 2tb ssd": "32 جيجا رام + 2 تيرا SSD",
    "64gb ram + 4tb ssd": "64 جيجا رام + 4 تيرا SSD",
    "standard grip": "مقبض قياسي",
    "pro sticky grip": "مقبض احترافي مانع للانزلاق",
    "neo hybrid leatherette": "جلد هجين NEO فاخر",
    "softweave plus fabric": "نسيج SoftWeave Plus ناعم",
    "premium napa leather": "جلد نابا الفاخر",

    // Static reviews translations
    "incredibly light and comfortable!": "خفيف ومريح للغاية بشكل لا يصدق!",
    "the ergonomic shape fits my hand perfectly. at 55g, flicking in shooters feels effortless. the battery life easily lasts a couple of weeks of daily gaming.": "الشكل المريح يناسب يدي تماماً. بوزن 55 جراماً، أشعر أن التحريك السريع في ألعاب التصويب لا يتطلب أي مجهود. عمر البطارية يستمر بسهولة لبضعة أسابيع من اللعب اليومي.",
    "amazing sensor, lightweight build": "مستشعر مذهل، وبنية خفيفة الوزن",
    "the focus x sensor tracks flawlessly on both my glass pad and cordura surface. optical clicks are super crisp. great build quality.": "مستشعر Focus X يتتبع الحركات بشكل لا تشوبه شائبة على كل من لوحة الماوس الزجاجية والأسطح القماشية الكوردورا. النقرات البصرية نقية وحادة للغاية. جودة تصنيع رائعة.",

    "best headset i've ever used.": "أفضل سماعة رأس استخدمتها على الإطلاق.",
    "the dac unit makes adjusting game/chat mix on the fly so easy. the audio quality is incredible, i can hear footsteps exactly where they are. having hot-swappable batteries is a game-changer.": "تسهل وحدة DAC ضبط توازن صوت اللعبة والمحادثة أثناء اللعب بكل سهولة. جودة الصوت مذهلة، أستطيع سماع خطوات الأقدام وتحديد مكانها بدقة. ميزة البطاريات القابلة للتبديل السريع هي نقلة نوعية.",
    "perfect sound, excellent anc": "صوت مثالي، وعزل ضوضاء ممتاز",
    "i play in a noisy room and the active noise cancellation works wonders. sound profile is rich and detailed. very comfortable fit!": "ألعب في غرفة صاخبة، ويعمل نظام إلغاء الضوضاء النشط (ANC) بشكل رائع. ملف الصوت غني ومفصل. مريحة جداً عند ارتدائها!",

    "best competitive controller on the market!": "أفضل وحدة تحكم تنافسية في السوق!",
    "the paddles feel clicky and tactile. the trigger locks make shot response times almost instant. absolutely no stick drift after a month of intense play!": "أزرار الـ Paddles الخلفية سريعة الاستجابة ومرضية للغاية. أقفال الأزرار الخلفية تجعل وقت الاستجابة لإطلاق النار فورياً تقريباً. لا يوجد أي انحراف في الماوس (Stick Drift) على الإطلاق بعد شهر من اللعب المكثف!",
    "incredible responsiveness, rubber grips are great": "استجابة لا تصدق، ومقابض مطاطية رائعة",
    "buttons click like mechanical mouse switches. fits perfectly in the hand, and the software lets you map profiles easily on the fly.": "تضغط الأزرار مثل أزرار الماوس الميكانيكية. تناسب اليد تماماً، ويسمح لك البرنامج بتعيين الإعدادات بسهولة أثناء اللعب.",

    "the absolute best gaming chair.": "أفضل كرسي ألعاب على الإطلاق.",
    "the adaptive lumbar support is amazing—it actually moves with you when you lean. the premium epu synthetic leather feels extremely high quality. assembly was very straightforward.": "دعم القطنية التكيفي مذهل - فهو يتحرك معك فعلياً عند الانحناء. جلد EPU الاصطناعي الممتاز ذو جودة عالية للغاية. كان التجميع سهلاً ومباشراً للغاية.",
    "incredibly ergonomic, worth every penny": "مريح للغاية، يستحق كل قرش",
    "i spend 10+ hours a day at my desk, and this chair has completely eliminated my back pain. the high density foam is firm but comfortable.": "أقضي أكثر من 10 ساعات يومياً على مكتبي، وقد قضى هذا الكرسي تماماً على آلام ظهري. الفوم عالي الكثافة متماسك ومريح للغاية.",

    "next-gen vr is finally here!": "جيل جديد من الواقع الافتراضي هنا أخيراً!",
    "the mixed reality passthrough is clear enough to read my phone screen. pancake lenses make everything sharp from edge to edge. a massive upgrade over the quest 2.": "خاصية العبور (Passthrough) للواقع المختلط واضحة بما يكفي لقراءة شاشة هاتفي. عدسات البانكيك تجعل كل شيء حاداً من الحافة إلى الحافة. ترقية هائلة مقارنة بـ Quest 2.",
    "incredible experience, but elite strap is a must": "تجربة مذهلة، لكن حزام النخبة ضروري",
    "graphics are crisp, and the system is fast. the default strap is okay, but i highly recommend upgrading to the elite strap for better weight distribution.": "الرسومات حادة للغاية، والنظام سريع. الحزام الافتراضي مقبول، لكنني أنصح بشدة بالترقية إلى حزام Elite لتوزيع الوزن بشكل أفضل.",

    "absolutely breathtaking oled display!": "شاشة OLED خلابة تحبس الأنفاس!",
    "the colors are incredibly vibrant, and the blacks are perfectly deep. 240hz refresh rate combined with near-instant response time makes gaming smoother than ever.": "الألوان نابضة بالحياة بشكل لا يصدق، واللون الأسود عميق ومثالي. معدل التحديث 240 هرتز مع زمن الاستجابة الفوري تقريباً يجعل الألعاب أسلس من أي وقت مضى.",
    "endless premium features, great heat dissipation": "ميزات ممتازة لا حصر لها، وتشتيت حراري رائع",
    "the custom heatsink keeps the panel cool, reducing burn-in risk. smart kvm is super useful for my dual pc setup. stunning design!": "المشتت الحراري المخصص يحافظ على برودة اللوحة، مما يقلل من خطر الاحتراق الذاتي. ميزة Smart KVM مفيدة جداً لإعداد الكمبيوتر المزدوج الخاص بي. تصميم مذهل!",

    "the ultimate portable powerhouse": "وحش الأداء المحمول الأقوى على الإطلاق",
    "the mini-led dual-mode display is insane—switching between 4k creative work and high-refresh fhd gaming is seamless. build quality rivals apple. gets warm, but performance is unmatched.": "شاشة Mini-LED ثنائية الوضع مذهلة - التبديل بين دقة 4K للعمل الإبداعي ودقة FHD بمعدل تحديث عالٍ للألعاب سلس للغاية. جودة التصنيع تنافس آبل. يسخن قليلاً، لكن الأداء لا مثيل له.",
    "unbelievable graphics performance": "أداء رسوميات لا يصدق",
    "rtx 4090 in a laptop this thin feels like black magic. cyberpunk with full ray reconstruction runs buttery smooth. pricey, but absolutely worth it.": "وجود بطاقة RTX 4090 في لابتوب بهذا السمك النحيف يبدو وكأنه سحر. لعبة Cyberpunk مع تقنية تتبع الأشعة الكاملة تعمل بسلاسة فائقة. غالي الثمن، ولكنه يستحق كل قرش بالتأكيد.",

    "absolute monster of a gpu!": "بطاقة رسوميات وحش بكل ما تحمله الكلمة من معنى!",
    "this card handles anything i throw at it at 4k max settings. temps never exceed 60c even under full load thanks to the massive cooler. power-hungry but incredible.": "هذه البطاقة تتعامل مع أي شيء أشغله عليها بدقة 4K وبأقصى إعدادات. درجات الحرارة لا تتجاوز 60 درجة مئوية أبداً حتى تحت الضغط الكامل بفضل المبرد الضخم. تستهلك طاقة كبيرة ولكنها مذهلة.",
    "utterly flawless 4k gaming and ai workloads": "ألعاب 4K وسير عمل الذكاء الاصطناعي بلا أي أخطاء",
    "rendering and training models is blazing fast. frame generation in games feels like magic. make sure you have a massive case and a top-tier power supply!": "عمليات الرندر وتدريب النماذج سريعة للغاية. توليد الإطارات (Frame Generation) في الألعاب يشبه السحر. تأكد من أن لديك صندوق حاسوب ضخم ومزود طاقة من الدرجة الأولى!",

    "absolutely love it! highly recommend": "أحببته كثيراً! أنصح به بشدة",
    "exceeded my expectations in every way. the material feels premium, and it performs flawlessly. shipping was fast too.": "فاق توقعاتي في كل شيء. المواد تبدو ممتازة، ويؤدي وظيفته بلا عيوب. كان الشحن سريعاً أيضاً.",
    "great value for the price": "قيمة رائعة مقابل السعر",
    "good quality and works exactly as described. will definitely buy from neontech again!": "جودة جيدة ويعمل تماماً كما هو موصوف. بالتأكيد سأشتري من NeonTech مرة أخرى!",

    "best keyboard i have ever owned. period.": "أفضل لوحة مفاتيح امتلكتها على الإطلاق. بلا شك.",
    "the low-profile switches are incredibly satisfying to type on. the battery life is amazing — i get almost two weeks with moderate rgb use. lightspeed wireless has zero noticeable latency. highly recommended!": "المفاتيح منخفضة الارتفاع مرضية للغاية في الكتابة عليها. عمر البطارية مذهل - أحصل على أسبوعين تقريباً مع الاستخدام المعتدل لإضاءة RGB. اتصال Lightspeed اللاسلكي ليس به أي زمن انتقال ملحوظ. موصى به بشدة!",
    "superb premium build, slightly expensive": "بنية ممتازة ورائعة، باهظة الثمن قليلاً",
    "the aluminum finish looks fantastic on my desk. keycap legends are sharp, and the software works well. my only complaint is the price, but you definitely get what you pay for in terms of quality.": "تشطيب الألومنيوم يبدو رائعاً للغاية على مكتبي. طباعة أغطية المفاتيح حادة، والبرنامج يعمل بشكل جيد. شكواي الوحيدة هي السعر، لكنك بالتأكيد تحصل على ما تدفع مقابله من حيث الجودة.",

    "mixed reality is mind-blowing!": "الواقع المختلط مذهل ومدهش للغاية!",
    "amazing clarity, strap could be better": "وضوح مذهل، والحزام يمكن أن يكون أفضل",
    "best display for gaming, period.": "أفضل شاشة للألعاب بلا منازع.",
    "extremely fast, but needs a dark room": "سريعة للغاية، لكنها تحتاج لغرفة مظلمة",
    "mindblowing performance in a portable package": "أداء مذهل في هيكل محمول وسهل النقل",
    "excellent workstation and gaming powerhouse": "محطة عمل ممتازة ووحش ألعاب حقيقي",
    "unparalleled power, path tracing is flawless": "قوة لا مثيل لها، وتتبع المسار مثالي ومذهل",
    "a dream for machine learning and rendering": "حلم لتعلم الآلة وعمليات الرندر",
    "incredible back support!": "دعم ظهر مذهل للغاية!",
    "premium quality worth every penny": "جودة عالية تستحق كل قرش"
};

function translatePage(lang) {
    const t = translations[lang];
    if (!t) return;
    
    // Set html lang and body dir attributes
    document.documentElement.lang = lang;
    if (lang === 'ar') {
        document.body.classList.add("lang-ar");
        document.body.dir = "rtl";
    } else {
        document.body.classList.remove("lang-ar");
        document.body.dir = "ltr";
    }
    
    // Search input placeholder
    const searchInput = document.querySelector(".nav-search input");
    if (searchInput) {
        searchInput.placeholder = t.searchPlaceholder;
    }
    
    // Sidebar section title
    const sidebarTitle = document.querySelector(".sidebar-section:first-child .sidebar-title");
    if (sidebarTitle) {
        sidebarTitle.textContent = t.categoriesTitle;
    }
    
    // Translate filters
    const filterItems = document.querySelectorAll(".sidebar .filter-item");
    filterItems.forEach(item => {
        const countSpan = item.querySelector(".filter-count");
        const countText = countSpan ? countSpan.outerHTML : "";
        const iconSpan = item.querySelector(".filter-icon");
        const iconText = iconSpan ? iconSpan.outerHTML : "";
        
        let text = item.textContent.replace(countSpan ? countSpan.textContent : "", "").trim();
        let lower = text.toLowerCase();
        let key = "";
        if (lower.includes("all products") || lower.includes("كل المنتجات")) key = "allProducts";
        else if (lower.includes("controllers") || lower.includes("أجهزة التحكم")) key = "controllers";
        else if (lower.includes("monitors") || lower.includes("الشاشات")) key = "monitors";
        else if (lower.includes("headsets") || lower.includes("سماعات الرأس")) key = "headsets";
        else if (lower.includes("keyboards") || lower.includes("لوحات المفاتيح")) key = "keyboards";
        else if (lower.includes("mice") || lower.includes("الماوسات")) key = "mice";
        else if (lower.includes("laptops") || lower.includes("لاب توب")) key = "laptops";
        else if (lower.includes("graphics cards") || lower.includes("كروت الشاشة")) key = "graphicsCards";
        else if (lower.includes("vr headsets") || lower.includes("نظارات الواقع الافتراضي")) key = "vrHeadsets";
        else if (lower.includes("gaming chairs") || lower.includes("كراسي القيمنق")) key = "gamingChairs";
        
        if (key && t[key]) {
            item.innerHTML = `<span>${iconText}${t[key]}</span>${countText}`;
        }
    });
    
    // Brands Title translation
    const brandsTitle = document.querySelectorAll(".sidebar-section")[1]?.querySelector(".sidebar-title");
    if (brandsTitle) {
        brandsTitle.textContent = t.brandsTitle;
    }
    
    // Price title translation
    const priceTitle = document.querySelectorAll(".sidebar-section")[2]?.querySelector(".sidebar-title");
    if (priceTitle) {
        priceTitle.textContent = t.priceRangeTitle;
    }
    
    // Exit Intent Discount
    const exitModal = document.querySelector(".exit-modal");
    if (exitModal) {
        const titleEl = exitModal.querySelector(".exit-title") || exitModal.querySelector("h2");
        const descEl = exitModal.querySelector(".exit-desc") || exitModal.querySelector("p");
        const closeBtnEl = exitModal.querySelector(".close-btn");
        const dismissLink = exitModal.querySelector(".dismiss-link") || exitModal.querySelector(".close-link");
        
        if (titleEl) titleEl.textContent = t.exitTitle;
        if (descEl) {
            descEl.innerHTML = `${t.exitDesc} <span class="coupon-code">SALAH10</span>`;
        }
        if (closeBtnEl && closeBtnEl.tagName !== "BUTTON") {
            closeBtnEl.textContent = "×";
        }
        if (dismissLink) dismissLink.textContent = t.exitClose;
    }
    
    // Cart Drawer Header & Empty State
    const cartHeader = document.querySelector("#cart-drawer h2");
    if (cartHeader) {
        cartHeader.textContent = t.cartTitle;
    }
    const emptyStateText = document.querySelector(".cart-empty-state p");
    if (emptyStateText) {
        emptyStateText.textContent = t.emptyCart;
    }
    const emptyStateBtn = document.querySelector("#cart-shop-now");
    if (emptyStateBtn) {
        emptyStateBtn.textContent = t.shopNow;
    }
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.textContent = t.buyNow;
    }
    
    // Detail page buttons
    const pAddCartBtn = document.querySelector(".p-add-cart-btn span") || document.querySelector(".p-add-cart-btn");
    if (pAddCartBtn) {
        pAddCartBtn.textContent = t.addToCart;
    }
    const qtyLabel = document.querySelector(".qty-label");
    if (qtyLabel) {
        qtyLabel.textContent = t.qtyLabel;
    }
    
    // Tab Button Titles
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
        let text = btn.textContent.trim().toLowerCase();
        if (text.includes("description") || text.includes("الوصف")) {
            btn.textContent = t.descTab;
        } else if (text.includes("specifications") || text.includes("المواصفات")) {
            btn.textContent = t.specsTab;
        } else if (text.includes("reviews") || text.includes("المراجعات")) {
            btn.textContent = t.reviewsTab;
        }
    });
    
    const reviewsHeader = document.querySelector(".reviews-header h3");
    if (reviewsHeader) {
        let countText = reviewsHeader.textContent.match(/\d+/);
        let count = countText ? countText[0] : "0";
        reviewsHeader.textContent = lang === 'ar' ? `المراجعات (${count})` : `Reviews (${count})`;
    }
    
    // Live Gamers Simulator Switch
    const viewersTextList = document.querySelectorAll(".viewers-text");
    viewersTextList.forEach(viewerText => {
        const countSpan = viewerText.querySelector(".viewers-count");
        if (countSpan) {
            const count = countSpan.textContent.trim();
            viewerText.innerHTML = lang === 'ar' 
                ? `مباشر: <span class="viewers-count">${count}</span> لاعبين يتصفحون الآن`
                : `Live: <span class="viewers-count">${count}</span> Gamers`;
        }
    });

    // Detailed Product Page Custom Translation Block
    if (lang === 'ar') {
        // Translate specifications tables
        const specRows = document.querySelectorAll(".specs-table tr");
        specRows.forEach(row => {
            const th = row.querySelector("th");
            const td = row.querySelector("td");
            if (th) {
                const key = th.textContent.trim().toLowerCase();
                if (staticPhrases[key]) th.textContent = staticPhrases[key];
            }
            if (td) {
                const key = td.textContent.trim().toLowerCase();
                if (staticPhrases[key]) td.textContent = staticPhrases[key];
            }
        });

        // Translate trust tags
        const tagItems = document.querySelectorAll(".tag-item");
        tagItems.forEach(item => {
            const title = item.querySelector(".tag-title");
            const sub = item.querySelector(".tag-sub");
            if (title) {
                const key = title.textContent.trim().toLowerCase();
                if (staticPhrases[key]) title.textContent = staticPhrases[key];
            }
            if (sub) {
                const key = sub.textContent.trim().toLowerCase();
                if (staticPhrases[key]) sub.textContent = staticPhrases[key];
            }
        });

        // Translate stock status
        const stockStatus = document.querySelector(".p-stock-status");
        if (stockStatus) {
            const dot = stockStatus.querySelector(".pulse-dot");
            const text = stockStatus.textContent.trim().toLowerCase();
            let matchedText = "متوفر في المخزون — جاهز للشحن الفوري";
            if (text.includes("in stock")) {
                matchedText = "متوفر في المخزون — جاهز للشحن الفوري";
            }
            stockStatus.innerHTML = "";
            if (dot) stockStatus.appendChild(dot);
            stockStatus.appendChild(document.createTextNode(" " + matchedText));
        }

        // Define bilingual option labels maps
        const optionLabelsMap = {
            "color:": "اللون:",
            "switch type:": "نوع المفاتيح:",
            "ear cushion:": "وسادة الأذن:",
            "polling rate:": "معدل الاستطلاع:",
            "storage capacity:": "سعة التخزين:",
            "head strap:": "حزام الرأس:",
            "screen size:": "حجم الشاشة:",
            "panel finish:": "طلاء الشاشة:",
            "display mode:": "وضع العرض:",
            "configuration:": "المواصفات الأساسية:",
            "cooling form factor:": "نظام التبريد:",
            "memory:": "الذاكرة الرسومية:",
            "grip type:": "نوع المقبض:",
            "upholstery:": "الخامة الخارجية:",
            "size:": "الحجم:"
        };

        const optionLabelsMapEn = {
            "color:": "Color:",
            "switch type:": "Switch Type:",
            "ear cushion:": "Ear Cushion:",
            "polling rate:": "Polling Rate:",
            "storage capacity:": "Storage Capacity:",
            "head strap:": "Head Strap:",
            "screen size:": "Screen Size:",
            "panel finish:": "Panel Finish:",
            "display mode:": "Display Mode:",
            "configuration:": "Configuration:",
            "cooling form factor:": "Cooling Form Factor:",
            "memory:": "Memory:",
            "grip type:": "Grip Type:",
            "upholstery:": "Upholstery:",
            "size:": "Size:"
        };

        // Translate option groups label and pill buttons dynamically for all products
        const optionGroups = document.querySelectorAll(".option-group");
        optionGroups.forEach(group => {
            const label = group.querySelector(".option-label");
            if (label) {
                const selectedVal = label.querySelector(".selected-val");
                const selectedValText = selectedVal ? selectedVal.textContent.trim() : "";
                
                // Extract clean label text without the selected-val text
                let cleanLabel = label.textContent.replace(selectedValText, "").trim().toLowerCase();
                
                if (lang === 'ar') {
                    let arabicLabel = "";
                    for (let key in optionLabelsMap) {
                        if (cleanLabel.includes(key)) {
                            arabicLabel = optionLabelsMap[key];
                            break;
                        }
                    }
                    if (arabicLabel) {
                        const translatedVal = staticPhrases[selectedValText.toLowerCase().trim()] || selectedValText;
                        label.innerHTML = `${arabicLabel} <span class="selected-val">${translatedVal}</span>`;
                    }
                } else {
                    // English
                    let englishLabel = "";
                    for (let key in optionLabelsMapEn) {
                        if (cleanLabel.includes(key)) {
                            englishLabel = optionLabelsMapEn[key];
                            break;
                        }
                    }
                    if (englishLabel) {
                        const checkedRadio = group.querySelector("input[type='radio']:checked");
                        let origVal = selectedValText;
                        if (checkedRadio) {
                            const pill = checkedRadio.closest(".opt-pill");
                            const pillBtn = pill ? pill.querySelector(".opt-pill-btn") : null;
                            if (pillBtn) {
                                origVal = pillBtn.textContent.trim();
                            }
                        }
                        label.innerHTML = `${englishLabel} <span class="selected-val">${origVal}</span>`;
                    }
                }
            }

            // Translate pill buttons themselves (so they are localized in the choice options)
            const pills = group.querySelectorAll(".opt-pill-btn");
            pills.forEach(pill => {
                const text = pill.textContent.trim().toLowerCase();
                if (lang === 'ar') {
                    if (staticPhrases[text]) {
                        pill.textContent = staticPhrases[text];
                    }
                } else {
                    // Restore English
                    const radio = pill.previousElementSibling || pill.closest(".opt-pill")?.querySelector("input[type='radio']");
                    if (radio) {
                        let originalText = radio.value;
                        let valueMapping = {
                            "carbon": "Carbon Black",
                            "white": "White Edition",
                            "red": "Red Edition",
                            "blue": "Blue Edition",
                            "1000": "1000Hz (Standard)",
                            "8000": "8000Hz (Dongle Needed)",
                            "128": "128GB Storage",
                            "512": "512GB Storage (+$120)",
                            "standard": "Standard Soft Strap",
                            "elite": "Elite Battery Strap (+$100)",
                            "leatherette": "Premium Leatherette",
                            "fabric": "Breathable Fabric Mesh",
                            "regular": "Regular (170-189cm)",
                            "xl": "XL (190-200cm)",
                            "small": "Small (Under 170cm)",
                            "gl-tactile": "GL Tactile (Quiet)",
                            "gl-clicky": "GL Clicky (Audible)",
                            "gl-linear": "GL Linear (Smooth)",
                            "founders": "Founders Edition (Triple-Slot Fan)",
                            "triple-fan": "Custom OC (Triple-Slot Fan)",
                            "liquid": "Liquid Cooled AIO",
                            "32gb": "32GB GDDR7",
                            "48gb": "48GB GDDR7",
                            "matte": "Anti-Glare Matte",
                            "glossy": "Glossy AR Glass",
                            "27-360": "27\" WQHD 360Hz",
                            "32-240": "32\" 4K UHD 240Hz",
                            "dual-mode": "Dual Mini-LED (UHD+ 120Hz / FHD+ 240Hz)",
                            "oled-mode": "QHD OLED 240Hz",
                            "32gb-2tb": "32GB RAM + 2TB SSD",
                            "64gb-4tb": "64GB RAM + 4TB SSD",
                            "standard-grip": "Standard Grip",
                            "sticky-grip": "Pro Sticky Grip",
                            "hybrid-leather": "NEO Hybrid Leatherette",
                            "softweave": "SoftWeave Plus Fabric",
                            "nappa": "Premium Napa Leather"
                        };
                        if (originalText && valueMapping[originalText]) {
                            if (originalText === "carbon" && (document.title.includes("Secretlab") || document.title.includes("Titan"))) {
                                pill.textContent = "Stealth Black";
                            } else {
                                pill.textContent = valueMapping[originalText];
                            }
                        }
                    }
                }
            });
        });

        // Translate page custom titles and descriptions dynamically based on matching
        const pTitle = document.querySelector(".p-title");
        const pDesc = document.querySelector(".p-desc");
        if (pTitle) {
            const titleText = pTitle.textContent.trim().toLowerCase();
            if (titleText.includes("g915")) {
                pTitle.textContent = "لوحة مفاتيح لوجيتك G915 TKL اللاسلكية";
                if (pDesc) pDesc.textContent = "ثورة في التصميم والهندسة. تتميز لوحة G915 TKL بتقنية LIGHTSPEED اللاسلكية الاحترافية وإضاءة LIGHTSYNC RGB المتطورة ومفاتيح ميكانيكية منخفضة الحجم عالية الأداء.";
            } else if (titleText.includes("titan evo")) {
                pTitle.textContent = "كرسي الألعاب سيكريت لاب تايتان إيفو إصدار 2026";
                if (pDesc) pDesc.textContent = "كرسي الألعاب الحائز على الجوائز. يوفر سيكريت لاب تايتان إيفو راحة مريحة فائقة وتصميماً مريحاً للألعاب وجلسات العمل الطويلة.";
            } else if (titleText.includes("xbox")) {
                pTitle.textContent = "جهاز تحكم إكس بوكس اللاسلكي — ستيلر شيفت";
                if (pDesc) pDesc.textContent = "ارتقِ بمستوى لعبك مع جهاز تحكم إكس بوكس اللاسلكي الذي يتميز بتصميم أنيق ومسكات مطاطية مريحة وتغيير الألوان الفريد.";
            } else if (titleText.includes("rtx 5090")) {
                pTitle.textContent = "كارت الشاشة أسوس روج ستريكس جيفورس RTX 5090";
                if (pDesc) pDesc.textContent = "أقوى كارت شاشة للجيمنج وصناع المحتوى بمستويات أداء خيالية مع تقنية DLSS 4 والجيل الجديد من تتبع الأشعة وتصميم نيون رائع.";
            } else if (titleText.includes("arctis nova")) {
                pTitle.textContent = "سماعة ستيل سيريز أركتيس نوفا برو اللاسلكية";
                if (pDesc) pDesc.textContent = "اسمع تفاصيل اللعبة كأنك بداخلها مع جودة الصوت الاحترافية ونظام إلغاء الضوضاء النشط المتطور وعمر بطارية خارق للعادة.";
            } else if (titleText.includes("blade 16")) {
                pTitle.textContent = "لاب توب القيمنق رايزر بليد 16 (إصدار 2026)";
                if (pDesc) pDesc.textContent = "أطلق العنان لأقوى أداء للجيمنج مع شاشة مذهلة قياس 16 بوصة، معالج فائق السرعة وكارت شاشة RTX 5090 لتشغيل أثقل الألعاب بسلاسة.";
            } else if (titleText.includes("odyssey oled")) {
                pTitle.textContent = "شاشة سامسونج أوديسي OLED G9 منحنية 49 بوصة";
                if (pDesc) pDesc.textContent = "ادخل إلى عصر جديد من اللعب مع شاشة عريضة مذهلة بدقة خيالية وزمن استجابة فائق السرعة 0.03ms لمتعة ألعاب لا تنتهي.";
            } else if (titleText.includes("superlight 2")) {
                pTitle.textContent = "ماوس لوجيتك جي برو إكس سوبرلايت 2 ديكس";
                if (pDesc) pDesc.textContent = "المعيار الذهبي الجديد لماوسات الألعاب الاحترافية. خفة متناهية في الوزن 60 جرام ودقة أسطورية للحركات السريعة بفضل مستشعر Hero 2.";
            } else if (titleText.includes("quest 3")) {
                pTitle.textContent = "نظارة الواقع الافتراضي ميتا كويست 3 مساحة 512 جيجا";
                if (pDesc) pDesc.textContent = "وسع عالمك واستكشف الواقع المختلط والممتد مع أقوى نظارة ألعاب مستقلة وتتبع دقيق لليدين لتجربة لعب خيالية ومثيرة.";
            } else if (titleText.includes("deathadder") || titleText.includes("hyperspeed")) {
                pTitle.textContent = "ماوس رايزر ديف أدر V3 هايبر سبيد اللاسلكي";
                if (pDesc) pDesc.textContent = "تأتي الراحة المريحة الاحترافية بوزن أخف. بوزن 55 جرامًا فقط، تم تحسين ماوس Razer DeathAdder V3 HyperSpeed لتحقيق السرعة والدقة المذهلة والراحة الفائقة بفضل مستشعر Focus X 26K البصري المتطور.";
            } else if (titleText.includes("blackshark") || (titleText.includes("headset") && titleText.includes("shark"))) {
                pTitle.textContent = "سماعة رايزر بلاك شارك V2 برو اللاسلكية";
                if (pDesc) pDesc.textContent = "صوت وراحة لا مثيل لهما. تتميز سماعة Razer BlackShark V2 Pro بميكروفون فائق الوضوح وصوت محيطي مذهل للاعبين المحترفين.";
            } else if (titleText.includes("wolverine") || titleText.includes("wolverine v3")) {
                pTitle.textContent = "يد تحكم رايزر ولفيرين V3 برو اللاسلكية";
                if (pDesc) pDesc.textContent = "أقوى يد تحكم لاسلكية احترافية للجيمنج مصممة للإكس بوكس والكمبيوتر الشخصي بميزات تخصيص استثنائية وأداء خارق.";
            }
        }
        
        // 8. Product Details Page Deep Translation Block
        
        // Translate Breadcrumbs
        const breadcrumbs = document.querySelectorAll(".breadcrumbs a, .breadcrumbs .current");
        breadcrumbs.forEach(link => {
            const text = link.textContent.trim().toLowerCase();
            if (text === "home" || text === "الرئيسية") link.textContent = "الرئيسية";
            else if (text === "mice" || text === "الماوسات") link.textContent = "الماوسات";
            else if (text === "keyboards" || text === "لوحات المفاتيح") link.textContent = "لوحات المفاتيح";
            else if (text === "headsets" || text === "سماعات الرأس") link.textContent = "سماعات الرأس";
            else if (text === "controllers" || text === "أجهزة التحكم") link.textContent = "أجهزة التحكم";
            else if (text === "gaming chairs" || text === "كراسي القيمنق") link.textContent = "كراسي القيمنق";
            else if (text === "laptops" || text === "لاب توب") link.textContent = "لاب توب";
            else if (text === "monitors" || text === "الشاشات") link.textContent = "الشاشات";
        });
        
        // Translate rating count verified reviews
        const ratingCount = document.querySelector(".p-rating-count");
        if (ratingCount) {
            const originalText = ratingCount.getAttribute("data-orig-rcount") || ratingCount.textContent.trim();
            if (!ratingCount.getAttribute("data-orig-rcount")) {
                ratingCount.setAttribute("data-orig-rcount", originalText);
            }
            if (lang === 'ar') {
                const count = originalText.replace("verified reviews", "").trim();
                ratingCount.textContent = `${count} تقييم موثق`;
            } else {
                ratingCount.textContent = originalText;
            }
        }
        
        // Translate tab labels
        const tabLabels = document.querySelectorAll(".tab-label-btn");
        tabLabels.forEach(lbl => {
            const originalText = lbl.getAttribute("data-orig-tab") || lbl.textContent.trim();
            if (!lbl.getAttribute("data-orig-tab")) {
                lbl.setAttribute("data-orig-tab", originalText);
            }
            const text = originalText.toLowerCase();
            if (lang === 'ar') {
                if (text.includes("overview")) {
                    lbl.textContent = "نظرة عامة";
                } else if (text.includes("specs") || text.includes("technical")) {
                    lbl.textContent = "المواصفات التقنية";
                } else if (text.includes("reviews")) {
                    const match = text.match(/\d+([.,]\d+)?/);
                    const count = match ? ` (${match[0]})` : "";
                    lbl.textContent = "المراجعات" + count;
                }
            } else {
                lbl.textContent = originalText;
            }
        });

        // Translate reviews aggregate score details
        const scoreSub = document.querySelector(".score-sub");
        if (scoreSub) {
            const originalText = scoreSub.getAttribute("data-orig-sub") || scoreSub.textContent.trim();
            if (!scoreSub.getAttribute("data-orig-sub")) {
                scoreSub.setAttribute("data-orig-sub", originalText);
            }
            if (lang === 'ar') {
                const match = originalText.match(/\d+([.,]\d+)?/);
                const count = match ? match[0] : "";
                scoreSub.textContent = `بناءً على ${count} تقييم مشترٍ موثق`;
            } else {
                scoreSub.textContent = originalText;
            }
        }
        
        const ratingStarLabels = document.querySelectorAll(".score-breakdown .bar-row > span:first-child");
        ratingStarLabels.forEach(lbl => {
            const originalText = lbl.getAttribute("data-orig-lbl") || lbl.textContent.trim();
            if (!lbl.getAttribute("data-orig-lbl")) {
                lbl.setAttribute("data-orig-lbl", originalText);
            }
            if (lang === 'ar') {
                const lower = originalText.toLowerCase();
                if (lower.includes("5 stars")) lbl.textContent = "5 نجوم";
                else if (lower.includes("4 stars")) lbl.textContent = "4 نجوم";
                else if (lower.includes("3 stars")) lbl.textContent = "3 نجوم";
                else if (lower.includes("2 stars")) lbl.textContent = "2 نجوم";
                else if (lower.includes("1 star")) lbl.textContent = "نجمة واحدة";
            } else {
                lbl.textContent = originalText;
            }
        });

        // Translate existing static/dynamic review items
        const reviewItems = document.querySelectorAll(".review-item");
        reviewItems.forEach(item => {
            const badge = item.querySelector(".badge-verified");
            if (badge) {
                badge.textContent = lang === 'ar' ? "مشتري موثق" : "Verified Buyer";
            }
            
            const dateEl = item.querySelector(".review-date");
            if (dateEl) {
                const originalDate = dateEl.getAttribute("data-orig-date") || dateEl.textContent.trim();
                if (!dateEl.getAttribute("data-orig-date")) {
                    dateEl.setAttribute("data-orig-date", originalDate);
                }
                if (lang === 'ar') {
                    let dateText = originalDate;
                    const monthsMap = {
                        "january": "يناير", "february": "فبراير", "march": "مارس", "april": "أبريل", "may": "مايو", "june": "يونيو",
                        "july": "يوليو", "august": "أغسطس", "september": "سبتمبر", "october": "أكتوبر", "november": "نوفمبر", "december": "ديسمبر"
                    };
                    let lowerDate = dateText.toLowerCase();
                    for (const [enMonth, arMonth] of Object.entries(monthsMap)) {
                        if (lowerDate.includes(enMonth)) {
                            dateText = dateText.toLowerCase().replace(enMonth, arMonth);
                            break;
                        }
                    }
                    dateEl.textContent = dateText;
                } else {
                    dateEl.textContent = originalDate;
                }
            }

            const titleEl = item.querySelector(".review-title");
            if (titleEl) {
                const originalTitle = titleEl.getAttribute("data-orig-title") || titleEl.textContent.trim();
                if (!titleEl.getAttribute("data-orig-title")) {
                    titleEl.setAttribute("data-orig-title", originalTitle);
                }
                if (lang === 'ar') {
                    const key = originalTitle.toLowerCase().trim();
                    titleEl.textContent = staticPhrases[key] || originalTitle;
                } else {
                    titleEl.textContent = originalTitle;
                }
            }
            
            const textEl = item.querySelector(".review-text");
            if (textEl) {
                const originalTextVal = textEl.getAttribute("data-orig-text") || textEl.textContent.trim();
                if (!textEl.getAttribute("data-orig-text")) {
                    textEl.setAttribute("data-orig-text", originalTextVal);
                }
                if (lang === 'ar') {
                    const key = originalTextVal.toLowerCase().trim();
                    textEl.textContent = staticPhrases[key] || originalTextVal;
                } else {
                    textEl.textContent = originalTextVal;
                }
            }
        });

        // Translate Write Review Form dynamically if present
        const writeReviewTitle = document.querySelector(".write-review-title");
        if (writeReviewTitle) {
            writeReviewTitle.textContent = lang === 'ar' ? "اكتب تقييمًا" : "WRITE A REVIEW";
        }
        const reviewRatingLabel = document.querySelector("#write-review-form div span");
        if (reviewRatingLabel) {
            reviewRatingLabel.textContent = lang === 'ar' ? "تقييمك بالنجوم:" : "Your Rating:";
        }
        const reviewAuthor = document.getElementById("review-author");
        if (reviewAuthor && !reviewAuthor.readOnly) {
            reviewAuthor.placeholder = lang === 'ar' ? "اسمك الكريم" : "Your Name";
        }
        const reviewTitleInput = document.getElementById("review-title");
        if (reviewTitleInput) {
            reviewTitleInput.placeholder = lang === 'ar' ? "عنوان المراجعة (مثال: أداء جبار!)" : "Review Title (e.g., Ultimate performance!)";
        }
        const reviewTextInput = document.getElementById("review-text");
        if (reviewTextInput) {
            reviewTextInput.placeholder = lang === 'ar' ? "شاركنا تجربتك للأداة الجيمنج..." : "Share your experience with this gaming gear...";
        }
        const reviewSubmitBtn = document.querySelector('#write-review-form button[type="submit"]');
        if (reviewSubmitBtn) {
            reviewSubmitBtn.textContent = lang === 'ar' ? "إرسال التقييم" : "Submit Review";
        }
        
        // Translate Overview page headings and feature cards
        const contentTitles = document.querySelectorAll(".tab-content .content-title, .related-products-section .section-title-label");
        contentTitles.forEach(tEl => {
            const text = tEl.textContent.trim().toLowerCase();
            if (text.includes("ultra-lightweight")) {
                tEl.textContent = "ماوس مريح وخفيف الوزن للغاية";
            } else if (text.includes("technical specifications") || text.includes("specs")) {
                tEl.textContent = "المواصفات التقنية";
            } else if (text.includes("complete your setup") || text.includes("setup")) {
                tEl.innerHTML = `أكمل <span>منصتك</span>`;
            }
        });
        
        const overviewP = document.querySelector(".overview-content p");
        if (overviewP && overviewP.textContent.trim().toLowerCase().includes("tested and approved")) {
            overviewP.textContent = "تم اختباره واعتماده من قبل أبطال الألعاب المحترفين. تم إعادة تصميم Razer DeathAdder V3 HyperSpeed بشكل محسّن لتوفير أقصى درجات الراحة والتحكم بفضل مستشعر Focus X البصري المتطور.";
        }
        
        const fCardTitles = document.querySelectorAll(".feature-card .f-card-title");
        fCardTitles.forEach(title => {
            const text = title.textContent.trim().toLowerCase();
            if (text.includes("55g")) {
                title.textContent = "وزن خفيف للغاية 55 جرام";
            } else if (text.includes("focus x")) {
                title.textContent = "مستشعر Focus X البصري";
            } else if (text.includes("switches")) {
                title.textContent = "المفاتيح البصرية الجيل الثالث";
            }
        });
        
        const fCardTexts = document.querySelectorAll(".feature-card .f-card-text");
        fCardTexts.forEach(txt => {
            const text = txt.textContent.trim().toLowerCase();
            if (text.includes("lightest ergonomic")) {
                txt.textContent = "واحد من أخف ماوسات الألعاب المريحة التي تم تصميمها على الإطلاق. تحرك بسرعة وبدقة متناهية مع أقل قدر من التعب.";
            } else if (text.includes("26,000 dpi")) {
                txt.textContent = "مستشعر بدقة 26,000 نقطة في البوصة يتتبع حركاتك بدقة متناهية مع معايرة ذكية ومزامنة الحركة.";
            } else if (text.includes("double-clicking")) {
                txt.textContent = "خالٍ تماماً من مشاكل النقرات المزدوجة مع استجابة فائقة السرعة 0.2 ملي ثانية، وعمر افتراضي 90 مليون نقرة.";
            }
        });
    }

    // 7. Homepage Static Content Custom Translation Block
    if (lang === 'ar') {
        // Catalog Title
        const catTitle = document.querySelector(".catalog-title");
        if (catTitle) {
            catTitle.innerHTML = `مستلزمات <span>الألعاب</span>`;
        }

        // Featured Banner (limited drop)
        const featTag = document.querySelector(".featured-tag");
        if (featTag) featTag.textContent = "إصدار محدود";
        
        const featTitle = document.querySelector(".featured-title");
        if (featTitle) featTitle.innerHTML = `لوحة مفاتيح رايزر بلاك ويدو V4 برو &mdash; إصدار الفانتوم`;
        
        const featSub = document.querySelector(".featured-sub");
        if (featSub) featSub.innerHTML = `مفاتيح ميكانيكية &bull; إضاءة كروما RGB &bull; استجابة ملموسة &bull; متبقي 200 قطعة فقط!`;
        
        const featShop = document.getElementById("featured-shop-now");
        if (featShop) featShop.textContent = "تصفح المتجر";
        
        const featLearn = document.getElementById("featured-learn-more");
        if (featLearn) featLearn.textContent = "اقرأ المزيد";

        // Sort label
        const sortSelect = document.querySelector(".sort-select");
        if (sortSelect) {
            const options = sortSelect.querySelectorAll("option");
            const arOptions = ["المميز", "السعر: من الأقل للأعلى", "السعر: من الأعلى للأقل", "الأعلى تقييماً", "الأحدث"];
            options.forEach((opt, idx) => {
                if (arOptions[idx]) opt.textContent = arOptions[idx];
            });
        }

        const filterToggleBtn = document.querySelector(".filter-toggle-btn");
        if (filterToggleBtn) {
            const svg = filterToggleBtn.querySelector("svg");
            filterToggleBtn.innerHTML = "";
            if (svg) filterToggleBtn.appendChild(svg);
            filterToggleBtn.appendChild(document.createTextNode(" الفلاتر"));
        }

        // Comparison Bar
        const compBarTitle = document.querySelector(".comp-bar-title");
        if (compBarTitle) compBarTitle.textContent = "مقارنة المنتجات";
        
        const compBarDesc = document.querySelector(".comp-bar-desc");
        if (compBarDesc) compBarDesc.textContent = "اختر حتى 3 منتجات للمقارنة جنباً إلى جنب";
        
        const compClearBtn = document.getElementById("comp-clear-btn");
        if (compClearBtn) compClearBtn.textContent = "مسح الكل";
        
        const compCompareBtn = document.getElementById("comp-compare-btn");
        if (compCompareBtn) compCompareBtn.textContent = "قارن الآن";
        
        const compModalTitle = document.querySelector(".comp-modal-title");
        if (compModalTitle) compModalTitle.innerHTML = `مقارنة <span>المنتجات</span>`;

        // Auth Modal Labels & Placeholders
        const authTitle = document.querySelector(".auth-modal-title");
        if (authTitle) {
            const text = authTitle.textContent.toLowerCase();
            if (text.includes("in") || text.includes("دخول")) {
                authTitle.innerHTML = `تسجيل <span>الدخول</span>`;
            } else if (text.includes("up") || text.includes("إنشاء")) {
                authTitle.innerHTML = `إنشاء <span>حساب</span>`;
            }
        }

        // Login Form
        const loginForm = document.getElementById("login-form");
        if (loginForm) {
            const emailLabel = loginForm.querySelector("label[for='login-email']");
            if (emailLabel) emailLabel.textContent = "البريد الإلكتروني";
            const emailInput = loginForm.querySelector("#login-email");
            if (emailInput) emailInput.placeholder = "name@example.com";
            
            const passLabel = loginForm.querySelector("label[for='login-password']");
            if (passLabel) passLabel.textContent = "كلمة المرور";
            const passInput = loginForm.querySelector("#login-password");
            if (passInput) passInput.placeholder = "••••••••";
            
            const forgotLink = loginForm.querySelector("#switch-to-forgot");
            if (forgotLink) forgotLink.textContent = "نسيت كلمة المرور؟";
            
            const submitBtn = loginForm.querySelector("button[type='submit']");
            if (submitBtn) submitBtn.textContent = "تسجيل الدخول";
            
            const orSpan = loginForm.querySelector(".auth-divider span");
            if (orSpan) orSpan.textContent = "أو";
            
            const googleBtn = loginForm.querySelector(".btn-google");
            if (googleBtn) {
                const svg = googleBtn.querySelector("svg");
                googleBtn.innerHTML = "";
                if (svg) googleBtn.appendChild(svg);
                googleBtn.appendChild(document.createTextNode(" المتابعة باستخدام Google"));
            }
            
            const switchText = loginForm.querySelector(".auth-switch");
            if (switchText) {
                switchText.innerHTML = `ليس لديك حساب؟ <a href="#" id="switch-to-signup" style="color: var(--neon); text-decoration: none;">إنشاء حساب جديد</a>`;
            }
        }

        // Signup Form
        const signupForm = document.getElementById("signup-form");
        if (signupForm) {
            const nameLabel = signupForm.querySelector("label[for='signup-name']");
            if (nameLabel) nameLabel.textContent = "الاسم التعريفي";
            const nameInput = signupForm.querySelector("#signup-name");
            if (nameInput) nameInput.placeholder = "Gamer123";
            
            const emailLabel = signupForm.querySelector("label[for='signup-email']");
            if (emailLabel) emailLabel.textContent = "البريد الإلكتروني";
            const emailInput = signupForm.querySelector("#signup-email");
            if (emailInput) emailInput.placeholder = "name@example.com";
            
            const passLabel = signupForm.querySelector("label[for='signup-password']");
            if (passLabel) passLabel.textContent = "كلمة المرور";
            const passInput = signupForm.querySelector("#signup-password");
            if (passInput) passInput.placeholder = "••••••••";
            
            const confirmLabel = signupForm.querySelector("label[for='signup-password-confirm']");
            if (confirmLabel) confirmLabel.textContent = "تأكيد كلمة المرور";
            const confirmInput = signupForm.querySelector("#signup-password-confirm");
            if (confirmInput) confirmInput.placeholder = "••••••••";
            
            const submitBtn = signupForm.querySelector("button[type='submit']");
            if (submitBtn) submitBtn.textContent = "إنشاء حساب";
            
            const orSpan = signupForm.querySelector(".auth-divider span");
            if (orSpan) orSpan.textContent = "أو";
            
            const googleBtn = signupForm.querySelector(".btn-google");
            if (googleBtn) {
                const svg = googleBtn.querySelector("svg");
                googleBtn.innerHTML = "";
                if (svg) googleBtn.appendChild(svg);
                googleBtn.appendChild(document.createTextNode(" التسجيل باستخدام Google"));
            }
            
            const switchText = signupForm.querySelector(".auth-switch");
            if (switchText) {
                switchText.innerHTML = `لديك حساب بالفعل؟ <a href="#" id="switch-to-login" style="color: var(--neon); text-decoration: none;">تسجيل الدخول</a>`;
            }
        }

        // ================= HOMEPAGE STATIC AND PRODUCT CARD TRANSLATIONS =================
        
        // 1. Dynamic Product Cards & Title Fallback
        const productCards = document.querySelectorAll(".product-card");
        productCards.forEach(card => {
            const cat = card.querySelector(".card-category");
            if (cat) {
                const text = cat.textContent.trim().toLowerCase();
                if (text === "mice" || text === "الماوسات") cat.textContent = "الماوسات";
                else if (text === "headsets" || text === "سماعات الرأس") cat.textContent = "سماعات الرأس";
                else if (text === "controllers" || text === "أجهزة التحكم") cat.textContent = "أجهزة التحكم";
                else if (text === "gaming chairs" || text === "كراسي القيمنق") cat.textContent = "كراسي القيمنق";
                else if (text === "keyboards" || text === "لوحات المفاتيح") cat.textContent = "لوحات المفاتيح";
                else if (text === "monitors" || text === "الشاشات") cat.textContent = "الشاشات";
                else if (text === "laptops" || text === "لاب توب") cat.textContent = "لاب توب";
                else if (text === "graphics cards" || text === "كروت الشاشة") cat.textContent = "كروت الشاشة";
                else if (text === "vr headsets" || text === "نظارات الواقع الافتراضي") cat.textContent = "نظارات الواقع الافتراضي";
            }
            
            const titleEl = card.querySelector(".card-title a") || card.querySelector(".card-title");
            if (titleEl) {
                titleEl.textContent = getTranslatedProductTitle(titleEl.textContent);
            }
            
            const badge = card.querySelector(".card-badge");
            if (badge) {
                const text = badge.textContent.trim().toUpperCase();
                if (text === "NEW" || text === "جديد") badge.textContent = "جديد";
                else if (text === "HOT" || text === "شائع" || text.includes("شائع")) badge.innerHTML = "🔥 شائع";
                else if (text === "SALE" || text === "تخفيض") badge.textContent = "تخفيض";
            }
            
            const cartBtn = card.querySelector(".btn-cart");
            if (cartBtn) {
                const span = cartBtn.querySelector("span");
                if (span) {
                    span.textContent = "إضافة للسلة";
                } else {
                    cartBtn.textContent = "إضافة للسلة";
                }
            }
        });

        // Translate page main title fallback if present
        const pageTitleEl = document.querySelector(".p-title");
        if (pageTitleEl) {
            pageTitleEl.textContent = getTranslatedProductTitle(pageTitleEl.textContent);
        }

        // 2. Features Strip
        const featureItems = document.querySelectorAll(".features-strip .feature-item");
        const featuresMap = {
            "free shipping": { title: "شحن مجاني", sub: "على جميع الطلبات بأكثر من $49" },
            "secure checkout": { title: "دفع آمن ومحمي", sub: "تشفير SSL 256-bit آمن" },
            "30-day returns": { title: "إرجاع خلال 30 يوماً", sub: "بدون تعقيدات أو أسئلة" },
            "24/7 support": { title: "دعم متواصل 24/7", sub: "دعم مخصص للاعبين" }
        };
        featureItems.forEach(item => {
            const titleEl = item.querySelector(".feature-text-title");
            const subEl = item.querySelector(".feature-text-sub");
            if (titleEl) {
                const titleText = titleEl.textContent.trim().toLowerCase();
                if (featuresMap[titleText]) {
                    titleEl.textContent = featuresMap[titleText].title;
                    if (subEl) subEl.textContent = featuresMap[titleText].sub;
                }
            }
        });

        // 3. Stats Row
        const statItems = document.querySelectorAll(".stats-row .stat-item");
        const statsMap = {
            "orders shipped": { number: "1000+", label: "طلب تم شحنه" },
            "satisfaction rate": { number: "98%", label: "نسبة رضا العملاء" },
            "premium products": { number: "248", label: "منتج مميز" },
            "partner brands": { number: "60+", label: "علامة تجارية شريكة" }
        };
        statItems.forEach(item => {
            const numEl = item.querySelector(".stat-number");
            const labelEl = item.querySelector(".stat-label");
            if (labelEl) {
                const labelText = labelEl.textContent.trim().toLowerCase();
                if (statsMap[labelText]) {
                    labelEl.textContent = statsMap[labelText].label;
                    if (numEl) numEl.textContent = statsMap[labelText].number;
                }
            }
        });

        // 4. Brands Marquee Label
        const brandsLabel = document.querySelector(".brands-section .brands-label");
        if (brandsLabel) {
            brandsLabel.textContent = "موثوق به من قبل أكثر من 60 علامة تجارية عالمية للألعاب";
        }

        // 5. Interactive 3D Showroom
        const showroomSection = document.querySelector(".homepage-showroom-section");
        if (showroomSection) {
            const studioSpan = showroomSection.querySelector("span[style*='letter-spacing']");
            if (studioSpan) {
                const dot = studioSpan.querySelector("span");
                studioSpan.innerHTML = "";
                if (dot) studioSpan.appendChild(dot);
                studioSpan.appendChild(document.createTextNode(" استوديو الهولوجرام"));
            }
            
            const heading = document.getElementById("showroom-heading");
            if (heading) {
                heading.innerHTML = `غرفة العتاد <span>الهولوجرامية 3D</span>`;
            }
            
            const desc = showroomSection.querySelector("p[style*='line-height']");
            if (desc) {
                desc.textContent = "تفاعل مع عتاد الألعاب الاحترافي في عرض هولوجرامي كامل بزاوية 360 درجة. يمكنك التدوير، التكبير، تفعيل نقاط المواصفات الساخنة، أو إسقاط صورتك الخاصة لعرضها.";
            }
            
            const sidebarDesc = showroomSection.querySelector(".showroom-desc");
            if (sidebarDesc) {
                sidebarDesc.textContent = "اختر أحد الأجهزة الطرفية للجيمنج من القائمة أدناه، أو ارفع صورتك الخاصة. اسحب المجسم على المنصة لتدويره 360 درجة.";
            }
            
            // Labels
            const controlLabels = showroomSection.querySelectorAll(".showroom-control-label");
            const labelsMap = {
                "select specimen": "اختر المجسم المعروض",
                "project your own gear": "اعرض عتادك الخاص",
                "hologram laser glow": "توهج ليزر الهولوجرام",
                "gear zoom / scale": "تكبير وتصغير العتاد"
            };
            controlLabels.forEach(label => {
                const text = label.textContent.trim().toLowerCase();
                if (labelsMap[text]) {
                    label.textContent = labelsMap[text];
                }
            });
            
            // Select buttons
            const gearSelectBtns = showroomSection.querySelectorAll(".gear-select-btn");
            gearSelectBtns.forEach(btn => {
                const text = btn.textContent.trim().toLowerCase();
                if (text.includes("keyboard") || text.includes("لوحة")) {
                    btn.textContent = "⌨️ لوحة مفاتيح ميكانيكية";
                } else if (text.includes("mouse") || text.includes("ماوس")) {
                    btn.textContent = "🖱️ ماوس قيمنق احترافي";
                } else if (text.includes("headset") || text.includes("سماعة")) {
                    btn.textContent = "🎧 سماعة صوت محيطي";
                } else if (text.includes("controller") || text.includes("يد")) {
                    btn.textContent = "🎮 يد تحكم احترافية";
                } else if (text.includes("vr") || text.includes("نظارة")) {
                    btn.textContent = "🥽 نظارة واقع افتراضي حديثة";
                }
            });
            
            // Upload Box text
            const uploadBoxText = showroomSection.querySelector(".upload-gear-box p");
            if (uploadBoxText) {
                uploadBoxText.textContent = "اسحب الصورة هنا أو اضغط للرفع";
            }
        }

        // 6. Newsletter Section
        const newsletterSection = document.querySelector(".newsletter-section");
        if (newsletterSection) {
            const eyebrow = newsletterSection.querySelector(".newsletter-eyebrow");
            if (eyebrow) {
                const dot = eyebrow.querySelector(".nl-dot");
                eyebrow.innerHTML = "";
                if (dot) eyebrow.appendChild(dot);
                eyebrow.appendChild(document.createTextNode(" للأعضاء فقط"));
            }
            
            const title = document.getElementById("nl-heading");
            if (title) {
                title.innerHTML = `ارتقِ بمستوى <span>عتادك وألعابك</span>`;
            }
            
            const sub = newsletterSection.querySelector(".newsletter-sub");
            if (sub) {
                sub.textContent = "انضم إلى أكثر من 180,000 لاعب يحصلون على عروض حصرية، وصول مبكر للمنتجات الجديدة، وأدلة إعدادات المحترفين مباشرة في بريدهم الوارد.";
            }
            
            const input = newsletterSection.querySelector("input[name='email']");
            if (input) {
                input.placeholder = "أدخل بريدك الإلكتروني…";
            }
            
            const submitBtn = newsletterSection.querySelector("button[type='submit']");
            if (submitBtn) {
                submitBtn.textContent = "اشتراك";
            }
            
            const note = newsletterSection.querySelector(".newsletter-note");
            if (note) {
                note.textContent = "بدون رسائل مزعجة. إلغاء الاشتراك في أي وقت.";
            }
            
            const perks = newsletterSection.querySelectorAll(".nl-perk");
            perks.forEach(perk => {
                const icon = perk.querySelector(".nl-perk-icon");
                const text = perk.textContent.replace("✓", "").trim().toLowerCase();
                let arText = "";
                if (text.includes("early access")) arText = "وصول مبكر للمنتجات الحصرية";
                else if (text.includes("discounts")) arText = "خصومات خاصة بالأعضاء";
                else if (text.includes("setup guides")) arText = "أدلة مجانية لإعداد المنصة";
                else if (text.includes("pro player")) arText = "اختيارات اللاعبين المحترفين";
                
                if (arText) {
                    perk.innerHTML = "";
                    if (icon) perk.appendChild(icon);
                    perk.appendChild(document.createTextNode(" " + arText));
                }
            });
        }

        // 7. Rich Footer
        const siteFooter = document.querySelector(".site-footer");
        if (siteFooter) {
            const brandDesc = siteFooter.querySelector(".footer-brand-desc");
            if (brandDesc) {
                brandDesc.textContent = "الوجهة الأولى للاعبين المحترفين وعشاق التكنولوجيا. عتاد مختار بعناية، أسعار لا تقبل المنافسة، ودعم عملاء فائق الجودة.";
            }
            
            // Col Titles
            const colTitles = siteFooter.querySelectorAll(".footer-col-title");
            const footerTitlesMap = {
                "shop": "المتجر",
                "support": "الدعم الفني",
                "company": "الشركة"
            };
            colTitles.forEach(title => {
                const text = title.textContent.trim().toLowerCase();
                if (footerTitlesMap[text]) {
                    title.textContent = footerTitlesMap[text];
                }
            });
            
            // Links
            const footerLinks = siteFooter.querySelectorAll(".footer-links a");
            const footerLinksMap = {
                "new arrivals": "وصل حديثاً",
                "best sellers": "الأكثر مبيعاً",
                "controllers": "أجهزة التحكم",
                "headsets": "سماعات الرأس",
                "keyboards": "لوحات المفاتيح",
                "monitors": "الشاشات",
                "deals & bundles": "العروض والحزم",
                "help center": "مركز المساعدة",
                "track my order": "تتبع طلبي",
                "returns & refunds": "المرتجع والمسترد",
                "warranty claims": "طلبات الضمان",
                "contact us": "اتصل بنا",
                "community forum": "منتدى المجتمع",
                "about neontech": "حول نيون تك",
                "careers": "الوظائف",
                "press kit": "الصحافة والإعلام",
                "affiliate program": "التسويق بالعمولة",
                "brand partnerships": "شراكات العلامات التجارية"
            };
            footerLinks.forEach(link => {
                let tag = link.querySelector(".new-tag");
                let text = link.textContent.replace("New", "").trim().toLowerCase();
                if (footerLinksMap[text]) {
                    link.innerHTML = footerLinksMap[text];
                    if (tag) {
                        tag.textContent = "جديد";
                        link.appendChild(document.createTextNode(" "));
                        link.appendChild(tag);
                    }
                }
            });
            
            // Bottom Footer
            const footerCopy = siteFooter.querySelector(".footer-copy");
            if (footerCopy) {
                footerCopy.innerHTML = `&copy; 2026 نيون تك &mdash; تم التطوير بواسطة <a href="https://salahkhaled.com" target="_blank" rel="noopener noreferrer" style="color: var(--neon); text-decoration: none; font-weight: 600; transition: opacity 0.3s;">صلاح خالد</a>`;
            }
            
            const bottomLinks = siteFooter.querySelectorAll(".footer-bottom-links a");
            bottomLinks.forEach(link => {
                const text = link.textContent.trim().toLowerCase();
                if (text.includes("privacy")) link.textContent = "سياسة الخصوصية";
                else if (text.includes("terms")) link.textContent = "شروط الخدمة";
                else if (text.includes("cookie")) link.textContent = "إعدادات الكوكيز";
            });
            
            const payBadges = siteFooter.querySelectorAll(".footer-payments .pay-badge");
            payBadges.forEach(badge => {
                const text = badge.textContent.trim().toUpperCase();
                if (text === "VISA") badge.textContent = "فيزا";
                else if (text === "MC") badge.textContent = "ماستر كارد";
                else if (text === "AMEX") badge.textContent = "أمكس";
                else if (text === "PAYPAL") badge.textContent = "بايبال";
                else if (text === "CRYPTO") badge.textContent = "عملات رقمية";
            });
        }

        // 8. Cart Summary Row Translations inside Drawer
        const cartDrawer = document.getElementById("cart-drawer");
        if (cartDrawer) {
            const rows = cartDrawer.querySelectorAll(".cart-summary-row, .cart-total-row");
            rows.forEach(row => {
                const labelEl = row.querySelector("span:first-child");
                if (labelEl) {
                    const text = labelEl.textContent.trim().toLowerCase();
                    if (text === "subtotal" || text === "المجموع الفرعي") {
                        labelEl.textContent = "المجموع الفرعي";
                    } else if (text === "shipping" || text === "الشحن") {
                        labelEl.textContent = "الشحن";
                    } else if (text === "total" || text === "المجموع الكلي") {
                        labelEl.textContent = "المجموع الكلي";
                    }
                }
                const valEl = row.querySelector(".text-neon");
                if (valEl && (valEl.textContent.trim().toLowerCase() === "free" || valEl.textContent.trim() === "مجاني")) {
                    valEl.textContent = "مجاني";
                }
            });
        }
    }
    
    // Support Bot language update
    if (typeof window.renderChatbot === 'function') {
        window.renderChatbot();
    }
}

// 3. Initialize Bilingual Header Switcher Button
function initBilingualSwitcher() {
    const navActions = document.querySelector(".nav-actions");
    if (!navActions) return;
    
    if (document.querySelector(".lang-switcher-btn")) return;
    
    const activeLang = localStorage.getItem("neontech_lang") || "en";
    
    const switcherBtn = document.createElement("button");
    switcherBtn.className = "nav-btn lang-switcher-btn";
    switcherBtn.style.fontFamily = "monospace";
    switcherBtn.style.fontSize = "0.95rem";
    switcherBtn.style.fontWeight = "bold";
    switcherBtn.style.color = "var(--neon)";
    switcherBtn.style.border = "1px solid var(--neon)";
    switcherBtn.style.background = "transparent";
    switcherBtn.style.padding = "5px 10px";
    switcherBtn.style.borderRadius = "4px";
    switcherBtn.style.cursor = "pointer";
    switcherBtn.style.transition = "all 0.3s ease";
    switcherBtn.style.marginRight = "10px";
    switcherBtn.style.display = "inline-flex";
    switcherBtn.style.alignItems = "center";
    switcherBtn.style.boxShadow = "0 0 10px rgba(0, 255, 135, 0.1)";
    
    switcherBtn.textContent = activeLang === "en" ? "AR" : "EN";
    
    switcherBtn.addEventListener("mouseover", () => {
        switcherBtn.style.boxShadow = "0 0 15px var(--neon)";
        switcherBtn.style.background = "rgba(0, 255, 135, 0.1)";
    });
    
    switcherBtn.addEventListener("mouseleave", () => {
        switcherBtn.style.boxShadow = "0 0 10px rgba(0, 255, 135, 0.1)";
        switcherBtn.style.background = "transparent";
    });
    
    switcherBtn.addEventListener("click", () => {
        const currentLang = localStorage.getItem("neontech_lang") || "en";
        const newLang = currentLang === "en" ? "ar" : "en";
        localStorage.setItem("neontech_lang", newLang);
        switcherBtn.textContent = newLang === "en" ? "AR" : "EN";
        
        if (newLang === "en") {
            window.location.reload();
        } else {
            translatePage(newLang);
            showNeonToast(
                "🌐 تغيير اللغة",
                "تم تحويل لغة الموقع إلى العربية بنجاح."
            );
        }
    });
    
    navActions.insertBefore(switcherBtn, navActions.firstChild);
    
    // Translate immediately on page load
    translatePage(activeLang);
}

// 4. Initialize Interactive Reviews Tab Form
function initInteractiveReviews() {
    const reviewsContent = document.querySelector(".reviews-content");
    if (!reviewsContent) return;
    
    if (document.getElementById("write-review-form-container")) return;
    
    const productTitle = document.querySelector(".p-title")?.textContent.trim() || document.title.split("—")[0].trim();
    const reviewsStorageKey = `neontech_reviews_${productTitle.replace(/\s+/g, "_").toLowerCase()}`;
    
    const formContainer = document.createElement("div");
    formContainer.id = "write-review-form-container";
    formContainer.className = "write-review-section";
    formContainer.style.marginTop = "30px";
    formContainer.style.borderTop = "1px solid var(--border-subtle)";
    formContainer.style.paddingTop = "25px";
    
    const activeLang = localStorage.getItem("neontech_lang") || "en";
    
    formContainer.innerHTML = `
        <h3 class="write-review-title" style="font-family: monospace; font-size: 1.2rem; color: var(--text-primary); margin-bottom: 20px;">
            ${activeLang === "ar" ? "اكتب تقييمًا" : "WRITE A REVIEW"}
        </h3>
        <form id="write-review-form" style="display: flex; flex-direction: column; gap: 15px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-weight: bold; color: var(--text-secondary);">${activeLang === "ar" ? "تقييمك بالنجوم:" : "Your Rating:"}</span>
                <div class="stars review-stars-selector" style="font-size: 1.5rem; display: inline-flex; gap: 5px;">
                    <span class="star" data-rating="1" style="cursor: pointer;">&#9733;</span>
                    <span class="star" data-rating="2" style="cursor: pointer;">&#9733;</span>
                    <span class="star" data-rating="3" style="cursor: pointer;">&#9733;</span>
                    <span class="star" data-rating="4" style="cursor: pointer;">&#9733;</span>
                    <span class="star" data-rating="5" style="cursor: pointer;">&#9733;</span>
                </div>
                <input type="hidden" id="review-rating-value" value="0" />
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <input type="text" id="review-author" placeholder="${activeLang === "ar" ? "اسمك الكريم" : "Your Name"}" required style="padding: 10px 15px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 4px; color: var(--text-primary);" />
                <input type="text" id="review-title" placeholder="${activeLang === "ar" ? "عنوان المراجعة (مثال: أداء جبار!)" : "Review Title (e.g., Ultimate performance!)"}" required style="padding: 10px 15px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 4px; color: var(--text-primary);" />
            </div>
            
            <textarea id="review-text" rows="4" placeholder="${activeLang === "ar" ? "شاركنا تجربتك للأداة الجيمنج..." : "Share your experience with this gaming gear..."}" required style="padding: 10px 15px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 4px; color: var(--text-primary); resize: vertical;"></textarea>
            
            <button type="submit" class="btn-primary" style="align-self: flex-start; padding: 12px 30px; font-weight: bold; cursor: pointer;">
                ${activeLang === "ar" ? "إرسال التقييم" : "Submit Review"}
            </button>
        </form>
    `;
    
    reviewsContent.appendChild(formContainer);
    
    // Auto-fill review author with logged in name
    if (supabaseClient) {
        supabaseClient.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                const name = user.user_metadata?.display_name || user.email.split('@')[0];
                const authorInput = document.getElementById("review-author");
                if (authorInput) {
                    authorInput.value = name;
                    authorInput.readOnly = true;
                    authorInput.style.opacity = "0.7";
                }
            }
        });
    }
    
    const starsSelector = formContainer.querySelectorAll(".review-stars-selector .star");
    const ratingValueInput = document.getElementById("review-rating-value");
    
    starsSelector.forEach(star => {
        star.addEventListener("click", function() {
            const rating = parseInt(this.getAttribute("data-rating"));
            ratingValueInput.value = rating;
            
            starsSelector.forEach(s => {
                const sRating = parseInt(s.getAttribute("data-rating"));
                if (sRating <= rating) {
                    s.classList.add("glow");
                } else {
                    s.classList.remove("glow");
                }
            });
        });
    });
    
    const reviewsList = reviewsContent.querySelector(".reviews-list");
    if (reviewsList) {
        let savedReviews = [];
        try {
            savedReviews = JSON.parse(localStorage.getItem(reviewsStorageKey)) || [];
        } catch (e) {
            console.warn(e);
        }
        
        savedReviews.forEach(rev => {
            prependReviewDOM(reviewsList, rev);
        });
    }
    
    const form = document.getElementById("write-review-form");
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const rating = parseInt(ratingValueInput.value);
        if (rating === 0) {
            showNeonToast(
                activeLang === "ar" ? "⚠️ اختيار التقييم" : "⚠️ Select Rating",
                activeLang === "ar" ? "يرجى تحديد التقييم بالنجوم أولاً!" : "Please select a star rating first!"
            );
            return;
        }
        
        const author = document.getElementById("review-author").value.trim();
        const title = document.getElementById("review-title").value.trim();
        const text = document.getElementById("review-text").value.trim();
        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        const newReview = {
            author: author,
            title: title,
            text: text,
            rating: rating,
            date: date
        };
        
        let savedReviews = [];
        try {
            savedReviews = JSON.parse(localStorage.getItem(reviewsStorageKey)) || [];
        } catch (err) {
            console.warn(err);
        }
        savedReviews.push(newReview);
        localStorage.setItem(reviewsStorageKey, JSON.stringify(savedReviews));
        
        if (reviewsList) {
            prependReviewDOM(reviewsList, newReview);
        }
        
        updateReviewsAggregate(rating);
        
        form.reset();
        starsSelector.forEach(s => s.classList.remove("glow"));
        ratingValueInput.value = "0";
        
        // Expose username if active session
        if (supabaseClient) {
            supabaseClient.auth.getUser().then(({ data: { user } }) => {
                if (user) {
                    const name = user.user_metadata?.display_name || user.email.split('@')[0];
                    const authorInput = document.getElementById("review-author");
                    if (authorInput) authorInput.value = name;
                }
            });
        }
        
        showNeonToast(
            activeLang === "ar" ? "🎉 تم النشر" : "🎉 Review Published",
            activeLang === "ar" ? "شكرًا لك! تم نشر مراجعتك بنجاح." : "Thank you! Your review has been published successfully."
        );
    });
}

function prependReviewDOM(reviewsList, review) {
    let starsHTML = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= review.rating) {
            starsHTML += '<span class="star filled">&#9733;</span>';
        } else {
            starsHTML += '<span class="star">&#9733;</span>';
        }
    }
    
    const reviewItem = document.createElement("div");
    reviewItem.className = "review-item";
    reviewItem.style.borderLeft = "2px solid var(--neon)";
    reviewItem.style.paddingLeft = "15px";
    
    reviewItem.innerHTML = `
        <div class="review-header">
            <div>
                <span class="author-name" style="font-weight: bold; color: var(--text-primary);">${review.author}</span>
                <span class="badge-verified" style="margin-left: 8px; font-size: 0.75rem; color: var(--neon); background: rgba(0,255,135,0.1); padding: 2px 6px; border-radius: 4px;">Verified Buyer</span>
            </div>
            <span class="review-date" style="font-size: 0.85rem; color: var(--text-secondary);">${review.date}</span>
        </div>
        <div class="stars" style="margin: 8px 0;">
            ${starsHTML}
        </div>
        <h4 class="review-title" style="margin: 8px 0; color: var(--text-primary); font-size: 1.05rem;">${review.title}</h4>
        <p class="review-text" style="color: var(--text-secondary); line-height: 1.6; margin: 0;">${review.text}</p>
    `;
    
    reviewsList.insertBefore(reviewItem, reviewsList.firstChild);
}

function updateReviewsAggregate(newRating) {
    const scoreNumEl = document.querySelector(".score-number");
    const scoreSubEl = document.querySelector(".score-sub");
    if (!scoreNumEl || !scoreSubEl) return;
    
    let currentScore = parseFloat(scoreNumEl.textContent);
    let countMatch = scoreSubEl.textContent.match(/[\d,]+/);
    if (!countMatch) return;
    
    let currentCount = parseInt(countMatch[0].replace(/,/g, ""));
    let newCount = currentCount + 1;
    let newScore = ((currentScore * currentCount) + newRating) / newCount;
    
    scoreNumEl.textContent = newScore.toFixed(1);
    scoreSubEl.textContent = `Based on ${newCount.toLocaleString()} verified buyer ratings`;
    
    const scoreStarsEl = document.querySelector(".score-box .stars");
    if (scoreStarsEl) {
        scoreStarsEl.innerHTML = renderStarsHTML(newScore);
    }
}

// 5. Cart Account Syncing Utility
window.syncUserCart = function(user) {
    if (!user) {
        // Clear active cart on logout
        if (typeof window.setCart === 'function') {
            window.setCart([]);
        }
        localStorage.removeItem('neontech_cart');
        return;
    }
    
    const userCartKey = `sb-${user.id}-cart`;
    let userCart = [];
    try {
        userCart = JSON.parse(localStorage.getItem(userCartKey)) || [];
    } catch (e) {
        console.warn("Error parsing user cart:", e);
    }
    
    let anonCart = [];
    try {
        anonCart = JSON.parse(localStorage.getItem('neontech_cart')) || [];
    } catch (e) {
        console.warn("Error parsing anonymous cart:", e);
    }
    
    // Merge Strategy
    let mergedCart = [...userCart];
    anonCart.forEach(anonItem => {
        let existing = mergedCart.find(item => item.id === anonItem.id);
        if (existing) {
            existing.quantity = Math.min(10, existing.quantity + anonItem.quantity);
        } else {
            mergedCart.push(anonItem);
        }
    });
    
    localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
    if (typeof window.setCart === 'function') {
        window.setCart(mergedCart);
    }
};

// 6. Interactive Floating Support Chatbot System
function initSupportChatbot() {
    if (document.getElementById("neontech-support-chatbot")) return;
    
    const botContainer = document.createElement("div");
    botContainer.id = "neontech-support-chatbot";
    botContainer.style.position = "fixed";
    botContainer.style.bottom = "30px";
    botContainer.style.right = "30px";
    botContainer.style.zIndex = "10000";
    botContainer.style.fontFamily = "inherit";
    
    botContainer.innerHTML = `
        <button id="chatbot-toggle-btn" style="width: 60px; height: 60px; border-radius: 50%; background: #080b0f; border: 2px solid var(--neon); color: var(--neon); cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px var(--neon); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); outline: none;">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
        </button>
        
        <div id="chatbot-window" style="display: none; position: absolute; bottom: 80px; right: 0; width: 350px; height: 480px; background: #0c1017; border: 2px solid var(--border-subtle); border-radius: 12px; box-shadow: 0 0 30px rgba(0,255,135,0.15); flex-direction: column; overflow: hidden; transition: all 0.3s ease;">
            <div style="background: rgba(0,255,135,0.05); padding: 15px; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: var(--neon); box-shadow: 0 0 10px var(--neon);"></div>
                    <strong style="color: var(--text-primary); font-size: 0.95rem; font-family: monospace;">NeonTech Assistant v1.2</strong>
                </div>
                <button id="chatbot-close-btn" style="background: transparent; border: none; color: var(--text-secondary); font-size: 1.25rem; cursor: pointer;">&times;</button>
            </div>
            
            <div id="chatbot-messages" style="flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; font-size: 0.85rem;"></div>
            
            <div id="chatbot-options" style="padding: 10px 15px; display: flex; flex-direction: column; gap: 8px; border-top: 1px solid var(--border-subtle); background: rgba(255,255,255,0.01);"></div>
            
            <div id="chatbot-input-row" style="display: none; padding: 10px 15px; border-top: 1px solid var(--border-subtle); background: rgba(0,0,0,0.2);">
                <div style="display: flex; gap: 8px;">
                    <input type="text" id="chatbot-text-input" placeholder="Type Order ID..." style="flex: 1; padding: 8px 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 4px; color: var(--text-primary); font-size: 0.8rem;" />
                    <button id="chatbot-submit-btn" style="background: var(--neon); border: none; color: #000; font-weight: bold; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">Send</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(botContainer);
    
    const toggleBtn = document.getElementById("chatbot-toggle-btn");
    const chatWindow = document.getElementById("chatbot-window");
    const closeBtn = document.getElementById("chatbot-close-btn");
    
    toggleBtn.addEventListener("click", () => {
        const isOpen = chatWindow.style.display === "flex";
        chatWindow.style.display = isOpen ? "none" : "flex";
        if (!isOpen) {
            toggleBtn.style.transform = "scale(0.9) rotate(90deg)";
            toggleBtn.style.borderColor = "#ff007f";
            toggleBtn.style.color = "#ff007f";
            toggleBtn.style.boxShadow = "0 0 20px #ff007f";
            playNotificationSound();
        } else {
            toggleBtn.style.transform = "none";
            toggleBtn.style.borderColor = "var(--neon)";
            toggleBtn.style.color = "var(--neon)";
            toggleBtn.style.boxShadow = "0 0 20px var(--neon)";
        }
    });
    
    closeBtn.addEventListener("click", () => {
        chatWindow.style.display = "none";
        toggleBtn.style.transform = "none";
        toggleBtn.style.borderColor = "var(--neon)";
        toggleBtn.style.color = "var(--neon)";
        toggleBtn.style.boxShadow = "0 0 20px var(--neon)";
    });
    
    window.renderChatbot = function() {
        const activeLang = localStorage.getItem("neontech_lang") || "en";
        const messagesContainer = document.getElementById("chatbot-messages");
        const optionsContainer = document.getElementById("chatbot-options");
        const textInput = document.getElementById("chatbot-text-input");
        const inputRow = document.getElementById("chatbot-input-row");
        
        messagesContainer.innerHTML = "";
        optionsContainer.innerHTML = "";
        inputRow.style.display = "none";
        
        const welcomeText = activeLang === "ar" 
            ? "مرحباً بك في NeonTech! 🎮 أنا مساعدك الذكي. كيف يمكنني مساندتك اليوم لتطوير عتادك القيمنق؟"
            : "Welcome to NeonTech! 🎮 I'm your digital support assistant. How can I help you level up your gaming rig today?";
            
        appendMessage("bot", welcomeText);
        
        const options = activeLang === "ar" ? [
            { id: "track", text: "📦 تتبع طلبية" },
            { id: "coupon", text: "🎟️ كود خصم إضافي" },
            { id: "dpi", text: "⚙️ معايرة الماوس والشاشة" },
            { id: "salah", text: "💬 تواصل مع المالك (صلاح)" }
        ] : [
            { id: "track", text: "📦 Track an Order" },
            { id: "coupon", text: "🎟️ Extra Promo Code" },
            { id: "dpi", text: "⚙️ DPI & Refresh Calibrator" },
            { id: "salah", text: "💬 Chat with Salah (Owner)" }
        ];
        
        options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "chatbot-opt-btn";
            btn.style.width = "100%";
            btn.style.padding = "10px 15px";
            btn.style.textAlign = activeLang === "ar" ? "right" : "left";
            btn.style.background = "rgba(255,255,255,0.03)";
            btn.style.border = "1px solid var(--border-subtle)";
            btn.style.borderRadius = "6px";
            btn.style.color = "var(--text-primary)";
            btn.style.cursor = "pointer";
            btn.style.transition = "all 0.2s ease";
            btn.style.fontSize = "0.8rem";
            
            btn.addEventListener("mouseover", () => {
                btn.style.background = "rgba(0, 255, 135, 0.05)";
                btn.style.borderColor = "var(--neon)";
            });
            
            btn.addEventListener("mouseleave", () => {
                btn.style.background = "rgba(255,255,255,0.03)";
                btn.style.borderColor = "var(--border-subtle)";
            });
            
            btn.addEventListener("click", () => {
                handleOptionClick(opt.id, opt.text);
            });
            
            optionsContainer.appendChild(btn);
        });
        
        textInput.placeholder = activeLang === "ar" ? "أدخل رقم الطلب (مثال #NT-54321)..." : "Type Order ID (e.g. #NT-54321)...";
    };
    
    function appendMessage(sender, text) {
        const messagesContainer = document.getElementById("chatbot-messages");
        const bubble = document.createElement("div");
        bubble.style.padding = "10px 14px";
        bubble.style.borderRadius = "12px";
        bubble.style.maxWidth = "80%";
        bubble.style.lineHeight = "1.5";
        bubble.style.animation = "fadeIn 0.3s ease forwards";
        
        if (sender === "bot") {
            bubble.style.background = "rgba(255,255,255,0.03)";
            bubble.style.color = "var(--text-primary)";
            bubble.style.alignSelf = "flex-start";
            bubble.style.borderLeft = "2px solid var(--neon)";
        } else {
            bubble.style.background = "var(--neon)";
            bubble.style.color = "#000";
            bubble.style.fontWeight = "550";
            bubble.style.alignSelf = "flex-end";
        }
        
        bubble.innerHTML = text;
        messagesContainer.appendChild(bubble);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function handleOptionClick(id, text) {
        const activeLang = localStorage.getItem("neontech_lang") || "en";
        appendMessage("user", text);
        
        if (id === "track") {
            const trackPrompt = activeLang === "ar"
                ? "سأقوم بتتبع طلبك على الفور! يرجى إدخال رقم الطلب المكون من 5 أرقام (مثال #NT-54321) أدناه:"
                : "I will track your package right away! Please type your 5-digit Order ID (e.g. #NT-54321) below:";
            
            setTimeout(() => {
                appendMessage("bot", trackPrompt);
                document.getElementById("chatbot-input-row").style.display = "block";
                document.getElementById("chatbot-text-input").focus();
            }, 600);
        } 
        else if (id === "coupon") {
            setTimeout(() => {
                const couponResponse = activeLang === "ar"
                    ? `🎟️ مروق عليك يا صديقي! صلاح معطيك كود خصم حصري للقيمنق:<br><br><strong style="font-family: monospace; font-size:1.1rem; color:var(--neon);">SALAH10</strong><br><br>يمنحك 10% خصم إضافي على المجموع الفرعي وجميع المنتجات بالسلة عند المزامنة والتشيك أوت!`
                    : `🎟️ Got you sorted, buddy! Salah secured an exclusive VIP gaming promo for you:<br><br><strong style="font-family: monospace; font-size:1.1rem; color:var(--neon);">SALAH10</strong><br><br>Gives 10% off on your cart items upon validation & checkout sheet!`;
                appendMessage("bot", couponResponse);
                playNotificationSound();
            }, 600);
        }
        else if (id === "dpi") {
            setTimeout(() => {
                const dpiResponse = activeLang === "ar"
                    ? `⚙️ <strong>أداة معايرة الأداء</strong>:<br><br>1. <strong>الماوس (DPI)</strong>: للعب التنافسي (Valorant/CS2) ننصح بـ 800 DPI وحساسية داخلية منخفضة. لـ MOBA ننصح بـ 1600 DPI.<br>2. <strong>الشاشة (Refresh)</strong>: تأكد من ضبط الإعدادات بنظام التشغيل على أقصى هرتز تدعمه شاشتك (مثلاً 240Hz). فعل G-Sync لإنهاء التقطيع!`
                    : `⚙️ <strong>Performance Calibrator</strong>:<br><br>1. <strong>Mouse DPI</strong>: For competitive shooters (Valorant/CS2), target 800 DPI with low in-game sensitivity. For MOBAs, try 1600 DPI.<br>2. <strong>Monitor Refresh</strong>: Double check your OS adapter settings to ensure you are running at maximum native refresh (e.g., 240Hz). Enable G-Sync to end screen tearing!`;
                appendMessage("bot", dpiResponse);
            }, 600);
        }
        else if (id === "salah") {
            setTimeout(() => {
                const salahResponse = activeLang === "ar"
                    ? `💬 <strong>أبشر يا غالي!</strong> يمكنك التواصل المباشر مع صلاح خالد (المالك والمهندس):<br><br>📱 جوال / واتساب: <a href="https://wa.me/966500438424" target="_blank" style="color: var(--neon); font-weight:bold;">966500438424+</a><br>📧 بريد: <span style="color:var(--neon);">salah@neontech.com</span><br><br>تواصل في أي وقت لتعديل تجميعتك أو حجز ألعابك!`
                    : `💬 <strong>Connect with Salah Khaled</strong> (Owner & Lead Engineer):<br><br>📱 Mobile / WhatsApp: <a href="https://wa.me/966500438424" target="_blank" style="color: var(--neon); font-weight:bold;">+966500438424</a><br>📧 Email: <span style="color:var(--neon);">salah@neontech.com</span><br><br>Reach out anytime to calibrate your custom build or secure special reserve orders!`;
                appendMessage("bot", salahResponse);
            }, 600);
        }
    }
    
    const submitBtn = document.getElementById("chatbot-submit-btn");
    const textInput = document.getElementById("chatbot-text-input");
    
    const handleTrackSubmit = () => {
        const activeLang = localStorage.getItem("neontech_lang") || "en";
        const val = textInput.value.trim();
        if (!val) return;
        
        appendMessage("user", val);
        textInput.value = "";
        document.getElementById("chatbot-input-row").style.display = "none";
        
        const matches = val.match(/\d+/);
        const orderNum = matches ? matches[0] : "54321";
        
        setTimeout(() => {
            appendMessage("bot", activeLang === "ar" ? "⏳ جاري الاستعلام بقواعد البيانات ومزامنة الشحن..." : "⏳ Querying logistics pipeline and fetching parcel info...");
            
            setTimeout(() => {
                const stages = activeLang === "ar" ? [
                    "📦 <strong>المرحلة 1: تجهيز الشحنة</strong><br>تمت مراجعة الطلب وتجميع عتاد النيون الخاص بك وجاري تغليفه في مخازننا في الرياض.",
                    "🚚 <strong>المرحلة 2: قيد التوصيل</strong><br>تم تسليم العبوة لشركة الشحن الشريكة (أرامكس) وهي الآن في طريقها إلى مدينتك.",
                    "🎮 <strong>المرحلة 3: تم التوصيل!</strong><br>تم تسليم طلبية الجيمنج الخاصة بك للمشتري بنجاح. نتمنى لك فوزاً ساحقاً في اللعبة القادمة!"
                ] : [
                    "📦 <strong>Phase 1: Parcel Assembly</strong><br>Your high-end neon gear has been checked, combined, and is being securely packaged at our Riyadh warehouse.",
                    "🚚 <strong>Phase 2: In Transit</strong><br>Parcel handed over to our shipping partner (Aramex) and is currently en route to your city dispatch station.",
                    "🎮 <strong>Phase 3: Delivered!</strong><br>Your elite gear was successfully received. Victory is yours! Level up and enjoy the game!"
                ];
                
                const index = parseInt(orderNum) % 3;
                const result = stages[index];
                
                appendMessage("bot", `📋 <strong>Order #NT-${orderNum} Status</strong>:<br><br>${result}`);
                playNotificationSound();
            }, 1200);
            
        }, 600);
    };
    
    submitBtn.addEventListener("click", handleTrackSubmit);
    textInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            handleTrackSubmit();
        }
    });
    
    window.renderChatbot();
}

// Global Inits
initBilingualSwitcher();
initInteractiveReviews();
initSupportChatbot();