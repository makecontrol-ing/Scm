const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");

// Adds a subtle visual change to the fixed header after scrolling.
function updateHeaderState() {
  if (window.scrollY > 16) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

function closeMobileMenu() {
  if (!navToggle || !siteNav) return;

  navToggle.classList.remove("is-active");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menú de navegación");
  siteNav.classList.remove("is-open");
}

if (navToggle && siteNav) {
  // Mobile navigation toggle.
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";

    navToggle.classList.toggle("is-active", !isOpen);
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navToggle.setAttribute(
      "aria-label",
      !isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
    );
    siteNav.classList.toggle("is-open", !isOpen);
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 980) {
      closeMobileMenu();
    }
  });
});

window.addEventListener("scroll", updateHeaderState);
window.addEventListener("load", updateHeaderState);
window.addEventListener("resize", () => {
  if (window.innerWidth >= 980) {
    closeMobileMenu();
  }
});

if ("IntersectionObserver" in window) {
  // Reveals sections as they enter the viewport.
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (contactForm) {
  // Keeps the form visual-only while giving a simple success interaction.
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector("button[type='submit']");

    if (submitButton) {
      const originalText = submitButton.textContent;
      submitButton.textContent = "Pronto te contactaremos";
      submitButton.disabled = true;

      window.setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        contactForm.reset();
      }, 1800);
    }
  });
}

// Lógica de Productos
document.addEventListener("DOMContentLoaded", () => {
  const productsGrid = document.getElementById("products-grid");
  if (!productsGrid) return; // Sólo ejecutar si existe el contenedor

  fetch("productos.json")
    .then(response => response.json())
    .then(productos => {
      productos.forEach((producto, index) => {
        // Crear elemento de tarjeta
        const article = document.createElement("article");
        article.className = "product-card reveal is-visible";
        article.style.animationDelay = `${index * 0.1}s`;

        // Generar URL pre-llenada de WhatsApp
        const phoneNumber = "573116192792";
        const wppMessage = encodeURIComponent(`Hola, me interesa comprar el producto: ${producto.nombre}`);
        const wppUrl = `https://wa.me/${phoneNumber}?text=${wppMessage}`;

        // Contenido HTML de la tarjeta
        article.innerHTML = `
          <div class="product-image-container">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image" loading="lazy">
            <span class="product-tag">${producto.etiqueta}</span>
          </div>
          <div class="product-info">
            <h3 class="product-title">${producto.nombre}</h3>
            <p class="product-desc">${producto.descripción}</p>
            <div class="product-footer">
              <span class="product-price">$${producto.valor}</span>
              <a href="${wppUrl}" target="_blank" rel="noreferrer" class="button button-primary buy-button">
                <i class="fa-brands fa-whatsapp"></i> Comprar
              </a>
            </div>
          </div>
        `;
        productsGrid.appendChild(article);
      });
    })
    .catch(error => console.error("Error al cargar los productos:", error));
});
