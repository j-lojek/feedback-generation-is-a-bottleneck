const themeButtons = Array.from(document.querySelectorAll("[data-theme-option]"));
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
const storageKey = "feedback-generation-theme";
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxBackdrop = document.querySelector(".lightbox-backdrop");
let activeFigureLink = null;

function storedTheme() {
  const value = localStorage.getItem(storageKey);
  return value === "dark" || value === "light" || value === "system" ? value : "system";
}

function applyTheme(choice) {
  const resolved = choice === "system" ? (mediaQuery.matches ? "dark" : "light") : choice;
  document.documentElement.dataset.theme = choice;
  document.documentElement.dataset.colorScheme = resolved;
  themeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeOption === choice));
  });
}

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const choice = button.dataset.themeOption;
    localStorage.setItem(storageKey, choice);
    applyTheme(choice);
  });
});

mediaQuery.addEventListener("change", () => {
  if (storedTheme() === "system") {
    applyTheme("system");
  }
});

document.querySelector(".brand")?.addEventListener("click", (event) => {
  event.preventDefault();
  history.replaceState(null, "", `${location.pathname}${location.search}`);
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
});

function openLightbox(link) {
  if (!lightbox || !lightboxImage || !lightboxTitle) return;
  const image = link.querySelector("img");
  const caption = link.closest("figure")?.querySelector("figcaption")?.textContent?.trim();
  activeFigureLink = link;
  lightboxImage.src = link.href;
  lightboxImage.alt = image?.alt || caption || "Expanded figure";
  lightboxTitle.textContent = caption || image?.alt || "Expanded figure";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  lightboxClose?.focus();
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  lightboxImage.removeAttribute("src");
  activeFigureLink?.focus();
  activeFigureLink = null;
}

document.querySelectorAll(".figure-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openLightbox(link);
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxBackdrop?.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox?.classList.contains("is-open")) {
    closeLightbox();
  }
});

applyTheme(storedTheme());
