import type { HTMLAnyElement, CustomEventSets } from "./types";

const STORAGE = new Map();

const STORAGE_EVENTS = new Map();

STORAGE_EVENTS.set('beforeSet', new Map());
STORAGE_EVENTS.set('afterSet', new Map());
STORAGE_EVENTS.set('get', new Map());


export const setStorage = (el: HTMLAnyElement, key: any, value: any) => {
    if (!STORAGE.has(el)) {
        STORAGE.set(el, new Map());
    }

    execStorageEvents(el, 'beforeSet', key, value);
    STORAGE.get(el).set(key, value);
    execStorageEvents(el, 'afterSet', key, value);
}


export const getStorage = (el: HTMLAnyElement, key: any) => {
    if (!STORAGE.has(el)) {
        return null;
    }
    let val = STORAGE.get(el).get(key);
    execStorageEvents(el, 'get', key, val);
    return val;
}


export const onStorage = (el: HTMLAnyElement, e: 'beforeSet' | 'afterSet' | 'get', fn: (key: any, value?: any) => void) => {
    let storage = STORAGE_EVENTS.get(e);
    if (!storage.has(el)) {
        storage.set(el, []);
    }
    storage.get(el).push(fn);
}


const execStorageEvents = (el: HTMLAnyElement, e: 'beforeSet' | 'afterSet' | 'get', key: any, value: any) => {
    let storage = STORAGE_EVENTS.get(e);
    if (!storage.has(el)) {
        return;
    }
    storage.get(el).forEach(fn => fn(key, value));
}


export const addClass = (el: HTMLAnyElement, ...className: string[]) => {
    el.classList.add(...className);
}


export const removeClass = (el: HTMLAnyElement, ...className: string[]) => {
    el.classList.remove(...className);
}


export const hasClass = (el: HTMLAnyElement, className: string): boolean => {
    return el.classList.contains(className);
}


export const toggleClass = (el: HTMLAnyElement, ...className: string[]) => {
    className.forEach(name => el.classList.toggle(name, true));
}


export const next = (el: HTMLAnyElement): HTMLAnyElement | null => {
    let next = el.nextSibling;
    while (next && next.nodeType !== 1) {
        next = next.nextSibling;
    }
    return next as HTMLAnyElement | null;
}


export const prev = (el: HTMLAnyElement): HTMLAnyElement | null => {
    let prev = el.previousSibling;
    while (prev && prev.nodeType !== 1) {
        prev = prev.previousSibling;
    }
    return prev as HTMLAnyElement | null;
}


export const parent = (el: HTMLAnyElement): HTMLAnyElement => {
    return el.parentElement;
}


export const remove = (el: HTMLAnyElement) => {
    el.parentNode.removeChild(el);
}


export const attr = (el: HTMLAnyElement, attr?: string, value?: string) => {
    if (typeof value === 'undefined') {
        return el.getAttribute(attr);
    }
    el.setAttribute(attr, value);
}


export const html = (el: HTMLAnyElement, value?: string) => {
    if (typeof value === 'undefined') {
        return el.innerHTML;
    }
    el.innerHTML = value;
}


export const dispatch = (el: HTMLAnyElement, ev: string, sets?: CustomEventSets) => {
    let event = new CustomEvent(ev, {
        bubbles: true, cancelable: true, detail: undefined, ...sets
    });
    el.dispatchEvent(event);
}



export const closest = (el: HTMLAnyElement, selector: string, search?: NodeList): HTMLAnyElement | null => {
    let realSearch: NodeList;

    if (!search) {
        realSearch = document.querySelectorAll(selector);
    } else {
        realSearch = search;
    }

    let total = search.length;
    if (!total) return null;

    let parent = el.parentElement;

    while (!parent || !parent.tagName || !Array.prototype.includes.call(realSearch, parent)) {
        if (parent === null) {
            break;
        }
        parent = parent.parentElement;
    }

    return parent;
}



export const val = (el: HTMLInputElement, value?: string): string | boolean => {
    if (typeof value === 'undefined') {
        if (el.type === 'checkbox' || el.type === 'radio') {
            return el.checked;
        }
        return el.value;
    }
    if (el.type === 'checkbox' || el.type === 'radio') {
        el.checked = !!value;
        return;
    }
    el.value = value;
}


