window.onload = function() {

    document.addEventListener('Swiped-left', function(e) {
        e.target.innerHTML = e.type;
    });

    document.addEventListener('Swiped-right', function(e) {
        e.target.innerHTML = e.type;
    });

    document.addEventListener('Swiped-up', function(e) {
        e.target.innerHTML = e.type;
    });

    document.addEventListener('Swiped-down', function(e) {
        e.target.innerHTML = e.type;
    });

}

(function (window, document) {
    'use strict';
    if ('initCustomEvent' in document.createEvent('CustomEvent')) {
        window.CustomEvent = function (event, params) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            const evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        };
        window.CustomEvent.prototype = window.Event.prototype;
    }

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener('touchend', handleTouchEnd, false);

    let xDown = null;
    let yDown = null;
    let xDiff = null;
    let yDiff = null;
    let timeDown = null;
    let startEl = null;

    function handleTouchEnd(e) {
        if (startEl !== e.target) return;
        let swipeThreshold = parseInt(startEl.getAttribute('data-swipe-threshold') || '20', 10);    // default 10px
        let swipeTimeout = parseInt(startEl.getAttribute('data-swipe-timeout') || '500', 10);      // default 1000ms
        let timeDiff = Date.now() - timeDown;
        let eventType = '';
        if (Math.abs(xDiff) > Math.abs(yDiff)) { // most significant
            if (Math.abs(xDiff) > swipeThreshold && timeDiff < swipeTimeout) {
                if (xDiff > 0) {
                    eventType = 'Swiped-left';
                }
                else {
                    eventType = 'Swiped-right';
                }
            }
        }
        else {
            if (Math.abs(yDiff) > swipeThreshold && timeDiff < swipeTimeout) {
                if (yDiff > 0) {
                    eventType = 'Swiped-up';
                }
                else {
                    eventType = 'Swiped-down';
                }
            }
        }
        if (eventType !== '') {
            startEl.dispatchEvent(new CustomEvent(eventType, { bubbles: true, cancelable: true }));
        }
        xDown = null;
        yDown = null;
        timeDown = null;
    }

    function handleTouchStart(e) {
        if (e.target.getAttribute('data-swipe-ignore') === 'true') return;
        startEl = e.target;
        timeDown = Date.now();
        xDown = e.touches[0].clientX;
        yDown = e.touches[0].clientY;
        xDiff = 0;
        yDiff = 0;
    }

    function handleTouchMove(e) {
        if (!xDown || !yDown) return;
        let xUp = e.touches[0].clientX;
        let yUp = e.touches[0].clientY;
        xDiff = xDown - xUp;
        yDiff = yDown - yUp;
    }

}(window, document));
