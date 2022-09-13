import dom from "./DOM";
import { Collapse } from "bootstrap";


export const accordions = (context?: HTMLElement) => {
    dom('.js-accordion', context).each<HTMLElement>(wrap => {
        initAccordion(wrap);
    });
}


const initAccordion = (wrap: HTMLElement) => {
    let sets = new Collapse(wrap);
    dom(wrap).setStorage('accordion', sets);
}


export const getAccordion = (wrap: HTMLElement): Collapse | null => {
    return dom(wrap).getStorage('accordion') as Collapse;
}