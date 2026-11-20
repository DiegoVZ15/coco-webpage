// Agrega la dirección del repositorio público, por ejemplo https://github.com/usuario/CoCo.
const repositoryUrl = "";

if (repositoryUrl) {
  document.querySelectorAll("[data-repo]").forEach((link) => {
    link.href = repositoryUrl;
    if (link.dataset.repoLabel) link.textContent = link.dataset.repoLabel;
  });
}

// El menú se mantiene visible en pantallas grandes y cuando JavaScript está desactivado.
const menu = document.querySelector(".menu-button");
const nav = document.querySelector(".site-nav");
const narrowScreen = window.matchMedia("(max-width: 48rem)");

function setMenu(open) {
  menu.hidden = !narrowScreen.matches;
  nav.hidden = narrowScreen.matches && !open;
  menu.setAttribute("aria-expanded", String(open));
}

setMenu(false);
narrowScreen.addEventListener("change", () => setMenu(false));
menu.addEventListener("click", () => setMenu(nav.hidden));
nav.addEventListener("click", (event) => {
  if (narrowScreen.matches && event.target.closest("a")) {
    setMenu(false);
    menu.focus({ preventScroll: true });
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && narrowScreen.matches && !nav.hidden) {
    setMenu(false);
    menu.focus();
  }
});

const filters = document.querySelector(".filters");
const filterButtons = filters.querySelectorAll("button");
const readers = document.querySelectorAll(".reader-card");
const resultStatus = document.querySelector("#resultados");

filters.hidden = false;
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const platform = button.dataset.filter;
    let total = 0;
    filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    readers.forEach((reader) => {
      const visible = platform === "all" || reader.dataset.platform.split(" ").includes(platform);
      reader.hidden = !visible;
      if (visible) total++;
    });
    resultStatus.textContent = total === 1 ? "1 lector disponible" : `${total} lectores disponibles`;
  });
});

const copyStatus = document.querySelector("#estado-copia");

document.querySelectorAll("[data-copy]").forEach((button) => {
  const command = document.getElementById(button.dataset.copy);
  const label = button.querySelector("span");
  let resetLabel;

  button.hidden = false;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(command.textContent);
      label.textContent = "Copiado";
      copyStatus.textContent = "Comando copiado al portapapeles.";
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(command);
      selection.removeAllRanges();
      selection.addRange(range);
      label.textContent = "Seleccionado";
      copyStatus.textContent = "Comando seleccionado. Usa Ctrl+C o el menú de selección para copiarlo.";
    }
    clearTimeout(resetLabel);
    resetLabel = setTimeout(() => {
      label.textContent = "Copiar";
      copyStatus.textContent = "";
    }, 2500);
  });
});
