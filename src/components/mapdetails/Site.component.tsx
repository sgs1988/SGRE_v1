import React, { Component, useState } from 'react';
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import {
    Input,
    Collapse, Button, CardBody, Card, ListGroup, ListGroupItem, Tooltip, Modal, ModalHeader, ModalBody, ModalFooter, DropdownToggle,
    DropdownMenu, Dropdown, UncontrolledDropdown,
    DropdownItem, Label
} from 'reactstrap';
import './site.scss';
import CoordinateDetails1 from './../coordinatesDetails/CoordinateDetails';
import ProjectDetailFirstForm from './../projectDetails/ProjectDetailFirstForm';
import { ProjectStore } from "../../common/Store/newProjectStore";
import { ProjectDetailsModel } from '../../common/model/newprojectdetailsModel';
import { PROJECT } from "../../common/constants/stores";


export interface IModelSiteProps {
    coordinateDetailsData?: any;
    newShapeCoordinate?: any;
    coordinatePointDetails?: any;
    setSiteDetails?: any;
    project?: ProjectStore;
    firstformdata?: any;
}

@inject(PROJECT)
@observer
export default class SiteComponent extends React.Component<IModelSiteProps> {


    constructor(props: IModelSiteProps) {
        super(props);
        //const [isOpen, setIsOpen] = useState(false);
        //const [tooltipOpen, setTooltipOpen] = useState(false);
        this.state = {
            siteName: [],
            count: 0,
            addSite: true,
            disable: true
        }

        // this.handleAddSite = this.handleAddSite.bind(this);
        this.openModel = this.openModel.bind(this);
        this.projectModel = this.props.project?.getProjectDetails;
        console.log(this.projectModel);
        this.coordinateData = [];

        // this.toggleCordinate = this.toggleCordinate.bind(this);
    }
    @observable
    private tooltipOpen: boolean = false;
    private setTooltipOpen: any;
    @observable
    private isModalOpen: boolean = false;
    @observable
    private setDropdownOpen: boolean = false;
    @observable
    private disable: boolean = true;
    @observable
    private projectEnabled: boolean = false;
    @observable
    private dropdownOpen: boolean = false;
    @observable
    private projectModel: any;
    @observable
    private project: ProjectDetailsModel = {} as ProjectDetailsModel;
    @observable
    private final: any;
    private coordinateData: any = [];


    state: any = {};
    toggle: any = () => {
        //console.log("work")
        this.tooltipOpen = !this.tooltipOpen
    }
    toggleDropdown: any = () => {
        //console.log("work")
        this.tooltipOpen = !this.tooltipOpen
    }
    state1 = {
        isOpen: false
    };
    toggle1: any = () => {
        alert("Button is clicked");
        this.setState({
            isOpen: !this.state1.isOpen
        });
    };
    togglePopup: any = () => {
        this.isModalOpen = !this.isModalOpen;
    }

    openCoordinate = (name: any) => {
        if (name === 'project') {
            this.projectEnabled = true;
        } else {
            this.projectEnabled = false;
        }
        this.isModalOpen = true;


    }

    openModel: any = (item: any, index: number) => {
        this.state.siteName.map((site: any, index: number) => {
            site.active = false;
        });
        this.state.siteName[index].active = true;
        this.setState({ siteName: this.state.siteName, addSite: false });
        this.props.setSiteDetails(this.state.siteName[index]);
        //call
    }

