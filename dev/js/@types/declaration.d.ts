declare module "*.scss" {
    const content: { [className: string]: string };
    export default content;
}

declare module "*.png";
declare module "*.jpg";
declare module "*.svg";

declare module "*/exports.js" {
    export default Object;
}

declare module "*.js" {
    export default Object;
}


/**
 * @see https://github.com/bluzky/nice-select2
 */
declare module "nice-select2/dist/js/nice-select2" {
    export default class NiceSelect {
        constructor(
            select: HTMLSelectElement | string,
            options?: {
                searchable?: boolean
            }
        );

        update(): void;
        focus(): void;
        disable(): void;
        enable(): void;
        destroy(): void;
        clear(): void;
    }
}

/**
 * @see https://litepicker.com/
 */
declare module "litepicker" {
    export default class Litepicker {

        constructor(options: {
            element: HTMLInputElement,
            elementEnd?: HTMLInputElement,
            allowRepick?: boolean,
            singleMode?: boolean,
            format?: string,
            buttonText?: {
                apply?: string,
                cancel?: string,
                previousMonth?: string,
                nextMonth?: string,
                reset?: string
            },
            dropdowns?: {
                minYear?: number | null,
                maxYear?: number | null,
                months?: number | null,
                years?: boolean
            },
            minDate?: Date | number | string | null,
            tooltipText?: {
                one?: string,
                other?: string
            }
        });
    }
}