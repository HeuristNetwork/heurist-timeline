/**
 * @file TimelineToolbar.js
 * @brief Provides the toolbar UI for the timeline viewport and navigation commands.
 * @project     Heurist academic knowledge management system
 * @package     heurist-timeline
 * @link        https://HeuristNetwork.org
 * @copyright   (C) 2024 onwards Heurist Network
 * @author      Artem Osmakov   <osmakov@gmail.com>
 * @author      Ian Johnson <ian.johnson.heurist@gmail.com>
 * @license     https://www.gnu.org/licenses/gpl-3.0.txt GNU License 3.0
 * @since       8.0
 */

/**
 * Provides the floating toolbar used to control the display and viewport of the timeline.
 */
export class TimelineToolbar {
  /**
   * Constructs a toolbar wrapper for the supplied public API.
   *
   * @param {{ api: object, settings: object }} options - API handle and settings object.
   */
  constructor({ api, settings }) {
    this.api = api;
    this.settings = settings;
    this.element = null;
  }

  /**
   * Mounts the toolbar into the DOM before the timeline container.
   *
   * @param {HTMLElement} container - The main timeline container.
   */
  mount(container) {
    if (this.settings.showToolbar === false) return;

    const bar = document.createElement("div");
    bar.className = "heurist-timeline-toolbar";

    const buttons = [
      ["fa-magnifying-glass-plus", "Zoom in", () => this.api.zoomIn()],
      ["fa-magnifying-glass-minus", "Zoom out", () => this.api.zoomOut()],
      ["fa-arrows-left-right-to-line", "Zoom to all", () => this.api.zoomToAll()],
      ["fa-crosshairs", "Zoom to selection", () => this.api.zoomToSelection()],
      ["fa-backward-step", "Move to start", () => this.api.moveToStart()],
      ["fa-forward-step", "Move to end", () => this.api.moveToEnd()],
      ["fa-gear", "Timeline options", () => this._toggleOptions()],
    ];

    for (const [icon, title, handler] of buttons) {
      const button = document.createElement("button");
      button.type = "button";
      button.title = title;
      button.innerHTML = `<i class="fa-solid ${icon}"></i>`;
      button.addEventListener("click", handler);
      bar.appendChild(button);
    }

    container.parentElement?.insertBefore(bar, container);
    this.element = bar;
  }

  /**
   * Toggles the current label mode used by the timeline renderer.
   */
  _toggleOptions() {
    this.api.cycleLabelMode();
  }

  /**
   * Removes the toolbar from the DOM.
   */
  destroy() {
    this.element?.remove();
    this.element = null;
  }
}

