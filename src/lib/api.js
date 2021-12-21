import _shared from "./shared";

function setupDOM(handler) {
    if (!handler.ptrElement) {
        const ptr = document.createElement("div");

        if (handler.mainElement !== document.body) {
            handler.mainElement.parentNode.insertBefore(ptr, handler.mainElement);
        } else {
            document.body.insertBefore(ptr, document.body.firstChild);
        }

        ptr.classList.add(`${handler.classPrefix}ptr`);
        ptr.innerHTML = handler.getMarkup().replace(/__PREFIX__/g, handler.classPrefix);

        handler.ptrElement = ptr;

        if (typeof handler.onInit === "function") {
            handler.onInit(handler);
        }

        // Add the css styles to the style node, and then
        // insert it into the dom
        if (!_shared.styleEl) {
            _shared.styleEl = document.createElement("style");
            _shared.styleEl.setAttribute("id", "pull-to-refresh-js-style");

            document.head.appendChild(_shared.styleEl);
        }

        _shared.styleEl.textContent = handler
            .getStyles()
            .replace(/__PREFIX__/g, handler.classPrefix)
            .replace(/\s+/g, " ");
    }

    return handler;
}

function onReset(handler) {
    if (!handler.ptrElement) return;

    handler.ptrElement.classList.remove(`${handler.classPrefix}refresh`);
    handler.ptrElement.style[handler.cssProp] = "0px";

    setTimeout(() => {
        // remove previous ptr-element from DOM
        if (handler.ptrElement && handler.ptrElement.parentNode) {
            handler.ptrElement.parentNode.removeChild(handler.ptrElement);
            handler.ptrElement = null;
        }

        // reset state
        _shared.state = "pending";
    }, handler.refreshTimeout);
}

