import React, { HtmlHTMLAttributes } from 'react';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Label, Input, InputGroup } from "reactstrap";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import { ProjectStore } from "../../common/Store/newProjectStore";
import { PROJECT } from "../../common/constants/stores";
import history from '../../history';
// import HemisCoordinateDetail from '../hemicoordinate/HemiCorordinate';

export interface ICoordinateComponentProps {
    project?: ProjectStore;
}

@inject(PROJECT)
@observer
export default class CoordinateDetail extends React.Component<ICoordinateComponentProps>  {
    constructor(props: ICoordinateComponentProps) {
        super(props);
        this.changecordinate = true;
        this.inputsGeo = [];
        this.hemis = false;
        this.geoLoc = '';
        this.handleChangeGeo = this.handleChangeGeo.bind(this);
    }
    @observable
    private inputsGeo: Array<string>;
    @observable
    private changecordinate: boolean = true;
    @observable
    private geoLoc: string = "";
    @observable
    private hemis: boolean = false;
    @observable
    private isModalOpen: boolean = false;

    toggle = () => {
        this.isModalOpen = !this.isModalOpen;
    };
    
    deleteRow(index: number) {
        this.inputsGeo.splice(index, 1);
    }

    addGeoInput() {

        var newInput = `input-${this.inputsGeo.length}`;
        this.inputsGeo.push(newInput);
    }
   
    handleChangeGeo(event: React.ChangeEvent<HTMLInputElement>) {

        this.geoLoc = event.target.value

        if (event.currentTarget.value === 'UTM') {
            this.hemis = true
            this.changecordinate = false
        }
        else {
            this.hemis = false
            this.changecordinate = true;
        }

    }
    render() {

        return (
           
                <div className='mainModalDiv'>
                    <div className='cordinate'>Co-ordinate system</div>
                    <div className="form-group row typeDiv">
                        <label className="col-sm-2 col-form-label">Type</label>
                        <div className="col-sm-6">

                            <Input
                                type="select"
                                name="country"
                                id="country"
                                value={this.geoLoc}
                                className="geoLocation"
                                onChange={this.handleChangeGeo}
                            >
                                <option value="Geographical">Geographical</option>
                                <option value="UTM">UTM</option>

                            </Input>
                        </div>
                    </div>
                    <div className='cordinate'>Co-ordinates of the site</div>
                    {this.changecordinate ?
                        <div className='changecordinateMainDiv'>
                            <div className="form-group row pointOne">
                                <Label className="col-sm-2 col-form-label"></Label>
                                <div className="col-sm-3">
                                    <Label className="col-form-label">Latitude</Label>
                                </div>
                                <div className="col-sm-3">
                                    <Label className="col-form-label">Longitude</Label>
                                </div>
                            </div>
                            <div className="form-group row">
                                <Label className="col-sm-2 col-form-label">Point 1</Label>
                                <div className="col-sm-3">
                                    <InputGroup>
                                        <Input type="text" id="pointIn" className="form-control" />

                                    </InputGroup>
                                    <span className="north">&deg;N</span>

                                </div>
                                <div className="col-sm-3">
                                    <Input type="text" className="form-control" />
                                    <span className="north">E&deg;</span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <Label className="col-sm-2 col-form-label">Point 2</Label>
                                <div className="col-sm-3">
                                    <Input type="text" className="form-control" />
                                    <span className="north">&deg;N</span>
                                </div>
                                <div className="col-sm-3">
                                    <Input type="text" className="form-control" />
                                    <span className="north">E&deg;</span>
                                </div>
                            </div>
                            <div className="form-group row">
                                <Label className="col-sm-2 col-form-label">Point 3</Label>
                                <div className="col-sm-3">
                                    <Input type="text" className="form-control" />
                                    <span className="north">&deg;N</span>
                                </div>
                                <div className="col-sm-3">
                                    <Input type="text" className="form-control" />
                                    <span className="north">E&deg;</span>
                                </div>
                            </div>
                            {this.inputsGeo.map((row, i) =>
                                <div className="form-group row addpointDiv" key={i}>
                                    <Label className="col-sm-2 col-form-label">Point {i + 4}</Label>
                                    <div className="col-sm-3">
                                        <Input type="text" className="form-control" />
                                        <span className="north">&deg;N</span>
                                    </div>
                                    <div className="col-sm-3">
                                        <Input type="text" className="form-control" />
                                        <span className="north">E&deg;</span>
                                    </div>
                                    <Button type="button" className="btn btn-default deleteBtn" onClick={() => this.deleteRow(i)} >
                                        <i className="fa fa-trash deleteIcon" aria-hidden="true"></i>
                                    </Button>
                                </div>
                            )}
                            <div className="form-group row">
                                <Label className="col-sm-2 col-form-label"></Label>
                                <div className="col-sm-3">
                                    <Input type="button" value="Add Point" className="btn addPointBtn" onClick={() => this.addGeoInput()} />

                                </div>

                            </div>
                        </div>
                        : ''
                    }
                    {/* {this.hemis
                        ? <HemisCoordinateDetail></HemisCoordinateDetail>
                        : null
                    } */}
                </div>
  
        );
    }
}
