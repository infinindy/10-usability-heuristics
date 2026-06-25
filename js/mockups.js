/* mockups.js - Interactive simulations logic with Good vs Bad comparisons */

// Store active mode ('good' or 'bad') for each heuristic
const mockupModes = {
    grab: 'good',
    match: 'good',
    gmail: 'good',
    ecommerce: 'good',
    register: 'good',
    netflix: 'good',
    instagram: 'good',
    music: 'good',
    coupon: 'good',
    duolingo: 'good'
};

document.addEventListener('DOMContentLoaded', () => {
    initGlobalModeToggles();
    
    // Initialize all mockups
    initGrabMockup();
    initSettingsMatchMockup();
    initGmailMockup();
    initEcommerceMockup();
    initRegisterMockup();
    initNetflixMockup();
    initInstagramMockup();
    initMusicPlayerMockup();
    initCouponMockup();
    initDuolingoMockup();
});

/**
 * Handle mode toggle buttons inside the mockup frames.
 */
function initGlobalModeToggles() {
    const toggleContainers = document.querySelectorAll('.mockup-ui-toggle');
    
    toggleContainers.forEach(container => {
        const heuristic = container.getAttribute('data-heuristic');
        const buttons = container.querySelectorAll('.toggle-mode-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const mode = btn.getAttribute('data-mode');
                mockupModes[heuristic] = mode;
                
                // Trigger reset/update callback for that specific mockup
                triggerMockupReset(heuristic, mode);
            });
        });
    });
}

function triggerMockupReset(heuristic, mode) {
    // Dispatch resets based on heuristic key
    switch (heuristic) {
        case 'grab':
            resetGrabMockup();
            break;
        case 'match':
            resetSettingsMatchMockup(mode);
            break;
        case 'gmail':
            resetGmailMockup();
            break;
        case 'ecommerce':
            resetEcommerceMockup(mode);
            break;
        case 'register':
            resetRegisterMockup(mode);
            break;
        case 'netflix':
            resetNetflixMockup(mode);
            break;
        case 'instagram':
            resetInstagramMockup(mode);
            break;
        case 'music':
            resetMusicPlayerMockup(mode);
            break;
        case 'coupon':
            resetCouponMockup();
            break;
        case 'duolingo':
            resetDuolingoMockup(mode);
            break;
    }
}

// Global alert overlay inside screen mockup for feedback
function alertToast(message, type) {
    const activeScreen = document.querySelector('.phone-screen:not([style*="display: none"])');
    if (!activeScreen) return;
    
    const toast = document.createElement('div');
    toast.style.position = 'absolute';
    toast.style.bottom = '70px';
    toast.style.left = '10px';
    toast.style.right = '10px';
    toast.style.backgroundColor = type === 'success' ? '#10b981' : '#f59e0b';
    toast.style.color = 'white';
    toast.style.fontSize = '0.7rem';
    toast.style.fontFamily = 'var(--font-thai)';
    toast.style.padding = '0.5rem 0.75rem';
    toast.style.borderRadius = '6px';
    toast.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    toast.style.zIndex = '999';
    toast.style.textAlign = 'center';
    toast.style.transition = 'opacity 0.25s, transform 0.25s';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.innerText = message;
    
    activeScreen.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 250);
    }, 3000);
}

// Global trigger for physical phone shaking feedback on validation errors
function triggerShake(element) {
    if (!element) return;
    element.classList.remove('shake-error');
    void element.offsetWidth; // Trigger reflow to restart animation
    element.classList.add('shake-error');
    setTimeout(() => {
        element.classList.remove('shake-error');
    }, 400);
}


/* ==========================================================================
   1. GRAB MOCKUP (Visibility of System Status)
   ========================================================================== */
let grabState = 'idle';
let grabTimeout;

function initGrabMockup() {
    const btnAction = document.getElementById('grab-btn-action');
    btnAction.addEventListener('click', runGrabSimulation);
}

