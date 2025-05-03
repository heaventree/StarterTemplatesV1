import React, { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import 'grapesjs/dist/css/grapes.min.css';
import './styles.css';

interface EditorProps {
  content?: string;
  onSave?: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ content = '', onSave }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);

  useEffect(() => {
    if (editorRef.current && !editor) {
      const e = grapesjs.init({
        container: editorRef.current,
        height: '700px',
        width: 'auto',
        storageManager: false,
        plugins: [gjsBlocksBasic],
        pluginsOpts: {
          gjsBlocksBasic: {},
        },
        blockManager: {
          appendTo: '#blocks',
        },
        panels: {
          defaults: [
            {
              id: 'panel-switcher',
              el: '.panel__switcher',
              buttons: [
                {
                  id: 'show-blocks',
                  active: true,
                  label: 'Blocks',
                  command: 'show-blocks',
                  togglable: false,
                }
              ],
            },
            {
              id: 'panel-devices',
              el: '.panel__devices',
              buttons: [
                {
                  id: 'device-desktop',
                  label: 'Desktop',
                  command: 'set-device-desktop',
                  active: true,
                  togglable: false,
                },
                {
                  id: 'device-mobile',
                  label: 'Mobile',
                  command: 'set-device-mobile',
                  togglable: false,
                }
              ],
            },
            {
              id: 'basic-actions',
              el: '.panel__basic-actions',
              buttons: [
                {
                  id: 'save',
                  className: 'btn-save',
                  label: 'Save',
                  command: 'save-db',
                  active: false,
                }
              ],
            }
          ]
        },
        deviceManager: {
          devices: [
            {
              name: 'Desktop',
              width: '',
            },
            {
              name: 'Mobile',
              width: '320px',
              widthMedia: '480px',
            }
          ]
        },
      });

      // Load initial content if provided
      if (content) {
        e.setComponents(content);
      }

      // Save command
      e.Commands.add('save-db', {
        run: (editor: any) => {
          if (onSave) {
            const html = editor.getHtml();
            const css = editor.getCss();
            onSave(`<style>${css}</style>${html}`);
          }
        }
      });

      // Show blocks panel by default
      e.Commands.add('show-blocks', {
        getRowEl(editor: any) { return editor.getContainer().closest('.editor-row'); },
        getBlocksEl(row: HTMLElement) { return row.querySelector('.blocks-container'); },

        run(editor: any, sender: any) {
          const row = this.getRowEl(editor);
          const blocksEl = this.getBlocksEl(row);
          blocksEl.style.display = '';
          sender.set('active', true);
        },
        stop(editor: any, sender: any) {
          const row = this.getRowEl(editor);
          const blocksEl = this.getBlocksEl(row);
          blocksEl.style.display = 'none';
          sender.set('active', false);
        }
      });

      // Set device commands
      e.Commands.add('set-device-desktop', {
        run: (editor: any) => editor.setDevice('Desktop')
      });
      e.Commands.add('set-device-mobile', {
        run: (editor: any) => editor.setDevice('Mobile')
      });

      setEditor(e);
    }

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editorRef, content, onSave]);

  return (
    <div className="editor-container">
      <div className="panel__devices"></div>
      <div className="panel__basic-actions"></div>
      <div className="editor-row">
        <div className="editor-canvas">
          <div ref={editorRef}></div>
        </div>
        <div className="panel__switcher"></div>
        <div className="blocks-container">
          <div id="blocks"></div>
        </div>
      </div>
    </div>
  );
};

export default Editor;