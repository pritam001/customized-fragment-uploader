# customized-fragment-uploader
A small javascript library to upload files with customization and fragmentation

[![made-with-js](https://img.shields.io/badge/Made%20with-Javascript-1f425f.svg)](https://developer.mozilla.org/bm/docs/Web/JavaScript)
[![Dev Status](https://img.shields.io/badge/Dev%20Status-WIP-orange.svg)](https://shields.io/)
[![GitHub release](https://img.shields.io/github/release/pritam001/customized-fragment-uploader.svg)](https://github.com/pritam001/customized-fragment-uploader/releases/)
[![GitHub license](https://img.shields.io/github/license/pritam001/customized-fragment-uploader.svg)](https://github.com/pritam001/customized-fragment-uploader/blob/master/LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/pritam001/customized-fragment-uploader/graphs/commit-activity)
![Github Fork](https://img.shields.io/github/forks/pritam001/customized-fragment-uploader.svg?style=social&label=Fork&maxAge=2592000)


### Features:
1. Select and upload multiple files
2. Fragment each file and upload (Fragmentation is optional)
3. Progress score
4. Customization for concurrent uploading, chunks


### Usage:
```javascript
import {CFUploader} from "CFUploader";
window.CFUploader = new CFUploader();
```


### Todo:
- [ ] Rewrite src/main.js to src/cfu.js as IIFE to reduce namespace pollution
- [ ] Rewrite npm scripts
- [ ] Create dummy server for file upload
- [ ] Testing framework
- [ ] Gulp v4


### Future Scope:
1. React CFU
2. Vue CFU

