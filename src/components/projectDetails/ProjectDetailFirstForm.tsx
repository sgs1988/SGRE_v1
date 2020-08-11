//ModalComponent.js
import React, { HtmlHTMLAttributes } from 'react';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Label, Input, InputGroup } from "reactstrap";
import CoordinateDetails1 from '../coordinatesDetails/CoordinateDetails';
import DatePicker from "react-datepicker";
import { ProjectStore } from "../../common/Store/newProjectStore";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import { PROJECT } from "../../common/constants/stores";
import { ProjectDetailsModel } from '../../common/model/newprojectdetailsModel';
import "react-datepicker/dist/react-datepicker.css";
import './projDetails.scss';
import history from '../../history';

export interface IModalComponentProps {
    project?: ProjectStore;
    firstformdata?: any;

}

@inject(PROJECT)
@observer
export default class ProjectDetailFirstForm extends React.Component<IModalComponentProps>  {

    constructor(props: IModalComponentProps) {
        super(props);
        this.projectName = '';
        this.nextEnabled = false;
        this.prjctNameValid = false;

        this.errorMsg = "";
        this.itemvalues = [];
        this.startDate = new Date();
        this.handleDatenewChange = this.handleDatenewChange.bind(this);
        this.updateName = this.updateName.bind(this);
        this.projectModel = this.props.project?.getProjectDetails;
        console.log(this.projectModel)
        this.projectName = this?.projectModel?.projectName;
        this.refNo = this?.projectModel?.refno;
        this.client = this?.projectModel?.client;
        this.notes = this?.projectModel?.notes;
    }

    @observable
    private isModalOpen: boolean = false;
    @observable
    private projectName: string = "";
    @observable
    private refNo: string = "";
    @observable
    private client: string = "";
    @observable
    private notes: string = "";
    @observable
    private itemvalues: [];
    @observable
    private projectModel: any;
    @observable
    private prjctNameValid: boolean = true;
    @observable
    private nextEnabled: boolean = false;
    @observable
    private errorMsg: string = 'This is error';
    @observable
    private startDate: Date = new Date();
    @observable
    private project: ProjectDetailsModel = {} as ProjectDetailsModel;
    @observable
    private firstformdata: any;


    componentDidMount() {
        this.props.project?.fetchAllProjectName();
    }

    getAllProjectData() {
        this.props.project?.fetchAllProjectName();
    }
    handleDatenewChange(date: any) {
        this.startDate = date;
    }

    updateTextAreaVal = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {

        this.notes = ev.target.value;
        this.project.notes = this.notes;
        this.props.project?.setProjectDetails(this.project);
    }
    updateVal = (ev: React.ChangeEvent<HTMLInputElement>) => {
        // const re = /^[0-9\b]+$/;
        switch (ev.target.id) {
            case "projectName": {
                this.projectName = ev.currentTarget.value ?? "";
                this.project.projectName = this.projectName;
                break;
            }
            case "refNo": {
                this.refNo = ev.currentTarget.value ?? "";
                break;
            }
            case "client": {
                this.client = ev.currentTarget.value ?? "";
                break;
            }
            case "notes": {
                this.notes = ev.currentTarget.value ?? "";
                break;
            }

        }

        this.project = {
            projectName: this.projectName,
            refno: this.refNo,
            notes: this.notes,
            client: this.client,
            startDate: this.startDate,
            creator: "test",
            hemis: false
        };
        this.props.project?.setProjectDetails(this.project);
        console.log("ewwwewe", this.notes);
        //console.log(obj);
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
                this.errorMsg = "Project name already present, Please use other name"
            }
        });
        this.project.projectName = this.projectName;
        this.props.project?.setProjectDetails(this.project);
        if (this.props.firstformdata) {
            this.props.firstformdata(this.projectName);
        }

    }

    render() {

        return (
            <div className='mainModalDiv'>
                <div className='generalhead'>General</div>
                <div className="form-group row">
                    <Label htmlFor='username' className="col-sm-2 col-form-label required">Name</Label>
                    <div className="col-sm-6">

                        <Input type='text' id='projectName' name='projectName' className='form-field'
                            value={this.projectName} onChange={this.updateName} />
                        {this.projectName ?
                            <button className="close-icon" onClick={(ev) => this.projectName = ''} type="reset"></button>
                            : ''}
                        <span className="error">{this.errorMsg}</span>

                    </div>
                </div>
                <div className="form-group row">
                    <Label className="col-sm-2 col-form-label">Ref No.</Label>
                    <div className="col-sm-6">
                        <Input type="text" id="refNo" value={this.refNo} onChange={this.updateVal} className="form-control" />
                        {this.refNo ?
                            <button className="close-icon" onClick={(ev) => this.refNo = ''} type="reset"></button>
                            : ''
                        }
                    </div>
                </div>
                <div className="form-group row">
                    <Label className="col-sm-2 col-form-label">Client</Label>
                    <div className="col-sm-6">
                        <Input type="text" id="client" value={this.client} onChange={this.updateVal} className="form-control" />
                        {this.client ?
                            <button className="close-icon" onClick={(ev) => this.client = ''} type="reset"></button>
                            : ''
                        }
                    </div>
                </div>
                <div className="form-group row">
                    <Label className="col-sm-2 col-form-label">Notes</Label>
                    <div className="col-sm-6">
                        <textarea id="notes" name="notes" className="form-control" onChange={this.updateTextAreaVal} value={this.notes} />
                    </div>
                </div>

                <div className="form-group row separateDiv">
                    <Label className="col-sm-2 col-form-label">Start Date</Label>
                    <div className="col-sm-6">

                        <DatePicker
                            selected={this.startDate}
                            onChange={this.handleDatenewChange}
                            name="startDate"
                            className="form-control"
                            readOnly={true}
                        />
                        {/* <div className="calen" >
                            <i className="fa fa-calendar"
                                aria-hidden="true"
                            ></i>
                        </div> */}
                    </div>
                </div>
                <div className="form-group row separateDiv">
                    <Label className="col-sm-2 col-form-label">Creator</Label>
                    <div className="col-sm-6">
                        <Input type="text" value='Priyanka Saxena' readOnly={true} className="form-control" />
                    </div>
                </div>
            </div>

        );
    }
}  