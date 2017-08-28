
import React, { Component } from 'react'
import { render } from 'react-dom'
import { Editor, EditorState, RichUtils, Entity, convertToRaw, AtomicBlockUtils } from 'draft-js'
import RNMessageChannel from 'react-native-webview-messaging'

class MyEditor extends React.Component {
  constructor(props) {
    super(props)
    const self = this
    this.state = {editorState: EditorState.createEmpty()}
    this.onChange = (editorState) => {
      self.setState({editorState})
      const content = editorState.getCurrentContent()
      RNMessageChannel.sendJSON(content);
    }
    this.addImage = this._addImage.bind(this)
  }

  componentDidMount() {

    const self = this

    const helloBtn = document.querySelector('#hello');
    const jsonBtn = document.querySelector('#json');
    const eventBtn = document.querySelector('#event');
    const messagesContainer = document.querySelector('#text');
    //
    // helloBtn.addEventListener('click', () => {
    //   RNMessageChannel.send('hello');
    // });

    // jsonBtn.addEventListener('click', () => {
    //   RNMessageChannel.sendJSON({
    //     payload: 'hello'
    //   });
    // });
    //
    // eventBtn.addEventListener('click', () => {
    //   RNMessageChannel.emit('greetingFromWebview', {
    //     payload: 'hello'
    //   });
    // });

    RNMessageChannel.on('text', text => {
      self.addImage(text)
    //   // messagesContainer.innerHTML = `Received text from RN: ${text}`;
    });


    // RNMessageChannel.on('json', text => {
    //   messagesContainer.innerHTML = `Received json from RN: ${JSON.stringify(text)}`;
    // });
    //
    // RNMessageChannel.on('greetingFromRN', event => {
    //   messagesContainer.innerHTML = `Received "greetingFromRN" event: ${JSON.stringify(event)}`;
    // });

  }

  _addImage(url) {
    this._promptForMedia('image', url)
  }

  _promptForMedia(type, src) {

    console.log(type, src);

    const { editorState } = this.state;
    const entityKey = Entity.create(type, 'IMMUTABLE', { src: src })

    this.onChange(AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      ' '
    ))

  }

  render() {
    return (
      <div>
        <p id="text"></p>
        <Editor
          blockRendererFn={mediaBlockRenderer}
          editorState={this.state.editorState}
          onChange={this.onChange}
          />
      </div>
    )
  }
}


function mediaBlockRenderer(block) {
  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false,
    };
  }
  return null;
}


const Media = (props) => {

  const entity = Entity.get(props.block.getEntityAt(0))
  const { src } = entity.getData()
  const type = entity.getType()

  let media;

  if (type === 'image') {
    media = <img src={src} />
  }

  return media;
}

render(
  <MyEditor />,
  document.getElementById('app')
)