function runGrabSimulation() {
    const btnAction = document.getElementById('grab-btn-action');
    const statusText = document.getElementById('grab-status-text');
    const car = document.getElementById('grab-car');
    const screen = document.getElementById('screen-grab');
    const mode = mockupModes.grab;
    
    let pulseRing = screen.querySelector('.grab-pulse-ring');
    if (!pulseRing) {
        pulseRing = document.createElement('div');
        pulseRing.className = 'grab-pulse-ring';
        screen.appendChild(pulseRing);
    }
    
    if (grabState === 'idle') {
        grabState = 'booking';
        
        if (mode === 'good') {
            // Good UI: Give visual feedback immediately with a circular spinner
            btnAction.textContent = 'ยกเลิกการค้นหา';
            btnAction.style.backgroundColor = '#ef4444';
            btnAction.style.boxShadow = '0 4px 6px rgba(239, 239, 239, 0.2)';
            statusText.innerHTML = '<div class="grab-loading-spinner"></div> กำลังค้นหาคนขับรถ... (50%)';
            pulseRing.classList.add('active');
            pulseRing.style.opacity = '1';
        } else {
            // Bad UI: No status update, screen feels frozen.
            statusText.textContent = 'พร้อมหาคนขับรอบตัวคุณ';
        }
        
        // Reset car
        car.style.transition = 'none';
        car.style.top = '70px';
        car.style.left = '60px';
        car.style.transform = 'rotate(30deg)';
        car.classList.remove('moving');
        
        grabTimeout = setTimeout(() => {
            grabState = 'accepted';
            
            if (mode === 'good') {
                btnAction.textContent = 'ยกเลิกการจอง';
                statusText.innerHTML = '🟢 เจอคนขับแล้ว! <strong>นายสมควร (กข-9988)</strong><br><small>กำลังเดินทางมาหาคุณ (2 นาที)</small>';
                pulseRing.classList.remove('active');
                pulseRing.style.opacity = '0';
                
                // Clear inline style overrides so the offset-path CSS animation takes over
                car.style.top = '';
                car.style.left = '';
                car.style.transform = '';
                car.classList.add('moving');
                
                grabTimeout = setTimeout(() => {
                    grabState = 'arrived';
                    statusText.innerHTML = '✨ คนขับมาถึงจุดรับของคุณแล้ว! (🚗 รถเก๋งสีขาว)';
                    btnAction.textContent = 'ตกลง';
                    btnAction.style.backgroundColor = '#4f46e5';
                }, 4000);
            } else {
                // Bad UI: Suddenly accept and teleport the car instantly without transitions
                statusText.innerHTML = '🟢 เจอคนขับแล้ว (นายสมควร)<br>คนขับมาถึงแล้ว!';
                btnAction.textContent = 'จองรถ JustGrab';
                car.style.transition = 'none';
                car.style.top = '225px';
                car.style.left = '125px';
                car.style.transform = 'rotate(110deg)';
            }
        }, 2000);
        
    } else {
        resetGrabMockup();
    }
}

function resetGrabMockup() {
    clearTimeout(grabTimeout);
    grabState = 'idle';
    
    const btnAction = document.getElementById('grab-btn-action');
    const statusText = document.getElementById('grab-status-text');
    const car = document.getElementById('grab-car');
    const screen = document.getElementById('screen-grab');
    const pulseRing = screen.querySelector('.grab-pulse-ring');
    
    btnAction.textContent = 'จองรถ JustGrab';
    btnAction.style.backgroundColor = '#00b14f';
    btnAction.style.boxShadow = '0 4px 6px rgba(0, 177, 79, 0.2)';
    statusText.textContent = 'พร้อมหาคนขับรอบตัวคุณ';
    if (pulseRing) {
        pulseRing.classList.remove('active');
        pulseRing.style.opacity = '0';
    }
    
    car.classList.remove('moving');
    car.style.transition = 'none';
    car.style.top = '70px';
    car.style.left = '60px';
    car.style.transform = 'rotate(30deg)';
}


/* ==========================================================================
   2. SETTINGS TOGGLE MOCKUP (Match System & Real World)
   ========================================================================== */
function initSettingsMatchMockup() {
    resetSettingsMatchMockup('good');
}

