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
        "<g transform='rotate(0 50 50)'><rect x='47.5' y='24' rx='2.5' ry='6' width='5' height='12' fill='#1886f8'>repeatCount='indefinite'></animate></rect></g><g transform='rotate(30 50 50)'><rect x='47.5' y='24' rx='2.5' ry='6' width='5' height='12' fill='#1886f8'><animate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.8333333333333334s' repeatCount='indefinite'></animate></rect></g><g transform='rotate(60 50 50)'><rect x='47.5' y='24' rx='2.5' ry='6' width='5' height='12' fill='#1886f8'><animate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.75s' repeatCount='indefinite'></animate></rect></g><g transform='rotate(90 50 50)'><rect x='47.5' y='24' rx='2.5' ry='6' width='5' height='12' fill='#1886f8'><animate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.6666666666666666s' repeatCount='indefinite'></animate></rect></g><g transform='rotate(120 50 50)'><rect x='47.5' y='24' rx='2.5' ry='6' width='5' height='12' fill='#1886f8'><animate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.5833333333333334s' repeatCount='indefinite'></animate></rect></g><g transform='rotate(150 50 50)'><rect x='47.5' y='24' rx='2.5' ry='6' width='5' height='12' fill='#1886f8'><animate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.5s' repeatCount='indefinite'></animate></rect></g><g transform='rotate(180 50 50)'><rect x='47.5' y='24' rx='2.5' ry='6' width='5' height='12' fill='#1886f8'><animate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.4166666666666667s' repeatCount='indefinite'></animate></rect></g><g transform='rotate(210 50 50)'><rect x='47.5' y='24' rx='2.5' ry='6' width='5' height='12' fill='#1886f8'><animate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.3333333333333333s' repeatCount='indefinite'></animate>/rect></g><g transform='rotate(240 50 50)'><rect x='47.5' y='24' rx='2.5' ry='6' width='5' height='12' fill='#1886f8'><animate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.25s' repeatCount='indefinite'></animate></rect></g><g transform='rotate(270 50 50)'><rect x='47.5' y='24' rx='2.5' ry='6' width='5' height='12' fill='#1886f8'><animate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.16666666666666666s' repeatCount='indefinite'></animate></rect></g><g transform='rotate(300 50 50)'><rect x='47.5' y='24' rx='2.5' ry='6' width='5' height='12' fill='#1886f8'><animate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.08333333333333333s' repeatCount='indefinite'></animate></rect></g><g transform='rotate(330 50 50)'><rect x='47.5' y='24' rx='2.5' ry='6' width='5' height='12' fill='#1886f8'><animate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='0s' repeatCount='indefinite'></animate></rect></g>";

    if (iconEl) {
        if (_shared.state === "refreshing") {
            iconEl.innerHTML =
                "<div><svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' style='margin: auto; background: transparent; display: block; shape-rendering: auto;' width='50px' height='50px' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid'>" +
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
