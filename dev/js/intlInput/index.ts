import dom from "../DOM"
import { intlTel } from "./tools"

export const initIntlTel = (context: HTMLElement) => {
    dom(".js-input-tel", context).each((input: HTMLInputElement) => {
        intlTel(input)
    })
}