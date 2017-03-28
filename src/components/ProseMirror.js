import React from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
// import { DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { exampleSetup, buildMenuItems, buildKeymap } from 'prosemirror-example-setup';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { menuBar, MenuItem, Dropdown, DropdownSubmenu, renderGrouped, icons, joinUpItem, liftItem, selectParentNodeItem, undoItem, redoItem, wrapItem, blockTypeItem } from 'prosemirror-menu'; // menuBar提供浮動置頂,
import { baseKeymap, toggleMark } from 'prosemirror-commands';

class ProseMirror extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log(exampleSetup({schema}))
        let r = buildMenuItems(schema);
        console.log(r);

        this.editorState = EditorState.create({
            schema,
            // plugins: exampleSetup({schema})
            plugins: [
                history(),
                menuBar({
                    floating: true, // toolbar 浮動置頂
                    // content: [[r.toggleStrong]]
                    content: [[
                        new MenuItem({
                            select(state) {
                                // 判斷按鈕是否可使用
                                return true;
                            },
                            onDeselected: "disable", // 決定按鈕不可使用時的處理方式, 預設為隱藏按鈕, 設為"disable"時則反灰該按鈕
                            active(state) {
                                // check active狀態
                                // 若這顆按鈕是on的狀態回傳true
                                // off則回傳false
                                // 若是active狀態
                                // prosemirror會在按鈕上加上class "ProseMirror-menu-active"
                                return false;
                            },
                            // render,
                            icon: { // 詳情請study prosemirror-menu/src/icon.js
                                dom: (() => {
                                    let node = document.createElement('div');
                                    node.className = 'images grid';
                                    return node;
                                })(),
                            },
                            label: '', //
                            title: '按鈕',
                            class: '', // 對icon加上class
                            css: '', // 對icon加上inline css
                            execEvent: '', // 觸發事件 default: mousedown
                            run(state, dispatch) {
                                console.log(state)
                                console.log('run');
                            }
                        }),
                        joinUpItem,
                        liftItem,
                        selectParentNodeItem,
                        undoItem,
                        redoItem,
                        new Dropdown([
                            new MenuItem({
                                label: '選項1',
                                title: '選項1',
                                select() {
                                    return false;
                                },
                                onDeselected: "disable",
                                run() {
                                    console.log('run 1');
                                }
                            }),
                            new MenuItem({
                                label: '選項2',
                                title: '選項2',
                                select() {
                                    return true;
                                },
                                run() {
                                    console.log('run 2');
                                }
                            })
                        ], {
                            label: '下拉選單',
                            title: '下拉選單',
                            class: '',
                            css: ''
                        })
                    ]]
                }),
                keymap(baseKeymap),
                keymap({
                    'Mod-z': undo,
                    'Mod-y': redo
                })
            ]
        });

        this.editor = new EditorView(this.refs.editor, {
            state: this.editorState
        });
    }

    serialize = () => {
        console.log(this.editorState.doc.toJSON());
        console.log(this.editorState)
    }

    destroy = () => {
        this.editor.destroy();
    }

    render() {
        return (
            <div>
                <div id="editor" ref="editor"></div>
                <button onClick={this.serialize}>serialize</button>
                <button onClick={this.destroy}>destroy</button>
            </div>
        );
    }
};

export default ProseMirror;
