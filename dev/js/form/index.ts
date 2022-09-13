import { ajaxForm } from "./ajaxForm"
import { select } from "./select"
import { validate } from "./validate"

let IS_INITED = false


export const initForms = (context?: HTMLElement) => {
    if (!IS_INITED) {
        IS_INITED = true
        initStatic()
    }
    initDynamic(context)
}

const initStatic = () => {
}

const initDynamic = (context?: HTMLElement) => {
    validate(context)
    ajaxForm(context)
    select(context)
}