import dom from '../DOM'

import intlTelInput from 'intl-tel-input'
import 'intl-tel-input/build/js/utils.js'
import IMask from 'imask/esm/imask'
import 'imask/esm/masked/pattern'
import 'imask/esm/masked/pipe'

import { dispatchEvents } from "../utils"

export const inputTel = (context: HTMLElement) => {
  dom(".js-input-tel", context).each((input: HTMLInputElement) => {
    initInputTel(input)
  })
}

const initInputTel = (
  input: HTMLInputElement,
  settings: IntlTelSettings = {}
) => {
  const initedInstance = getInputIntlInstance(input)
  if (initedInstance) return initedInstance
  return new IntlTel(input, settings).init()
}

interface IntlTelSettings { }

let shouldDispatch = false

class IntlTel {
  form: HTMLFormElement
  input: HTMLInputElement
  settings: IntlTelSettings
  intl: any
  dialCode: string
  customPlaceholder: string
  mask: string
  isValid: boolean
  requiredLength: number
  geoIp: any

  constructor(input: HTMLInputElement, settings: IntlTelSettings = {}) {
    this.input = input
    this.settings = {
      ...settings,
    }
    this.geoIp = sessionStorage.getItem("ipinfo") ? JSON.parse(sessionStorage.getItem("ipinfo")) : {}
    this.form = input.closest('form')
  }

  init() {
    this.initIntl()
    this.appendPlaceForErrors()

    this.input.addEventListener("countrychange", this.onCountryChange)
    this.input.addEventListener("input", this.onInput)
    this.input.addEventListener("keydown", this.onKeyDown)
    this.input.addEventListener("validate-input", this.onInput)

    setInputIntlInstance(this.input, this)

    return this
  }

  destroy() {

  }

  initIntl() {
    const that = this

    this.intl = intlTelInput(this.input, {
      separateDialCode: false,
      autoPlaceholder: "polite",
      initialCountry: "auto",
      autoHideDialCode: true,
      nationalMode: false,
      geoIpLookup: this.ajaxGeoIpLookup,
      customPlaceholder: function (placeholder: string, countryData: any) {
        that.customPlaceholder = placeholder
        that.dialCode = countryData.dialCode
        that.createMask()
        that.input.value = maskPhone(that.input.value, {
          mask: that.mask,
        })

        return "+" + (countryData.dialCode || "")
      },
    })
  }

  onCountryChange = (e: Event) => {
    this.createMask()
    this.validate()

    if (shouldDispatch) {
      dispatchEvents(this.form, 'input')
    }

    shouldDispatch = true
  };

  onInput = (e: Event) => {
    this.validate()
  };

  onKeyDown = (e: KeyboardEvent) => {
    if (("+" + this.dialCode).length < this.input.value.length) return

    if (e.keyCode === 8 || e.keyCode === 46) {
      e.preventDefault()
    }
  };

  validate() {
    let lengthValue = this.input.value.length
    let lengthDialCode = ("+" + this.dialCode).length
    let lengthPlaceholder = this.customPlaceholder.length

    if (lengthDialCode > lengthValue) {
      this.input.value = "+" + this.dialCode
    }

    this.input.value = this.input.value.replace(/[^+\d]/g, "")

    if (lengthValue > lengthPlaceholder) {
      let valueSplit = this.input.value.split('')
      valueSplit.splice(lengthPlaceholder, lengthPlaceholder - lengthValue)
      this.input.value = valueSplit.join('')
    }

    if (this.mask) {
      this.input.value = maskPhone(this.input.value, {
        mask: this.mask,
      })
    }

    this.isValid = this.validateLength()
  }

  validateLength() {
    if (!this.requiredLength || !this.input.value.length) return true
    return this.requiredLength === unmaskPhone(this.input.value).length
  }

  createMask() {
    let placeholderWithoutDial = this.customPlaceholder
      .replace(`+${this.dialCode}`, "")
      .replace(/[0-9]/g, "0")
    this.mask = `+{${this.dialCode}}${placeholderWithoutDial}`
    this.requiredLength = unmaskPhone(this.mask).length
  }

  private appendPlaceForErrors() {
    const span = document.createElement("span")
    span.className = "alert-input-text"
    this.input.parentNode.append(span)
  }

  private ajaxGeoIpLookup = async (callback: Function) => {
    if (this.geoIp?.country) {
      callback(this.geoIp.country)
      return
    }

    try {
      const res = await fetch("https://ipinfo.io/json")
      this.geoIp = await res.json()
      sessionStorage.setItem("ipinfo", JSON.stringify(this.geoIp))
      callback(this.geoIp.country)
    } catch (e) {
      callback("BY")
    }
  };
}

const maskPhone = (
  value: string,
  masked: IMask.AnyMasked | IMask.AnyMaskedOptions
): string => {
  let settings = {
    mask: "+{7} (000) 000-00-00",
    ...masked,
  } as IMask.AnyMasked | IMask.AnyMaskedOptions

  return IMask.pipe(value, settings)
}

const unmaskPhone = (value: string) => {
  return value.replace(/[^+\d()]/g, "")
}


const IntlInstances = new Map()

export const getInputIntlInstance = (input: HTMLInputElement) => {
  return IntlInstances.get(input)
}

export const setInputIntlInstance = (input: HTMLInputElement, instance: any) => {
  IntlInstances.set(input, instance)
}