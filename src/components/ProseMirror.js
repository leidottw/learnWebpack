import React from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
// import { DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
// import { exampleSetup } from 'prosemirror-example-setup';
import History from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';

class ProseMirror extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.editorState = EditorState.create({
            schema,
            plugins: [
                History.history(),
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
