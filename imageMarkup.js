import Image from '@tiptap/extension-image';
import * as markerjs2 from 'markerjs2';

const ImageMarkup = Image.extend({
    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            style: {
                default: 'cursor: pointer',
            },
        };
    },
    addNodeView() {
        return ({ node, editor, getPos }) => {
            const { view, options: { editable }, } = editor;
            const { src, alt, style } = node.attrs;
            const $container = document.createElement('div');
            const $img = document.createElement('img');
            const $btn = document.createElement('button');

            
        $btn.innerHTML = `<svg fill="#ffffff" height="18px" width="18px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 306.637 306.637" xml:space="preserve" stroke="#ffffff">
        <g id="SVGRepo_iconCarrier">
          <g>
            <path d="M12.809,238.52L0,306.637l68.118-12.809l184.277-184.277l-55.309-55.309L12.809,238.52z M60.79,279.943l-41.992,7.896 l7.896-41.992L197.086,75.455l34.096,34.096L60.79,279.943z"></path>
            <path d="M251.329,0l-41.507,41.507l55.308,55.308l41.507-41.507L251.329,0z M231.035,41.507l20.294-20.294l34.095,34.095 L265.13,75.602L231.035,41.507z"></path>
          </g>
        </g>
      </svg>
      `; 
        $btn.style.position = 'absolute';
        $btn.style.top = '90%';
        $btn.style.right = '0%';
        $btn.style.transform = 'translateX(-50%)';
        $btn.style.zIndex = '10';
        $btn.style.borderRadius = '50%'; 
        $btn.style.width = '35px'; 
        $btn.style.height = '35px'; 
        $btn.style.backgroundColor = '#5e5e5c'; 
        $btn.style.border = '1px solid #5e5e5c'; 
        $btn.style.display = 'flex';
        $btn.style.alignItems = 'center';
        $btn.style.justifyContent = 'center';

            $container.appendChild($img);
            $container.appendChild($btn); 
            $img.setAttribute('src', src);
            $img.setAttribute('alt', alt);
            $img.setAttribute('style', style);
            $img.setAttribute('draggable', 'true');


            $btn.addEventListener('click', () => {
                const markerArea = new markerjs2.MarkerArea($img);
                markerArea.uiStyleSettings.toolbarOverflowBlockStyleColorsClassName = "bg-black";

                markerArea.settings.popupMargin = 100;
                markerArea.settings.displayMode = 'popup';
                markerArea.uiStyleSettings.zIndex = 5000;
                markerArea.settings.defaultColor = "#5e5e5c";
                markerArea.settings.defaultFillColor = "transparent"
                markerArea.settings.defaultText = "Hier je text";

            
                markerArea.addEventListener('render', (event) => {
                    $img.src = event.dataUrl;
                    if (typeof getPos === 'function') {
                        const newAttrs = Object.assign({}, node.attrs, { src: event.dataUrl });
                        view.dispatch(view.state.tr.setNodeMarkup(getPos(), null, newAttrs));
                    }
                });
                markerArea.show();
                
                });
            

            if (!editable) return { dom: $img };
            
            $container.style.display = 'inline-block';
            $container.style.position = 'relative'; 

            $img.addEventListener('click', (e) => { 
                e.stopPropagation(); 
                $container.setAttribute('style', `position: relative; border: #6C6C6C; ${style} cursor: pointer; display: inline-block;`);
                $container.style.width = `${$img.offsetWidth}px`;

                if (!$container.contains($btn)) {
                    $container.appendChild($btn);
                }
                
                const dotsPosition = [
                    'top: -4px; left: -4px; cursor: nwse-resize;',
                    'top: -4px; right: -4px; cursor: nesw-resize;',
                    'bottom: -4px; left: -4px; cursor: nesw-resize;',
                    'bottom: -4px; right: -4px; cursor: nwse-resize;',
                ];
                
                for (let index = 0; index < 4; index++) {
                    const $dot = document.createElement('div');
                    $dot.setAttribute('style', `position: absolute; width: 9px; height: 9px; border: 1.5px solid #5b5c5b; border-radius: 50%; ${dotsPosition[index]}`);
                    $dot.addEventListener('mousedown', (e) => {
                        e.preventDefault();
                        let isResizing = true;
                        let startX = e.clientX;
                        let startWidth = $img.offsetWidth;
                        let startHeight = $img.offsetHeight;
                        const onMouseMove = (e) => {
                            if (!isResizing) return;
                            const deltaX = e.clientX - startX;
                            const aspectRatio = startWidth / startHeight;
                            const newWidth = startWidth + deltaX;
                            const newHeight = newWidth / aspectRatio;
                            $container.style.width = newWidth + 'px';
                            $container.style.height = newHeight + 'px';
                            $img.style.width = newWidth + 'px';
                            $img.style.height = newHeight + 'px';
                        };
                        const onMouseUp = () => {
                            isResizing = false;
                            if (typeof getPos === 'function') {
                                const newAttrs = Object.assign({}, node.attrs, { style: $img.style.cssText });
                                view.dispatch(view.state.tr.setNodeMarkup(getPos(), null, newAttrs));
                            }
                            document.removeEventListener('mousemove', onMouseMove);
                            document.removeEventListener('mouseup', onMouseUp);
                        };
                        document.addEventListener('mousemove', onMouseMove);
                        document.addEventListener('mouseup', onMouseUp);
                    });
                    $container.appendChild($dot);
                }
                
                document.addEventListener('click', (e) => {
                    if (!$container.contains(e.target)) {
                        $container.removeAttribute('style');
                        while ($container.childElementCount > 1) {
                            $container.removeChild($container.lastChild);
                        }
                    }
                }, { once: true }); 
            });
            
            return { dom: $container };
        };
    },
});

export { ImageMarkup, ImageMarkup as default };
