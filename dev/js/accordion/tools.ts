import { callAfterTransition, callCustomEvent, dispatchEvents, reflow } from "../utils"

const CLASS_COLLAPSE = 'collapse' // закрыт
const CLASS_COLLAPSING = 'collapsing' // открывется/закрывается
const CLASS_ACTIVE = 'active' // открыт
const CLASS_DISABLED = 'disabled' // заблокирован

export const accordion = (el: HTMLElement, settings: AccordionSettings = {}) => {
    let instance = getAccordionInstance(el)
    if (instance) return instance
    return new Accordion(el, settings).init()
}

export interface AccordionSettings {

}

interface AccordionCallbacks {
    before?: (instance: Accordion) => void
    after?: (instance: Accordion) => void
}

export class Accordion {
    el: HTMLElement
    trigger: HTMLElement
    content: HTMLElement

    settings: AccordionSettings

    constructor(el: HTMLElement, settings: AccordionSettings = {}) {
        this.el = el
        this.trigger = this.el.querySelector('.js-accord-trigger')
        this.content = this.el.querySelector('.js-accord-body')


        this.settings = {
            ...settings
        }
    }

    init() {
        this.el.classList.add(CLASS_COLLAPSE)

        if (this.isActive()) {
            this._toggleDataCollapse(true)
        }

        if (this.trigger) {
            this.trigger.addEventListener('click', this._handlerTrigger)
        } else {
            this.el.addEventListener('click', this._handlerTrigger)
        }

        setAccordionInstance(this.el, this)

        return this
    }

    open(silent = false, callbacks: AccordionCallbacks = {}) {
        if (this.isDisabled()) return

        this._dispatch(this.el, 'accord:before-open', silent)
        callCustomEvent(callbacks, 'before', this)

        this._toggleDataCollapse(true)

        this.el.classList.remove(CLASS_COLLAPSE)
        this.el.classList.add(CLASS_COLLAPSING)

        this.content.style.height = this.content.scrollHeight + 'px'

        callAfterTransition(() => {
            this.el.classList.add(CLASS_COLLAPSE, CLASS_ACTIVE)
            this.el.classList.remove(CLASS_COLLAPSING)

            this.content.style.height = ''

            this._dispatch(this.el, 'accord:after-open', silent)
            callCustomEvent(callbacks, 'after', this)
        }, this.content)
    }

    close(silent = false, callbacks: AccordionCallbacks = {}) {
        if (this.isDisabled()) return

        this._dispatch(this.el, 'accord:before-close', silent)
        callCustomEvent(callbacks, 'before', this)

        this._toggleDataCollapse(false)

        this.content.style.height = this.content.getBoundingClientRect().height + 'px'
        reflow(this.content)

        this.el.classList.add(CLASS_COLLAPSING)
        this.el.classList.remove(CLASS_ACTIVE, CLASS_COLLAPSE)

        this.content.style.height = ''

        callAfterTransition(() => {
            this.el.classList.add(CLASS_COLLAPSE)
            this.el.classList.remove(CLASS_COLLAPSING)

            this._dispatch(this.el, 'accord:after-close', silent)
            callCustomEvent(callbacks, 'after', this)
        }, this.content)
    }

    destroy() {
        if (this.isActive()) {
            this.close(true)
        }

        if (this.trigger) {
            this.trigger.removeEventListener('click', this._handlerTrigger)
        } else {
            this.el.removeEventListener('click', this._handlerTrigger)
        }

        removeAccordionInstance(this.el)
    }

    disable() {
        this.el.classList.add(CLASS_DISABLED)
    }

    undisable() {
        this.el.classList.remove(CLASS_DISABLED)
    }

    isActive() {
        return this.el.classList.contains(CLASS_ACTIVE)
    }

    isDisabled() {
        return this.el.classList.contains(CLASS_DISABLED)
    }

    private _handlerTrigger = (e: Event) => {
        e.preventDefault()
        if (this.isActive()) {
            this.close()
        } else {
            this.open()
        }
    }

    private _dispatch(el: HTMLElement, ev: string, silent: boolean) {
        if (silent) return
        dispatchEvents(el, ev, { detail: this })
    }

    private _toggleDataCollapse(isOpen: boolean) {
        let type = isOpen ? 'open' : 'close'
        this.el.setAttribute('data-collapse', type)
    }
}

export const AccordionInstances: Map<HTMLElement, Accordion> = new Map()

export const getAccordionInstance = (el: HTMLElement) => {
    return AccordionInstances.get(el)
}

export const setAccordionInstance = (el: HTMLElement, instance: Accordion) => {
    AccordionInstances.set(el, instance)
}

export const removeAccordionInstance = (el: HTMLElement) => {
    AccordionInstances.delete(el)
}