function resetSettingsMatchMockup(mode) {
    const wifiContainer = document.getElementById('wifi-action-area');
    const darkContainer = document.getElementById('dark-action-area');
    const footerBad = document.getElementById('settings-footer-bad');
    const screen = document.getElementById('screen-match');
    
    if (!wifiContainer) return;
    
    let wifiState = true;
    let darkState = false;
    
    // Reset screen classes to default active Wi-Fi and light theme
    screen.classList.remove('wifi-off');
    screen.classList.remove('dark-status');
    screen.style.backgroundColor = '#f8fafc';
    
    if (mode === 'good') {
        footerBad.classList.add('hidden');
        
        // Render physical toggles
        wifiContainer.innerHTML = `
            <div class="switch-container active" id="switch-wifi">
                <div class="switch-handle"></div>
            </div>
        `;
        darkContainer.innerHTML = `
            <div class="switch-container" id="switch-dark">
                <div class="switch-handle"></div>
            </div>
        `;
        
        // Bind Toggle clicks
        const swWifi = document.getElementById('switch-wifi');
        const swDark = document.getElementById('switch-dark');
        
        swWifi.addEventListener('click', () => {
            wifiState = !wifiState;
            swWifi.classList.toggle('active', wifiState);
            screen.classList.toggle('wifi-off', !wifiState);
            alertToast(`🛜 Wi-Fi: ${wifiState ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}`, 'success');
        });
        
        swDark.addEventListener('click', () => {
            darkState = !darkState;
            swDark.classList.toggle('active', darkState);
            screen.classList.toggle('dark-status', darkState);
            screen.style.backgroundColor = darkState ? '#1e293b' : '#f8fafc';
            alertToast(`🌙 โหมดกลางคืน: ${darkState ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}`, 'success');
        });
        
    } else {
        // Bad UI: Render text input fields (Match fails real world)
        footerBad.classList.remove('hidden');
        
        wifiContainer.innerHTML = `<input type="text" class="settings-bad-input" id="input-wifi" value="เปิด">`;
        darkContainer.innerHTML = `<input type="text" class="settings-bad-input" id="input-dark" value="ปิด">`;
        
        const btnSave = document.getElementById('settings-btn-save-bad');
        btnSave.onclick = () => {
            const wifiVal = document.getElementById('input-wifi').value.trim();
            const darkVal = document.getElementById('input-dark').value.trim();
            
            if (wifiVal === 'เปิด' || wifiVal === '1') {
                wifiState = true;
            } else {
                wifiState = false;
            }
            
            if (darkVal === 'เปิด' || darkVal === '1') {
                darkState = true;
            } else {
                darkState = false;
            }
            
            screen.classList.toggle('wifi-off', !wifiState);
            screen.classList.toggle('dark-status', darkState);
            screen.style.backgroundColor = darkState ? '#1e293b' : '#f8fafc';
            alertToast(`💾 บันทึกการตั้งค่าสำเร็จ! (Wi-Fi: ${wifiState ? 'เปิด' : 'ปิด'}, โหมดกลางคืน: ${darkState ? 'เปิด' : 'ปิด'})`, 'warn');
        };
    }
}


/* ==========================================================================
   3. GMAIL MOCKUP (User Control & Freedom)
   ========================================================================== */
let gmailDeletedItem = null;
let gmailDeletedParent = null;
let gmailDeletedIndex = null;
let gmailUndoTimeout = null;

function initGmailMockup() {
    const inbox = document.getElementById('gmail-inbox');
    const toast = document.getElementById('gmail-toast');
    const btnUndo = document.getElementById('gmail-btn-undo');
    
    if (!inbox) return;
    
    inbox.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.gmail-delete-btn');
        if (!deleteBtn) return;
        
        const emailItem = deleteBtn.closest('.gmail-email-item');
        if (!emailItem) return;
        
        const mode = mockupModes.gmail;
        
        if (mode === 'good') {
            // Good UI: Allow undo
            gmailDeletedItem = emailItem;
            gmailDeletedParent = emailItem.parentNode;
            gmailDeletedIndex = Array.from(gmailDeletedParent.children).indexOf(emailItem);
            
            emailItem.style.opacity = '0';
            emailItem.style.transform = 'translateX(-100%)';
            
            setTimeout(() => {
                emailItem.style.display = 'none';
                showGmailToast();
            }, 200);
        } else {
            // Bad UI: Direct delete, no way to restore
            emailItem.style.opacity = '0';
            emailItem.style.transform = 'translateX(-100%)';
            setTimeout(() => {
                emailItem.remove();
                alertToast('🗑️ ลบอีเมลสำเร็จถาวร! (ไม่สามารถเรียกคืนได้)', 'warn');
            }, 200);
        }
    });
    
    btnUndo.addEventListener('click', () => {
        if (!gmailDeletedItem) return;
        
        gmailDeletedItem.style.display = 'flex';
        
        if (gmailDeletedIndex >= gmailDeletedParent.children.length) {
            gmailDeletedParent.appendChild(gmailDeletedItem);
        } else {
            gmailDeletedParent.insertBefore(gmailDeletedItem, gmailDeletedParent.children[gmailDeletedIndex]);
        }
        
        setTimeout(() => {
            gmailDeletedItem.style.opacity = '1';
            gmailDeletedItem.style.transform = 'translateX(0)';
            gmailDeletedItem = null;
        }, 20);
        
        hideGmailToast();
        clearTimeout(gmailUndoTimeout);
    });
}

