import { callAfterTransition, callCustomEvent, dispatchEvents, reflow } from "../utils"

const CLASS_COLLAPSE = 'collapse'
const CLASS_COLLAPSING = 'collapsing'
const CLASS_ACTIVE = 'active'
const CLASS_DISABLED = 'disabled'

export const accordion = (el: HTMLElement, settings: AccordionSettings = {}) => {
    return new Accordion(el, settings).init()
}

export interface AccordionElement extends HTMLElement {
    Accordion: Accordion
}

export interface AccordionSettings {

}

interface AccordionCallbacks {
    before?: (instance: Accordion) => void
    after?: (instance: Accordion) => void
}

export class Accordion {
    el: AccordionElement
    trigger: HTMLElement
    content: HTMLElement

    settings: AccordionSettings

    isActive: boolean
    isDisabled: boolean
    isInited: boolean

    constructor(el: HTMLElement, settings: AccordionSettings = {}) {
        this.el = el as AccordionElement
        this.trigger = this.el.querySelector('.js-accord-trigger')
        this.content = this.el.querySelector('.js-accord-body')

        this.isDisabled = this.el.classList.contains(CLASS_DISABLED)
        this.isActive = this.el.classList.contains(CLASS_ACTIVE)
        this.isInited = this.el?.Accordion?.isInited

        this.settings = {
            ...settings
        }
    }

    init() {
        if (this.el?.Accordion?.isInited) return this.el.Accordion

        this.el.classList.add(CLASS_COLLAPSE)

        if (this.isActive) {
            this._toggleDataCollapse(true)
        }

        if (this.trigger) {
            this.trigger.addEventListener('click', this._handlerTrigger)
        } else {
            this.el.addEventListener('click', this._handlerTrigger)
        }

        this.el.Accordion = this
        this.isInited = true

        return this
    }

    open(silent = false, callbacks: AccordionCallbacks = {}) {
        if (this.isDisabled) return

        this._dispatch(this.el, 'before-open', silent)
        callCustomEvent(callbacks, 'before', this)

        this._toggleDataCollapse(true)

        this.isActive = true
        this.el.classList.remove(CLASS_COLLAPSE)
        this.el.classList.add(CLASS_COLLAPSING)

        this.content.style.height = this.content.scrollHeight + 'px'

        const complete = () => {
            this.el.classList.add(CLASS_COLLAPSE, CLASS_ACTIVE)
            this.el.classList.remove(CLASS_COLLAPSING)

            this.content.style.height = ''

            this._dispatch(this.el, 'after-open', silent)
            callCustomEvent(callbacks, 'after', this)
        }

        callAfterTransition(complete, this.content)
    }

    close(silent = false, callbacks: AccordionCallbacks = {}) {
        if (this.isDisabled) return

        this._dispatch(this.el, 'before-close', silent)
        callCustomEvent(callbacks, 'before', this)

        this._toggleDataCollapse(false)

        this.content.style.height = this.content.getBoundingClientRect().height + 'px'
        reflow(this.content)

        this.isActive = false
        this.el.classList.add(CLASS_COLLAPSING)
        this.el.classList.remove(CLASS_ACTIVE, CLASS_COLLAPSE)

        this.content.style.height = ''

        const complete = () => {
            this.el.classList.add(CLASS_COLLAPSE)
            this.el.classList.remove(CLASS_COLLAPSING)

            this._dispatch(this.el, 'after-close', silent)
            callCustomEvent(callbacks, 'after', this)
        }

        callAfterTransition(complete, this.content)
    }

    destroy() {
        if (this.isActive) {
            this.close(true)
        }

        if (this.trigger) {
            this.trigger.removeEventListener('click', this._handlerTrigger)
        } else {
            this.el.removeEventListener('click', this._handlerTrigger)
        }

        this.isDisabled = false
        this.isInited = false
    }

    disable() {
        if (this.isDisabled) return

        this.el.classList.add(CLASS_DISABLED)
        this.isDisabled = true
    }

    undisable() {
        if (!this.isDisabled) return

        this.el.classList.remove(CLASS_DISABLED)
        this.isDisabled = false
    }

    // Инициализирует свитч аккордиона по клику
    _handlerTrigger = (e: Event) => {
        e.preventDefault()
        if (this.isActive) {
            this.close()
        } else {
            this.open()
        }
    }

    _isIgnore(el: HTMLElement) {
        return el.closest('.js-accord-ignore')
    }

    _dispatch(el: HTMLElement, ev: string, silent: boolean) {
        if (silent) return
        dispatchEvents(el, ev, { detail: this })
    }

    _toggleDataCollapse(isOpen: boolean) {
        let type = isOpen ? 'open' : 'close'
        this.el.setAttribute('data-collapse', type)
    }
}





