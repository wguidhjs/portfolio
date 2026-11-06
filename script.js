const root = document.documentElement;
const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");
const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");
const modal = document.querySelector(".project-modal");
const modalPanel = document.querySelector(".modal__panel");
const modalVisual = document.querySelector(".modal__visual");
const projectCount = document.querySelector(".filters__count b");

const projectData = {
  echo: {
    title: "Echo",
    category: "Experimental / 2026",
    year: "Hong Kong",
    description:
      "Echo 是一件把城市声音转化为动态星图的互动装置。我们从街区、市场和交通节点采集声音，让观众能用视觉语言“听见”一座城市在一天中的情绪变化。",
    role: "Creative direction",
    focus: "Sound, data & space",
    outcome: "3,000+ interactions",
  },
  atelier: {
    title: "Atelier 24",
    category: "Product / 2025",
    year: "0 → 1",
    description:
      "Atelier 24 是为独立创作者打造的轻量日程工具。它不要求用户把一天切碎，而是通过“注意力块”和灵感捕捉，帮助人们找到属于自己的工作节奏。",
    role: "Product design",
    focus: "iOS & design system",
    outcome: "12k+ early users",
  },
  nori: {
    title: "Nori",
    category: "Brand experience / 2025",
    year: "Food & culture",
    description:
      "Nori 从一个简单的问题开始：我们能否用更透明、更有人情味的方式讲述食物？项目覆盖品牌策略、视觉识别与线上订购体验，让每一份餐食都能追溯到它的来处。",
    role: "Brand & digital",
    focus: "Identity & web",
    outcome: "Full rebrand",
  },
  frame: {
    title: "Frame",
    category: "Product / 2024",
    year: "Editorial",
    description:
      "Frame 是一个记录创意过程的编辑平台。除了最终结果，它更关心设计师如何提出问题、推翻自己，并在无数个小决定里找到答案。",
    role: "Design & code",
    focus: "Editorial system",
    outcome: "6 issues",
  },
};

function openMenu() {
  menuToggle.classList.add("is-open");
  mobileMenu.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "关闭菜单");
  mobileMenu.setAttribute("aria-hidden", "false");
  body.classList.add("is-locked");
}

function closeMenu() {
  menuToggle.classList.remove("is-open");
  mobileMenu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "打开菜单");
  mobileMenu.setAttribute("aria-hidden", "true");
  body.classList.remove("is-locked");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.classList.contains("is-open");
  isOpen ? closeMenu() : openMenu();
});

mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const type = filter.dataset.filter;
    filters.forEach((item) => item.classList.toggle("is-active", item === filter));

    let visible = 0;
    projects.forEach((project) => {
      const show = type === "all" || project.dataset.category === type;
      project.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });

    if (projectCount) projectCount.textContent = String(visible).padStart(2, "0");
  });
});

let lastFocusedProject = null;

function openProject(projectEl) {
  const data = projectData[projectEl.dataset.project];
  if (!data) return;

  lastFocusedProject = projectEl;
  modalVisual.dataset.project = projectEl.dataset.project;
  modal.querySelector(".modal__category").textContent = data.category;
  modal.querySelector(".modal__year").textContent = data.year;
  modal.querySelector("#modal-title").textContent = data.title;
  modal.querySelector(".modal__description").textContent = data.description;
  modal.querySelector(".modal__role").textContent = data.role;
  modal.querySelector(".modal__focus").textContent = data.focus;
  modal.querySelector(".modal__outcome").textContent = data.outcome;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  body.classList.add("is-locked");
  window.setTimeout(() => modal.querySelector(".modal__close").focus(), 60);
}

function closeProject() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  body.classList.remove("is-locked");
  lastFocusedProject?.focus();
}

projects.forEach((project) => {
  project.addEventListener("click", () => openProject(project));
  project.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProject(project);
    }
  });
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeProject);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (modal.classList.contains("is-open")) closeProject();
    if (mobileMenu.classList.contains("is-open")) closeMenu();
  }

  if (event.key === "Tab" && modal.classList.contains("is-open")) {
    const focusable = modal.querySelectorAll(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px" },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const cursor = document.querySelector(".cursor");
const canUseCursor = window.matchMedia("(pointer: fine)").matches;

if (cursor && canUseCursor) {
  let cursorX = 0;
  let cursorY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
  });

  function renderCursor() {
    cursorX += (targetX - cursorX) * 0.16;
    cursorY += (targetY - cursorY) * 0.16;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }

  renderCursor();

  projects.forEach((project) => {
    project.addEventListener("mouseenter", () => cursor.classList.add("is-view"));
    project.addEventListener("mouseleave", () => cursor.classList.remove("is-view"));
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (targetId === "#") return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Keep the active section name in the URL hash without hijacking scrolling.
const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible?.target.id && location.hash !== `#${visible.target.id}`) {
      history.replaceState(null, "", `#${visible.target.id}`);
    }
  },
  { threshold: 0.3 },
);

["work", "about", "experience", "contact"].forEach((id) => {
  const section = document.getElementById(id);
  if (section) sectionObserver.observe(section);
});

root.classList.add("js-ready");
