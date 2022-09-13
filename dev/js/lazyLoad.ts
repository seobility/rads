import dom from "./DOM";
import { isInViewport } from "./utils";


let IS_INITED = false;
let IMAGES = [];


export const lazyLoad = (context?: HTMLElement) => {
    dom('img[data-src]', context).each<HTMLImageElement>(img => {
        if (img.hasAttribute('src')) {
            return;
        }
        maybeLoad(img);
        IMAGES.push(img);
    });

    if (!IS_INITED) {
        IS_INITED = true;
        window.addEventListener('scroll', e => {
            maybeLoadImages();
        }, { passive: true });
    }
}


const maybeLoad = (img: HTMLImageElement): boolean => {
    if (img.hasAttribute('src')) {
        return true;
    }

    if (!isInViewport(img, window.innerHeight / 2 * -1)) {
        return false;
    }

    img.onload = () => {
        img.classList.add('lazy-loaded');
    }

    img.src = img.dataset.src;

    return true;
}


const maybeLoadImages = () => {
    if (!IMAGES.length) {
        return;
    }
    IMAGES = IMAGES.filter(img => !maybeLoad(img));
}