function showGmailToast() {
    const toast = document.getElementById('gmail-toast');
    clearTimeout(gmailUndoTimeout);
    toast.classList.add('show');
    
    gmailUndoTimeout = setTimeout(() => {
        hideGmailToast();
        if (gmailDeletedItem) {
            gmailDeletedItem.remove();
            gmailDeletedItem = null;
        }
    }, 5000);
}

function hideGmailToast() {
    const toast = document.getElementById('gmail-toast');
    if (toast) toast.classList.remove('show');
}

function resetGmailMockup() {
    hideGmailToast();
    clearTimeout(gmailUndoTimeout);
    gmailDeletedItem = null;
    
    const inbox = document.getElementById('gmail-inbox');
    if (!inbox) return;
    
    // Reset original emails list
    inbox.innerHTML = `
        <div class="gmail-email-item" id="gmail-item-1">
            <div class="gmail-item-left">
                <div class="gmail-sender-avatar" style="background-color: #ea4335;">P</div>
                <div class="gmail-email-content">
                    <div class="gmail-sender">พี่นิค UX Lead</div>
                    <div class="gmail-subject">ส่งการบ้าน 10 Heuristics ด้วยนะ!</div>
                    <div class="gmail-preview">สวัสดีน้องฝึกงาน อย่าลืมเช็คหน้าเว็บ...</div>
                </div>
            </div>
            <button class="gmail-delete-btn" title="Delete">🗑️</button>
        </div>
        <div class="gmail-email-item" id="gmail-item-2">
            <div class="gmail-item-left">
                <div class="gmail-sender-avatar" style="background-color: #4285f4;">S</div>
                <div class="gmail-email-content">
                    <div class="gmail-sender">Spotify</div>
                    <div class="gmail-subject">เพลงใหม่ที่คุณน่าจะชอบสัปดาห์นี้</div>
                    <div class="gmail-preview">มาฟังเพลงฮิตติดกระแสในช่วงนี้กันเลย...</div>
                </div>
            </div>
            <button class="gmail-delete-btn" title="Delete">🗑️</button>
        </div>
    `;
}


/* ==========================================================================
   4. E-COMMERCE MOCKUP (Consistency & Standards)
   ========================================================================== */
let cartValue = 1;

function initEcommerceMockup() {
    const btnAddStandard = document.getElementById('eco-btn-add-standard');
    const btnAddBad = document.getElementById('eco-btn-add-bad');
    const cartBadge = document.querySelector('.eco-cart-badge');
    const badCartBtn = document.getElementById('eco-bad-cart-btn-trigger');
    
    btnAddStandard.addEventListener('click', () => {
        cartValue++;
        cartBadge.textContent = cartValue;
        
        // Pulse badge animation
        cartBadge.style.transform = 'scale(1.4)';
        setTimeout(() => cartBadge.style.transform = 'scale(1)', 150);
        
        alertToast('🛒 เพิ่มเข้าในตะกร้าด้านบนขวาเรียบร้อย!', 'success');
    });
    
    badCartBtn.addEventListener('click', () => {
        cartValue++;
        badCartBtn.innerHTML = `🛒 ถุงสินค้า (มี ${cartValue} ชิ้น)`;
        alertToast('🛒 เพิ่มลงในถุงสินค้ามุมซ้ายล่างแล้ว!', 'warn');
    });

    btnAddBad.addEventListener('click', () => {
        cartValue++;
        badCartBtn.innerHTML = `🛒 ถุงสินค้า (มี ${cartValue} ชิ้น)`;
        alertToast('🛒 เพิ่มลงในถุงสินค้ามุมซ้ายล่างแล้ว! (ผ่านการกดปุ่มที่วางตำแหน่งสับสน)', 'warn');
    });
    
    resetEcommerceMockup('good');
}

