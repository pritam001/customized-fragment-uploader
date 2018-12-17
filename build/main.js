"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @name Customized Fragment Uploader
 * @author Pritam Sarkar
 */
var CFUploader = exports.CFUploader = function () {
    function CFUploader() {
        _classCallCheck(this, CFUploader);

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

    _createClass(CFUploader, [{
        key: "watchDOMId",
        value: function watchDOMId(id) {
            var _this = this;

            document.getElementById(id).addEventListener('change', function (e) {
                if (_this._isUploading === false) {
                    _this.clearFileUploaders();
                    if (document.getElementById(id) && document.getElementById(id).files) {
                        _this._files = document.getElementById(id).files;
                        _this.addFiles(document.getElementById(id).files);
                    }
                } else {
                    document.getElementById(id).disabled = true;
                    _this._errorMessage = "Unable to include changes in files while upload in progress";
                }
            });
        }
    }, {
        key: "addFiles",
        value: function addFiles(files) {
            var _this2 = this;

            Array.from(files).forEach(function (file) {
                _this2.addFile(file);
            });
        }
    }, {
        key: "addFile",
        value: function addFile(file) {
            var uid = file.name; // TODO: unique id generation
            var fu = new FileUploader(file, uid);
            this._fileUploaders.set(uid, fu);
            console.log(this.fileUploadersArray);
        }
    }, {
        key: "clearFileUploaders",
        value: function clearFileUploaders() {
            this.fileUploadersArray = new Map();
        }
    }, {
        key: "files",
        get: function get() {
            return this._files;
        },
        set: function set(files) {
            this._files = files;
        }
    }, {
        key: "fileUploadersArray",
        get: function get() {
            return this._fileUploaders;
        },
        set: function set(fileUploaders) {
            this._fileUploaders = fileUploaders;
        }
    }], [{
        key: "health",
        value: function health() {
            console.log("FragmentUploader running in global window!");
        }
    }]);

    return CFUploader;
}();

var FileUploader = function FileUploader(file, uid) {
    _classCallCheck(this, FileUploader);

    this._file = file;
    this._uniqueID = uid;
    this._isUploading = false;
};

var Uploader = function Uploader() {
    _classCallCheck(this, Uploader);
};

window.CFUploader = CFUploader;
