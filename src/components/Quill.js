import React from 'react';
import { Link } from 'react-router';
import Quill from 'quill';

class MyEditor extends React.Component {
    componentDidMount() {
        var saved = `{"ops":[{"attributes":{"color":"red"},"insert":"fefe"},{"insert":"\n"},{"attributes":{"color":"green"},"insert":"feefef"},{"insert":"\n\n"},{"attributes":{"color":"green","strike":true},"insert":"ewfwefewfwef"},{"insert":"\n\n"},{"attributes":{"underline":true,"strike":true,"italic":true,"color":"green","bold":true},"insert":"fewfwefewf"},{"attributes":{"list":"bullet"},"insert":"\n"}]}`;

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

            [{ 'color': ['red', 'green'] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],

            ['clean']                                         // remove formatting button
        ];

        window.Delta = Quill.import('delta');

        let quill = new Quill(this.refs.editor, {
            modules: {
                toolbar: toolbarOptions
            }
        });
// console.log(saved)
//         quill.setContents(JSON.parse(saved));

        quill.keyboard.addBinding({
            key: 'B',
            shiftKey: true
        }, function(range, context) {
            console.log('shift + B')
            this.quill.formatText(range, 'bold', true)
        });

        quill.keyboard.addBinding({
            key: 'I',
            shiftKey: true
        }, function(range, context) {
            console.log('shift + I')
            this.quill.formatText(range, 'italic', true)
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
