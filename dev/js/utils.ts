import dom from './DOM'
import React from "./React"

/**
 * - Подгружает скрипт на странице
 */
export const loadScript = async (src: string) => {
    return new Promise(resolve => {
        let script = document.createElement('script')
        script.onload = () => {
            resolve(true)
        }
        document.head.appendChild(script)
        script.src = src
    })
}

export const dispatchEvents = (el: HTMLElement, events: string, sets: CustomEventInit = {}) => {
    if (!el) return
    let eventInit: CustomEventInit = { bubbles: true, cancelable: true, ...sets }

    events.split(' ').forEach((ev) => {
        let customEvent = new CustomEvent(ev, eventInit)
        el.dispatchEvent(customEvent)
    })
}

export const callAfterTransition = (callback: Function, transitionEl: HTMLElement, waitForTransition = true) => {
    if (!waitForTransition) {
        callback()
        return
    }

    const durationPadding = 5
    const emulatedDuration = getTransitionDurationFromEl(transitionEl) + durationPadding

    let isCalled = false

    transitionEl.addEventListener('transitionend', handler)

    setTimeout(() => {
        if (!isCalled) {
            dispatchEvents(transitionEl, 'transitionend')
        }
    }, emulatedDuration)

    function handler({ target }) {
        if (target !== transitionEl) return

        isCalled = true
        transitionEl.removeEventListener('transitionend', handler)
        callback()
    }
}

export const getTransitionDurationFromEl = (el: HTMLElement) => {
    if (!el) return 0

    let { transitionDuration, transitionDelay } = window.getComputedStyle(el)

    const floatTransitionDuration = Number.parseFloat(transitionDuration)
    const floatTransitionDelay = Number.parseFloat(transitionDelay)

    if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0
    }

    // Личилка, если задано несколько transition-duration
    transitionDuration = transitionDuration.split(',')[0]
    transitionDelay = transitionDelay.split(',')[0]

    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * 1000
}

export const callCustomEvent = (events = {}, evName: string, ...args) => {
    if (!events[evName]) return
    events[evName].call(this, ...args)
}

// Ресетит анимацию
// https://www.harrytheo.com/blog/2021/02/restart-a-css-animation-with-javascript/
export const reflow = (el: HTMLElement) => {
    el.offsetHeight
}

export const execute = (callback: Function, ...args: any[]) => {
    if (typeof callback === 'function') {
        callback(...args)
    }
}

export const setCompensateForScrollbar = () => {
    document.body.classList.add('compensate-for-scrollbar')
}

export const removeCompensateForScrollbar = () => {
    document.body.classList.remove('compensate-for-scrollbar')
}

export const toggleCompensateForScrollbar = (condition?: boolean) => {
    document.body.classList.toggle('compensate-for-scrollbar', condition)
}

export const getCookie = (key: string) => {
    let formatedKey = key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/, '\\$1')
    let reg = new RegExp(`(?:^|; )${formatedKey}=([^;]*)`)
    let matches = document.cookie.match(reg)
    return matches ? decodeURIComponent(matches[1]) : false
}

export const setCookie = (key: string, value: string, options?: any) => {
    let result = encodeURIComponent(key) + '=' + encodeURIComponent(value)

    options = { path: '/', ...options }
    options.expires = options.expires instanceof Date ? options.expires.toUTCString() : options.expires

    Object.keys(options).forEach((optKey) => {
        let optVal = options[optKey]
        result += `; ${optKey}`
        result += !optVal ? `= ${optVal}` : ''
    })

    document.cookie = result
}

export const wrapElement = <K extends keyof HTMLElementTagNameMap>(el: HTMLElement, tag: K, settings = {}) => {
    const wrap = React.createElement(tag, settings) as HTMLElement
    el.parentNode.insertBefore(wrap, el)
    wrap.append(el)
    return wrap
}


/**
 * - Проверяет ести ли элемент с селектором selector в событии e
 */
export const inEvent = (e: MouseEvent, selector: string): boolean => {
    let path = e.composedPath()

    let total = path.length
    let i: number

    for (i = 0; i < total; i++) {
        // @ts-ignore
        if (path[i] && path[i].tagName && path[i].matches(selector)) {
            return true
        }
    }

    return false
}


export const sleep = async (time: number) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, time);
    })
}


export const isInViewport = (item: HTMLElement, margin = 0) => {
    let top = item.getBoundingClientRect().top;

    if (top > window.innerHeight - margin) {
        return false;
    }

    if ((top < 0) && (Math.abs(top) > item.offsetHeight)) {
        return false;
    }

    return true;
}