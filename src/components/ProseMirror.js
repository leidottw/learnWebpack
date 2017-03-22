import React from 'react';
import { Link } from 'react-router';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser, Fragement } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';

class MyEditor extends React.Component {

    componentDidMount() {
        const footnote = {
            group: "inline",
            content: "inline*",
            inline: true,
            draggable: true,
            atom: true,
            toDOM: () => ["footnote", 0],
            parseDOM: [{tag: "footnote"}]
        };

        const footnoteSchema = new Schema({
            nodes: schema.spec.nodes.addBefore("image", "footnote", footnote),
            marks: schema.spec.marks
        });

        var view = new EditorView(this.refs.editor, {
            state: EditorState.create({
                doc: DOMParser.fromSchema(footnoteSchema).parse(document.querySelector("#content"))
            }),
        });
    }

    render() {
        return (
            <div>
                <div id="content">122223</div>
                <div ref="editor"></div>
            </div>
        );
    }
};

export default MyEditor;
