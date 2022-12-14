import "loaders.css"
import "Css/index.scss"
import "./polyfill"


import { initForms } from "./form"
import { loadingBtn } from "./loadingBtn"
import { initAccordions } from "./accordion/accordion"
import { compensateForScrollbar } from "./compensateForScrollbar"
import { initModals } from "./modals"


let IS_INITED = false

export const dynamicFunctions = (context?: HTMLElement) => {
    if (IS_INITED && !context) {
        return
    }

    IS_INITED = true

    initForms(context)
    loadingBtn(context)
    initAccordions(context)
    initModals(context)
}


const staticFunctions = () => {
    compensateForScrollbar()
}


window.dynamicFunctions = dynamicFunctions

staticFunctions()
dynamicFunctions()