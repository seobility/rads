import dom from "./DOM"
import { addInputError } from "./form/validate"

export type AjaxResponse = {
    status: 'success' | 'error',
    msg?: string,
    fields: any,
    data?: {
        value?: string,
        label?: string,
        src?: string
    }
}

export type BackDates = {
    validateMess: Object,
    captchaKey?: string,
    // ключ для api yandex карт
    yandexApiKey: string,
    // домаен для карты yandex
    yandexMapDomain: string
}

export const parseResponse = (res: XMLHttpRequest, form?: HTMLElement): AjaxResponse | string => {
    let response: AjaxResponse | string

    try {
        response = JSON.parse(res.responseText)
    } catch (err) {
        response = ''
    }

    if (typeof response === 'string') {
        return response
    }

    let domForm = dom(form)
    let domResponse = domForm.find('.js-server-response')

    let { status, msg, fields } = response

    if (msg) {
        domResponse
            .removeClass('success', 'error')
            .addClass(status)
            .html(msg)
    }

    if (fields) {
        responseFileds(fields, form)
    }

    return response
}

const responseFileds = (fields: any, form: HTMLElement) => {
    for (let key in fields) {
        let input = dom(`[name="${key}"]`, form, true).get(0) as HTMLInputElement
        addInputError(input, fields[key])
    }
}