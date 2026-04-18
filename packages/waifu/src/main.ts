import { Rive, Layout, Fit, Alignment } from "@rive-app/canvas";
import { getCurrentWindow } from "@tauri-apps/api/window";

const RIVE_SRC = "https://cdn.rive.app/animations/vehicles.riv";

const canvas = document.getElementById("rive") as HTMLCanvasElement;
const menu = document.getElementById("menu") as HTMLUListElement;
const togglePin = document.getElementById("toggle-pin") as HTMLLIElement;
const quit = document.getElementById("quit") as HTMLLIElement;
const appWindow = getCurrentWindow();

const rive = new Rive({
  src: RIVE_SRC,
  canvas,
  autoplay: true,
  layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  onLoad: () => rive.resizeDrawingSurfaceToCanvas(),
});

window.addEventListener("resize", () => rive.resizeDrawingSurfaceToCanvas());

document.body.addEventListener("mousedown", async (e) => {
  if (e.button !== 0) return;
  if ((e.target as HTMLElement).closest("#menu")) return;
  hideMenu();
  await appWindow.startDragging();
});

document.body.addEventListener("contextmenu", async (e) => {
  e.preventDefault();
  togglePin.dataset.checked = String(await appWindow.isAlwaysOnTop());
  const pad = 4;
  const x = Math.min(e.clientX, window.innerWidth - menu.offsetWidth - pad);
  const y = Math.min(e.clientY, window.innerHeight - menu.offsetHeight - pad);
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.hidden = false;
});

togglePin.addEventListener("click", async () => {
  const next = togglePin.dataset.checked !== "true";
  await appWindow.setAlwaysOnTop(next);
  togglePin.dataset.checked = String(next);
  hideMenu();
});

quit.addEventListener("click", () => appWindow.close());

window.addEventListener("blur", hideMenu);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hideMenu();
});

function hideMenu() {
  menu.hidden = true;
}
