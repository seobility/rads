import dom from "./DOM"


export const triggerCheck = (context?: HTMLElement) => {
    dom('.js-trigger-check', context).on('change', e => {
        let input = e.target as HTMLInputElement
        let wrap = e.currentTarget as HTMLElement
        if (input.checked) {
            wrap.classList.add('checked')
        } else {
            wrap.classList.remove('checked')
        }
    })
}