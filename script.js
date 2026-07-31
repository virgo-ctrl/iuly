document.addEventListener('DOMContentLoaded', () => {
  // 1. COUNTDOWN TIMER (14m 52s)
  initCountdownTimer();

  // 2. FAQ ACCORDION (SINGLE OPEN)
  initFaqAccordion();

  // 3. STICKY BOTTOM BAR ON SCROLL
  initStickyBar();

  // 4. QUALIFICATION MODAL & CHECKOUT REDIRECT
  initQualificationModal();

  // 5. 3D CARD DECK CAROUSEL (BARALHO DE MÓDULOS - IMAGENS COMPLETAS)
  initDeckCarousel();
});

/* Countdown Timer */
function initCountdownTimer() {
  const timerElement = document.getElementById('timer-count');
  if (!timerElement) return;

  let totalSeconds = 14 * 60 + 52; // 14m 52s

  const interval = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(interval);
      timerElement.textContent = "00:00";
      return;
    }

    totalSeconds--;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    timerElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
  }, 1000);
}

/* FAQ Accordion */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other accordion items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* Sticky Bottom Bar */
function initStickyBar() {
  const stickyBar = document.getElementById('sticky-bar');
  if (!stickyBar) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 600) {
      stickyBar.classList.add('visible');
    } else {
      stickyBar.classList.remove('visible');
    }
  }, { passive: true });
}

/* Qualification Modal & Hubla Checkout Link */
function initQualificationModal() {
  const modal = document.getElementById('qualify-modal');
  const openBtns = document.querySelectorAll('.open-modal-btn');
  const closeBtn = document.getElementById('close-modal');
  const form = document.getElementById('qualify-form');

  const CHECKOUT_URL = "https://pay.hub.la/Tvap7CYGVwoqxXPiv1IM";

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (typeof fbq === 'function') {
      fbq('track', 'ViewContent', {
        content_name: 'Recomeço Pós-Parto 30 Dias',
        content_category: 'Curso',
        currency: 'BRL',
        value: 97.00
      });
    }
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const moment = document.getElementById('user-moment')?.value || '';
      const clearance = document.querySelector('input[name="medical_clearance"]:checked')?.value || '';

      const finalUrl = `${CHECKOUT_URL}?utm_source=landing_page&momento=${encodeURIComponent(moment)}&liberacao=${encodeURIComponent(clearance)}`;

      if (typeof fbq === 'function') {
        fbq('track', 'InitiateCheckout', {
          content_name: 'Recomeço Pós-Parto 30 Dias',
          content_category: 'Curso',
          num_items: 1,
          currency: 'BRL',
          value: 97.00
        });
      }

      window.location.href = finalUrl;
    });
  }
}

/* 3D CARD DECK CAROUSEL LOGIC WITH UNCUT IMAGES & ACTIVE TEXT PANEL */
function initDeckCarousel() {
  const cards = document.querySelectorAll('.deck-card');
  const dots = document.querySelectorAll('.deck-dot');
  const prevBtn = document.getElementById('deck-prev');
  const nextBtn = document.getElementById('deck-next');
  const container = document.getElementById('cards-deck');

  const activeNumEl = document.getElementById('active-module-num');
  const activeTitleEl = document.getElementById('active-module-title');
  const activeDescEl = document.getElementById('active-module-desc');
  
  if (!cards.length || !container) return;

  const modulesData = [
    {
      num: "Módulo 01",
      title: "RESPIRAÇÃO CONSCIENTE",
      desc: "O ponto de partida que quase todo mundo pula. Aqui você reconecta diafragma e assoalho pélvico, que trabalham juntos como um sistema. Sem isso, nenhum exercício de abdômen funciona de verdade."
    },
    {
      num: "Módulo 02",
      title: "ATIVAÇÃO DO ABDÔMEN",
      desc: "O transverso do abdômen é o músculo que funciona como uma cinta natural. É ele que sustenta e aproxima. Nesta aula você aprende a encontrar, ativar e sustentar essa musculatura de forma correta."
    },
    {
      num: "Módulo 03",
      title: "FORTALECIMENTO PÉLVICO",
      desc: "Aqui a gente trata da região que sustenta bexiga, útero e intestino. É o trabalho que atua diretamente sobre o escape de urina, a sensação de peso na região íntima e o desconforto na relação."
    },
    {
      num: "Módulo 04",
      title: "MOVIMENTOS FUNCIONAIS",
      desc: "Levantar o bebê, sentar pra amamentar, empurrar o carrinho, sair da cama. Esta aula transfere tudo que você construiu para os movimentos que você faz cinquenta vezes por dia."
    },
    {
      num: "Módulo 05",
      title: "GUIAS & MATERIAIS DE APOIO",
      desc: "Materiais orientativos em PDF para acompanhar seus hábitos diários, postura no cuidado com o recém-nascido e guias de acompanhamento da evolução."
    },
    {
      num: "Módulo 06",
      title: "EVOLUÇÃO PÓS-30 DIAS",
      desc: "Direcionamento prático para manter os ganhos de tônus e fortalecimento pélvico nos meses seguintes, preparando seu corpo com segurança para novas etapas de treino."
    }
  ];

  let currentIndex = 0;
  const totalCards = cards.length;

  function updateDeck() {
    cards.forEach((card, i) => {
      let diff = i - currentIndex;

      // Circular wrap around
      if (diff > totalCards / 2) diff -= totalCards;
      if (diff < -totalCards / 2) diff += totalCards;

      card.className = 'deck-card';
      if (diff === 0) {
        card.classList.add('pos-0');
      } else if (diff === 1) {
        card.classList.add('pos-1');
      } else if (diff === -1) {
        card.classList.add('pos--1');
      } else if (diff === 2) {
        card.classList.add('pos-2');
      } else if (diff === -2) {
        card.classList.add('pos--2');
      } else {
        card.classList.add('pos-hidden');
      }
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });

    // Update active module text panel below deck
    if (activeNumEl && activeTitleEl && activeDescEl) {
      const activeData = modulesData[currentIndex];
      activeNumEl.textContent = `${activeData.num} • (${currentIndex + 1} de ${totalCards})`;
      activeTitleEl.textContent = activeData.title;
      activeDescEl.textContent = activeData.desc;
    }
  }

  function nextCard() {
    currentIndex = (currentIndex + 1) % totalCards;
    updateDeck();
  }

  function prevCard() {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    updateDeck();
  }

  if (nextBtn) nextBtn.addEventListener('click', nextCard);
  if (prevBtn) prevBtn.addEventListener('click', prevCard);

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      currentIndex = idx;
      updateDeck();
    });
  });

  // Mouse & Touch Dragging Swipe
  let startX = 0;
  let isDragging = false;

  function handleStart(x) {
    startX = x;
    isDragging = true;
  }

  function handleEnd(x) {
    if (!isDragging) return;
    isDragging = false;
    const diffX = x - startX;
    if (diffX < -35) {
      nextCard();
    } else if (diffX > 35) {
      prevCard();
    }
  }

  container.addEventListener('mousedown', (e) => handleStart(e.clientX));
  container.addEventListener('mouseup', (e) => handleEnd(e.clientX));
  container.addEventListener('mouseleave', (e) => {
    if (isDragging) handleEnd(e.clientX);
  });

  container.addEventListener('touchstart', (e) => handleStart(e.touches[0].clientX), { passive: true });
  container.addEventListener('touchend', (e) => handleEnd(e.changedTouches[0].clientX), { passive: true });

  // Initial setup
  updateDeck();
}
