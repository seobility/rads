import dom from "../DOM"
import { dropdown, DropdownInstances, getDropdownInstance } from "./tools"

let isInited: boolean

export const initDropdowns = (context?: HTMLElement) => {
    if (isInited) {
        window.removeEventListener('click', onWindowClick)
        isInited = false
    }

    dom(".js-dropdown", context).each((el: HTMLElement) => {
        dropdown(el)
    })

    window.addEventListener('click', onWindowClick)
    isInited = true
}


const onWindowClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement

    DropdownInstances.forEach((instance) => {
        if (!instance.trigger.contains(target) || instance.isActive()) {
            instance.close()
        } else {
            instance.open()
        }
    })
}

