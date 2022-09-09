import "loaders.css"
import "Css/index.scss"
import "./polyfill"


import { initForms } from "./form"
import { loadingBtn } from "./loadingBtn"
import { triggerCheck } from "./triggerCheck"
import { inViewport } from "./inViewport"
import { header } from "./header"
import { initAccordions } from "./accordion/accordion"
import { compensateForScrollbar } from "./compensateForScrollbar"
import { initModals } from "./modals"
import { cookie } from "./cookie"


let IS_INITED = false

export const dynamicFunctions = (context?: HTMLElement) => {
    if (IS_INITED && !context) {
        return
    }

    IS_INITED = true

    initForms(context)
    loadingBtn(context)
    triggerCheck(context)
    initAccordions(context)
    initModals(context)
}


const staticFunctions = () => {
    inViewport()
    header()
    compensateForScrollbar()
    cookie()
}


window.dynamicFunctions = dynamicFunctions

staticFunctions()
dynamicFunctions()