function update(handler) {
    const iconEl = handler.ptrElement.querySelector(`.${handler.classPrefix}icon`);

    const loadingElement =
        "<path d='M10 3.70968C9.45164 3.70968 9.03229 3.29032 9.03229 2.74194V0.967742C9.03229 0.419355 9.45164 0 10 0C10.5484 0 10.9678 0.419355 10.9678 0.967742V2.74194C10.9678 3.25806 10.5484 3.70968 10 3.70968Z' fill='#FF8049' fill-opacity='0.22'/><path d='M10 20C9.45164 20 9.03229 19.5806 9.03229 19.0322V17.258C9.03229 16.7096 9.45164 16.2903 10 16.2903C10.5484 16.2903 10.9678 16.7096 10.9678 17.258V19.0322C10.9678 19.5806 10.5484 20 10 20Z' fill='#FF8049' fill-opacity='0.8'/><path d='M6.35481 4.67743C6.03223 4.67743 5.70965 4.51614 5.5161 4.19356L4.64513 2.67743C4.38707 2.22582 4.54836 1.61291 4.99997 1.35485C5.45159 1.09679 6.06449 1.25808 6.32255 1.70969L7.19352 3.22582C7.45159 3.67743 7.2903 4.29033 6.83868 4.5484C6.70965 4.61292 6.5161 4.67743 6.35481 4.67743Z' fill='#FF8049' fill-opacity='0.14'/><path d='M14.5161 18.7741C14.1935 18.7741 13.871 18.6128 13.6774 18.2902L12.8064 16.7741C12.5484 16.3225 12.7097 15.7096 13.1613 15.4515C13.6129 15.1935 14.2258 15.3548 14.4839 15.8064L15.3548 17.3225C15.6129 17.7741 15.4516 18.387 15 18.6451C14.8387 18.7419 14.6774 18.7741 14.5161 18.7741Z' fill='#FF8049' fill-opacity='0.7'/><path d='M3.70969 7.32256C3.5484 7.32256 3.38711 7.2903 3.22582 7.19352L1.70969 6.32256C1.25808 6.06449 1.09679 5.45159 1.35485 4.99997C1.61291 4.54836 2.22582 4.38707 2.67743 4.64513L4.19356 5.5161C4.64517 5.77417 4.80646 6.38707 4.5484 6.83868C4.35485 7.16127 4.03227 7.32256 3.70969 7.32256Z' fill='#FF8049' fill-opacity='0.08'/><path d='M17.8387 15.4839C17.6775 15.4839 17.5162 15.4517 17.3549 15.3549L15.8065 14.4839C15.3549 14.2259 15.1936 13.613 15.4517 13.1613C15.7097 12.7097 16.3226 12.5484 16.7742 12.8065L18.2904 13.6775C18.742 13.9355 18.9033 14.5484 18.6452 15.0001C18.4839 15.3226 18.1613 15.4839 17.8387 15.4839Z' fill='#FF8049' fill-opacity='0.6'/><path d='M2.74194 10.9677H0.967742C0.419355 10.9677 0 10.5484 0 9.99997C0 9.45158 0.419355 9.03223 0.967742 9.03223H2.74194C3.29032 9.03223 3.70968 9.45158 3.70968 9.99997C3.70968 10.5484 3.25806 10.9677 2.74194 10.9677Z' fill='#FF8049' fill-opacity='0.05'/><path d='M19.0322 10.9677H17.258C16.7096 10.9677 16.2903 10.5484 16.2903 9.99997C16.2903 9.45158 16.7096 9.03223 17.258 9.03223H19.0322C19.5806 9.03223 20 9.45158 20 9.99997C20 10.5484 19.5806 10.9677 19.0322 10.9677Z' fill='#FF8049' fill-opacity='0.5'/><path d='M2.16133 15.4839C1.83875 15.4839 1.51617 15.3226 1.32262 15.0001C1.06456 14.5484 1.22585 13.9355 1.67746 13.6775L3.19359 12.8065C3.6452 12.5484 4.25811 12.7097 4.51617 13.1613C4.77424 13.613 4.61295 14.2259 4.16133 14.4839L2.6452 15.3549C2.51617 15.4517 2.35488 15.4839 2.16133 15.4839Z' fill='#FF8049'/><path d='M16.2904 7.32256C15.9678 7.32256 15.6452 7.16127 15.4517 6.83868C15.1936 6.38707 15.3549 5.77417 15.8065 5.5161L17.3226 4.64513C17.7742 4.38707 18.3871 4.54836 18.6452 4.99997C18.9033 5.45159 18.742 6.06449 18.2904 6.32256L16.7742 7.19352C16.6129 7.2903 16.4516 7.32256 16.2904 7.32256Z' fill='#FF8049' fill-opacity='0.4'/><path d='M5.48384 18.7741C5.32255 18.7741 5.16126 18.7419 4.99997 18.6451C4.54836 18.387 4.38707 17.7741 4.64513 17.3225L5.5161 15.8064C5.77417 15.3548 6.38707 15.1935 6.83868 15.4515C7.2903 15.7096 7.45159 16.3225 7.19352 16.7741L6.32255 18.2902C6.129 18.6128 5.80642 18.7741 5.48384 18.7741Z' fill='#FF8049' fill-opacity='0.9'/><path d='M13.6452 4.67743C13.4839 4.67743 13.3226 4.64517 13.1613 4.5484C12.7097 4.29033 12.5484 3.67743 12.8064 3.22582L13.6774 1.70969C13.9355 1.25808 14.5484 1.09679 15 1.35485C15.4516 1.61291 15.6129 2.22582 15.3548 2.67743L14.4839 4.19356C14.2903 4.48388 13.9677 4.67743 13.6452 4.67743Z' fill='#FF8049' fill-opacity='0.3'/>";

    if (iconEl) {
        if (_shared.state === "refreshing") {
            iconEl.innerHTML =
                "<div style='margin: 0 auto; text-align: center'><svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none' style='margin: auto'>" +
                loadingElement +
                "</svg></div>";
        }
    }
}

export default {
    setupDOM,
    onReset,
    update,
};