function resetEcommerceMockup(mode) {
    const topCart = document.getElementById('eco-top-cart');
    const bottomConfusing = document.getElementById('eco-bottom-confusing');
    const bottomStandard = document.getElementById('eco-bottom-standard');
    const badCartBtn = document.getElementById('eco-bad-cart-btn-trigger');
    const cartBadge = document.querySelector('.eco-cart-badge');
    const btnAddBad = document.getElementById('eco-btn-add-bad');
    
    cartValue = 1;
    if (cartBadge) cartBadge.textContent = cartValue;
    if (badCartBtn) badCartBtn.innerHTML = '🛒 ถุงสินค้า (มี 1 ชิ้น)';
    
    if (mode === 'good') {
        topCart.style.display = 'block';
        bottomStandard.classList.remove('hidden');
        bottomConfusing.style.display = 'none';
        btnAddBad.classList.add('hidden');
    } else {
        topCart.style.display = 'none';
        bottomStandard.classList.add('hidden');
        bottomConfusing.style.display = 'flex';
        btnAddBad.classList.remove('hidden');
    }
}


/* ==========================================================================
   5. REGISTER MOCKUP (Error Prevention)
   ========================================================================== */
function initRegisterMockup() {
    const inputPass = document.getElementById('reg-input-password');
    
    inputPass.addEventListener('input', () => {
        const mode = mockupModes.register;
        if (mode === 'good') {
            validatePasswordGood();
        }
    });
    
    const btnSubmit = document.getElementById('reg-btn-submit');
    btnSubmit.addEventListener('click', () => {
        const mode = mockupModes.register;
        const pass = inputPass.value;
        const errorBox = document.getElementById('reg-error-after-submit');
        
        if (mode === 'good') {
            alertToast('🎉 สมัครสมาชิกเสร็จสมบูรณ์รวดเร็ว!', 'success');
            
            // Visual success state: Disable inputs and turn button green
            inputPass.setAttribute('disabled', 'true');
            btnSubmit.setAttribute('disabled', 'true');
            btnSubmit.textContent = 'สมัครสมาชิกสำเร็จ! ✅';
            btnSubmit.style.backgroundColor = '#10b981';
            
            setTimeout(() => {
                inputPass.removeAttribute('disabled');
                btnSubmit.textContent = 'ลงทะเบียน';
                btnSubmit.style.backgroundColor = '#4f46e5';
                resetRegisterMockup('good');
            }, 2000);
        } else {
            // Bad UI: Checks only after clicking register button
            const hasNum = /\d/.test(pass);
            const isLong = pass.length >= 8;
            
            if (isLong && hasNum) {
                errorBox.classList.add('hidden');
                alertToast('สมัครสมาชิกเสร็จสิ้น!', 'success');
                
                // Visual success state: Disable input and button
                inputPass.setAttribute('disabled', 'true');
                btnSubmit.setAttribute('disabled', 'true');
                btnSubmit.textContent = 'เสร็จสิ้น';
                btnSubmit.style.backgroundColor = '#10b981';
                
                setTimeout(() => {
                    inputPass.removeAttribute('disabled');
                    btnSubmit.removeAttribute('disabled');
                    btnSubmit.textContent = 'ลงทะเบียน';
                    btnSubmit.style.backgroundColor = '#0f172a';
                    resetRegisterMockup('bad');
                }, 2000);
            } else {
                errorBox.classList.remove('hidden');
                alertToast('สมัครสมาชิกล้มเหลว! ตรวจสอบข้อแนะนำ', 'warn');
                triggerShake(document.getElementById('screen-register').closest('.phone-frame'));
            }
        }
    });
    
    resetRegisterMockup('good');
}

function validatePasswordGood() {
    const pass = document.getElementById('reg-input-password').value;
    const checkLen = document.getElementById('check-len');
    const checkNum = document.getElementById('check-num');
    const btnSubmit = document.getElementById('reg-btn-submit');
    
    const isLong = pass.length >= 8;
    const hasNum = /\d/.test(pass);
    
    // Check Length
    if (isLong) {
        checkLen.textContent = '✅ ยาวอย่างน้อย 8 ตัวอักษร';
        checkLen.classList.add('valid');
    } else {
        checkLen.textContent = '❌ ยาวอย่างน้อย 8 ตัวอักษร';
        checkLen.classList.remove('valid');
    }
    
    // Check Numbers
    if (hasNum) {
        checkNum.textContent = '✅ มีตัวเลขอย่างน้อย 1 ตัว';
        checkNum.classList.add('valid');
    } else {
        checkNum.textContent = '❌ มีตัวเลขอย่างน้อย 1 ตัว';
        checkNum.classList.remove('valid');
    }
    
    // Disable/Enable button (Error Prevention)
    if (isLong && hasNum) {
        btnSubmit.removeAttribute('disabled');
    } else {
        btnSubmit.setAttribute('disabled', 'true');
    }
}

