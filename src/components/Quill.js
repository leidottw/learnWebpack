import React from 'react';
import { Link } from 'react-router';
import Quill from 'quill';

class MyEditor extends React.Component {
    componentDidMount() {
        var toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],

            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],

            ['clean']                                         // remove formatting button
        ];

        let quill = new Quill(this.refs.editor, {
            // modules: {
            //     toolbar: toolbarOptions
            // }
        });

        quill.keyboard.addBinding({
            key: 'B',
            shiftKey: true
        }, function(range, context) {
            console.log('shift + B')
            this.quill.formatText(range, 'bold', true)
        });

        console.log(quill)
        quill.on('text-change', function() {
            console.log(quill.getContents());
        });

        quill.on('selection-change', function() {
            console.log(quill.getSelection());

            // quill.setSelection
        })
    }

    render() {
        return (
            <div>
                <div ref="editor"></div>
            </div>
        );
    }
};

export default MyEditor;
