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
        this._targetDivID = "";
        this._isUploading = false;
        this._errorMessage = "";
        // TODO: chunk size
        // TODO: unique id generator function
        // TODO: file type check function
        // TODO: file size limit
        // TODO: concurrent uploading
        // TODO: status of all concurrent uploads
        // TODO: total upload status: files uploaded, percentage
        this._uploadAPIs = {
            "preUploadInitiation": null,
            "postUploadCompletion": null,
            "preFileUpload": null,
            "fileUploadURL": null,
            "postFileUpload": null
        };
    }

    _createClass(CFUploader, [{
        key: "watchDOMId",
        value: function watchDOMId(id) {
            var _this = this;

            document.getElementById(id).addEventListener('change', function (e) {
                if (_this.isUploading === false) {
                    _this.clearFileUploaders();
                    _this.targetDivID = id;
                    if (document.getElementById(id) && document.getElementById(id).files) {
                        _this.files = document.getElementById(id).files;
                        _this.addFiles(document.getElementById(id).files);
                    }
                } else {
                    _this.errorMessage = "Unable to include changes in files while upload in progress!";
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
            var fu = new FileUploader(this, file, uid);
            this._fileUploaders.set(uid, fu);
            console.log(this.fileUploadersArray);
        }
    }, {
        key: "clearFileUploaders",
        value: function clearFileUploaders() {
            this.fileUploadersArray = new Map();
        }
    }, {
        key: "initiateUpload",
        value: function initiateUpload() {
            var _this3 = this;

            if (this.fileUploadersArray.size === 0) {
                this.errorMessage = "No files selected to upload!";
            } else {

                if (!!this.uploadAPIs.preUploadInitiation) {
                    document.getElementById(this.targetDivID).disabled = true;
                    this.uploadAPIs.preUploadInitiation.onSuccess = function (response) {
                        _this3.fileUploadersArray.forEach(function (fileUploader) {
                            fileUploader.startUploading();
                        });
                    };
                    this.uploadAPIs.preUploadInitiation.onFailure = function (response) {
                        document.getElementById(_this3.targetDivID).disabled = false;
                        console.log("preUploadInitiation failed!");
                    };
                    this.uploadAPIs.preUploadInitiation.execute();
                } else {
                    document.getElementById(this.targetDivID).disabled = true;
                    this.fileUploadersArray.forEach(function (fileUploader) {
                        fileUploader.startUploading();
                    });
                }
            }
        }
    }, {
        key: "cancelUpload",
        value: function cancelUpload() {
            // TODO : cancel upload
        }
    }, {
        key: "set_API_URL",
        value: function set_API_URL(apiName, apiURLObject) {
            var APIs = this.uploadAPIs;
            if (APIs.hasOwnProperty(apiName)) {
                APIs[apiName] = apiURLObject;
            }
            this.uploadAPIs = APIs;
        }
    }, {
        key: "fileUploadersArray",
        get: function get() {
            return this._fileUploaders;
        },
        set: function set(fileUploaders) {
            this._fileUploaders = fileUploaders;
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
        key: "targetDivID",
        get: function get() {
            return this._targetDivID;
        },
        set: function set(id) {
            this._targetDivID = id;
        }
    }, {
        key: "isUploading",
        get: function get() {
            return this._isUploading;
        },
        set: function set(bool) {
            var _this4 = this;

            if (this.isUploading === true && bool === false) {
                // TODO: change condition to cfUploader status = SUCCESS
                if (!!this.uploadAPIs.postUploadCompletion) {
                    this.uploadAPIs.postUploadCompletion.execute();
                    this.uploadAPIs.postUploadCompletion.onSuccess = function (response) {
                        document.getElementById(_this4.targetDivID).disabled = false;
                    };
                }
            }
            this._isUploading = !!bool;
        }
    }, {
        key: "errorMessage",
        get: function get() {
            return this._errorMessage;
        },
        set: function set(error) {
            this._errorMessage = error;
        }
    }, {
        key: "uploadAPIs",
        get: function get() {
            return this._uploadAPIs;
        },
        set: function set(apis) {
            this._uploadAPIs = apis;
        }
    }], [{
        key: "health",
        value: function health() {
            console.log("CustomizedFragmentUploader running in global window!");
        }
    }]);

    return CFUploader;
}();

var FileUploader = function () {
    function FileUploader(cfUploader, file, uid) {
        _classCallCheck(this, FileUploader);

        this._parentCFUploader = cfUploader;
        this._file = file;
        this._uniqueID = uid;
        this._isFileUploading = false;
    }

    _createClass(FileUploader, [{
        key: "startUploading",
        value: function startUploading() {
            var _this5 = this;

            this.parentCFUploader.isUploading = true;
            var fileUploadPromise = new Promise(function (resolve, reject) {
                if (!!_this5.parentCFUploader.uploadAPIs.preFileUpload) {
                    _this5.parentCFUploader.uploadAPIs.preFileUpload.onSuccess = function (response) {
                        resolve(true);
                    };
                    _this5.parentCFUploader.uploadAPIs.preFileUpload.onFailure = function (response) {
                        console.log("preFileUpload failed!");
                        _this5.isFileUploading = false;
                        _this5.cancelFileUpload();
                        reject(false);
                    };
                    _this5.parentCFUploader.uploadAPIs.preFileUpload.execute();
                } else {
                    resolve(true);
                }
            }).then(function (result) {
                return new Promise(function (resolve, reject) {
                    if (!!_this5.parentCFUploader.uploadAPIs.fileUploadURL) {
                        _this5.parentCFUploader.uploadAPIs.fileUploadURL.onSuccess = function (response) {
                            resolve(true);
                        };
                        _this5.parentCFUploader.uploadAPIs.fileUploadURL.onFailure = function (response) {
                            console.log("fileUploadURL failed!");
                            _this5.isFileUploading = false;
                            _this5.cancelFileUpload();
                            reject(false);
                        };
                        _this5.parentCFUploader.uploadAPIs.fileUploadURL.execute();
                    } else {
                        resolve(true);
                    }
                });
            }).then(function (result) {
                return new Promise(function (resolve, reject) {
                    if (!!_this5.parentCFUploader.uploadAPIs.postFileUpload) {
                        _this5.parentCFUploader.uploadAPIs.postFileUpload.onSuccess = function (response) {
                            resolve(true);
                        };
                        _this5.parentCFUploader.uploadAPIs.postFileUpload.onFailure = function (response) {
                            console.log("postFileUpload failed!");
                            _this5.isFileUploading = false;
                            _this5.cancelFileUpload();
                            reject(false);
                        };
                        _this5.parentCFUploader.uploadAPIs.postFileUpload.execute();
                    } else {
                        resolve(true);
                    }
                });
            });
        }
    }, {
        key: "cancelFileUpload",
        value: function cancelFileUpload() {
            // TODO: on cancel file upload
        }
    }, {
        key: "parentCFUploader",
        get: function get() {
            return this._parentCFUploader;
        },
        set: function set(cfUploader) {
            this._parentCFUploader = cfUploader;
        }
    }, {
        key: "isFileUploading",
        get: function get() {
            return this._isFileUploading;
        },
        set: function set(bool) {
            this._isFileUploading = !!bool;
        }
    }]);

    return FileUploader;
}();

var FragmentUploader = function FragmentUploader() {
    _classCallCheck(this, FragmentUploader);
};

var UploaderAPIObject = function () {
    function UploaderAPIObject(_ref) {
        var url = _ref["url"],
            method = _ref["method"],
            header = _ref["header"],
            body = _ref["body"],
            postSuccess = _ref["success"],
            postFailure = _ref["failure"];

        _classCallCheck(this, UploaderAPIObject);

        this._url = url;
        this._method = method;
        this._header = !!header ? header : {};
        this._body = body;
        this._onSuccess = null;
        this._onFailure = null;
        this._postSuccess = postSuccess;
        this._postFailure = postFailure;
    }

    _createClass(UploaderAPIObject, [{
        key: "execute",
        value: function execute() {
            var _this6 = this;

            var xhr = void 0;
            if (window.XMLHttpRequest) {
                // for modern browsers
                xhr = new XMLHttpRequest();
            } else {
                // for old IE browsers
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }

            xhr.onreadystatechange = function (e) {
                if (xhr.readyState === 4) {
                    var response = xhr.responseText && JSON.parse(xhr.responseText);
                    if (xhr.status >= 200 && xhr.status < 300) {
                        _this6.onSuccess(response);
                        _this6.postSuccess(response);
                    } else {
                        _this6.onFailure(response);
                        _this6.postFailure(response);
                    }
                }
            };

            xhr.open(this.method, this.url, true);
            Object.keys(this.header).forEach(function (key) {
                xhr.setRequestHeader(key, _this6.header[key]);
            });

            if (this.method === "GET") {
                xhr.send();
            } else if (this.method === "POST" || this.method === "PUT") {
                xhr.send(this.body);
            }
        }
    }, {
        key: "method",
        get: function get() {
            return this._method;
        },
        set: function set(value) {
            this._method = value;
        }
    }, {
        key: "body",
        get: function get() {
            return this._body;
        },
        set: function set(value) {
            this._body = value;
        }
    }, {
        key: "url",
        get: function get() {
            return this._url;
        },
        set: function set(value) {
            this._url = value;
        }
    }, {
        key: "header",
        get: function get() {
            return this._header;
        },
        set: function set(value) {
            this._header = value;
        }
    }, {
        key: "onSuccess",
        get: function get() {
            return this._onSuccess;
        },
        set: function set(value) {
            this._onSuccess = value;
        }
    }, {
        key: "onFailure",
        get: function get() {
            return this._onFailure;
        },
        set: function set(value) {
            this._onFailure = value;
        }
    }, {
        key: "postSuccess",
        get: function get() {
            return this._postSuccess;
        },
        set: function set(value) {
            this._postSuccess = value;
        }
    }, {
        key: "postFailure",
        get: function get() {
            return this._postFailure;
        },
        set: function set(value) {
            this._postFailure = value;
        }
    }]);

    return UploaderAPIObject;
}();

window.CFUploader = CFUploader;
window.CFUploaderAPI = UploaderAPIObject;