function resetRegisterMockup(mode) {
    const inputPass = document.getElementById('reg-input-password');
    const checkList = document.getElementById('reg-live-checks');
    const errorBox = document.getElementById('reg-error-after-submit');
    const btnSubmit = document.getElementById('reg-btn-submit');
    
    inputPass.value = '';
    errorBox.classList.add('hidden');
    btnSubmit.style.backgroundColor = ''; // Clear custom inline backgrounds
    
    if (mode === 'good') {
        checkList.classList.remove('hidden');
        btnSubmit.setAttribute('disabled', 'true');
        validatePasswordGood();
    } else {
        checkList.classList.add('hidden');
        btnSubmit.removeAttribute('disabled'); // Bad UI leaves button active so users make errors
    }
}


/* ==========================================================================
   6. NETFLIX MOCKUP (Recognition vs Recall)
   ========================================================================== */
function initNetflixMockup() {
    const trigger = document.getElementById('nf-btn-toggle-search');
    const close = document.getElementById('nf-btn-close-search');
    const main = document.getElementById('nf-main-home');
    const search = document.getElementById('nf-search-page');
    const watch = document.getElementById('nf-watch-card');
    
    trigger.addEventListener('click', () => {
        main.classList.add('hidden');
        search.classList.remove('hidden');
    });
    
    close.addEventListener('click', () => {
        search.classList.add('hidden');
        main.classList.remove('hidden');
        document.getElementById('nf-search-input').value = '';
    });
    
    watch.addEventListener('click', () => {
        alertToast('▶️ กำลังเล่น Squid Game ต่อจากนาทีที่ 38', 'success');
    });
    
    const items = document.querySelectorAll('.nf-recent-item');
    items.forEach(item => {
        item.addEventListener('click', () => {
            const query = item.textContent.replace(/[🖤🏴‍☠️🦖]\s*/g, '');
            document.getElementById('nf-search-input').value = query;
            alertToast(`🔍 ค้นหา: "${query}"`, 'success');
        });
    });
}

function resetNetflixMockup(mode) {
    const searchInput = document.getElementById('nf-search-input');
    const recent = document.getElementById('nf-recent-searches-container');
    const main = document.getElementById('nf-main-home');
    const search = document.getElementById('nf-search-page');
    const continueSection = document.getElementById('nf-continue-section');
    
    searchInput.value = '';
    search.classList.add('hidden');
    main.classList.remove('hidden');
    
    if (mode === 'good') {
        recent.style.display = 'block';
        if (continueSection) continueSection.classList.remove('hidden');
    } else {
        recent.style.display = 'none';
        if (continueSection) continueSection.classList.add('hidden');
    }
}


/* ==========================================================================
   7. INSTAGRAM MOCKUP (Flexibility & Efficiency)
   ========================================================================== */
function initInstagramMockup() {
    const photo = document.getElementById('ig-photo-post');
    const btnLike = document.getElementById('ig-btn-like');
    const heartPop = document.getElementById('ig-heart-pop');
    const likesCount = document.getElementById('ig-likes-count');
    
    let isLiked = false;
    let base = 1420;
    let lastClick = 0;
    
    function toggle(animateHeart = false) {
        isLiked = !isLiked;
        if (isLiked) {
            btnLike.textContent = '❤️';
            btnLike.style.color = '#ef4444';
            likesCount.textContent = `ถูกใจ ${base + 1} คน`;
            
            if (animateHeart) {
                heartPop.style.animation = 'none';
                void heartPop.offsetWidth;
                heartPop.style.animation = 'heart-beat 0.8s ease forwards';
            }
        } else {
            btnLike.textContent = '🤍';
            btnLike.style.color = '#000';
            likesCount.textContent = `ถูกใจ ${base} คน`;
        }
    }
    
    btnLike.addEventListener('click', () => toggle(false));
    
    photo.addEventListener('click', () => {
        const mode = mockupModes.instagram;
        if (mode === 'bad') return; // Bad UI ignores double taps
        
        const now = Date.now();
        if ((now - lastClick) < 300) {
            if (!isLiked) toggle(true);
            else {
                heartPop.style.animation = 'none';
                void heartPop.offsetWidth;
                heartPop.style.animation = 'heart-beat 0.8s ease forwards';
            }
        }
        lastClick = now;
    });
}

