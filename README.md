# `tiptap-extension-ImagePlus`

![tiptap-extension-resize-image](https://github.com/bae-sh/tiptap-extension-resize-image/assets/37887690/e79f3d2a-c2df-4506-ac4a-fb71918569b4)

This NPM Package contains 3 different extensions:

 - Paste handler, is used to paste images with keyboard or by right clicking in the tiptap editor. When pasting the image is converted to a base64.
 - Resizer, when pasted the image can be resized when clicking on it.
 - Image Annotation, when clicking on an image in the editor a button appears to edit the image. MarkerJS is used to annotate the image and after you are done the image is replaced by the edited image.

## Installation

You can install it using npm:

```bash
$ npm install tiptap-extension-imageplus
```

## Usage

```javascript
import PasteHandler from 'tiptap-extension-imageplus';
import ImageMarkup from 'tiptap-extension-imageplus';
import { EditorContent, useEditor } from '@tiptap/react';

const editor = useEditor({
  extensions: [PasteHandler, ImageMarkup],
  content: `<img src="https://source.unsplash.com/8xznAGy4HcY/800x400" />`,
});
```
