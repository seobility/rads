import dom from "./DOM";


export const inViewport = () => {
    dom('.js-in-viewport').each<HTMLElement>(item => {
        checkIsInViewport(item);
    });
    window.addEventListener('scroll', e => {
        dom('.js-in-viewport').each<HTMLElement>(item => {
            checkIsInViewport(item);
        })
    }, { passive: true });
}


const checkIsInViewport = (item: HTMLElement) => {
    let margin = 0;
    if (item.hasAttribute('data-margin')) {
        margin = parseFloat(item.dataset.margin);
    }
    if (isInViewport(item, margin)) {
        item.classList.add('in-viewport');
    } else {
        item.classList.remove('in-viewport');
    }
}


const isInViewport = (item: HTMLElement, margin = 0) => {
    let top = item.getBoundingClientRect().top;

    if (top > window.innerHeight - margin) {
        return false;
    }

    if ((top < 0) && (Math.abs(top) > item.offsetHeight)) {
        return false;
    }

    return true;
}