function resetInstagramMockup(mode) {
    const btnLike = document.getElementById('ig-btn-like');
    const likesCount = document.getElementById('ig-likes-count');
    const hint = document.getElementById('ig-hint-text');
    
    btnLike.textContent = '🤍';
    btnLike.style.color = '#000';
    likesCount.textContent = 'ถูกใจ 1,420 คน';
    
    if (mode === 'good') {
        hint.innerHTML = '💡 ลองกดปุ่ม 🤍 หรือ <strong>ดับเบิ้ลแท็บที่รูปภาพ</strong> สองครั้ง';
    } else {
        hint.innerHTML = '💡 ต้องกดปุ่มรูปหัวใจ 🤍 เท่านั้น (ดับเบิ้ลแท็บใช้งานไม่ได้)';
    }
}


/* ==========================================================================
   8. APPLE MUSIC MOCKUP (Aesthetic & Minimalist)
   ========================================================================== */
let musicInterval = null;
let musicProgressPercent = 35;

function initMusicPlayerMockup() {
    const playBtn = document.querySelector('.mu-ctrl-btn.play');
    let scrubber = document.querySelector('.mu-scrubber-progress');
    let isPlaying = false;
    
    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playBtn.textContent = '⏸️';
            alertToast('🎵 กำลังเล่นเสียงเพลง...', 'success');
            
            musicInterval = setInterval(() => {
                musicProgressPercent = (musicProgressPercent + 1) % 100;
                if (scrubber) scrubber.style.width = `${musicProgressPercent}%`;
            }, 1000);
        } else {
            playBtn.textContent = '▶️';
            clearInterval(musicInterval);
        }
    });
}

function resetMusicPlayerMockup(mode) {
    clearInterval(musicInterval);
    
    const playBtn = document.querySelector('.mu-ctrl-btn.play');
    const viewMin = document.getElementById('mu-view-minimal-el');
    const viewClut = document.getElementById('mu-view-cluttered-el');
    const title = document.getElementById('mu-ui-indicator');
    const scrubber = document.querySelector('.mu-scrubber-progress');
    
    playBtn.textContent = '▶️';
    musicProgressPercent = 35;
    if (scrubber) scrubber.style.width = '35%';
    
    if (mode === 'good') {
        viewMin.classList.remove('hidden');
        viewClut.classList.add('hidden');
        title.textContent = 'เล่นเลย (Minimal)';
    } else {
        viewClut.classList.remove('hidden');
        viewMin.classList.add('hidden');
        title.textContent = 'เครื่องเล่นเพลง (Cluttered)';
    }
}


/* ==========================================================================
   9. SHOPEE COUPON MOCKUP (Error Recovery)
   ========================================================================== */
function initCouponMockup() {
    const applyBtn = document.getElementById('cp-btn-apply');
    const input = document.getElementById('cp-input-code');
    const alertBox = document.getElementById('cp-alert-box');
    const alertMsg = document.getElementById('cp-alert-msg');
    
    const valDiscount = document.getElementById('cp-val-discount');
    const valTotal = document.getElementById('cp-val-total');
    
    applyBtn.addEventListener('click', () => {
        const mode = mockupModes.coupon;
        const code = input.value.trim().toUpperCase();
        
        if (code === 'SUMMER50') {
            alertBox.classList.remove('hidden');
            
            if (mode === 'good') {
                // Good UI: Explain nicely and give direct action suggestion button
                alertMsg.innerHTML = `
                    โค้ด <strong>SUMMER50</strong> หมดอายุแล้ว!<br>
                    💡 แนะนำ: ใช้โค้ด <strong>NEWYEAR2026</strong> รับส่วนลด 10% แทน<br>
                    <button class="cp-alert-suggest-btn" id="cp-btn-suggest">กดใช้โค้ดแนะนำ</button>
                `;
                
                // Bind suggestion click
                document.getElementById('cp-btn-suggest').addEventListener('click', () => {
                    input.value = 'NEWYEAR2026';
                    applySuccessCoupon(59);
                });
            } else {
                // Bad UI: Crytic error message, no suggestion
                alertMsg.innerHTML = '❌ [Error Code: 400] Bad Request. Action failed due to parameter mismatch (SUMMER50_EXPIRED)';
                triggerShake(document.getElementById('screen-coupon').closest('.phone-frame'));
            }
        } else if (code === 'NEWYEAR2026') {
            applySuccessCoupon(59);
        } else {
            alertBox.classList.remove('hidden');
            alertMsg.innerHTML = `❌ ไม่พบคูปอง "${code}" กรุณาพิมพ์ใหม่อีกครั้ง`;
            triggerShake(document.getElementById('screen-coupon').closest('.phone-frame'));
        }
    });
    
    function applySuccessCoupon(discount) {
        alertBox.classList.add('hidden');
        valDiscount.textContent = `-฿${discount}`;
        valDiscount.classList.add('cp-val-discount-active');
        valTotal.textContent = `฿${590 - discount}`;
        alertToast('🎉 ใช้คูปองส่วนลด 10% สำเร็จ!', 'success');
    }
}

