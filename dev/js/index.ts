import "loaders.css"
import "css/index.scss"
import "./polyfill"

import { initForms } from "./form"
import { loadingBtn } from "./loadingBtn"
import { compensateForScrollbar } from "./compensateForScrollbar"
import { initModals } from "./modals"
import { initDropdowns } from "./dropdown"
import { lazyLoad } from "./lazyLoad"
// import { initAccordions } from "./accordion"
import { initIntlTel } from "./intlInput"
import { accordions } from "./accordions"
import { tooltips } from "./tooltips"
import { initMenu } from "./menu"

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
<<<<<<< HEAD
    uploadFile(context);
=======
    initDropdowns(context)
    lazyLoad(context)
    accordions(context)
    tooltips(context)
    // initAccordions(context)
>>>>>>> b2cf27d72f944776d1323387cb5f48fd28659b53
}


const staticFunctions = () => {
    compensateForScrollbar()
    initMenu()
}

window.dynamicFunctions = dynamicFunctions

staticFunctions()
dynamicFunctions()