    componentDidMount() {
        console.log(this.props.project?.getProjectDetails);
        this.final = this.props.project?.getProjectDetails;
        if (this.props.newShapeCoordinate.addSite === true && this.props.newShapeCoordinate.coordinateList.length > 0) {
            this.updateAddSite(this.props.newShapeCoordinate.coordinateList, this.props.newShapeCoordinate.selectShapIndex);
        }
    }
    componentDidUpdate(prevProps: any) {

        if (prevProps.newShapeCoordinate !== this.props.newShapeCoordinate && this.props.newShapeCoordinate.addSite === true && this.props.newShapeCoordinate.coordinateList.length > 0 && this.state.addSite === true) {
            console.log(this.props.newShapeCoordinate.selectShapIndex, '...');
            this.updateAddSite(this.props.newShapeCoordinate.coordinateList, this.props.newShapeCoordinate.selectShapIndex);
        } else if (prevProps.newShapeCoordinate !== this.props.newShapeCoordinate && this.props.newShapeCoordinate.addSite === false && this.props.newShapeCoordinate.selectCoordinate.length > 0 && this.state.addSite === true) {

            this.state.siteName.map((site: any, index: number) => {
                site.active = false;
            });
            for (let i = 0; i < this.state.siteName.length; i++) {
                if (JSON.stringify(this.state.siteName[i].coordinate) == JSON.stringify(this.props.newShapeCoordinate.selectCoordinate)) {
                    this.state.siteName[i].active = true;
                    break;
                }
            }
            this.setState({ siteName: this.state.siteName, addSite: false });
        }

        if (this.state.addSite === false) {
            this.setState({ addSite: true });
        }
    }
    updateAddSite: any = (coordinate: any, selectShapIndex: number) => {
        // this.setState({ siteName: [], count: 0 });
        // this.state.siteName = [];
        if (coordinate.length > 0) {
            coordinate.map((obj: any, index: any) => {
                this.state.siteName.map((site: any, index: number) => {
                    site.active = false;
                });
                let matchSite: any = this.state.siteName.filter((obj: any) => {return obj.id === (index + 1)});
                if (matchSite.length === 0) {
                    this.state.count += 1;
                    this.state.siteName.push({
                        id: this.state.count,
                        name: "Site no. " + this.state.count,
                        active: selectShapIndex === -1 ? true : false,
                        coordinate: obj,
                        disable: true
                    });
                }
            })
            if (selectShapIndex !== -1) {
                this.state.siteName[selectShapIndex].active = true;
            }
            this.setState({ siteName: this.state.siteName });
        }
    }

    // handleAddSite: any = () => {

    //     this.state.count += 1;
    //     this.state.siteName.map((site: any, index: number) => {
    //         site.active = false;
    //     });
    //     this.state.siteName.push({
    //         id: this.state.count,
    //         name: "Site no. " + this.state.count,
    //         active: true
    //     });
    //     this.setState({ siteName: this.state.siteName });
    // }

    changeUnit = (arg: any) => {
        let triangleCoords: any = [];
        if (arg.length > 0) {
            arg.map((obj: any) => {
                if (obj.lat !== '' && obj.lat !== NaN && obj.long !== '' && obj.long !== NaN) {
                    triangleCoords.push({ lat: parseFloat(obj.lat), lng: parseFloat(obj.long) });
                }
            })
            this.props.coordinateDetailsData(triangleCoords);
            this.isModalOpen = false;
        }
    }

    changePointUnit = (arg: any) => {
        let triangleCoords: any = [];
        if (arg.length > 0) {
            arg.map((obj: any) => {
                if (obj.lat !== '' && obj.lat !== NaN && obj.long !== '' && obj.long !== NaN) {
                    triangleCoords.push({ lat: parseFloat(obj.lat), lng: parseFloat(obj.long) });
                }
            })
            this.coordinateData = triangleCoords;
        }
    }

    deleteItem: any = () => {
        // this.state.count += 1;
        // this.state.siteName.map((site: any, index: number) => {
        //     site.active = false;
        // });
        // this.state.siteName.pop({
        //     id: this.state.count,
        //     name: "Site no. " + this.state.count,
        //     active: true
        // });
        // this.setState({ siteName: this.state.siteName });

    }

    handleNext = (obj: any) => {
        console.log('projDetails :', obj);
        // if (obj.length > 0) {
        //     this.nextEnableBtn = true;
        // }
        // else {
        //     this.nextEnableBtn = false;
        // }
    }


    saveCoordinates() {
        let triangleCoords: any = [];
        if (this.coordinateData.length > 0) {
            triangleCoords = this.coordinateData;
        }
        this.props.coordinateDetailsData(triangleCoords);
        this.isModalOpen = false;
    }

