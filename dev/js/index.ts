import "loaders.css"
import "Css/index.scss"
import "./polyfill"


import { initForms } from "./form"
import { loadingBtn } from "./loadingBtn"
import { compensateForScrollbar } from "./compensateForScrollbar"
import { initModals } from "./modals"
import { initDropdowns } from "./dropdown"
import { initAccordions } from "./accordion"
import { initIntlTel } from "./intlInput"


let IS_INITED = false

export const dynamicFunctions = (context?: HTMLElement) => {
    if (IS_INITED && !context) {
        return
    }

    IS_INITED = true

    initForms(context)
    initIntlTel(context)
    loadingBtn(context)
    initModals(context)
    initDropdowns(context)
    initAccordions(context)
}


const staticFunctions = () => {
    compensateForScrollbar()
}


window.dynamicFunctions = dynamicFunctions

staticFunctions()
dynamicFunctions()