export const isFormField = (el: HTMLAnyElement): boolean => {
    return /^(?:input|select|textarea|button)$/i.test(el.nodeName);
}


/**
 * - Оптимизированно переберает массив
 */
export const each = (
    arr: any[] | NodeList | HTMLCollection,
    fn: (item: any, i: number, arr: any[] | NodeList | HTMLCollection) => void, breakOn?: number
) => {
    let total = arr.length;
    let i = 0;

    while (i < total) {
        fn(arr[i], i, arr);
        i++;
        if (i === breakOn) {
            break;
        }
    }
}


type AjaxParams = {
    url: string,
    data?: any,
    xhrEvents?: any,
    getXhr?: boolean,
    success?: (target: XMLHttpRequest, req: ProgressEvent) => void,
    error?: (target: XMLHttpRequest, req: ProgressEvent) => void,
    method?: string,
    headers?: any,
    xhrParams?: any
}

export const ajax = async ({ url, data, xhrEvents, getXhr, success, error, method, headers, xhrParams }: AjaxParams): Promise<XMLHttpRequest> => {
    return new Promise(async (resolve: any, reject) => {
        data = getRequestData(data);
        method = getRequestMethod(method, data);

        let xhr = new XMLHttpRequest;
        xhr.open(method, url, true);

        setRequestHeader(xhr, headers);

        if (xhrEvents) {
            for (let event in xhrEvents) {
                if (event === 'loadend') continue;
                xhr.addEventListener(event, xhrEvents[event]);
            }
        }

        xhr.addEventListener('loadend', (res: ProgressEvent) => {
            let target = res.target as XMLHttpRequest;
            if (target.status < 200 || target.status > 299) {
                error && error(target, res);
            } else {
                success && success(target, res);
                !getXhr && resolve(target, res);
            }
        });

        if (xhrParams) {
            for (let key in xhrParams) {
                xhr[key] = xhrParams[key];
            }
        }

        xhr.send(data);

        if (getXhr) {
            resolve(xhr);
        }
    });
}


const getRequestData = (data) => {
    if (!data) return null;

    let type = typeof data;

    if (type === 'string') return data;
    if (type !== 'object') return null;
    if (data instanceof FormData) return data;

    let requestData = new FormData();

    for (let key in data) {
        requestData.append(key, data[key]);
    }

    return requestData;
}


const getRequestMethod = (method, data) => {
    if (method) return method;
    return data ? 'post' : 'get';
}


const setRequestHeader = (xhr, headers) => {
    if (!headers) return;
    for (let key in headers) {
        xhr.setRequestHeader(key, headers[key]);
    }
}


export const slideUp = (target: HTMLElement) => {
    target.classList.remove('slide-down');
    target.classList.add('slide-up');

    target.style.height = `${target.offsetHeight}px`;

    setTimeout(() => {
        target.setAttribute('style', 'height: 0px; margin-top: 0px; margin-bottom: 0px; padding-top: 0px; padding-bottom: 0px;');
        setTimeout(() => {
            if (!target.classList.contains('slide-up')) {
                return;
            }

            target.classList.remove('slide-up');
            target.setAttribute('style', 'display: none');

        }, parseFloat(window.getComputedStyle(target).transitionDuration) * 1000);
    });
}


export const slideDown = (target: HTMLElement) => {
    target.classList.remove('slide-up');
    target.classList.add('slide-down');

    target.removeAttribute('style');
    let height = target.offsetHeight;
    target.style.height = '0px';

    setTimeout(() => {
        target.style.height = `${height}px`;
        setTimeout(() => {
            if (!target.classList.contains('slide-down')) {
                return;
            }
            target.classList.remove('slide-down');
            target.removeAttribute('style');
        }, parseFloat(window.getComputedStyle(target).transitionDuration) * 1000);
    });
}

export const slideToggle = (target: HTMLElement) => {
    if (window.getComputedStyle(target).display === 'none') {
        return slideDown(target);
    } else {
        return slideUp(target);
    }
}