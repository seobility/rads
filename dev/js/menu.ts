import dom from "./DOM"
import { DomElement } from "./DOM/DomElement"
import { removeCompensateForScrollbar, setCompensateForScrollbar } from "./utils"

let SIDEBAR: DomElement

export const initMenu = () => {
    SIDEBAR = dom('.js-sidebar')
    const burgers = dom('.js-burger')

    burgers.on('click', (e) => {
        e.preventDefault()
        if (SIDEBAR.hasClass('active')) {
            closeMenu()
        } else {
            openMenu()
        }
    })
}


const openMenu = () => {
    setCompensateForScrollbar()
    SIDEBAR.addClass('active')
}

const closeMenu = () => {
    removeCompensateForScrollbar()
    SIDEBAR.removeClass('active')
}