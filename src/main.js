/**
 * @name Customized Fragment Uploader
 * @author Pritam Sarkar
 */
export class CFUploader {
    constructor() {
        this._fileUploaders = new Map();
        this._files = null;
        this._targetDivID = "";
        this._isUploading = false;
        this._errorMessage = "";
        this._chunkSize = 100*1024; // In Bytes
        // TODO: unique id generator function
        // TODO: file type check function
        // TODO: file size limit
        // TODO: concurrent uploading
        // TODO: status of all concurrent uploads
        // TODO: total upload status: files uploaded, percentage
        this._uploadAPIs = {
            "preUploadInitiation" : null,
            "postUploadCompletion" : null,
            "preFileUpload" : null,
            "fileUploadURL" : null,
            "fragmentUploadURL" : null,
            "postFileUpload" : null
        };
    }

    static health() {
        console.log("CustomizedFragmentUploader running in global window!");
    }

    watchDOMId(id) {
        document.getElementById(id).addEventListener('change', e => {
            if(this.isUploading === false) {
                this.clearFileUploaders();
                this.targetDivID = id;
                if(document.getElementById(id) && document.getElementById(id).files) {
                    this.files = document.getElementById(id).files;
                    this.addFiles(document.getElementById(id).files);
                }
            } else {
                this.errorMessage = "Unable to include changes in files while upload in progress!";
            }
        })
    }

    addFiles(files) {
        Array.from(files).forEach(file => {this.addFile(file)});
    }

    addFile(file) {
        let uid = file.name; // TODO: unique id generation
        let fu = new FileUploader(this, file, uid);
        this._fileUploaders.set(uid, fu);
        console.log(this.fileUploadersArray);
    }

    clearFileUploaders() {
        this.fileUploadersArray = new Map();
    }

    initiateUpload() {
        if(this.fileUploadersArray.size === 0) {
            this.errorMessage = "No files selected to upload!";
        } else {

            if(!!this.uploadAPIs.preUploadInitiation) {
                document.getElementById(this.targetDivID).disabled = true;
                this.uploadAPIs.preUploadInitiation.onSuccess = (response) => {
                    this.fileUploadersArray.forEach((fileUploader) => {
                        fileUploader.startUploading();
                    });
                };
                this.uploadAPIs.preUploadInitiation.onFailure = (response) => {
                    document.getElementById(this.targetDivID).disabled = false;
                    console.log("preUploadInitiation failed!")
                };
                this.uploadAPIs.preUploadInitiation.execute();
            } else {
                document.getElementById(this.targetDivID).disabled = true;
                this.fileUploadersArray.forEach((fileUploader) => {
                    fileUploader.startUploading();
                });
            }
        }
    }

    cancelUpload() {
        // TODO : cancel upload
    }

    get fileUploadersArray() {
        return this._fileUploaders;
    }

    set fileUploadersArray(fileUploaders) {
        this._fileUploaders = fileUploaders;
    }

    get files() {
        return this._files;
    }

    set files(files) {
        this._files = files;
    }

    get targetDivID() {
        return this._targetDivID;
    }

    set targetDivID(id) {
        this._targetDivID = id;
    }

    get isUploading() {
        return this._isUploading;
    }

    set isUploading(bool) {
        if(this.isUploading === true && bool === false) {
            // TODO: change condition to cfUploader status = SUCCESS
            if(!!this.uploadAPIs.postUploadCompletion) {
                this.uploadAPIs.postUploadCompletion.execute();
                this.uploadAPIs.postUploadCompletion.onSuccess = (response) => {
                    document.getElementById(this.targetDivID).disabled = false;
                };
            }
        }
        this._isUploading = !!bool;
    }

    get errorMessage() {
        return this._errorMessage;
    }

    set errorMessage(error) {
        this._errorMessage = error;
    }

    get chunkSize() {
        return this._chunkSize;
    }

    set chunkSize(size) {
        this._chunkSize = size;
    }

