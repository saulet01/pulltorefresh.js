var _shared = {
  pullStartY: null,
  pullMoveY: null,
  handlers: [],
  styleEl: null,
  events: null,
  dist: 0,
  state: 'pending',
  timeout: null,
  distResisted: 0,
  supportsPassive: false,
  supportsPointerEvents: typeof window !== 'undefined' && !!window.PointerEvent
};

try {
  window.addEventListener('test', null, {
    get passive() {
      // eslint-disable-line getter-return
      _shared.supportsPassive = true;
    }

  });
} catch (e) {// do nothing
}

function setupDOM(handler) {
  if (!handler.ptrElement) {
    var ptr = document.createElement("div");

    if (handler.mainElement !== document.body) {
      handler.mainElement.parentNode.insertBefore(ptr, handler.mainElement);
    } else {
      document.body.insertBefore(ptr, document.body.firstChild);
    }

    ptr.classList.add(((handler.classPrefix) + "ptr"));
    ptr.innerHTML = handler.getMarkup().replace(/__PREFIX__/g, handler.classPrefix);
    handler.ptrElement = ptr;

    if (typeof handler.onInit === "function") {
      handler.onInit(handler);
    } // Add the css styles to the style node, and then
    // insert it into the dom


    if (!_shared.styleEl) {
      _shared.styleEl = document.createElement("style");

      _shared.styleEl.setAttribute("id", "pull-to-refresh-js-style");

      document.head.appendChild(_shared.styleEl);
    }

    _shared.styleEl.textContent = handler.getStyles().replace(/__PREFIX__/g, handler.classPrefix).replace(/\s+/g, " ");
  }

  return handler;
}

function onReset(handler) {
  if (!handler.ptrElement) { return; }
  handler.ptrElement.classList.remove(((handler.classPrefix) + "refresh"));
  handler.ptrElement.style[handler.cssProp] = "0px";
  setTimeout(function () {
    // remove previous ptr-element from DOM
    if (handler.ptrElement && handler.ptrElement.parentNode) {
      handler.ptrElement.parentNode.removeChild(handler.ptrElement);
      handler.ptrElement = null;
    } // reset state


    _shared.state = "pending";
  }, handler.refreshTimeout);
}

