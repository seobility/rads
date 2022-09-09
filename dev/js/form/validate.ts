import dom from "../DOM"
import { getMaskInstance } from "./inputMask"
import { getInputIntlInstance } from "./inputTel"

export const validate = (context?: HTMLElement) => {
  dom(".js-form-validate", context).each(form => {
    initValidate(form as HTMLFormElement)
  })
}


const initValidate = (form: HTMLFormElement) => {
  let domForm = dom(form)
  let domButtons = domForm.find('button[type=submit')
  let domInputs = domForm.find('.input')
  let domCheckboxes = domForm.find('input[type=checkbox]')

  domForm.on('input', e => {
    let currentInput = e.target as (HTMLInputElement | HTMLSelectElement)
    let hasError = false

    if (!validateInput(currentInput as HTMLInputElement)) {
      hasError = true
    }

    if (currentInput.type === "checkbox") {
      domButtons.each((btn) => {
        // @ts-ignore
        btn.disabled = domCheckboxes.get().some((checkbox: HTMLInputElement) => {
          return checkbox.hasAttribute("data-required") && !checkbox.checked
        })
      })
    }

    if (hasError) {
      e.preventDefault()
      maybeScrollFirstError(form)
      return false
    }
  })
}


const maybeScrollFirstError = (form: HTMLFormElement) => {
  if (!form.hasAttribute('data-scroll-first-error')) {
    return
  }

  let el = form.querySelector('.has-error') as HTMLElement

  if (!el) {
    return
  }

  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 100)
}


/**
 * - Валидирует отдельный инпут
 * - Выводит сообщение об ошибке под ним
 * @return true - инпут валидный
 * @return false - ошибка
 */
export const validateInput = (input: HTMLInputElement, addErrors = true) => {
  if (input.hasAttribute("data-required") && !validateRequired(input)) {
    if (addErrors) {
      addInputError(input, "required")
    }
    return false
  }

  if (input.hasAttribute("data-email") && !validateEmail(input)) {
    if (addErrors) {
      addInputError(input, "email")
    }
    return false
  }

  if (input.hasAttribute("data-intl-tel") && !validateTel(input)) {
    if (addErrors) {
      addInputError(input, "tel")
    }
    return false
  }

  if (
    input.hasAttribute("data-min-length") &&
    !validateMinLength(input, input.dataset.minLength)
  ) {
    if (addErrors) {
      addInputError(input, "minLength", [input.dataset.minLength])
    }
    return false
  }

  if (
    input.hasAttribute("data-max-length") &&
    !validateMaxLength(input, input.dataset.maxLength)
  ) {
    if (addErrors) {
      addInputError(input, "maxLength", [input.dataset.maxLength])
    }
    return false
  }

  if (input.hasAttribute('data-lat-name') && !validateLatName(input)) {
    if (addInputError) {
      if (input.value.match(/[а-яА-Я]+/)) {
        addInputError(input, 'latNameRuSymbols')
      } else {
        addInputError(input, 'latName')
      }
    }
    return false
  }

  removeInputError(input)
  return true
}


/**
 * - Валидирует форму
 */
export const validateForm = (form: HTMLFormElement, addErrors = true) => {
  let isFormValid = true

  dom(form)
    .find(".input, .js-select")
    .each(input => {
      // плагин селекта копирует классы на DIV
      if (input.tagName === 'DIV') {
        return
      }

      let isInputValid = validateInput(input as HTMLInputElement, addErrors)
      if (!isInputValid) isFormValid = false
    })

  if (!isFormValid) {
    maybeScrollFirstError(form)
  }

  return isFormValid
}


/**
 * - добавляет ошибку на input
 * @param input
 * @param msg ключ сообщения с объекта строк либо сообщение
 * @param replace массив строк для замены в сообщении
 */
export const addInputError = (input: HTMLInputElement, msg: string, replace?: Array<string | number>) => {
  if (input.classList.contains('js-input-tel')) {
    dom(input)
      .parent()
      .parent()
      .addClass('has-error')
      .find('.alert-input-text')
      .html(
        getInputMessage(msg, replace)
      )
    return
  }

  if (input.type === 'checkbox') {
    msg = 'acceptTerms'
    dom(input)
      .parent()
      .addClass('has-error')
      .parent()
      .find('.alert-input-text', true)
      .html(getInputMessage(msg, replace))
    return
  }

  dom(input)
    .parent()
    .addClass("has-error")
    .find(".alert-input-text", true)
    .html(
      getInputMessage(msg, replace)
    )
}


const getInputMessage = (msg: string, replace?: Array<string | number>) => {
  let data = window?.backDates?.validateMess
  let res = data && data[msg] ? data[msg] : msg
  if (replace) {
    for (let i = 0; i < replace.length; i++) {
      res = res.replaceAll(`\$${i + 1}`, replace[i])
    }
  }
  return res
}


/**
 * - Убирает ошибку с инпута
 */
export const removeInputError = (input: HTMLInputElement) => {
  if (input.classList.contains('js-input-tel')) {
    dom(input)
      .parent()
      .parent()
      .removeClass('has-error')
      .find('.alert-input-text', true)
      .html('')
    return
  }

  if (input.type === 'checkbox') {
    dom(input)
      .parent()
      .removeClass('has-error')
      .parent()
      .find('.alert-input-text', true)
      .html('')
    return
  }

  dom(input)
    .parent()
    .removeClass("has-error")
    .find(".alert-input-text", true)
    .html('')
}


const validateRequired = (input: HTMLInputElement) => {
  if (input.tagName === "SELECT") return !!input.value && input.value !== "all"
  if (input.type === "checkbox" || input.type === "radio") return input.checked
  return !!input.value
}


const validateLatName = (input: HTMLInputElement) => {
  if (!input.value) {
    return true
  }
  return input.value.match(/^[a-zA-Z]{2,}\s[a-zA-Z]{2,}$/)
}


const validateEmail = (input: HTMLInputElement) => {
  // если поле не заполнено - значит оно не обязательно
  if (!input.value) return true

  let re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(input.value).toLowerCase())
}


const validateMinLength = (input: HTMLInputElement, min) => {
  min = parseInt(min)
  return input.value.length >= min
}


const validateMaxLength = (input, max) => {
  max = parseInt(max)
  return input.value.length <= max
}


const validateTel = (input: HTMLInputElement) => {
  const instance = getInputIntlInstance(input)
  return instance.isValid
}