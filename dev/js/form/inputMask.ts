import IMask from "imask"
import dom from "../DOM"

export const inputMask = (context: HTMLElement) => {
    dom('.js-input-mask', context).each((input: HTMLInputElement) => {
        if (input.dataset.mask === "tel") {
            initTelMask(input)
        }
    })
}



const initTelMask = (input: HTMLInputElement) => {
    let options = {
        mask: '+{7}(000)000-00-00'
    }

    let instance = IMask(input, options)
    setMaskInstance(input, instance)
}

const MaskInstances = new Map()

export const getMaskInstance = (input: HTMLInputElement) => {
    return MaskInstances.get(input)
}

export const setMaskInstance = (input: HTMLInputElement, instance: any) => {
    MaskInstances.set(input, instance)
}