import dom from "./DOM"
import { headerState } from "./header"
import { dispatchEvents, removeCompensateForScrollbar, setCompensateForScrollbar } from "./utils"

export const initModals = (context: HTMLElement) => {
    initClosingModals(context)
    initOpeningModals(context)
}

const initClosingModals = (context: HTMLElement) => {
    dom('.js-modal-close', context).on('click', (e) => {
        e.preventDefault()
        let target = e.currentTarget as HTMLElement
        closeModal(target.dataset.target)
    })
}

const initOpeningModals = (context: HTMLElement) => {
    dom('.js-modal-open', context).on('click', (e) => {
        e.preventDefault()
        let target = e.currentTarget as HTMLElement
        openModal(target.dataset.target)
    })
}

export const closeModal = (modal: string | HTMLElement) => {
    let domModal = typeof modal === 'string' ? dom(`#${modal}`) : dom(modal)
    domModal.removeClass('active')
    // Модалка может быть открыта при открытом мобильном меню.
    // Возврат скролла должен происходить только в том случае, если меню закрыто
    if (!headerState.menuOpen) {
        removeCompensateForScrollbar()
    }
    dispatchEvents(domModal.get(0), 'modal:close')
}

export const openModal = (modal: string | HTMLElement) => {
    let domModal = typeof modal === 'string' ? dom(`#${modal}`) : dom(modal)
    domModal.addClass('active')
    setCompensateForScrollbar()
    dispatchEvents(domModal.get(0), 'modal:open')
}