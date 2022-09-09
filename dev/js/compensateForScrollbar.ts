import dom from "./DOM"

export const compensateForScrollbar = () => {
    let style = document.createElement('style')
    let scrollbarWidth = getScrollbarWidth()
    style.innerHTML = `
        .compensate-for-scrollbar .site-wrap {
            padding-right: ${scrollbarWidth}px;
        }
        .compensate-for-scrollbar .modal {
            padding-right: ${scrollbarWidth}px;
        }
        .compensate-for-scrollbar #wpadminbar {
            padding-right: ${scrollbarWidth}px;
        }
      `

    document.head.appendChild(style)
}

const getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.clientWidth
}