function update(handler) {
  var iconEl = handler.ptrElement.querySelector(("." + (handler.classPrefix) + "icon"));
  var loadingElement = "<path d='M10 3.70968C9.45164 3.70968 9.03229 3.29032 9.03229 2.74194V0.967742C9.03229 0.419355 9.45164 0 10 0C10.5484 0 10.9678 0.419355 10.9678 0.967742V2.74194C10.9678 3.25806 10.5484 3.70968 10 3.70968Z' fill='#FF8049' fill-opacity='0.22'/><path d='M10 20C9.45164 20 9.03229 19.5806 9.03229 19.0322V17.258C9.03229 16.7096 9.45164 16.2903 10 16.2903C10.5484 16.2903 10.9678 16.7096 10.9678 17.258V19.0322C10.9678 19.5806 10.5484 20 10 20Z' fill='#FF8049' fill-opacity='0.8'/><path d='M6.35481 4.67743C6.03223 4.67743 5.70965 4.51614 5.5161 4.19356L4.64513 2.67743C4.38707 2.22582 4.54836 1.61291 4.99997 1.35485C5.45159 1.09679 6.06449 1.25808 6.32255 1.70969L7.19352 3.22582C7.45159 3.67743 7.2903 4.29033 6.83868 4.5484C6.70965 4.61292 6.5161 4.67743 6.35481 4.67743Z' fill='#FF8049' fill-opacity='0.14'/><path d='M14.5161 18.7741C14.1935 18.7741 13.871 18.6128 13.6774 18.2902L12.8064 16.7741C12.5484 16.3225 12.7097 15.7096 13.1613 15.4515C13.6129 15.1935 14.2258 15.3548 14.4839 15.8064L15.3548 17.3225C15.6129 17.7741 15.4516 18.387 15 18.6451C14.8387 18.7419 14.6774 18.7741 14.5161 18.7741Z' fill='#FF8049' fill-opacity='0.7'/><path d='M3.70969 7.32256C3.5484 7.32256 3.38711 7.2903 3.22582 7.19352L1.70969 6.32256C1.25808 6.06449 1.09679 5.45159 1.35485 4.99997C1.61291 4.54836 2.22582 4.38707 2.67743 4.64513L4.19356 5.5161C4.64517 5.77417 4.80646 6.38707 4.5484 6.83868C4.35485 7.16127 4.03227 7.32256 3.70969 7.32256Z' fill='#FF8049' fill-opacity='0.08'/><path d='M17.8387 15.4839C17.6775 15.4839 17.5162 15.4517 17.3549 15.3549L15.8065 14.4839C15.3549 14.2259 15.1936 13.613 15.4517 13.1613C15.7097 12.7097 16.3226 12.5484 16.7742 12.8065L18.2904 13.6775C18.742 13.9355 18.9033 14.5484 18.6452 15.0001C18.4839 15.3226 18.1613 15.4839 17.8387 15.4839Z' fill='#FF8049' fill-opacity='0.6'/><path d='M2.74194 10.9677H0.967742C0.419355 10.9677 0 10.5484 0 9.99997C0 9.45158 0.419355 9.03223 0.967742 9.03223H2.74194C3.29032 9.03223 3.70968 9.45158 3.70968 9.99997C3.70968 10.5484 3.25806 10.9677 2.74194 10.9677Z' fill='#FF8049' fill-opacity='0.05'/><path d='M19.0322 10.9677H17.258C16.7096 10.9677 16.2903 10.5484 16.2903 9.99997C16.2903 9.45158 16.7096 9.03223 17.258 9.03223H19.0322C19.5806 9.03223 20 9.45158 20 9.99997C20 10.5484 19.5806 10.9677 19.0322 10.9677Z' fill='#FF8049' fill-opacity='0.5'/><path d='M2.16133 15.4839C1.83875 15.4839 1.51617 15.3226 1.32262 15.0001C1.06456 14.5484 1.22585 13.9355 1.67746 13.6775L3.19359 12.8065C3.6452 12.5484 4.25811 12.7097 4.51617 13.1613C4.77424 13.613 4.61295 14.2259 4.16133 14.4839L2.6452 15.3549C2.51617 15.4517 2.35488 15.4839 2.16133 15.4839Z' fill='#FF8049'/><path d='M16.2904 7.32256C15.9678 7.32256 15.6452 7.16127 15.4517 6.83868C15.1936 6.38707 15.3549 5.77417 15.8065 5.5161L17.3226 4.64513C17.7742 4.38707 18.3871 4.54836 18.6452 4.99997C18.9033 5.45159 18.742 6.06449 18.2904 6.32256L16.7742 7.19352C16.6129 7.2903 16.4516 7.32256 16.2904 7.32256Z' fill='#FF8049' fill-opacity='0.4'/><path d='M5.48384 18.7741C5.32255 18.7741 5.16126 18.7419 4.99997 18.6451C4.54836 18.387 4.38707 17.7741 4.64513 17.3225L5.5161 15.8064C5.77417 15.3548 6.38707 15.1935 6.83868 15.4515C7.2903 15.7096 7.45159 16.3225 7.19352 16.7741L6.32255 18.2902C6.129 18.6128 5.80642 18.7741 5.48384 18.7741Z' fill='#FF8049' fill-opacity='0.9'/><path d='M13.6452 4.67743C13.4839 4.67743 13.3226 4.64517 13.1613 4.5484C12.7097 4.29033 12.5484 3.67743 12.8064 3.22582L13.6774 1.70969C13.9355 1.25808 14.5484 1.09679 15 1.35485C15.4516 1.61291 15.6129 2.22582 15.3548 2.67743L14.4839 4.19356C14.2903 4.48388 13.9677 4.67743 13.6452 4.67743Z' fill='#FF8049' fill-opacity='0.3'/>";

  if (iconEl) {
    if (_shared.state === "refreshing") {
      iconEl.innerHTML = "<div style='margin: 0 auto; text-align: center'><svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none' style='margin: auto'>" + loadingElement + "</svg></div>";
    }
  }
}

var _ptr = {
  setupDOM: setupDOM,
  onReset: onReset,
  update: update
};

var _timeout;

var screenY = function screenY(event) {
  if (_shared.pointerEventsEnabled && _shared.supportsPointerEvents) {
    return event.screenY;
  }

  return event.touches[0].screenY;
};

