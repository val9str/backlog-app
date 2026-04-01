document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page");
  const navButtons = document.querySelectorAll(".nav-btn");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page;

      pages.forEach(p => p.style.display = "none");
      document.getElementById(`page-${page}`).style.display = "block";

      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
});

