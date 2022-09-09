import dom from "../DOM";
import { ajax } from "../DOM/fn";
import { validateForm } from "./validate";
import { addFormToken } from "./googleCaptcha";
import { AjaxResponse, parseResponse } from "../server";



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
    form.classList.add("loading");

    await addFormToken(form);

    let res = await sendFormRequest(form);

    form.classList.remove("loading");
}


export const sendFormRequest = async (form: HTMLFormElement): Promise<AjaxResponse> => {
    let res = await ajax({
        url: form.getAttribute('action'),
        data: new FormData(form)
    });
    return parseResponse(res, form) as AjaxResponse;
}
