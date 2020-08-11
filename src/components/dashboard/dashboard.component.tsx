import React from 'react';
import { Button } from 'reactstrap';
import ModalMain from '../modal/Modal';
import './dashboard.style.scss';

class Dashboard extends React.Component {
  render(){
    return (
        <div>
            <ModalMain></ModalMain>
         </div>
    );
  }
}

export default Dashboard;