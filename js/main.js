const toCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const parseBillValue = (value) => {
  if (!value) return 0;
  let cleaned = value.replace(/[^\d.,-]/g, "");
  if (cleaned.includes(",") && cleaned.includes(".")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (cleaned.includes(",")) {
    cleaned = cleaned.replace(",", ".");
  }
  const parsed = Number.parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const setupSimulator = () => {
  const input = document.querySelector("#bill");
  const economyOutput = document.querySelector("[data-economy]");
  const cta = document.querySelector("[data-sim-cta]");

  if (!input || !economyOutput || !cta) return;

  const update = () => {
    const bill = parseBillValue(input.value);
    const economy = bill * 0.9;
    economyOutput.textContent = toCurrency.format(economy);

    const message = `Olá Izael, minha conta média é R$ ${bill.toFixed(2)}. Quero simular minha economia com energia solar.`;
    cta.href = `https://wa.me/5598988502292?text=${encodeURIComponent(message)}`;
  };

  input.addEventListener("input", update);
  update();
};

const setupCarousel = () => {
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector(".carousel__track");
  const slides = Array.from(carousel.querySelectorAll(".carousel__slide"));
  const prevButton = carousel.querySelector(".carousel__control--prev");
  const nextButton = carousel.querySelector(".carousel__control--next");

  if (!track || slides.length === 0) return;

  let index = 0;
  let intervalId = null;

  const update = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
  };

  const goNext = () => {
    index = (index + 1) % slides.length;
    update();
  };

  const goPrev = () => {
    index = (index - 1 + slides.length) % slides.length;
    update();
  };

  const startAutoplay = () => {
    intervalId = setInterval(goNext, 5000);
  };

  const stopAutoplay = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  prevButton?.addEventListener("click", () => {
    stopAutoplay();
    goPrev();
    startAutoplay();
  });

  nextButton?.addEventListener("click", () => {
    stopAutoplay();
    goNext();
    startAutoplay();
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);

  update();
  startAutoplay();
};

const setupReveal = () => {
  const elements = document.querySelectorAll(".reveal");
  if (elements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  elements.forEach((el) => observer.observe(el));
};

const setupMobileNav = () => {
  const toggle = document.querySelector(".topbar__toggle");
  const links = document.querySelectorAll(".topbar__nav a");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("is-nav-open");
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("is-nav-open");
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  setupMobileNav();
  setupSimulator();
  setupCarousel();
  setupReveal();
});