    saveProjectDetails() {

        let apiData: any = {};






        console.log(this?.projectModel?.projectName);
        console.log(this?.projectModel?.refno);
        console.log(this?.projectModel?.client);
        console.log(this?.projectModel?.notes);

        //console.log("...... test 1", this.final);
        // console.log(".... test 2", this.props.project?.getState.projectDetail);

        let allNames: any = this.props.project?.getState.projectDetailData ?? [];
        console.log(allNames)
        let sites: any = [];
        if (this.state.siteName.length > 0) {
            this.state.siteName.map((obj: any) => {
                sites.push({
                    siteName: obj.name,
                    Description: obj.name,
                    siteCoordinates: obj.coordinate,
                    createdDate: new Date()
                })
            });
        }
        console.log('...sites...' + JSON.stringify(sites));

        apiData["projectName"] = this?.projectModel?.projectName;
        apiData["notes"] = this?.projectModel?.notes;
        apiData["referenceNumber"] = this?.projectModel?.refno;
        apiData["projectTypeId"] = 1;
        apiData["clientName"] = this?.projectModel?.client;
        apiData["createdDate"] = new Date();
        //apiData["updatedDate"] = "2020-07-20T18:41:27.5836296Z";
        apiData["sites"] = sites;

        console.log('...apiData...' + apiData);
        console.log('...apiData...' + JSON.stringify(apiData));
        this.props.project?.saveProject(apiData, this.saveProjectResponse, this.saveProjectFail);
        this.isModalOpen = false;
    }
    saveProjectResponse = (response: any) => {
        console.log("saveProjectResponse Success", response);

    }

    saveProjectFail = (response: any) => {
        console.log("saveProjectResponse Fail", response);
    }
    updateVal = (value: any, index: any) => {
        this.state.siteName[index].name = value;
        this.setState({ siteName: this.state.siteName});
    }
    // handleRename: any = (ev: React.ChangeEvent<HTMLInputElement>) => {

    //     this.setState({ disable: false })

    //     // this.state.siteName = ev.target.value;
    // }

    uploadFileTrigger = () => {
        let upload = document.getElementById('selectedFile') as HTMLElement;
        upload.click();
    };

    findFirstDiff = (str1: any, str2: any) =>
        str2[[...str1].findIndex((el, index) => el !== str2[index])];

    // Choose File 
    uploadFile = (event: any) => {
        if (event.target.files[0] !== undefined) {
            let ext = event.target.files[0].name.split('.').pop().toLowerCase();
            const reader = new FileReader();
            const file = event.target.files[0];
            let triangleCoords: any = [];
            reader.readAsText(file);
            if (ext === 'csv') {
                reader.onload = (event: any) => {
                    let lines: any = event.target.result.split('\n');

                    let headers: any = lines[0].split(",");
                    headers.map((name: any, index: any) => {
                        headers[index] = name.replace(/\s+/g, '');
                    });


                    let latitudeIndex: number = headers.indexOf('latitude');
                    let longitudeIndex: number = headers.indexOf('longitude');//longitude

                    for (let i = 1; i < lines.length - 1; i++) {
                        let currentline: any = lines[i].split(',');
                        console.log('currentline :', currentline, ', latitudeIndex :', latitudeIndex, ', longitudeIndex :', longitudeIndex);
                        triangleCoords.push({ 'lat': parseFloat(currentline[latitudeIndex]), 'lng': parseFloat(currentline[longitudeIndex]) })
                    }
                    console.log(triangleCoords);

                    //WIP: Draw for xml cordinates 'triangleCoords'
                    this.props.coordinateDetailsData(triangleCoords);

                }
            }

            if (ext === 'kml') {
                reader.onload = (event: any) => {
                    // let triangleCoords: any = [];
                    let parser = new DOMParser();
                    let xmlDoc = parser.parseFromString(event.target.result, "text/xml");
                    let coordinatesObj: any = xmlDoc.getElementsByTagName("coordinates");
                    if (coordinatesObj.length > 0) {
                        for (var i = 0; i < coordinatesObj.length; i++) {
                            var name = coordinatesObj[i].firstChild.nodeValue;
                            triangleCoords.push({ lat: parseFloat(name.split(",")[1]), lng: parseFloat(name.split(",")[0]) })
                        }
                        console.log(triangleCoords);
                        this.props.coordinateDetailsData(triangleCoords);
                    }
                }
            }
        }
    }

