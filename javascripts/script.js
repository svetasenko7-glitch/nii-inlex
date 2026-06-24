//попап 
function initPopups() {
  document.addEventListener('DOMContentLoaded', function() {
    const popupTriggers = document.querySelectorAll('.js-popup-trigger');
    const popups = document.querySelectorAll('.popup');
    const closeBtns = document.querySelectorAll('.js-popup-close');

    function openPopup(id, triggerElement) {
      const targetPopup = document.getElementById(id);
      if(targetPopup) {
        closeAllPopups();
        if(triggerElement) {
          const bindElements = targetPopup.querySelectorAll('[data-popup-field]');
          bindElements.forEach(function(element) {
            const fieldName = element.getAttribute('data-popup-field');
            const fieldValue = triggerElement.getAttribute('data-res-' + fieldName);
            if(fieldValue !== null) {
              if(element.tagName === 'IMG') {
                element.src = fieldValue;
              } else {
                element.innerHTML = fieldValue;
              }
            }
          });
        }
        targetPopup.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        const openEvent = new CustomEvent('popup:opened', {
          detail: {
            trigger: triggerElement
          }
        });
        targetPopup.dispatchEvent(openEvent);
      }
    }

    function closeAllPopups() {
      popups.forEach(p => {
        if(p.classList.contains('is-active')) {
          p.classList.remove('is-active');
          const closeEvent = new CustomEvent('popup:closed');
          p.dispatchEvent(closeEvent);
        }
      });
      document.body.style.overflow = '';
    }
    popupTriggers.forEach(trigger => {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        let popupId = null;
        if(trigger.hasAttribute('data-popup')) {
          popupId = trigger.getAttribute('data-popup');
        } else if(trigger.hasAttribute('href') && trigger.getAttribute('href').startsWith('#')) {
          popupId = trigger.getAttribute('href').substring(1);
        }
        if(popupId) {
          openPopup(popupId, trigger);
        }
      });
    });
    closeBtns.forEach(btn => {
      btn.addEventListener('click', closeAllPopups);
    });
    popups.forEach(popup => {
      popup.addEventListener('click', function(e) {
        if(e.target === popup) {
          closeAllPopups();
        }
      });
    });
  });
}
initPopups();
//ротатор изображений новостей в попапе
function initPopupImageRotator() {
  document.addEventListener('DOMContentLoaded', function() {
    const newsPopup = document.getElementById('popup-news');
    if(!newsPopup) return;
    const rotatorImg = newsPopup.querySelector('[data-popup-field="imgs"]');
    let rotatorInterval = null;
    newsPopup.addEventListener('popup:opened', function(e) {
      const trigger = e.detail.trigger;
      if(!trigger || !rotatorImg) return;
      const imgsData = trigger.getAttribute('data-res-imgs');
      if(!imgsData) return;
      const imgArray = imgsData.split(',');
      if(imgArray.length === 0) return;
      let currentIdx = 0;
      rotatorImg.src = imgArray[currentIdx];
      rotatorImg.style.opacity = '1';
      if(imgArray.length > 1) {
        rotatorInterval = setInterval(function() {
          rotatorImg.style.opacity = '0';
          setTimeout(function() {
            currentIdx = (currentIdx + 1) % imgArray.length;
            rotatorImg.src = imgArray[currentIdx];
            rotatorImg.style.opacity = '1';
          }, 200); // 200мс на fade-in эффект
        }, 2000); // Смена слайдов каждые 2 секунды
      }
    });
    newsPopup.addEventListener('popup:closed', function() {
      if(rotatorInterval) {
        clearInterval(rotatorInterval);
        rotatorInterval = null;
      }
    });
  });
}
initPopupImageRotator();
//бегущая строка
function initAllTickers() {
  document.addEventListener('DOMContentLoaded', function() {
    function setupTickerTrack(trackId) {
      const tickerTrack = document.getElementById(trackId);
      if(tickerTrack) {
        const originalContent = tickerTrack.innerHTML;
        tickerTrack.innerHTML = originalContent + originalContent;
        tickerTrack.classList.add('is-animated');
        tickerTrack.addEventListener('mouseenter', function() {
          this.style.animationPlayState = 'paused';
        });
        tickerTrack.addEventListener('mouseleave', function() {
          this.style.animationPlayState = 'running';
        });
      }
    }
    setupTickerTrack('brandTickerTrack'); // Для логотипов партнеров
    setupTickerTrack('awardsTickerTrack'); // Для текстовой ленты премий
  });
}
initAllTickers();
//анимация этапов
function initInjectionStages() {
  document.addEventListener('DOMContentLoaded', function() {
    const stageCards = document.querySelectorAll('.inj-flow-card');
    if(stageCards.length === 0) return;
    let activeIndex = 0;
    stageCards[activeIndex].classList.add('is-active');
    setInterval(function() {
      stageCards[activeIndex].classList.remove('is-active');
      activeIndex = (activeIndex + 1) % stageCards.length;
      stageCards[activeIndex].classList.add('is-active');
    }, 500);
  });
}
initInjectionStages();
//подписка в подвале
function initFooterSubscribe() {
  document.addEventListener('DOMContentLoaded', function() {
    const subscribeForm = document.getElementById('subscribe-form');
    const subscribeSuccess = document.getElementById('subscribe-success');
    if(!subscribeForm) return;
    const emailInput = subscribeForm.querySelector('.subscribe-input');
    subscribeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      let isValid = true;
      emailInput.classList.remove('is-error');
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if(emailInput.value.trim() === '' || !emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('is-error');
        isValid = false;
      }
      if(isValid) {
        subscribeForm.style.display = 'none';
        if(subscribeSuccess) {
          subscribeSuccess.style.display = 'block';
        }
        subscribeForm.reset();
      }
    });
    if(emailInput) {
      emailInput.addEventListener('input', function() {
        this.classList.remove('is-error');
      });
    }
  });
}
initFooterSubscribe();
//слайдер
function initGallerySliders() {
  document.addEventListener('DOMContentLoaded', function() {
    const allSliders = document.querySelectorAll('.js-gallery-slider');
    allSliders.forEach(sliderWrapper => {
      const mainCol = sliderWrapper.querySelector('.js-gal-main-col');
      const colorImg = sliderWrapper.querySelector('.js-gal-color-img');
      const bwImg = sliderWrapper.querySelector('.js-gal-bw-img');
      const leftImg = sliderWrapper.querySelector('.js-gal-left-img');
      const rightImg = sliderWrapper.querySelector('.js-gal-right-img');
      const dotsContainer = sliderWrapper.querySelector('.js-gal-dots');
      const prevBtn = sliderWrapper.querySelector('.js-gal-prev');
      const nextBtn = sliderWrapper.querySelector('.js-gal-next');
      const rawSlides = sliderWrapper.querySelectorAll('.js-gal-slide-data');
      const sliderData = [];
      rawSlides.forEach(slide => {
        sliderData.push({
          color: slide.getAttribute('data-color'),
          bw: slide.getAttribute('data-bw')
        });
      });
      let currentIdx = 0;
      const totalSlides = sliderData.length;
      let isFixedBw = false;
      if(totalSlides === 0) return;
      for(let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('gal-slider-dot');
        if(i === 0) dot.classList.add('is-active');
        dot.setAttribute('aria-label', `Слайд ${i + 1}`);
        dotsContainer.appendChild(dot);
      }
      const dots = dotsContainer.querySelectorAll('.gal-slider-dot');

      function updateSliderView() {
        const leftIdx = (currentIdx - 1 + totalSlides) % totalSlides;
        const rightIdx = (currentIdx + 1) % totalSlides;
        isFixedBw = false;
        mainCol.classList.remove('is-bw-active');
        colorImg.src = sliderData[currentIdx].color;
        bwImg.src = sliderData[currentIdx].bw ? sliderData[currentIdx].bw : '';
        leftImg.src = sliderData[leftIdx].color;
        rightImg.src = sliderData[rightIdx].color;
        dots.forEach((dot, idx) => {
          if(idx === currentIdx) {
            dot.classList.add('is-active');
          } else {
            dot.classList.remove('is-active');
          }
        });
      }
      updateSliderView();
      mainCol.addEventListener('mouseenter', function() {
        if(sliderData[currentIdx].bw) {
          mainCol.classList.add('is-bw-active');
        }
      });
      mainCol.addEventListener('mouseleave', function() {
        if(sliderData[currentIdx].bw && !isFixedBw) {
          mainCol.classList.remove('is-bw-active');
        }
      });
      mainCol.addEventListener('click', function() {
        if(sliderData[currentIdx].bw) {
          isFixedBw = !isFixedBw;
          if(isFixedBw) {
            mainCol.classList.add('is-bw-active');
          } else {
            mainCol.classList.remove('is-bw-active');
          }
        }
      });
      prevBtn.addEventListener('click', function() {
        currentIdx = (currentIdx - 1 + totalSlides) % totalSlides;
        updateSliderView();
      });
      nextBtn.addEventListener('click', function() {
        currentIdx = (currentIdx + 1) % totalSlides;
        updateSliderView();
      });
      dots.forEach((dot, idx) => {
        dot.addEventListener('click', function() {
          currentIdx = idx;
          updateSliderView();
        });
      });
    });
  });
}
initGallerySliders();
//мерцание элементов прартнеров
function initPartnersOrganicGlow() {
  document.addEventListener('DOMContentLoaded', function() {
    const partnerItems = document.querySelectorAll('.inst-partners-card');
    if(partnerItems.length === 0) return;
    let activeGlowCount = 0;
    const MAX_GLOWING = 3;

    function startCardLife(item) {
      const randomDelay = Math.random() * 3000 + 1000;
      setTimeout(() => {
        if(activeGlowCount < MAX_GLOWING && !item.matches(':hover') && !item.classList.contains('is-glowing')) {
          item.classList.add('is-glowing');
          activeGlowCount++;
          const randomGlowDuration = Math.random() * 1500 + 1500;
          setTimeout(() => {
            item.classList.remove('is-glowing');
            activeGlowCount--;
            startCardLife(item);
          }, randomGlowDuration);
        } else {
          startCardLife(item);
        }
      }, randomDelay);
    }
    partnerItems.forEach(item => {
      startCardLife(item);
    });
  });
}
initPartnersOrganicGlow();
//валидация формы каталога
function initCatalogFormLogic() {
  document.addEventListener('DOMContentLoaded', function() {
    const catPopup = document.getElementById('catOrderModal');
    if(!catPopup) return;
    const orderForm = document.getElementById('catOrderForm');
    const formScreen = document.getElementById('catModalFormScreen');
    const successScreen = document.getElementById('catModalSuccessScreen');
    if(!orderForm || !formScreen || !successScreen) return;
    catPopup.addEventListener('popup:opened', function() {
      formScreen.style.display = 'block';
      successScreen.style.display = 'none';
      orderForm.reset();
      orderForm.querySelectorAll('.cat-input').forEach(input => input.classList.remove('is-error'));
    });
    orderForm.addEventListener('submit', function(e) {
      e.preventDefault();
      let isFormValid = true;
      const nameInput = orderForm.querySelector('[name="name"]');
      const phoneInput = orderForm.querySelector('[name="phone"]');
      const emailInput = orderForm.querySelector('[name="email"]');
      [nameInput, phoneInput, emailInput].forEach(input => input.classList.remove('is-error'));
      if(nameInput.value.trim() === '') {
        nameInput.classList.add('is-error');
        isFormValid = false;
      }
      const phoneRegex = /^[+\d]+$/;
      if(!phoneRegex.test(phoneInput.value.trim())) {
        phoneInput.classList.add('is-error');
        isFormValid = false;
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if(!emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('is-error');
        isFormValid = false;
      }
      if(isFormValid) {
        formScreen.style.display = 'none';
        successScreen.style.display = 'block';
        orderForm.reset();
      }
    });
    orderForm.querySelectorAll('.cat-input').forEach(input => {
      input.addEventListener('input', function() {
        this.classList.remove('is-error');
      });
    });
  });
}
initCatalogFormLogic();
//обратный отсчет акции
function initPromoCountdownTimer() {
  document.addEventListener('DOMContentLoaded', function() {
    if(!document.getElementById('timer-days-tens')) return;
    const timeOffset = (35 * 24 * 60 * 60 * 1000) + (23 * 60 * 60 * 1000) + (11 * 60 * 1000);
    let targetDate = localStorage.getItem('inlexPromoEnd');
    if(!targetDate || parseInt(targetDate) < new Date().getTime()) {
      targetDate = new Date().getTime() + timeOffset;
      localStorage.setItem('inlexPromoEnd', targetDate);
    } else {
      targetDate = parseInt(targetDate);
    }

    function updateTimer() {
      const now = new Date().getTime();
      const distance = targetDate - now;
      let days = 0;
      let hours = 0;
      let minutes = 0;
      if(distance > 0) {
        days = Math.floor(distance / (1000 * 60 * 60 * 24));
        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      }
      const daysStr = days < 10 ? '0' + days : String(days);
      const hoursStr = hours < 10 ? '0' + hours : String(hours);
      const minutesStr = minutes < 10 ? '0' + minutes : String(minutes);
      document.getElementById('timer-days-tens').textContent = daysStr[0];
      document.getElementById('timer-days-units').textContent = daysStr[1];
      document.getElementById('timer-hours-tens').textContent = hoursStr[0];
      document.getElementById('timer-hours-units').textContent = hoursStr[1];
      document.getElementById('timer-minutes-tens').textContent = minutesStr[0];
      document.getElementById('timer-minutes-units').textContent = minutesStr[1];
      if(distance < 0) {
        clearInterval(timerInterval);
        localStorage.removeItem('inlexPromoEnd');
      }
    }
    updateTimer();
    const timerInterval = setInterval(updateTimer, 60000);
  });
}
initPromoCountdownTimer();
//мобильное меню
function initMobileMenu() {
  document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.querySelector('.js-menu-toggle');
    const menuOverlay = document.getElementById('mobile-menu');
    const header = document.querySelector('.header');
    if(!toggleBtn || !menuOverlay || !header) return;
    toggleBtn.addEventListener('click', function() {
      const isActive = toggleBtn.classList.toggle('is-active');
      menuOverlay.classList.toggle('is-active', isActive);
      header.classList.toggle('header--menu-open', isActive);
      if(isActive) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    menuOverlay.addEventListener('click', function(e) {
      if(e.target === menuOverlay) {
        toggleBtn.classList.remove('is-active');
        menuOverlay.classList.remove('is-active');
        header.classList.remove('header--menu-open');
        document.body.style.overflow = '';
      }
    });
  });
}
initMobileMenu();

//intro - первый блок на главной
function intro() {
 document.addEventListener("DOMContentLoaded", () => {
      
      const USER_OPTIONS = {
		  
		// Минимальная скорость перемещения кубиков на десктопе
        speedMin: 0.8,      
		
		// Максимальная скорость перемещения кубиков на десктопе
        speedMax: 3.0,     
        
		// Снижение скорости на мобильных экранах (чтобы не летали слишком быстро)
        mobileSpeedMultiplier: 0.5, 
		
		// Пауза между поочередным появлением кубиков на экране (в мс)
        spawnInterval: 1,    
		
		// Задержка перед тем, как на кубике начнет плавно проявляться картинка (в мс)
        imageFadeInterval: 50,  
		
		// Пауза после появления картинки и перед началом движения кубика (в мс)
        moveStartInterval: 10,   
		
		// Плавность проявления картинки-иконки (значение для CSS transition)
        imageFadeDuration: "1.2s"  
      };

      const CONFIG = {
		  
		//размер кубика при уменьшении ширины экрана
        cubeSizes: [
          { maxWidth: 480,   cubeWidth: 44 }, 
          { maxWidth: 640,   cubeWidth: 30 }, 
          { maxWidth: 768,   cubeWidth: 35 }, 
          { maxWidth: 1024,  cubeWidth: 40 }, 
          { maxWidth: 99999, cubeWidth: 50 }  
        ],
		
		//смещение картинки справа при уменьшении ширины экрана на указанное количество кубиков
        cubesToHide: [
          { maxWidth: 480,   hide: 6 }, 
          { maxWidth: 640,   hide: 4 },
          { maxWidth: 768,   hide: 3 },
          { maxWidth: 1200,  hide: 2 },
          { maxWidth: 1500,  hide: 1 },
          { maxWidth: 99999, hide: 0 }  
        ],
        buttons: [
          { maxWidth: 480,   solidWidth: 4, borderWidth: 3 }, 
          { maxWidth: 99999, solidWidth: 5, borderWidth: 4 }  
        ],
        buttonVerticalOffset: 0, 
        buttonHorizontalOffset: 1 
      };

      const rightSvg = document.querySelector('.intro-graphic-right svg');
      const rightContainer = document.querySelector('.intro-graphic-right');
      const leftSvg = document.querySelector('.intro-graphic-left svg');
      const actionsBlock = document.querySelector('.intro-actions');
      const btnSolid = document.querySelector('.intro-btn-solid');
      const btnBorder = document.querySelector('.intro-btn-border');
      const section = document.querySelector('.intro-section');

     if (!section || !leftSvg || !rightSvg) return;

      // Список картинок для каждого кубика по отдельности
      const cubeImages = [
        "./images/s1.png",
        "./images/s2.png",
        "./images/s3.png",
        "./images/s4.png"
      ];

      const obstacles = [];

      // Данные плавающих элементов
      const floatingCubesData = [
        { id: 1, relX: 0, relY: 2,  grid: 'left',  el: null, imgEl: null, x: 0, y: 0, w: 0, h: 0, vx: 0, vy: 0, moving: false, active: false, isGhost: true, isEmergencyGhost: false, posHistory: [] }, 
        { id: 2, relX: 0, relY: 7,  grid: 'left',  el: null, imgEl: null, x: 0, y: 0, w: 0, h: 0, vx: 0, vy: 0, moving: false, active: false, isGhost: true, isEmergencyGhost: false, posHistory: [] }, 
        { id: 3, relX: null, relY: null, grid: 'dynamic-button', el: null, imgEl: null, x: 0, y: 0, w: 0, h: 0, vx: 0, vy: 0, moving: false, active: false, isGhost: true, isEmergencyGhost: false, posHistory: [] }, 
        { id: 4, relX: 9, relY: 0,  grid: 'right', el: null, imgEl: null, x: 0, y: 0, w: 0, h: 0, vx: 0, vy: 0, moving: false, active: false, isGhost: true, isEmergencyGhost: false, posHistory: [] }  
      ];

      function getSetting(configArray, currentWidth) {
        return configArray.find(item => currentWidth <= item.maxWidth) || configArray[configArray.length - 1];
      }

      function synchronizeEverything() {
        const w = window.innerWidth;
        const sizeConf = getSetting(CONFIG.cubeSizes, w);
        const cubeWidth = sizeConf.cubeWidth;
        const cubeHeight = Math.round(cubeWidth * 1.02); 

        const hideConf = getSetting(CONFIG.cubesToHide, w);
        const cubesToHide = hideConf.hide;

        document.documentElement.style.setProperty('--cube-width', `${cubeWidth}px`);
        document.documentElement.style.setProperty('--cube-height', `${cubeHeight}px`);

        leftSvg.style.width = `${cubeWidth * 3}px`;
        leftSvg.style.height = `${cubeHeight * 12}px`;
        rightSvg.style.width = `${cubeWidth * 10}px`;
        rightSvg.style.height = `${cubeHeight * 10}px`;

        btnSolid.style.height = `${cubeHeight}px`;
        btnBorder.style.height = `${cubeHeight}px`;
        
        rightContainer.style.right = `-${cubesToHide * cubeWidth}px`;

        const leftSvgBounds = leftSvg.getBoundingClientRect();
        const rightSvgBounds = rightSvg.getBoundingClientRect();
        const sectionBounds = section.getBoundingClientRect();
        
        const leftSvgTopRelative = leftSvgBounds.top - sectionBounds.top;
        const leftSvgLeftRelative = leftSvgBounds.left - sectionBounds.left;
        const rightSvgTopRelative = rightSvgBounds.top - sectionBounds.top;
        const rightSvgLeftRelative = rightSvgBounds.left - sectionBounds.left;

        const row10TopPhysical = leftSvgTopRelative + (10 * cubeHeight) + CONFIG.buttonVerticalOffset;
        const col1LeftPhysical = leftSvgLeftRelative + (CONFIG.buttonHorizontalOffset * cubeWidth);

        actionsBlock.style.position = 'absolute';
        actionsBlock.style.top = `${row10TopPhysical}px`;
        actionsBlock.style.left = `${col1LeftPhysical}px`;
        actionsBlock.style.flexDirection = 'row'; 
        actionsBlock.style.gap = '10px'; 

        obstacles.length = 0;
        const staticRects = document.querySelectorAll('.intro-graphic-left rect, .intro-graphic-right rect');
        staticRects.forEach(rect => {
          const r = rect.getBoundingClientRect();
          obstacles.push({
            x: r.left - sectionBounds.left,
            y: r.top - sectionBounds.top,
            w: r.width,
            h: r.height
          });
        });

        // Удерживаем невылетевшие кубики строго на местах
        floatingCubesData.forEach(cube => {
          cube.w = cubeWidth; 
          cube.h = cubeHeight;
          
          if (!cube.moving && cube.el) {
            if (cube.grid === 'left') {
              cube.x = leftSvgLeftRelative + cube.relX * cubeWidth;
              cube.y = leftSvgTopRelative + cube.relY * cubeHeight;
            } else if (cube.grid === 'right') {
              cube.x = rightSvgLeftRelative + cube.relX * cubeWidth;
              cube.y = rightSvgTopRelative + cube.relY * cubeHeight;
            } else if (cube.grid === 'dynamic-button') {
              const actionsBounds = actionsBlock.getBoundingClientRect();
              cube.x = actionsBounds.left - sectionBounds.left + actionsBounds.width;
              cube.y = actionsBounds.top - sectionBounds.top + actionsBounds.height;
            }
            cube.el.style.transform = `translate(${cube.x}px, ${cube.y}px)`;
          }
        });
      }

      window.addEventListener('resize', synchronizeEverything);
      synchronizeEverything();

      // Базовое мерцание статики
      const staticCubes = document.querySelectorAll('.anim-square');
      staticCubes.forEach(cube => {
        const randomDelay = Math.random() * 1.8;
        cube.style.transitionDelay = `${randomDelay}s`;
        setTimeout(() => { cube.classList.add('visible'); }, 50);
      });

      // Функция инициализации плавающих элементов
      function initFloatingCubes() {
        const w = window.innerWidth;
        const allowedCount = w <= 768 ? 3 : 4; 

        for (let i = 0; i < allowedCount; i++) {
          const cube = floatingCubesData[i];
          
          const el = document.createElement('div');
          el.className = 'floating-cube';
          
          const imgEl = document.createElement('div');
          imgEl.className = 'floating-cube-inner-img';
          imgEl.style.transition = `opacity ${USER_OPTIONS.imageFadeDuration} ease-in-out`;
          
          el.appendChild(imgEl);
          section.appendChild(el);
          
          cube.el = el;
          cube.imgEl = imgEl;

          synchronizeEverything();

          const baseDelay = 500 + (i * USER_OPTIONS.spawnInterval);

          setTimeout(() => {
            el.classList.add('visible');

            setTimeout(() => {
              imgEl.style.backgroundImage = `url('${cubeImages[i]}')`;
              imgEl.style.opacity = '1';

              setTimeout(() => {
                let speedRange = USER_OPTIONS.speedMax - USER_OPTIONS.speedMin;
                let randomSpeedX = USER_OPTIONS.speedMin + Math.random() * speedRange;
                let randomSpeedY = USER_OPTIONS.speedMin + Math.random() * speedRange;
                
                if (window.innerWidth <= 768) {
                  randomSpeedX *= USER_OPTIONS.mobileSpeedMultiplier;
                  randomSpeedY *= USER_OPTIONS.mobileSpeedMultiplier;
                }

                cube.vx = (Math.random() > 0.5 ? 1 : -1) * randomSpeedX;
                cube.vy = (Math.random() > 0.5 ? 1 : -1) * randomSpeedY;
                
                cube.moving = true;
                cube.active = true;
              }, USER_OPTIONS.moveStartInterval);

            }, USER_OPTIONS.imageFadeInterval);

          }, baseDelay);
        }
      }

      function enforceAngleScatter(cube) {
        let sMin = USER_OPTIONS.speedMin;
        let sMax = USER_OPTIONS.speedMax;
        if (window.innerWidth <= 768) {
          sMin *= USER_OPTIONS.mobileSpeedMultiplier;
          sMax *= USER_OPTIONS.mobileSpeedMultiplier;
        }

        const sx = Math.sign(cube.vx) || 1;
        const sy = Math.sign(cube.vy) || 1;
        let ax = Math.abs(cube.vx);
        let ay = Math.abs(cube.vy);

        if (ax < sMin) ax = sMin;
        if (ax > sMax) ax = sMax;
        if (ay < sMin) ay = sMin;
        if (ay > sMax) ay = sMax;

        cube.vx = sx * ax;
        cube.vy = sy * ay;
      }

      // Физический движок перемещения
      function updatePhysics() {
        const sectionRect = section.getBoundingClientRect();
        const maxX = sectionRect.width;
        const maxY = sectionRect.height;

        const leftSvgBounds = leftSvg.getBoundingClientRect();
        const rightSvgBounds = rightSvg.getBoundingClientRect();
        const leftSvgLeftRelative = leftSvgBounds.left - sectionRect.left;
        const rightSvgLeftRelative = rightSvgBounds.left - sectionRect.left;
        const sizeConf = getSetting(CONFIG.cubeSizes, window.innerWidth);

        floatingCubesData.forEach(cube => {
          if (!cube.moving || !cube.active) return;

          // Отслеживание истории перемещения (Защита от тряски в углах)
          cube.posHistory.push({ x: cube.x, y: cube.y });
          if (cube.posHistory.length > 45) {
            const firstPos = cube.posHistory[0];
            cube.posHistory.shift();

            const deltaX = Math.abs(cube.x - firstPos.x);
            const deltaY = Math.abs(cube.y - firstPos.y);

            // Если кубик завис и дергается на пятачке менее 1 пикселя на протяжении 45 кадров
            if (deltaX < 1 && deltaY < 1 && !cube.isGhost) {
              // Импульсно выталкиваем его прямо к свободному центру экрана на 15 пикселей
              const dirCentX = (sectionRect.width / 2) - cube.x;
              const dirCentY = (sectionRect.height / 2) - cube.y;
              const distance = Math.sqrt(dirCentX * dirCentX + dirCentY * dirCentY) || 1;

              cube.x += (dirCentX / distance) * 15;
              cube.y += (dirCentY / distance) * 15;

              // Полностью хаотично перенаправляем его движение
              let speedRange = USER_OPTIONS.speedMax - USER_OPTIONS.speedMin;
              let randomSpeed = USER_OPTIONS.speedMin + Math.random() * speedRange;
              if (window.innerWidth <= 768) randomSpeed *= USER_OPTIONS.mobileSpeedMultiplier;

              cube.vx = (Math.random() > 0.5 ? 1 : -1) * randomSpeed;
              cube.vy = (Math.random() > 0.5 ? 1 : -1) * randomSpeed;
              cube.posHistory = [];
              return;
            }
          }

          // Внедрение раздельного перемещения осей
          // --- шаг 1: смещение по оси X ---
          cube.x += cube.vx;

          // Проверка границ экрана по X (срабатывает только если движется к стене)
          if (cube.x <= 0 && cube.vx < 0) { cube.x = 0; cube.vx *= -1; cube.vy += (Math.random() - 0.5) * 0.2; enforceAngleScatter(cube); }
          if (cube.x + cube.w >= maxX && cube.vx > 0) { cube.x = maxX - cube.w; cube.vx *= -1; cube.vy += (Math.random() - 0.5) * 0.2; enforceAngleScatter(cube); }

          // Проверка выхода из стартового Ghost Mode
          if (cube.isGhost) {
            if (cube.id === 1 || cube.id === 2) {
              if (cube.x > (leftSvgLeftRelative + sizeConf.cubeWidth * 3)) cube.isGhost = false;
            } else if (cube.id === 3) {
              const actionsBounds = actionsBlock.getBoundingClientRect();
              const startX = actionsBounds.left - sectionRect.left + actionsBounds.width;
              const startY = actionsBounds.top - sectionRect.top + actionsBounds.height;
              if (Math.abs(cube.x - startX) > cube.w || Math.abs(cube.y - startY) > cube.h) cube.isGhost = false;
            } else if (cube.id === 4) {
              if (cube.x < rightSvgLeftRelative) cube.isGhost = false;
            }
          }

          // Коллизия со статикой по оси X (виртуальное расширение на 4px блокирует пустые щели в 1 клетку)
          if (!cube.isGhost) {
            const virtualPadding = 4;
            let collidedX = false;

            obstacles.forEach(obs => {
              const cx = cube.x - virtualPadding;
              const cw = cube.w + virtualPadding * 2;
              const cy = cube.y - virtualPadding;
              const ch = cube.h + virtualPadding * 2;

              if (cx < obs.x + obs.w && cx + cw > obs.x && cy < obs.y + obs.h && cy + ch > obs.y) {
                // разрешаем столкновение только если вектор скорости направлен в сторону препятствия
                if (cube.vx > 0 && (cx + cw - cube.vx <= obs.x)) {
                  cube.x = obs.x - cube.w - virtualPadding;
                  collidedX = true;
                } else if (cube.vx < 0 && (cx - cube.vx >= obs.x + obs.w)) {
                  cube.x = obs.x + obs.w + virtualPadding;
                  collidedX = true;
                }
              }
            });

            if (collidedX) {
              cube.vx *= -1;
              cube.vy += (Math.random() - 0.5) * 0.2;
              enforceAngleScatter(cube);
            }
          }

          // --- шаг 2: смещение по оси Y ---
          cube.y += cube.vy;

          // Проверка границ экрана по Y
          if (cube.y <= 0 && cube.vy < 0) { cube.y = 0; cube.vy *= -1; cube.vx += (Math.random() - 0.5) * 0.2; enforceAngleScatter(cube); }
          if (cube.y + cube.h >= maxY && cube.vy > 0) { cube.y = maxY - cube.h; cube.vy *= -1; cube.vx += (Math.random() - 0.5) * 0.2; enforceAngleScatter(cube); }

          // Коллизия со статикой по оси Y
          if (!cube.isGhost) {
            const virtualPadding = 4;
            let collidedY = false;

            obstacles.forEach(obs => {
              const cx = cube.x - virtualPadding;
              const cw = cube.w + virtualPadding * 2;
              const cy = cube.y - virtualPadding;
              const ch = cube.h + virtualPadding * 2;

              if (cx < obs.x + obs.w && cx + cw > obs.x && cy < obs.y + obs.h && cy + ch > obs.y) {
                if (cube.vy > 0 && (cy + ch - cube.vy <= obs.y)) {
                  cube.y = obs.y - cube.h - virtualPadding;
                  collidedY = true;
                } else if (cube.vy < 0 && (cy - cube.vy >= obs.y + obs.h)) {
                  cube.y = obs.y + obs.h + virtualPadding;
                  collidedY = true;
                }
              }
            });

            if (collidedY) {
              cube.vy *= -1;
              cube.vx += (Math.random() - 0.5) * 0.2;
              enforceAngleScatter(cube);
            }
          }

          // Столкновение кубиков между собой (на чистом поле)
          if (!cube.isGhost) {
            floatingCubesData.forEach(other => {
              if (other === cube || !other.active || !other.moving || other.isGhost) return;

              if (cube.x < other.x + other.w && cube.x + cube.w > other.x &&
                  cube.y < other.y + other.h && cube.y + cube.h > other.y) {

                const tx = cube.vx;
                const ty = cube.vy;
                cube.vx = other.vx + (Math.random() - 0.5) * 0.15;
                cube.vy = other.vy + (Math.random() - 0.5) * 0.15;
                other.vx = tx + (Math.random() - 0.5) * 0.15;
                other.vy = ty + (Math.random() - 0.5) * 0.15;

                enforceAngleScatter(cube);
                enforceAngleScatter(other);

                const overlapX = Math.min(cube.x + cube.w - other.x, other.x + other.w - cube.x);
                const overlapY = Math.min(cube.y + cube.h - other.y, other.y + other.h - cube.y) || 1;

                if (overlapX < overlapY) {
                  if (cube.x < other.x) { cube.x -= overlapX / 2; other.x += overlapX / 2; }
                  else { cube.x += overlapX / 2; other.x -= overlapX / 2; }
                } else {
                  if (cube.y < other.y) { cube.y -= overlapY / 2; other.y += overlapY / 2; }
                  else { cube.y += overlapY / 2; other.y -= overlapY / 2; }
                }
              }
            });
          }

          cube.el.style.transform = `translate(${cube.x}px, ${cube.y}px)`;
        });

        requestAnimationFrame(updatePhysics);
      }

      setTimeout(() => {
        initFloatingCubes();
        requestAnimationFrame(updatePhysics);
      }, 600);

    });
}
intro();

