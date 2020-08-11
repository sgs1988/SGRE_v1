import React, { HtmlHTMLAttributes } from 'react';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Label, Input, InputGroup } from "reactstrap";
import ProjectDetail from '../projectDetails/projDetails';
import CoordinateDetails from '../coordinatesDetails/CoordinateDetails';
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import { ProjectStore } from "../../common/Store/newProjectStore";
import { PROJECT } from "../../common/constants/stores";

export interface IModalMainProps {
    project?: ProjectStore;
}

@inject(PROJECT)
@observer
export default class ModalMain extends React.Component<IModalMainProps>{
    constructor(props: IModalMainProps) {
        super(props);
        this.firstModal = false;
    }
    @observable
    private isModalOpen: boolean = false;
    @observable
    private firstModal: boolean = false;

    toggle = () => {
        this.isModalOpen = !this.isModalOpen;
    };
    render() {

        return (
            <div>
                 <Button className='btn openPrjct' onClick={this.toggle}> CREATE A PROJECT</Button>
              {this.firstModal?<ProjectDetail></ProjectDetail>:<CoordinateDetails></CoordinateDetails>}
            </div>
        );
    }
}