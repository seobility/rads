import { inEvent } from "js/utils"
import dom from "../DOM"
import { dropdown, DropdownInstances } from "./tools"

let isInited: boolean


export const initDropdowns = (context?: HTMLElement) => {
    if (isInited) {
        window.removeEventListener("click", onWindowClick)
        isInited = false
    }

    dom(".js-dropdown", context).each((el: HTMLElement, i) => {
        dropdown(el)
    })

    if (!isInited) {
        isInited = true
        window.addEventListener('click', onWindowClick)
    }
}


const onWindowClick = (e: MouseEvent) => {
    if (inEvent(e, '.js-dropdown')) {
        return;
    }

    const target = e.target as HTMLElement

    DropdownInstances.forEach((instance) => {
        if (!instance.trigger.contains(target) || instance.isActive()) {
            instance.close()
        } else {
            instance.open()
        }
    })
}

