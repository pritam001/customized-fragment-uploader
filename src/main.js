/**
 * @name Customized Fragment Uploader
 * @author Pritam Sarkar
 */
export class CFUploader {
    constructor() {
        this._fileUploaders = new Map();
        this._files = null;
        this._isUploading = true;
        this._errorMessage = "";
        // TODO: chunk size
        // TODO: unique id generator function
        // TODO: file type check function
        // TODO: file size limit
        // TODO: concurrent uploading
        // TODO: status of all concurrent uploads
        // TODO: total upload status: files uploaded, percentage
    }

    static health() {
        console.log("CustomizedFragmentUploader running in global window!");
    }

    watchDOMId(id) {
        document.getElementById(id).addEventListener('change', e => {
            if(this._isUploading === false) {
                this.clearFileUploaders();
                if(document.getElementById(id) && document.getElementById(id).files) {
                    this._files = document.getElementById(id).files;
                    this.addFiles(document.getElementById(id).files);
                }
            } else {
                //document.getElementById(id).disabled = true;
                this._errorMessage = "Unable to include changes in files while upload in progress";
            }
        })
    }

    addFiles(files) {
        Array.from(files).forEach(file => {this.addFile(file)});
    }

    addFile(file) {
        let uid = file.name; // TODO: unique id generation
        let fu = new FileUploader(file, uid);
        this._fileUploaders.set(uid, fu);
        console.log(this.fileUploadersArray);
    }

    clearFileUploaders() {
        this.fileUploadersArray = new Map();
    }

    get files() {
        return this._files;
    }

    set files(files) {
        this._files = files;
    }

    get fileUploadersArray() {
        return this._fileUploaders;
    }

    set fileUploadersArray(fileUploaders) {
        this._fileUploaders = fileUploaders;
    }
}

class FileUploader {
    constructor(file, uid) {
        this._file = file;
        this._uniqueID = uid;
        this._isUploading = false;
    }
}

class Uploader {
    constructor() {

    }
}


window.CFUploader = CFUploader;