import dom from "../DOM"
import { accordion } from "./tools"

export const initAccordions = (context?: HTMLElement) => {
    dom(".js-accord", context).each((el: HTMLElement) => {
        accordion(el)
    })
}
