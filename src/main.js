export class FragmentUploader {
    constructor() {
        this.fileUploaders = [];
        this.noOfFiles = 0;
    }

    static health() {
        console.log("FragmentUploader running in global window!");
    }


}



window.FragmentUploader = FragmentUploader;