import { Plugin } from 'prosemirror-state';
import { Extension } from '@tiptap/core';

const CustomPasteHandler = Extension.create({
  name: 'customPasteHandler',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste: (view, event, slice) => {
            let hasFiles = false;
            let reader = new FileReader();
            
            reader.onload = function(event) {
              let imageUrl = event.target.result;
              const node = view.state.schema.nodes.image.create({ src: imageUrl });
              const transaction = view.state.tr.replaceSelectionWith(node);
              view.dispatch(transaction);
            };
            
            Array.from(event.clipboardData.files)
              .filter(item => item.type.startsWith("image"))
              .forEach(item => {
                reader.readAsDataURL(item);
                hasFiles = true;
              });
            
            if (hasFiles) {
              event.preventDefault();
              return true;
            }
            return false;
          },
        },
      }),
    ]
  },
});

export default CustomPasteHandler;
