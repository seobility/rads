import dom from "../DOM";
import { ajax } from "../DOM/fn";
import { validateForm } from "./validate";
import { addFormToken } from "./googleCaptcha";
import { AjaxResponse, parseResponse } from "../server";
import { appendFormData } from "./upload";
import React from "../React";
import { initModals } from "js/modals";


export const ajaxForm = (context: HTMLElement) => {
    dom(".js-ajax-form", context).each(form => {
        initAjaxForm(form as HTMLFormElement);
    });
}


const initAjaxForm = (form: HTMLFormElement) => {
    
    dom(form).on("submit", e => {
        e.preventDefault();

        dom(form)
            .find(".js-server-response")
            .removeClass("error", "success")
            .html("");

        if (form.classList.contains('js-form-validate')) {
            if (!validateForm(form)) {
                return false;
            }
        }

        submitForm(form);

        return false;
    });
}


const submitForm = async (form: HTMLFormElement) => {
    console.log(form)

    form.classList.add("loading");

    await addFormToken(form);

    let res = await sendFormRequest(form);

    form.classList.remove("loading");
    rerenderFormOnSubmit();
}

const rerenderFormOnSubmit = () => {
    const context = document.querySelector('.form-block');
    const div = (
        <div className="on-submit-message">
            <div className="submit-message-wraper">
                <span className="submit-message">Спасибо за обращение! Мы обязательно свяжемся с Вами в ближайшее время.</span>
            </div>
            <button onClick={() => {context.classList.toggle('active')}} className="close-form-button js-modal-close" data-target="form-block">Отлично, ожидаю обратной связи</button>
        </div>
    );
    context.appendChild(div);
    dom('.form').remove();
    dom('.contact-info').remove();
    dom('.form-info').html(
        `Опишите вашу задачу. Мы постараемся подобрать и предложить Вам оптимальных<br> партнеров.`
    );

    console.log('asd');
    console.log(context);
    context.querySelector('.close-form-button').addEventListener('click', () => {
        console.log('he')
        context.classList.remove('active');
    });
}

export const sendFormRequest = async (form: HTMLFormElement): Promise<AjaxResponse> => {
    let res = await ajax({
        url: form.getAttribute('action'),
        data: getFormData(form)
    });
    return parseResponse(res, form) as AjaxResponse;
}


const getFormData = (form: HTMLFormElement): FormData => {
    let data = new FormData(form);

    dom('.js-files-upload', form).each<HTMLElement>(wrap => {
        appendFormData(data, wrap);
    });

    return data;
}
