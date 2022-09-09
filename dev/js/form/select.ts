import TomSelect from 'tom-select'
import dom from "../DOM"

export const select = (context: HTMLElement) => {
  dom('.js-select', context).each((select: HTMLSelectElement) => {
    initSelect(select)
  })
}

const initSelect = (select: HTMLSelectElement) => {
  let instance = new TomSelect(select, {

  })

  instance.control_input.readOnly = true
}