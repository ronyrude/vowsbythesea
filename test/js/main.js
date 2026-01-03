document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filters__btn');
  const packages = document.querySelectorAll('.package');
  const scrollTopBtn = document.querySelector('.scroll-top');
  const counterEl = document.querySelector('.floating-counter__number');
  const testimonials = document.querySelectorAll('.testimonial-slider figure');

  const updateFilters = (filter) => {
    packages.forEach((card) => {
      const price = Number(card.dataset.price);
      const tier = card.dataset.tier;
      const popular = card.dataset.popular === 'true';
      let isVisible = true;

      switch (filter) {
        case 'under-1000':
          isVisible = price < 1000;
          break;
        case 'most-popular':
          isVisible = popular;
          break;
        case 'premium':
          isVisible = tier === 'premium' || tier === 'luxury';
          break;
        default:
          isVisible = true;
      }

      card.style.display = isVisible ? 'grid' : 'none';
      card.setAttribute('aria-hidden', String(!isVisible));
    });
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.remove('is-active'));
      btn.classList.add('is-active');
      updateFilters(btn.dataset.filter);
    });
  });

  updateFilters('all');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('is-visible');
      } else {
        scrollTopBtn.classList.remove('is-visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (counterEl) {
    const target = Number(counterEl.dataset.count || counterEl.textContent || '0');
    let current = 0;
    const increment = Math.ceil(target / 60);

    const animateCounter = () => {
      current += increment;
      if (current >= target) {
        counterEl.textContent = String(target);
        return;
      }
      counterEl.textContent = String(current);
      requestAnimationFrame(animateCounter);
    };

    requestAnimationFrame(animateCounter);
  }

  if (testimonials.length > 1) {
    let index = 0;

    const rotate = () => {
      testimonials.forEach((item, idx) => {
        item.style.display = idx === index ? 'block' : 'none';
      });
      index = (index + 1) % testimonials.length;
    };

    rotate();
    setInterval(rotate, 7000);
  }
});