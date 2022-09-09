import { accordion } from "./accordion/tools"
import { toggleCompensateForScrollbar, wrapElement } from "./utils"

export const header = () => {
    const header = document.querySelector('.js-header') as HTMLElement
    if (!header) return

    initHeaderForm(header)
    initHeaderMenu(header)
    initSubmenu(header)
}

export const headerState = {
    menuOpen: false
}

const initHeaderForm = (header: HTMLElement) => {
    const trigger = header.querySelector('.js-header-search-trigger') as HTMLElement

    trigger.addEventListener('click', () => {
        header.classList.toggle('search-active')
    })
}

const initHeaderMenu = (header: HTMLElement) => {
    const burger = header.querySelector('.burger')

    burger.addEventListener('click', () => {
        header.classList.toggle('menu-active')
        let isOpen = header.classList.contains('menu-active')
        headerState.menuOpen = isOpen
        toggleCompensateForScrollbar()
    })
}

const initSubmenu = (header: HTMLElement) => {
    const itemsWithChildren = Array.from(header.querySelectorAll('.menu-item-has-children')) as HTMLElement[]
    if (!itemsWithChildren.length) return

    itemsWithChildren.forEach((item) => {
        initSubmenuItem(item)
    })
}

const initSubmenuItem = (item: HTMLElement) => {
    const link = item.querySelector('a') as HTMLElement
    const submenu = item.querySelector('.sub-menu') as HTMLElement

    link.classList.add('js-accord-trigger', 'accord-trigger')
    wrapElement(submenu, 'div', {
        className: 'sub-menu-wrap accord-body js-accord-body'
    })

    const instance = accordion(item)
}