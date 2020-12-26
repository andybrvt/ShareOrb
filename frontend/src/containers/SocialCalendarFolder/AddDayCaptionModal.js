import React from 'react';
import { Modal, notification, Input } from 'antd';
import SocialCalCellPageWebSocketInstance from '../../socialCalCellWebsocket';


const { TextArea } = Input;


class AddDayCaptionModal extends React.Component{

  state = {
    caption: ""
  }

  onTextChange = e => {
    // This function will be used for the onchange of the text area

    this.setState({
      caption: e.target.value
    })
  }

  onCaptionSubmit = e => {
    // This function will be used for updating the
    if(this.state.caption !== ""){
      SocialCalCellPageWebSocketInstance.sendSocialDayCaption(
        this.props.curDate,
        this.props.curId,
        this.state.caption
      )

      this.props.onClose()
    }

  }


  render(){

    console.log(this.state)
    return(


        <Modal
        visible = {this.props.visible}
        onCancel= {this.props.onClose}
        footer = {null}
        >
        Add Caption


        <TextArea
        onChange = {this.onTextChange}
        showCount 
        maxLength = {300}

         />

         <div
         className = ""
         onClick = {this.props.onClose}
         > Cancel </div>
         <div
         onClick = {() =>this.onCaptionSubmit()}
         className = ""
         > Save </div>
        </Modal>
    )
  }
}

export default AddDayCaptionModal;
