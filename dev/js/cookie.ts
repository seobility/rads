import { getCookie, setCookie } from "./utils"

export const cookie = () => {
    const elCookie = document.querySelector('.js-cookie')
    if (!elCookie || getCookie('cookie')) return

    const btn = elCookie.querySelector('.btn')

    elCookie.classList.add('active')

    btn.addEventListener('click', (e) => {
        e.preventDefault()
        setCookie('cookie', 'true')
        elCookie.classList.remove('active')
    })
}