    get uploadAPIs() {
        return this._uploadAPIs;
    }

    set_API_URL(apiName, apiURLObject) {
        let APIs = this.uploadAPIs;
        if(APIs.hasOwnProperty(apiName)) {
            APIs[apiName] = apiURLObject;
        }
        this.uploadAPIs = APIs;
    }

    set uploadAPIs(apis) {
        this._uploadAPIs = apis;
    }
}

class FileUploader {
    constructor(parentCFUploader, file, uid) {
        this._parentCFUploader = parentCFUploader;
        this._file = file;
        this._fragmentUploaders = new Map();
        this._isFileUploading = false;
        this._uid = uid;
    }

    startUploading() {
        this.parentCFUploader.isUploading = true;
        let fileUploadPromise = new Promise((resolve, reject) => {
            if(!!this.parentCFUploader.uploadAPIs.preFileUpload) {
                this.parentCFUploader.uploadAPIs.preFileUpload.onSuccess = (response) => {
                    resolve(true);
                };
                this.parentCFUploader.uploadAPIs.preFileUpload.onFailure = (response) => {
                    console.log("preFileUpload failed!");
                    this.isFileUploading = false;
                    this.cancelFileUpload();
                    reject(false);
                };
                this.parentCFUploader.uploadAPIs.preFileUpload.execute();
            } else {
                resolve(true);
            }
        }).then((result) => {
            return new Promise((resolve, reject) => {
                if(!!this.parentCFUploader.uploadAPIs.fileUploadURL) {
                    this.parentCFUploader.uploadAPIs.fileUploadURL.onSuccess = (response) => {
                        resolve(true);
                    };
                    this.parentCFUploader.uploadAPIs.fileUploadURL.onFailure = (response) => {
                        console.log("fileUploadURL failed!");
                        this.isFileUploading = false;
                        this.cancelFileUpload();
                        reject(false);
                    };
                    this.parentCFUploader.uploadAPIs.fileUploadURL.execute();
                } else if(!!this.parentCFUploader.uploadAPIs.fragmentUploadURL) {
                    // TODO: fragment the file, create uploaders, check if all fragments are uploaded, on Promise.all resolve
                    let fragmentUploaders = this.generateFragments();
                    this.fragmentUploaders = fragmentUploaders;
                    fragmentUploaders.forEach((fu) => {

                    });
                } else {
                    resolve(true);
                }
            });
        }).then((result) => {
            return new Promise((resolve, reject) => {
                if(!!this.parentCFUploader.uploadAPIs.postFileUpload) {
                    this.parentCFUploader.uploadAPIs.postFileUpload.onSuccess = (response) => {
                        resolve(true);
                    };
                    this.parentCFUploader.uploadAPIs.postFileUpload.onFailure = (response) => {
                        console.log("postFileUpload failed!");
                        this.isFileUploading = false;
                        this.cancelFileUpload();
                        reject(false);
                    };
                    this.parentCFUploader.uploadAPIs.postFileUpload.execute();
                } else {
                    resolve(true);
                }
            });
        });
    }

    cancelFileUpload() {
        // TODO: on cancel file upload
    }

    /*
    fragment file, create uploaders
     */
    generateFragments() {
        let fragmentUploader, fragmentUploaders = new Map();
        let fragmentSize = this.parentCFUploader.chunkSize, file = this.file;
        let fragmentIndex = 0, offset, fragment, fragmentUID, noOfFragments = Math.ceil(file.size / fragmentSize);
        while (fragmentIndex < noOfFragments) {
            offset = fragmentIndex * fragmentSize;
            fragment = file.slice(offset, fragmentSize);
            fragmentUID = this.uid.toString() + "_" + fragmentIndex.toString();
            fragmentUploader = FragmentUploader(this.parentCFUploader, this, fragment, fragmentUID);
            fragmentUploaders.set(fragmentUID, fragmentUploader);
            fragmentIndex++;
        }
        return fragmentUploaders;
    }

