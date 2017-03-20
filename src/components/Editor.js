import React from 'react';
import { Link } from 'react-router';
import {Editor, EditorState, RichUtils, convertFromRaw, convertToRaw} from 'draft-js';

const colorStyleMap = {
    red: {
      color: 'rgba(255, 0, 0, 1.0)',
    },
    orange: {
      color: 'rgba(255, 127, 0, 1.0)',
    },
    yellow: {
      color: 'rgba(180, 180, 0, 1.0)',
    },
    green: {
      color: 'rgba(0, 180, 0, 1.0)',
    },
    blue: {
      color: 'rgba(0, 0, 255, 1.0)',
    },
    indigo: {
      color: 'rgba(75, 0, 130, 1.0)',
    },
    violet: {
      color: 'rgba(127, 0, 255, 1.0)',
    },
};

class MyEditor extends React.Component {
    constructor(props) {
        super(props);

        let saved = `{"entityMap":{},"blocks":[{"key":"99qlt","text":"console.log(1)","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"3h4fb","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"7d350","text":"abcdeft","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":7,"style":"STRIKETHROUGH"}],"entityRanges":[],"data":{}},{"key":"slu","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"cavid","text":"ggkkggk","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":7,"style":"blue"}],"entityRanges":[],"data":{}}]}`;
        this.state = {editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(saved)))};
        // this.state = {editorState: EditorState.createEmpty()};

        this.onChange = (editorState) => {
            let file = convertToRaw(editorState.getCurrentContent());
            // console.log('save: ' + JSON.stringify(file));

            let selectionState = editorState.getSelection();
            console.log(selectionState.getAnchorKey())
            console.log(selectionState.getStartOffset())
            console.log(selectionState.getEndOffset())
            return this.setState({editorState});
        }
    }

    _onBoldClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
    }

    _onItalicClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
    }

    _onUnderlineClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
    }

    _onLineThroughClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'STRIKETHROUGH'));
    }

    _onCodeClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'CODE'));
    }

    _onRedClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'red'));
    }

    _onOrangeClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'orange'));
    }

    _onYellowClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'yellow'));
    }

    _onGreenClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'green'));
    }

    _onBlueClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'blue'));
    }

    _onIndigoClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'indigo'));
    }

    _onVioletClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'violet'));
    }

    render() {
        return (
            <div>
                <button onClick={this._onBoldClick.bind(this)} style={{fontWeight: 'bold'}}>B</button>
                <button onClick={this._onItalicClick.bind(this)} style={{fontStyle: 'italic'}}>I</button>
                <button onClick={this._onUnderlineClick.bind(this)} style={{textDecoration: 'underline'}}>U</button>
                <button onClick={this._onLineThroughClick.bind(this)} style={{textDecoration: 'line-through'}}>D</button>
                <button onClick={this._onCodeClick.bind(this)}>C</button>
                <button onClick={this._onRedClick.bind(this)}>Red</button>
                <button onClick={this._onOrangeClick.bind(this)}>Orange</button>
                <button onClick={this._onYellowClick.bind(this)}>Yellow</button>
                <button onClick={this._onGreenClick.bind(this)}>Green</button>
                <button onClick={this._onBlueClick.bind(this)}>Blue</button>
                <button onClick={this._onIndigoClick.bind(this)}>Indigo</button>
                <button onClick={this._onVioletClick.bind(this)}>Violet</button>
                <Editor editorState={this.state.editorState} onChange={this.onChange} customStyleMap={colorStyleMap}/>
            </div>
        );
    }
};

export default MyEditor;