var _setupEvents = (function () {
  var _el;

  function _onTouchStart(e) {
    // here, we must pick a handler first, and then append their html/css on the DOM
    var target = _shared.handlers.filter(function (h) { return h.contains(e.target); })[0];

    _shared.enable = !!target;

    if (target && _shared.state === 'pending') {
      _el = _ptr.setupDOM(target);

      if (target.shouldPullToRefresh()) {
        _shared.pullStartY = screenY(e);
      }

      clearTimeout(_shared.timeout);

      _ptr.update(target);
    }
  }

  function _onTouchMove(e) {
    if (!(_el && _el.ptrElement && _shared.enable)) {
      return;
    }

    if (!_shared.pullStartY) {
      if (_el.shouldPullToRefresh()) {
        _shared.pullStartY = screenY(e);
      }
    } else {
      _shared.pullMoveY = screenY(e);
    }

    if (_shared.state === 'refreshing') {
      if (e.cancelable && _el.shouldPullToRefresh() && _shared.pullStartY < _shared.pullMoveY) {
        e.preventDefault();
      }

      return;
    }

    if (_shared.state === 'pending') {
      _el.ptrElement.classList.add(((_el.classPrefix) + "pull"));

      _shared.state = 'pulling';

      _ptr.update(_el);
    }

    if (_shared.pullStartY && _shared.pullMoveY) {
      _shared.dist = _shared.pullMoveY - _shared.pullStartY;
    }

    _shared.distExtra = _shared.dist - _el.distIgnore;

    if (_shared.distExtra > 0) {
      if (e.cancelable) {
        e.preventDefault();
      }

      _el.ptrElement.style[_el.cssProp] = (_shared.distResisted) + "px";
      _shared.distResisted = _el.resistanceFunction(_shared.distExtra / _el.distThreshold) * Math.min(_el.distMax, _shared.distExtra);

      if (_shared.state === 'pulling' && _shared.distResisted > _el.distThreshold) {
        _el.ptrElement.classList.add(((_el.classPrefix) + "release"));

        _shared.state = 'releasing';

        _ptr.update(_el);
      }

      if (_shared.state === 'releasing' && _shared.distResisted < _el.distThreshold) {
        _el.ptrElement.classList.remove(((_el.classPrefix) + "release"));

        _shared.state = 'pulling';

        _ptr.update(_el);
      }
    }
  }

  function _onTouchEnd() {
    if (!(_el && _el.ptrElement && _shared.enable)) {
      return;
    } // wait 1/2 sec before unmounting...


    clearTimeout(_timeout);
    _timeout = setTimeout(function () {
      if (_el && _el.ptrElement && _shared.state === 'pending') {
        _ptr.onReset(_el);
      }
    }, 500);

    if (_shared.state === 'releasing' && _shared.distResisted > _el.distThreshold) {
      _shared.state = 'refreshing';
      _el.ptrElement.style[_el.cssProp] = (_el.distReload) + "px";

      _el.ptrElement.classList.add(((_el.classPrefix) + "refresh"));

      _shared.timeout = setTimeout(function () {
        var retval = _el.onRefresh(function () { return _ptr.onReset(_el); });

        if (retval && typeof retval.then === 'function') {
          retval.then(function () { return _ptr.onReset(_el); });
        }

        if (!retval && !_el.onRefresh.length) {
          _ptr.onReset(_el);
        }
      }, _el.refreshTimeout);
    } else {
      if (_shared.state === 'refreshing') {
        return;
      }

      _el.ptrElement.style[_el.cssProp] = '0px';
      _shared.state = 'pending';
    }

    _ptr.update(_el);

    _el.ptrElement.classList.remove(((_el.classPrefix) + "release"));

    _el.ptrElement.classList.remove(((_el.classPrefix) + "pull"));

    _shared.pullStartY = _shared.pullMoveY = null;
    _shared.dist = _shared.distResisted = 0;
  }

  function _onScroll() {
    if (_el) {
      _el.mainElement.classList.toggle(((_el.classPrefix) + "top"), _el.shouldPullToRefresh());
    }
  }

  var _passiveSettings = _shared.supportsPassive ? {
    passive: _shared.passive || false
  } : undefined;

  if (_shared.pointerEventsEnabled && _shared.supportsPointerEvents) {
    window.addEventListener('pointerup', _onTouchEnd);
    window.addEventListener('pointerdown', _onTouchStart);
    window.addEventListener('pointermove', _onTouchMove, _passiveSettings);
  } else {
    window.addEventListener('touchend', _onTouchEnd);
    window.addEventListener('touchstart', _onTouchStart);
    window.addEventListener('touchmove', _onTouchMove, _passiveSettings);
  }

  window.addEventListener('scroll', _onScroll);
  return {
    onTouchEnd: _onTouchEnd,
    onTouchStart: _onTouchStart,
    onTouchMove: _onTouchMove,
    onScroll: _onScroll,

    destroy: function destroy() {
      if (_shared.pointerEventsEnabled && _shared.supportsPointerEvents) {
        window.removeEventListener('pointerdown', _onTouchStart);
        window.removeEventListener('pointerup', _onTouchEnd);
        window.removeEventListener('pointermove', _onTouchMove, _passiveSettings);
      } else {
        window.removeEventListener('touchstart', _onTouchStart);
        window.removeEventListener('touchend', _onTouchEnd);
        window.removeEventListener('touchmove', _onTouchMove, _passiveSettings);
      }

      window.removeEventListener('scroll', _onScroll);
    }

  };
});

