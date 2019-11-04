/**
 * @name Customized Fragment Uploader
 * @author Pritam Sarkar
 * @description CFUploader class is exported to the main window as IIFE
 */

class CFUploader {
    constructor() {
        this.files = new Map();
        this.fileUploaders = new Map();
        this.config = new Config();
        this.stats = new Dashboard();
        this.methods = {};
        this.events = {};
        // TODO: unique id generator function
        // TODO: file type check function
        // TODO: file size limit
        // TODO: concurrent uploading
        // TODO: status of all concurrent uploads
        // TODO: total upload status: files uploaded, percentage
    }

}

class Config {
    constructor() {
        this.chunkSize = 100*1024; // In Bytes
        this.isConcurrentUploadAllowed = true;
        // TODO: file size limit
    }
}

let CFUStatus = Object.freeze({GREEN: 'started', YELLOW: 'paused', RED: 'terminated'});
class Dashboard {
    constructor() {
        this.status = CFUStatus.RED;

    }
}


let CFUploaderObj = (function() {
    // Create a singleton CFUploaderObj from CFUploader class
    let cfuInstance;

    if(cfuInstance) {
        return cfuInstance;
    } else {
        cfuInstance = new CFUploader();
    }

    return cfuInstance;
}());

export default CFUploaderObj;
