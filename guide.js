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

const messages = document.documentElement.lang === "en" ? {
  readerCount: (total) => total === 1 ? "1 reader available" : `${total} readers available`,
  copied: "Copied",
  copySuccess: "Command copied to the clipboard.",
  selected: "Selected",
  copyFallback: "Command selected. Use Ctrl+C or the selection menu to copy it."
} : {
  readerCount: (total) => total === 1 ? "1 lector disponible" : `${total} lectores disponibles`,
  copied: "Copiado",
  copySuccess: "Comando copiado al portapapeles.",
  selected: "Seleccionado",
  copyFallback: "Comando seleccionado. Usa Ctrl+C o el menú de selección para copiarlo."
};

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
    resultStatus.textContent = messages.readerCount(total);
  });
});

const copyStatus = document.querySelector("#estado-copia");

document.querySelectorAll("[data-copy]").forEach((button) => {
  const command = document.getElementById(button.dataset.copy);
  const label = button.querySelector("span");
  const copyLabel = label.textContent;
  let resetLabel;

  button.hidden = false;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(command.textContent);
      label.textContent = messages.copied;
      copyStatus.textContent = messages.copySuccess;
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(command);
      selection.removeAllRanges();
      selection.addRange(range);
      label.textContent = messages.selected;
      copyStatus.textContent = messages.copyFallback;
    }
    clearTimeout(resetLabel);
    resetLabel = setTimeout(() => {
      label.textContent = copyLabel;
      copyStatus.textContent = "";
    }, 2500);
  });
});