function resetCouponMockup() {
    const input = document.getElementById('cp-input-code');
    const alertBox = document.getElementById('cp-alert-box');
    const valDiscount = document.getElementById('cp-val-discount');
    const valTotal = document.getElementById('cp-val-total');
    
    input.value = 'SUMMER50';
    alertBox.classList.add('hidden');
    valDiscount.textContent = '-฿0';
    valDiscount.classList.remove('cp-val-discount-active');
    valTotal.textContent = '฿590';
}


/* ==========================================================================
   10. DUOLINGO MOCKUP (Help & Documentation)
   ========================================================================== */
let duoStep = 1;

function initDuolingoMockup() {
    const btnStart = document.getElementById('duo-btn-start-tour');
    const btnNext = document.getElementById('duo-tooltip-next-btn');
    const container = document.getElementById('duo-tooltip-container');
    const text = document.getElementById('duo-tooltip-text');
    const stepLabel = document.getElementById('duo-tooltip-step-num');
    
    const steps = [
        { text: 'ยินดีต้อนรับ! แตะที่ "ด่านที่ 1" เพื่อเรียนบทเรียนแรกของคุณนะ 🦉', element: 'duo-node-1', step: '1/3' },
        { text: 'เมื่อเรียนจบบทเรียนแรกสำเร็จ ด่านถัดไปจะเปิดล็อกเองอัตโนมัติ 🔒', element: 'duo-node-2', step: '2/3' },
        { text: 'อย่าลืมมองดูเลเวลมงกุฎ 👑 หรือหัวใจพลังชีวิต ❤️ ด้านบนด้วยน้า!', element: 'duo-header', step: '3/3' }
    ];
    
    btnStart.addEventListener('click', () => {
        duoStep = 1;
        showDuoStep(duoStep);
    });
    
    btnNext.addEventListener('click', () => {
        duoStep++;
        if (duoStep > steps.length) {
            container.classList.add('hidden');
            // Remove outline highlights
            document.querySelectorAll('.duo-node, .duo-header').forEach(el => el.style.outline = 'none');
            alertToast('✨ จบการแนะนำช่วยเหลือ!', 'success');
        } else {
            showDuoStep(duoStep);
        }
    });
    
    function showDuoStep(idx) {
        container.classList.remove('hidden');
        const s = steps[idx - 1];
        
        text.innerHTML = s.text;
        stepLabel.textContent = s.step;
        
        if (idx === steps.length) {
            btnNext.textContent = 'ปิดไกด์';
        } else {
            btnNext.textContent = 'ถัดไป';
        }
        
        // Highlight logic
        document.querySelectorAll('.duo-node, .duo-header').forEach(el => el.style.outline = 'none');
        const target = document.getElementById(s.element) || document.querySelector(`.${s.element}`);
        if (target) {
            target.style.outline = '3px solid #ff9600';
            target.style.outlineOffset = '3px';
            target.style.zIndex = '60';
        }
    }
}

function resetDuolingoMockup(mode) {
    const container = document.getElementById('duo-tooltip-container');
    const map = document.getElementById('duo-map-container');
    const badWall = document.getElementById('duo-help-bad-wall');
    const action = document.getElementById('duo-action-container');
    
    if (container) container.classList.add('hidden');
    document.querySelectorAll('.duo-node, .duo-header').forEach(el => el.style.outline = 'none');
    
    if (mode === 'good') {
        map.classList.remove('hidden');
        action.classList.remove('hidden');
        badWall.classList.add('hidden');
    } else {
        map.classList.add('hidden');
        action.classList.add('hidden');
        badWall.classList.remove('hidden'); // Bad UI shows dense help text wall immediately
    }
}
