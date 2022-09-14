import dom from "./DOM";
import { Tooltip } from "bootstrap";


export const tooltips = (context?: HTMLElement) => {
    dom('[data-bs-toggle="tooltip"]', context).each<HTMLElement>(btn => {
        initTooltip(btn);
    });
}


const initTooltip = (btn: HTMLElement) => {
    let sets = new Tooltip(btn);
    dom(btn).setStorage('tooltip', sets);
}


export const getTooltip = (btn: HTMLElement): Tooltip | null => {
    return dom(btn).getStorage('tooltip') as Tooltip;
}