    render() {
        const tooltipStyle: any = {
            placement: "top",
            text: "Top"
        }
        return (
            <div className=" clearfix sidebarInnerContainer">
                <br></br>
                <h6>Identify Site(s)</h6>
                {/* <Button className="arrowBack">
                    <i className="fa fa-arrow-left" aria-hidden="true"></i>
                </Button> */}
               <ListGroup className="fontSmall">
                    {
                        this.state.siteName.map((item: any, index: number) => {
                            return <ListGroupItem active={item.active} tag="button" action key={index} onClick={() => this.openModel(item, index)}><Input className="listGroupTxt renameIn"  onChange={e => this.updateVal(e.target.value, index)} value={item.name} disabled={item.disable}></Input>
                                <UncontrolledDropdown>
                                <DropdownToggle right className="dropBtn">
                                <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>
                                        Edit Coordinate
                                        </DropdownItem>
                                    <DropdownItem onClick={()=> item.disable = false}>
                                        Rename
                                        </DropdownItem>
                                    <DropdownItem onClick={e =>
                                        window.confirm("Are you sure you wish to delete this item?") &&
                                        this.deleteItem(e)
                                    }>
                                        Delete
                                        </DropdownItem>
                                </DropdownMenu>
                             </UncontrolledDropdown>

                            </ListGroupItem>

                        })
                    }

                    {/* < ListGroupItem tag="button" action><span className="listGroupTxt">Site no. 2</span><span>:</span></ListGroupItem>
                    <ListGroupItem tag="button" action><span className="listGroupTxt">Site no. 3</span><span>:</span></ListGroupItem> */}
                </ListGroup>

                {/* <button className="fontSmall" id="addSitebtn" onClick={this.handleAddSite}>Add Site</button> */}
                <div className="addsiteDiv">
                    <Label className="fontSmall" id="addSitebtn">Add Site:</Label>

                    <br></br>
                    <span></span>
                    <Button className="fontSmall addCordinate" id="polygonBtn" ><i className="fas fa-map"></i>
                    </Button >
                    <Tooltip placement={tooltipStyle.placement}
                        isOpen={this.tooltipOpen}
                        target={"polygonBtn"}
                        toggle={this.toggle}>
                        Use icon available on the map
                     </Tooltip>

                    <span>&nbsp;</span>
                    <span>
                        {/* <button className="fontSmall" onClick={() => this.openCoordinate('coordinate')}>Add coordinates</button>
                     */}
                        <Button className="fontSmall addCordinate addWidth" onClick={() => this.openCoordinate('coordinate')}>Add coordinates</Button>
                    </span> <span>
                    </span> <span>

                        <Button className="addCordinate fontSmall" onClick={this.uploadFileTrigger}>Upload file</Button>
                        <div><input type="file" name="file" id="selectedFile" className="d-none" onChange={this.uploadFile} /></div>
                    </span>
                </div>
                <div className="sidebarStyle backgroundWhite " >
                    <div><span><button className="btn saveBtn col-md-2" onClick={() => this.openCoordinate('project')}>Save Projects</button></span></div>

                </div>

                <div>
                    <Modal isOpen={this.isModalOpen}>
                        <form >
                            <ModalHeader>
                                {this.projectEnabled ?
                                    <div className='newprjct'> New Project </div>
                                    : <div className='newprjct'> Co-ordinates</div>
                                }
                                <button type="button" className="close" aria-label="Close" onClick={this.togglePopup}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </ModalHeader>
                            <ModalBody>
                                {this.projectEnabled ?
                                    <ProjectDetailFirstForm firstformdata={this.handleNext}></ProjectDetailFirstForm>
                                    : <CoordinateDetails1 coordinateDetailsData={this.changeUnit} saveSiteDetails={this.state.siteName} coordinatePointDetails={this.changePointUnit} />
                                }

                            </ModalBody>
                            <ModalFooter>
                                <Button type="button" value="Save" onClick={this.projectEnabled ? this.saveProjectDetails.bind(this) : this.saveCoordinates.bind(this)} className="btn nextBtn col-md-2">Save</Button>
                            </ModalFooter>
                        </form>
                    </Modal>
                </div>


            </div >
        )
    }

}