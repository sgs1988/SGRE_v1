import React, { HtmlHTMLAttributes } from 'react';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Label, Input, InputGroup } from "reactstrap";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import { ProjectStore } from "../../common/Store/newProjectStore";
import { PROJECT } from "../../common/constants/stores";
import history from '../../history';
import HemisCoordinatePoint from '../hemicoordinate/Hemispoint';
import CoordinatePoint from './point';

interface ICoordinate {
    lat: string;
    long: string;
}

export interface ICoordinateComponentProps {
    project?: ProjectStore;
    coordinateDetailsData?: any;
    saveSiteDetails?: any;
    coordinatePointDetails?: any;
}
const initialCoordinates: ICoordinate[] = [
    { lat: "", long: "" },
    { lat: "", long: "" },
    { lat: "", long: "" },
];

@inject(PROJECT)
@observer
export default class CoordinateDetails1 extends React.Component<ICoordinateComponentProps>  {
    constructor(props: ICoordinateComponentProps) {
        super(props);
        this.changecordinate = true;
        this.inputsGeo = [];
        this.coordinates = [];
        this.hemis = false;
        this.geoLoc = '';
        this.pointOne = '';
        this.handleChangeGeo = this.handleChangeGeo.bind(this);
    }
    @observable
    private inputsGeo: Array<string>;
    @observable
    private changecordinate: boolean = true;
    @observable
    private geoLoc: string = "";
    @observable
    private pointOne: string = "";
    @observable
    private hemis: boolean = false;
    @observable
    private isModalOpen: boolean = false;
    @observable
    private coordinates: any[];

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

    addCoordinates = (index: number, name: string, value: string) => {
        this.coordinates.push([name, value]);
    };

    deleteCoordinate = (index: number) => {
        let newCoordinates = this.coordinates.filter(
            (item, arrayIndex) => index != arrayIndex
        );
        this.coordinates = [...newCoordinates];
    };

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

    changeUnit = (arg: any) => {
        this.props.coordinateDetailsData(arg);
    }

    changeProjectUnit = (arg: any) => {
        this.props.coordinatePointDetails(arg);
    }

    componentDidMount() {
        console.log(this.props.saveSiteDetails, '....this.props.newShapeCoordinate...');
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

                        <CoordinatePoint coordinateDetailsData={this.changeUnit} coordinatePointDetails={this.changeProjectUnit}/>
                    </div>
                    : ''
                }
                {this.hemis
                    ? <HemisCoordinatePoint></HemisCoordinatePoint>
                    : null
                }
            </div>
        );
    }
}
