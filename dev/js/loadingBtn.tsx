import dom from "./DOM";
import React from "./React";


export const loadingBtn = (context: HTMLElement) => {
    dom(".loading-btn", context).each((btn: HTMLElement) => {
        initLoadingBtn(btn);
    });
};


const initLoadingBtn = (btn: HTMLElement) => {
    if (btn.querySelector('.preloader')) {
        return;
    }
    btn.appendChild((
        <div className='preloader'>
            <div className='ball-spin-fade-loader'>
                <div></div>
                <div> </div>
                <div> </div>
                <div> </div>
                <div> </div>
                <div> </div>
                <div> </div>
                <div> </div>
            </div>
        </div>
    ));
}