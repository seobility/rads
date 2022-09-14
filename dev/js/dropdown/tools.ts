import { dispatchEvents, execute } from "../utils"

const CLASS_ACTIVE = 'active'
const CLASS_DISABLED = 'disabled'

export const dropdown = (el: HTMLElement, settings: DropdownSettings = {}) => {
    let instance = getDropdownInstance(el)
    if (instance) return instance
    return new Dropdown(el, settings).init()
}

export interface DropdownSettings {

}


export class Dropdown {
    el: HTMLElement
    trigger: HTMLElement
    content: HTMLElement

    settings: DropdownSettings

    constructor(el: HTMLElement, settings: DropdownSettings = {}) {
        this.el = el
        this.trigger = this.el.querySelector('.js-dropdown-trigger')
        this.content = this.el.querySelector('.js-dropdown-body')

        this.settings = {
            ...settings
        }
    }

    init() {
        setDropdownInstance(this.el, this)
        return this
    }

    destroy() {
        removeDropdownInstance(this.el)
    }

    open(silent = false, callback?: Function) {
        if (this.isDisabled()) {
            return
        }

        this.el.classList.add(CLASS_ACTIVE)

        this._dispatch(this.el, 'dropdown:open', silent)
        execute(callback, this)
    }

    close(silent = false, callback?: Function) {
        if (this.isDisabled()) {
            return
        }

        this.el.classList.remove(CLASS_ACTIVE)

        this._dispatch(this.el, 'dropdown:close', silent)
        execute(callback, this)
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

    private _dispatch(el: HTMLElement, ev: string, silent: boolean) {
        if (silent) return
        dispatchEvents(el, ev, { detail: this })
    }
}


export const DropdownInstances: Map<HTMLElement, Dropdown> = new Map()

export const getDropdownInstance = (el: HTMLElement) => {
    return DropdownInstances.get(el)
}

export const setDropdownInstance = (el: HTMLElement, instance: Dropdown) => {
    DropdownInstances.set(el, instance)
}

export const removeDropdownInstance = (el: HTMLElement) => {
    DropdownInstances.delete(el)
}