import React from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { nodes, marks } from 'prosemirror-schema-basic';
// import { nodes, marks } from 'prosemirror-schema-table';
import { addListNodes, wrapInList, orderedList, bulletList, splitListItem, sinkListItem, liftListItem } from 'prosemirror-schema-list';
import { exampleSetup, buildMenuItems, buildKeymap } from 'prosemirror-example-setup';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { menuBar, MenuItem, Dropdown, DropdownSubmenu, renderGrouped, icons, wrapItem, blockTypeItem } from 'prosemirror-menu'; // menuBar提供浮動置頂,
import * as commands from 'prosemirror-commands';
// import { findWrapping } from 'prosemirror-transform';

class ProseMirror extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let extMarks = Object.assign({}, marks, {
            u: {
                parseDOM: [{tag: 'u'}],
                toDOM() {
                    return ['u'];
                }
            },
            del: {
                parseDOM: [{tag: 'del'}],
                toDOM() {
                    return ['del'];
                }
            }
        });

        let schema = new Schema({
            nodes,
            marks: extMarks
        });

        let nsSchema = new Schema({
            nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
            marks: schema.spec.marks
        });

        // keymap start
        let baseKeymap = {
            "Enter": commands.chainCommands(splitListItem(nsSchema.nodes.list_item), commands.newlineInCode, commands.createParagraphNear, commands.liftEmptyBlock, commands.splitBlock),
            "Mod-Enter": commands.exitCode,

            "Backspace": commands.chainCommands(commands.deleteSelection, commands.joinBackward),
            "Mod-Backspace": commands.chainCommands(commands.deleteSelection, commands.joinBackward),
            "Delete": commands.chainCommands(commands.deleteSelection, commands.joinForward),
            "Mod-Delete": commands.chainCommands(commands.deleteSelection, commands.joinForward),

            "Alt-ArrowUp": commands.joinUp,
            "Alt-ArrowDown": commands.joinDown,
            "Mod-BracketLeft": commands.lift,
            "Escape": commands.selectParentNode,

            'Mod-z': undo,
            'Mod-y': redo,
            'Mod-[': liftListItem(nsSchema.nodes.list_item),
            'Mod-]': sinkListItem(nsSchema.nodes.list_item)
        };

        // declare global: os, navigator
        const mac = typeof navigator != "undefined" ? /Mac/.test(navigator.platform)
                : typeof os != "undefined" ? os.platform() == "darwin" : false

        if (mac) {
            let extra = {
                "Ctrl-h": baseKeymap["Backspace"],
                "Alt-Backspace": baseKeymap["Mod-Backspace"],
                "Ctrl-d": baseKeymap["Delete"],
                "Ctrl-Alt-Backspace": baseKeymap["Mod-Delete"],
                "Alt-Delete": baseKeymap["Mod-Delete"],
                "Alt-d": baseKeymap["Mod-Delete"]
            }
            for (let prop in extra) baseKeymap[prop] = extra[prop]
        }
        // keymap end

        this.editorState = EditorState.create({
            schema: nsSchema,
            // plugins: exampleSetup({schema})
            plugins: [
                history(),
                menuBar({
                    floating: true, // toolbar 浮動置頂
                    content: [[
                        new MenuItem({
                            select(state) {
                                return commands.toggleMark(nsSchema.marks.strong)(state);
                            },
                            active(state) {
                                let {from, $from, to, empty} = state.selection;
                                if(empty) {
                                    // 未框選時check游標是否在樣式的範圍內
                                    return nsSchema.marks.strong.isInSet(state.storedMarks || $from.marks())
                                } else {
                                    // 框選時check框選的部分是否包含有套用樣式的範圍
                                    return state.doc.rangeHasMark(from, to, nsSchema.marks.strong)
                                }
                            },
                            icon: {
                                dom: (() => {
                                    let node = document.createElement('div');
                                    node.innerText = '粗體';
                                    return node;
                                })()
                            },
                            label: '',
                            title: '粗體',
                            run: commands.toggleMark(nsSchema.marks.strong)
                        }),
                        new MenuItem({
                            select(state) {
                                return commands.toggleMark(nsSchema.marks.em)(state);
                            },
                            active(state) {
                                let {from, $from, to, empty} = state.selection;
                                if(empty) {
                                    // 未框選時check游標是否在樣式的範圍內
                                    return nsSchema.marks.em.isInSet(state.storedMarks || $from.marks())
                                } else {
                                    // 框選時check框選的部分是否包含有套用樣式的範圍
                                    return state.doc.rangeHasMark(from, to, nsSchema.marks.em)
                                }
                            },
                            icon: {
                                dom: (() => {
                                    let node = document.createElement('div');
                                    node.innerText = '斜體';
                                    return node;
                                })()
                            },
                            label: '',
                            title: '斜體',
                            run: commands.toggleMark(nsSchema.marks.em)
                        }),
                        new MenuItem({
                            select(state) {
                                return commands.toggleMark(nsSchema.marks.u)(state);
                            },
                            active(state) {
                                let {from, $from, to, empty} = state.selection;
                                if(empty) {
                                    // 未框選時check游標是否在樣式的範圍內
                                    return nsSchema.marks.u.isInSet(state.storedMarks || $from.marks())
                                } else {
                                    // 框選時check框選的部分是否包含有套用樣式的範圍
                                    return state.doc.rangeHasMark(from, to, nsSchema.marks.u)
                                }
                            },
                            icon: {
                                dom: (() => {
                                    let node = document.createElement('div');
                                    node.innerText = '底線';
                                    return node;
                                })()
                            },
                            label: '',
                            title: '底線',
                            run: commands.toggleMark(nsSchema.marks.u)
                        }),
                        new MenuItem({
                            select(state) {
                                return commands.toggleMark(nsSchema.marks.del)(state);
                            },
                            active(state) {
                                let {from, $from, to, empty} = state.selection;
                                if(empty) {
                                    // 未框選時check游標是否在樣式的範圍內
                                    return nsSchema.marks.del.isInSet(state.storedMarks || $from.marks())
                                } else {
                                    // 框選時check框選的部分是否包含有套用樣式的範圍
                                    return state.doc.rangeHasMark(from, to, nsSchema.marks.del)
                                }
                            },
                            icon: {
                                dom: (() => {
                                    let node = document.createElement('div');
                                    node.innerText = '刪除線';
                                    return node;
                                })()
                            },
                            label: '',
                            title: '刪除線',
                            run: commands.toggleMark(nsSchema.marks.del)
                        }),
                        new MenuItem({
                            select(state) {
                                return commands.toggleMark(nsSchema.marks.link)(state);
                            },
                            active(state) {
                                let {from, $from, to, empty} = state.selection;
                                if(empty) {
                                    // 未框選時check游標是否在樣式的範圍內
                                    return nsSchema.marks.link.isInSet(state.storedMarks || $from.marks())
                                } else {
                                    // 框選時check框選的部分是否包含有套用樣式的範圍
                                    return state.doc.rangeHasMark(from, to, nsSchema.marks.link)
                                }
                            },
                            icon: {
                                dom: (() => {
                                    let node = document.createElement('div');
                                    node.innerText = '連結';
                                    return node;
                                })()
                            },
                            label: '',
                            title: '連結',
                            run(state, dispatch, view) {
                                if (this.active(state)) {
                                    commands.toggleMark(nsSchema.marks.link)(state, dispatch);
                                    return true;
                                }

                                let title = prompt('輸入名稱:'),
                                    href = prompt('輸入網址:');

                                commands.toggleMark(nsSchema.marks.link, { title, href })(state, dispatch);
                                view.focus();
                            }
                        }),
                        new MenuItem({
                            select(state) {
                                let $from = state.selection.$from,
                                    attrs = undefined;

                                for (let d = $from.depth; d >= 0; d--) {
                                    let index = $from.index(d);

                                    if ($from.node(d).canReplaceWith(index, index, nsSchema.nodes.image, attrs)) {
                                        return true;
                                    }
                                }

                                return false;
                            },
                            icon: {
                                dom: (() => {
                                    let node = document.createElement('div');
                                    node.innerText = '插入圖片';
                                    return node;
                                })()
                            },
                            label: '',
                            title: '插入圖片',
                            run(state, dispatch, view) {
                                let {node, from, to} = state.selection,
                                    attrs = nsSchema.nodes.image && node && node.type == nsSchema.nodes.image && node.attrs;

                                let title = prompt('輸入名稱:'),
                                    alt = prompt('替代名稱:'),
                                    src = prompt('輸入網址:');

                                dispatch(state.tr.replaceSelectionWith(nsSchema.nodes.image.createAndFill({ title, alt, src })));
                                view.focus();
                            }
                        }),
                        new MenuItem({
                            icon: {
                                dom: (() => {
                                    let node = document.createElement('div');
                                    node.innerText = '**插入檔案';
                                    return node;
                                })()
                            },
                            label: '',
                            title: '**插入檔案',
                            run(state, dispatch, view) {
                                alert('待實作');
                            }
                        }),
                        new MenuItem({
                            select(state) {
                                let $from = state.selection.$from,
                                    attrs = undefined;

                                for (let d = $from.depth; d >= 0; d--) {
                                    let index = $from.index(d);

                                    if ($from.node(d).canReplaceWith(index, index, nsSchema.nodes.horizontal_rule, attrs)) {
                                        return true;
                                    }
                                }

                                return false;
                            },
                            icon: {
                                dom: (() => {
                                    let node = document.createElement('div');
                                    node.innerText = '插入分隔線';
                                    return node;
                                })()
                            },
                            label: '',
                            title: '插入分隔線',
                            run(state, dispatch, view) {
                                dispatch(state.tr.replaceSelectionWith(nsSchema.nodes.horizontal_rule.create()));
                                view.focus();
                            }
                        }),
                        new MenuItem({
                            icon: {
                                dom: (() => {
                                    let node = document.createElement('div');
                                    node.innerText = '**插入表格';
                                    return node;
                                })()
                            },
                            label: '',
                            title: '**插入表格',
                            run(state, dispatch, view) {
                                alert('待實作');
                            }
                        }),
                        new Dropdown([
                            new MenuItem({
                                label: '置左'
                            }),
                            new MenuItem({
                                label: '置中'
                            }),
                            new MenuItem({
                                label: '置右'
                            })
                        ], {
                            label: '**對齊',
                            title: '**對齊'
                        }),
                        new Dropdown([
                            new MenuItem({
                                label: '程式碼'
                            }),
                            new MenuItem({
                                label: '標題1'
                            }),
                            new MenuItem({
                                label: '標題2'
                            }),
                            new MenuItem({
                                label: '標題3'
                            }),
                            new MenuItem({
                                label: '標題4'
                            }),
                            new MenuItem({
                                label: '標題5'
                            }),
                            new MenuItem({
                                label: '標題6'
                            })
                        ], {
                            label: '**樣式',
                            title: '**樣式'
                        }),
                        new MenuItem({
                            select(state) {
                                return wrapInList(nsSchema.nodes.bullet_list)(state);
                            },
                            onDeselected: 'disable',
                            icon: {
                                dom: (() => {
                                    let node = document.createElement('div');
                                    node.innerText = '無序序列';
                                    return node;
                                })()
                            },
                            label: '',
                            title: '無序序列',
                            run: wrapInList(nsSchema.nodes.bullet_list)
                        }),
                        new MenuItem({
                            select(state) {
                                return wrapInList(nsSchema.nodes.ordered_list)(state);
                            },
                            onDeselected: 'disable',
                            icon: {
                                dom: (() => {
                                    let node = document.createElement('div');
                                    node.innerText = '有序序列';
                                    return node;
                                })()
                            },
                            label: '',
                            title: '有序序列',
                            run: wrapInList(nsSchema.nodes.ordered_list)
                        }),
                        new MenuItem({
                            select: state => commands.lift(state),
                            onDeselected: 'disable',
                            icon: icons.lift,
                            title: "取消縮排",
                            run: commands.lift
                        }),
                        new MenuItem({
                            select: state => undo(state),
                            onDeselected: 'disable',
                            icon: icons.undo,
                            title: "復原",
                            run: undo
                        }),
                        new MenuItem({
                            select: state => redo(state),
                            onDeselected: 'disable',
                            icon: icons.redo,
                            title: "取消復原",
                            run: redo
                        }),
                    // test icon
                        new MenuItem({
                            select(state) {
                                return commands.wrapIn(nsSchema.nodes.blockquote)(state);
                            },
                            onDeselected: 'disable',
                            icon: icons.blockquote,
                            title: "blockQuote",
                            run: commands.wrapIn(nsSchema.nodes.blockquote)
                        }),
                        new MenuItem({
                            // select: state => sinkListItem(state),
                            onDeselected: 'disable',
                            icon: icons.lift,
                            title: "縮排",
                            run: sinkListItem(nsSchema.nodes.list_item)
                        }),
                        new MenuItem({
                            // select: state => liftListItem(state),
                            onDeselected: 'disable',
                            icon: icons.lift,
                            title: "取消縮排",
                            run: liftListItem(nsSchema.nodes.list_item)
                        }),
                        // MenuItem Template
                        // new MenuItem({
                        //     select(state) {
                        //         // 判斷按鈕是否可使用
                        //         return true;
                        //     },
                        //     onDeselected: "disable", // 決定按鈕不可使用時的處理方式, 預設為隱藏按鈕, 設為"disable"時則反灰該按鈕
                        //     active(state) {
                        //         // check active狀態
                        //         // 若這顆按鈕是on的狀態回傳true
                        //         // off則回傳false
                        //         // 若是active狀態
                        //         // prosemirror會在按鈕上加上class "ProseMirror-menu-active"
                        //         return false;
                        //     },
                        //     // render,
                        //     icon: { // 詳情請study prosemirror-menu/src/icon.js
                        //         dom: (() => {
                        //             let node = document.createElement('div');
                        //             node.className = 'images grid';
                        //             return node;
                        //         })()
                        //     },
                        //     label: '',
                        //     title: '按鈕',
                        //     class: '', // 對icon加上class
                        //     css: '', // 對icon加上inline css
                        //     execEvent: '', // 觸發事件 default: mousedown
                        //     run(state, dispatch) {
                        //         console.log(state)
                        //         console.log('run');
                        //     }
                        // }),
                        // Dropdown Template
                        // new Dropdown([
                        //     new MenuItem({
                        //         label: '選項1',
                        //         title: '選項1',
                        //         select() {
                        //             return false;
                        //         },
                        //         onDeselected: "disable",
                        //         run() {
                        //             console.log('run 1');
                        //         }
                        //     }),
                        //     new MenuItem({
                        //         label: '選項2',
                        //         title: '選項2',
                        //         select() {
                        //             return true;
                        //         },
                        //         run() {
                        //             console.log('run 2');
                        //         }
                        //     })
                        // ], {
                        //     label: '下拉選單',
                        //     title: '下拉選單',
                        //     class: '',
                        //     css: ''
                        // }),
                    ]]
                }),
                keymap(baseKeymap)
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
