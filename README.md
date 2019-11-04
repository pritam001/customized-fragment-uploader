# customized-fragment-uploader
A small javascript library to upload files with customization and fragmentation


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

