import dom from "../DOM";


let HAS_GOOGLE_SCRIPT = false;
let CAPTCHA_KEY = null;


/**
 * - Если скрипт капчи не загружен - загружает его
 * - Получает токен и вставляет в соответствующий инпут в форме
 * @param {DOM} form 
 * @returns {Promise}
 */
export const addFormToken = async (form: HTMLFormElement) => {
    return new Promise(async resolve => {

        CAPTCHA_KEY = window.backDates.captchaKey;

        if (!CAPTCHA_KEY) {
            resolve(false);
            return;
        }

        await loadScript();
        await appendToken(form);

        resolve(true);
    });
}



const loadScript = async () => {
    return new Promise(async resolve => {

        if (HAS_GOOGLE_SCRIPT) {
            resolve(true);
            return;
        }

        let body = document.body;

        if (body.classList.contains('loading-g-script')) {
            return;
        }

        body.classList.add('loading-g-script');

        let script = document.createElement('script');

        script.onload = (e) => {
            window.grecaptcha.ready(() => {
                HAS_GOOGLE_SCRIPT = true;
                body.classList.remove('loading-g-script');
                resolve(true);
            });
        }

        document.head.appendChild(script);

        script.src = 'https://www.google.com/recaptcha/api.js?render=' + CAPTCHA_KEY;
    });
}



const appendToken = async form => {
    return new Promise(async resolve => {
        window.grecaptcha.execute(CAPTCHA_KEY, { action: 'submit' }).then((token: string) => {
            appendInput(form, token);
            resolve(true);
        });
    });
}



const appendInput = (form: HTMLFormElement, token: string) => {
    let input = form.querySelector<HTMLInputElement>('[name="g-recaptcha-response"]');

    if (!input) {
        input = document.createElement('input');
        input.name = 'g-recaptcha-response';
        input.type = 'hidden';
        form.appendChild(input);
    }

    input.value = token;
}