    get parentCFUploader() {
        return this._parentCFUploader;
    }

    set parentCFUploader(value) {
        this._parentCFUploader = value;
    }

    get file() {
        return this._file;
    }

    set file(value) {
        this._file = value;
    }

    get uid() {
        return this._uid;
    }

    set uid(value) {
        this._uid = value;
    }

    get fragmentUploaders() {
        return this._fragmentUploaders;
    }

    set fragmentUploaders(value) {
        this._fragmentUploaders = value;
    }

    get isFileUploading() {
        return this._isFileUploading;
    }

    set isFileUploading(bool) {
        this._isFileUploading = !!bool;
    }
}

class FragmentUploader {
    constructor(parentCFUploader, parentFileUploader, fragment, uid) {
        this._parentCFUploader = parentCFUploader;
        this._parentFileUploader = parentFileUploader;
        this._fragment = fragment;
        this._isFragmentUploading = false;
        this._uid = uid;
    }

    get parentCFUploader() {
        return this._parentCFUploader;
    }

    set parentCFUploader(value) {
        this._parentCFUploader = value;
    }

    get parentFileUploader() {
        return this._parentFileUploader;
    }

    set parentFileUploader(value) {
        this._parentFileUploader = value;
    }

    get fragment() {
        return this._fragment;
    }

    set fragment(value) {
        this._fragment = value;
    }

    get uid() {
        return this._uid;
    }

    set uid(value) {
        this._uid = value;
    }

    get isFragmentUploading() {
        return this._isFragmentUploading;
    }

    set isFragmentUploading(value) {
        this._isFragmentUploading = value;
    }

}

class UploaderAPIObject {
    constructor({"url": url, "method": method, "header": header, "body": body, "success": postSuccess, "failure": postFailure}) {
        this._url = url;
        this._method = method;
        this._header = !!header ? header : {};
        this._body = body; // TODO: accept json body
        this._onSuccess = null;
        this._onFailure = null;
        this._postSuccess = postSuccess;
        this._postFailure = postFailure;
    }

    execute() {
        let xhr;
        if(window.XMLHttpRequest) {
            // for modern browsers
            xhr = new XMLHttpRequest();
        } else {
            // for old IE browsers
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhr.onreadystatechange = (e) => {
            if(xhr.readyState === 4) {
                let response = xhr.responseText && JSON.parse(xhr.responseText);
                if(xhr.status >= 200 && xhr.status <300) {
                    this.onSuccess(response);
                    this.postSuccess(response);
                } else {
                    this.onFailure(response);
                    this.postFailure(response);
                }
            }
        };

        xhr.open(this.method, this.url, true);
        Object.keys(this.header).forEach((key) => {
            xhr.setRequestHeader(key, this.header[key]);
        });

        if(this.method === "GET") {
            xhr.send();
        } else if(this.method === "POST" || this.method === "PUT") {
            xhr.send(this.body);
        }
    }

    get method() {
        return this._method;
    }

    set method(value) {
        this._method = value;
    }

    get body() {
        return this._body;
    }

    set body(value) {
        this._body = value;
    }

    get url() {
        return this._url;
    }

    set url(value) {
        this._url = value;
    }

    get header() {
        return this._header;
    }

    set header(value) {
        this._header = value;
    }

    get onSuccess() {
        return this._onSuccess;
    }

    set onSuccess(value) {
        this._onSuccess = value;
    }

    get onFailure() {
        return this._onFailure;
    }

    set onFailure(value) {
        this._onFailure = value;
    }

    get postSuccess() {
        return this._postSuccess;
    }

    set postSuccess(value) {
        this._postSuccess = value;
    }

    get postFailure() {
        return this._postFailure;
    }

    set postFailure(value) {
        this._postFailure = value;
    }

}

window.CFUploader = CFUploader;
window.CFUploaderAPI = UploaderAPIObject;
