//ModalComponent.js
import React, { HtmlHTMLAttributes } from 'react';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Label, Input, InputGroup } from "reactstrap";
import CoordinateDetails1 from '../coordinatesDetails/CoordinateDetails';
import DatePicker from "react-datepicker";
import { ProjectStore } from "../../common/Store/newProjectStore";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import ProjectDetailFirstForm from '../projectDetails/ProjectDetailFirstForm';
import { PROJECT } from "../../common/constants/stores";

import "react-datepicker/dist/react-datepicker.css";
import './projDetails.scss';
import history from '../../history';

export interface IModalComponentProps {
    project?: ProjectStore;
    coordinatePointDetails?: any;
    nextEnabled?: any;
}

@inject(PROJECT)
@observer
export default class ProjectDetail extends React.Component<IModalComponentProps>  {
    refNo: string;
    notes: string;
    client: string;
    constructor(props: IModalComponentProps) {
        super(props);
        this.projectName = '';
        this.nextEnabled = false;
        this.refNo = '';
        this.client = '';
        this.notes = '';
        this.prjctNameValid = false;
        this.errorMsg = "";
        this.startDate = new Date();
        this.coordinateData = [];
        this.handleDatenewChange = this.handleDatenewChange.bind(this);
        this.updateName = this.updateName.bind(this);
        this.saveProjectDetails = this.saveProjectDetails.bind(this);
    }

    @observable
    private isModalOpen: boolean = false;
    @observable
    private projectName: string = "";
    @observable
    private prjctNameValid: boolean = true;
    @observable
    private nextEnableBtn: boolean = false;
    @observable
    private saveEnableBtn: boolean = false;
    @observable
    private nextEnabled: boolean = false;
    @observable
    private errorMsg: string = 'This is error';
    @observable
    private startDate: Date = new Date();
    private coordinateData: any = [];

    componentDidMount() {
        this.props.project?.fetchAllProjectName();
        console.log(this.props.nextEnabled, '....this.props.nextEnabled...');
    }

    getAllProjectData() {
        this.props.project?.fetchAllProjectName();
    }
    handleDatenewChange(date: any) {
        this.startDate = date;
    }

    toggle = () => {
        this.isModalOpen = !this.isModalOpen;
    };
    nextClicked = () => {
        this.projectName = '';
        this.errorMsg = "";
        this.isModalOpen = !this.isModalOpen;
    }

    saveProjectDetails() {


        this.toggle();

        let triangleCoords: any = [];
        if (this.coordinateData.length > 0) {
            triangleCoords = this.coordinateData;
            // testProjDetail.triangleCoords = triangleCoords;

        }
        history.push('/map', triangleCoords);
        //history.push('/map', testProjDetail);

    }
    updateTextAreaVal = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.notes = ev.target.value ?? "";
    }
    updateVal = (ev: React.ChangeEvent<HTMLInputElement>) => {
        // const re = /^[0-9\b]+$/;
        switch (ev.target.id) {
            case "refNo": {
                this.refNo = ev.target.value ?? "";
                break;
            }
            case "client": {
                this.client = ev.target.value ?? "";
                break;
            }
        }
        const obj = {
            projectName: this.projectName,
            refNo: this.refNo,
            notes: this.notes,
            client: this.client,
            // isActive: true,
            startDate: new Date().toISOString(),
        };
        console.log(obj);
    }
    updateName = (ev: React.ChangeEvent<HTMLInputElement>) => {

        const allNames = this.props.project?.getState.projectDetailData ?? [];
        this.projectName = ev.target.value;
        let er = false;
        this.errorMsg = ""
        this.prjctNameValid = false;
        allNames.filter((pn) => {

            if (pn.projectName === this.projectName) {
                er = true;
                this.prjctNameValid = false;
                this.errorMsg = "Project name already present, Please use other name"
            }
        });

    }

    changeUnit = (arg: any) => {
        console.log(arg)
        let triangleCoords: any = [];
        if (arg.length > 0) {
            arg.map((obj: any) => {
                if (obj.lat !== '' && obj.lat !== NaN && obj.long !== '' && obj.long !== NaN) {
                    triangleCoords.push({ lat: parseFloat(obj.lat), lng: parseFloat(obj.long) });
                }
            })
            this.coordinateData = triangleCoords;
            this.saveEnableBtn = true;

        }
    }
    handleNext = (obj: any) => {
        console.log('projDetails :', obj);
        if (obj.length > 0) {
            this.nextEnableBtn = true;
        }
        else {
            this.nextEnableBtn = false;
        }
    }
    render() {

        return (
            <div className='mainDiv'>
                <div className='modalMain'>

                    <Button className='btn openPrjct' onClick={this.toggle}>

                        CREATE A PROJECT</Button>

                    <form >
                        <Modal isOpen={this.isModalOpen}>

                            <ModalHeader>

                                {!this.nextEnabled ?
                                    <div className='newprjct'> New Project </div>
                                    : <div className='newprjct'> Co-ordinates</div>
                                }


                                <button type="button" className="close" aria-label="Close" onClick={this.toggle}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </ModalHeader>
                            <ModalBody>

                                <div>
                                    {!this.nextEnabled ?
                                        <ProjectDetailFirstForm firstformdata={this.handleNext}></ProjectDetailFirstForm>

                                        : <div>
                                            <CoordinateDetails1 coordinatePointDetails={this.changeUnit} ></CoordinateDetails1>
                                        </div>
                                    }
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                {!this.nextEnabled ?

                                    <Button type="button" value="Next" disabled={!this.nextEnableBtn} onClick={() => { this.nextEnabled = true; }} className="btn nextBtn col-md-2" >NEXT</Button>
                                    : <Button type="button" value="Save" disabled={!this.saveEnableBtn} onClick={this.saveProjectDetails} className="btn nextBtn col-md-2">Save</Button>
                                }

                            </ModalFooter>
                        </Modal>
                    </form>

                </div>

            </div>
        );

    }
}