var _ptrMarkup = "\n<div class=\"__PREFIX__box\">\n  <div class=\"__PREFIX__content\">\n    <div class=\"__PREFIX__icon\"></div>\n    <div class=\"__PREFIX__text\"></div>\n  </div>\n</div>\n";

var _ptrStyles = "\n.__PREFIX__ptr {\n  pointer-events: none;\n  font-size: 0.85em;\n  font-weight: bold;\n  top: 0;\n  height: 0;\n  transition: height 0.3s, min-height 0.3s;\n  text-align: center;\n  width: 100%;\n  overflow: hidden;\n  display: flex;\n  align-items: flex-end;\n  align-content: stretch;\n}\n\n.__PREFIX__box {\n  flex-basis: 100%;\n}\n\n.__PREFIX__pull {\n  transition: none;\n}\n\n/*\nWhen at the top of the page, disable vertical overscroll so passive touch\nlisteners can take over.\n*/\n.__PREFIX__top {\n  touch-action: pan-x pan-down pinch-zoom;\n}\n";

var _defaults = {
  distThreshold: 60,
  distMax: 80,
  distReload: 50,
  distIgnore: 0,
  mainElement: 'body',
  triggerElement: 'body',
  ptrElement: '.ptr',
  classPrefix: 'ptr--',
  cssProp: 'min-height',
  iconArrow: '&#8675;',
  iconRefreshing: '&hellip;',
  instructionsPullToRefresh: 'Pull down to refresh',
  instructionsReleaseToRefresh: 'Release to refresh',
  instructionsRefreshing: 'Refreshing',
  refreshTimeout: 500,
  getMarkup: function () { return _ptrMarkup; },
  getStyles: function () { return _ptrStyles; },
  onInit: function () {},
  onRefresh: function () { return location.reload(); },
  resistanceFunction: function (t) { return Math.min(1, t / 2.5); },
  shouldPullToRefresh: function () { return !window.scrollY; }
};

var _methods = ['mainElement', 'ptrElement', 'triggerElement'];
var _setupHandler = (function (options) {
  var _handler = {}; // merge options with defaults

  Object.keys(_defaults).forEach(function (key) {
    _handler[key] = options[key] || _defaults[key];
  }); // normalize timeout value, even if it is zero

  _handler.refreshTimeout = typeof options.refreshTimeout === 'number' ? options.refreshTimeout : _defaults.refreshTimeout; // normalize elements

  _methods.forEach(function (method) {
    if (typeof _handler[method] === 'string') {
      _handler[method] = document.querySelector(_handler[method]);
    }
  }); // attach events lazily


  if (!_shared.events) {
    _shared.events = _setupEvents();
  }

  _handler.contains = function (target) {
    return _handler.triggerElement.contains(target);
  };

  _handler.destroy = function () {
    // stop pending any pending callbacks
    clearTimeout(_shared.timeout); // remove handler from shared state

    var offset = _shared.handlers.indexOf(_handler);

    _shared.handlers.splice(offset, 1);
  };

  return _handler;
});

var index = {
  setPassiveMode: function setPassiveMode(isPassive) {
    _shared.passive = isPassive;
  },

  setPointerEventsMode: function setPointerEventsMode(isEnabled) {
    _shared.pointerEventsEnabled = isEnabled;
  },

  destroyAll: function destroyAll() {
    if (_shared.events) {
      _shared.events.destroy();

      _shared.events = null;
    }

    _shared.handlers.forEach(function (h) {
      h.destroy();
    });
  },

  init: function init(options) {
    if ( options === void 0 ) options = {};

    var handler = _setupHandler(options);

    _shared.handlers.push(handler);

    return handler;
  },

  // export utils for testing
  _: {
    setupHandler: _setupHandler,
    setupEvents: _setupEvents,
    setupDOM: _ptr.setupDOM,
    onReset: _ptr.onReset,
    update: _ptr.update
  }
};

export default index;
