import React, { Component } from "react";
import { FormGroup, Label, Input, FormText } from 'reactstrap';
//import { MDBFileInput } from "mdbreact";

class InputPage extends Component {

  render() {
    return (
     // <MDBFileInput />
     <div>
         <FormGroup>
        <Label for="exampleFile">Upload File</Label>
        <Input type="file" name="file" id="exampleFile" />
        <FormText color="muted">
        
        </FormText>
      </FormGroup>
     </div>
    );
  }
}

export default InputPage;