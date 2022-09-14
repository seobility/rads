import dom from "../DOM";
import React from "../React";


type UploadSets = {
    wrap: HTMLElement,
    input: HTMLInputElement,
    list: HTMLElement,
    files: Map<HTMLElement, File>
}




export const uploadFile = (context?: HTMLElement) => {
    createCustomUploadBtn();
    dom('.js-files-upload', context).each<HTMLElement>(wrap => {
        initUpload(wrap);
    });
}

const createCustomUploadBtn = (context?: HTMLElement) => {
    document.querySelector('.select-file-button').addEventListener('click', (e) => {
        e.preventDefault();
        (document.querySelector('.select-files') as HTMLElement).click();
    });

};

const initUpload = (wrap: HTMLElement) => {
    let sets = getSets(wrap);
    sets.input.addEventListener('change', e => {
        e.preventDefault();
        maybeUploadFiles(sets);
    });
}


const maybeUploadFiles = (sets: UploadSets) => {
    let files = sets.input.files;
    console.log(files[0]);

    const fileType = files[0].type.match(/^.*\/(pdf|PDF|jpeg|JPEG|jpg|JPG|doc|DOC|docx|DOCX|xls|XLS|xlsx|)$/);

    console.log(fileType);
    if (fileType) {
        renderFiles(sets);
    }

}


const renderFiles = (sets: UploadSets) => {
    let list = sets.list;
    let iconPath = `../../img/svg/doc.svg`
    if (sets.input.files[0].type.match(/\/([^.]+)$|$/)) {
        iconPath = `../../img/svg/${sets.input.files[0].type.match(/\/([^.]+)$|$/)[1]}.svg`
    }

    for (let i = 0; i < sets.input.files.length; i++) {
        let div = (
            <div className="uploaded-file-container">
                <img className="file-icon" src={iconPath.toString()} alt="" />
                <div className={["input", "file-name"].join(" ")}>{sets.input.files[0].name.replace(/\.[^/.]+$/, "")}</div>
                <span className="file-size">{(sets.input.files[0].size * 0.0001).toFixed(2).toString() + 'Кб'}</span>
                <button className="delete-file-button">
                    <div className="cross">
                    </div>
                    Удалить
                </button>
            </div>
        );
        list.appendChild(div);
        sets.files.set(div, sets.input.files[i]);
        initDeleteFile(div, sets);
    }

    sets.input.value = '';
}


const initDeleteFile = (div: HTMLElement, sets: UploadSets) => {
    div.querySelector('.delete-file-button').addEventListener('click', e => {
        e.preventDefault();
        deleteFile(div, sets);
    });
}


const deleteFile = (div: HTMLElement, sets: UploadSets) => {
    sets.files.delete(div);
    div.remove();
}


const getSets = (wrap: HTMLElement): UploadSets => {
    let sets = dom(wrap).getStorage('upload-sets') as UploadSets;

    if (sets) {
        return sets;
    }

    sets = {
        wrap,
        input: wrap.querySelector('input[type="file"]') as HTMLInputElement,
        list: wrap.querySelector('.js-list') as HTMLElement,
        files: new Map()
    }

    sets.input.dataset.name = sets.input.name;

    dom(wrap).setStorage('upload-sets', sets);

    return sets;
}


export const getFiles = (wrap: HTMLElement): { name: string, files: File[] } => {
    let sets = getSets(wrap);
    let files = [];
    for (let val of sets.files) {
        files.push(val[1]);
    }
    return { name: sets.input.dataset.name, files };
}


export const appendFormData = (data: FormData, wrap: HTMLElement) => {
    let files = getFiles(wrap);
    files.files.forEach(file => {
        data.append(files.name, new Blob([file], { type: file.type }), file.name);
    });
}