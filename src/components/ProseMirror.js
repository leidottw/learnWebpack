import React from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { nodes, marks } from 'prosemirror-schema-basic';
// import { nodes, marks } from 'prosemirror-schema-table';
import { addListNodes, wrapInList, orderedList, bulletList } from 'prosemirror-schema-list';
import { exampleSetup, buildMenuItems, buildKeymap } from 'prosemirror-example-setup';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { menuBar, MenuItem, Dropdown, DropdownSubmenu, renderGrouped, icons, joinUpItem, liftItem, selectParentNodeItem, undoItem, redoItem, wrapItem, blockTypeItem } from 'prosemirror-menu'; // menuBar提供浮動置頂,
import { baseKeymap, toggleMark } from 'prosemirror-commands';
import { findWrapping } from 'prosemirror-transform';

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

        let extNodes = Object.assign({}, nodes, {
            ordered_list: orderedList,
            bullet_list: bulletList
        });

        let schema = new Schema({
            nodes: extNodes,
            marks: extMarks
        });

        console.log(schema);

        // let schema2 = new Schema({
        //     nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
        //     marks: schema.spec.marks
        // });


        // console.log(exampleSetup({schema}))
        // let r = buildMenuItems(schema);
        // console.log(r);

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
                                return toggleMark(schema.marks.strong)(state);
                            },
                            active(state) {
                                let {from, $from, to, empty} = state.selection;
                                if(empty) {
                                    // 未框選時check游標是否在樣式的範圍內
                                    return schema.marks.strong.isInSet(state.storedMarks || $from.marks())
                                } else {
                                    // 框選時check框選的部分是否包含有套用樣式的範圍
                                    return state.doc.rangeHasMark(from, to, schema.marks.strong)
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
                            run: toggleMark(schema.marks.strong)
                        }),
                        new MenuItem({
                            select(state) {
                                return toggleMark(schema.marks.em)(state);
                            },
                            active(state) {
                                let {from, $from, to, empty} = state.selection;
                                if(empty) {
                                    // 未框選時check游標是否在樣式的範圍內
                                    return schema.marks.em.isInSet(state.storedMarks || $from.marks())
                                } else {
                                    // 框選時check框選的部分是否包含有套用樣式的範圍
                                    return state.doc.rangeHasMark(from, to, schema.marks.em)
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
                            run: toggleMark(schema.marks.em)
                        }),
                        new MenuItem({
                            select(state) {
                                return toggleMark(schema.marks.u)(state);
                            },
                            active(state) {
                                let {from, $from, to, empty} = state.selection;
                                if(empty) {
                                    // 未框選時check游標是否在樣式的範圍內
                                    return schema.marks.u.isInSet(state.storedMarks || $from.marks())
                                } else {
                                    // 框選時check框選的部分是否包含有套用樣式的範圍
                                    return state.doc.rangeHasMark(from, to, schema.marks.u)
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
                            run: toggleMark(schema.marks.u)
                        }),
                        new MenuItem({
                            select(state) {
                                return toggleMark(schema.marks.del)(state);
                            },
                            active(state) {
                                let {from, $from, to, empty} = state.selection;
                                if(empty) {
                                    // 未框選時check游標是否在樣式的範圍內
                                    return schema.marks.del.isInSet(state.storedMarks || $from.marks())
                                } else {
                                    // 框選時check框選的部分是否包含有套用樣式的範圍
                                    return state.doc.rangeHasMark(from, to, schema.marks.del)
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
                            run: toggleMark(schema.marks.del)
                        }),
                        new MenuItem({
                            select(state) {
                                return toggleMark(schema.marks.link)(state);
                            },
                            active(state) {
                                let {from, $from, to, empty} = state.selection;
                                if(empty) {
                                    // 未框選時check游標是否在樣式的範圍內
                                    return schema.marks.link.isInSet(state.storedMarks || $from.marks())
                                } else {
                                    // 框選時check框選的部分是否包含有套用樣式的範圍
                                    return state.doc.rangeHasMark(from, to, schema.marks.link)
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
                                    toggleMark(schema.marks.link)(state, dispatch);
                                    return true;
                                }

                                let title = prompt('輸入名稱:'),
                                    href = prompt('輸入網址:');

                                toggleMark(schema.marks.link, { title, href })(state, dispatch);
                                view.focus();
                            }
                        }),
                        new MenuItem({
                            select(state) {
                                let $from = state.selection.$from,
                                    attrs = undefined;

                                for (let d = $from.depth; d >= 0; d--) {
                                    let index = $from.index(d);

                                    if ($from.node(d).canReplaceWith(index, index, schema.nodes.image, attrs)) {
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
                                    attrs = schema.nodes.image && node && node.type == schema.nodes.image && node.attrs;

                                let title = prompt('輸入名稱:'),
                                    alt = prompt('替代名稱:'),
                                    src = prompt('輸入網址:');

                                dispatch(state.tr.replaceSelectionWith(schema.nodes.image.createAndFill({ title, alt, src })));
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

                                    if ($from.node(d).canReplaceWith(index, index, schema.nodes.horizontal_rule, attrs)) {
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
                                dispatch(state.tr.replaceSelectionWith(schema.nodes.horizontal_rule.create()));
                                view.focus();
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
                                return true;
                                console.log(schema.marks.strong)
                                console.log(schema.nodes.bullet_list)
                                console.log(wrapInList(schema.nodes.bullet_list))

                                let {$from, $to} = state.selection
                                let range = $from.blockRange($to), doJoin = false, outerRange = range
                                console.log(range)
                                let wrap = findWrapping(outerRange, schema.nodes.bullet_list, undefined, range)
                                console.log(wrap)
                                return wrapInList(schema.nodes.bullet_list)(state);
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
                            run: wrapInList(schema.nodes.bullet_list)
                        }),
                        new MenuItem({
                            select(state) {
                                return true;
                                return wrapInList(schema.nodes.ordered_list)(state);
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
                            run: wrapInList(schema.nodes.ordered_list)
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
                        // joinUpItem,
                        // liftItem,
                        // selectParentNodeItem,
                        // undoItem,
                        // redoItem
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
