import React from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
// import { DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { exampleSetup, buildMenuItems, buildKeymap } from 'prosemirror-example-setup';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { menuBar, MenuItem } from 'prosemirror-menu';
import { toggleMark } from 'prosemirror-commands';

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
                    floating: true,
                    // content: [[r.toggleStrong]]
                    content: [[new MenuItem({
                        title: 'testTitle',
                        label: 'testLabel',
                        select(state) {
                            console.log('state');
                            return state;
                        },
                        run(state, dispatch) {
                            console.log('run');
                        }
                    })]]
                }),
                keymap({
                    'Mod-z': History.undo,
                    'Mod-y': History.redo
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
