import React from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
// import { DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { exampleSetup, buildMenuItems } from 'prosemirror-example-setup';
import History from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { menuBar, MenuItem } from 'prosemirror-menu';

class ProseMirror extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let menu = buildMenuItems(schema);
        menu.insertMenu.content = [new MenuItem({
            title: 'xxxTitle',
            label: 'xxxLabel',
            select(state) {
                console.log('select');
                console.log(state);
            },
            run(state, dispatch) {
                console.log('run');
            }
        })].concat(menu.insertMenu.content);
console.log(exampleSetup({schema, menuContent: menu.fullMenu}))
        this.editorState = EditorState.create({
            schema,
            plugins: exampleSetup({schema, menuContent: menu.fullMenu})
            // plugins: [
            //     History.history(),
            //     keymap({
            //         'Mod-z': History.undo,
            //         'Mod-y': History.redo
            //     })
            // ]
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
