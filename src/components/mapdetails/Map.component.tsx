import React, { Component, createRef } from 'react';
import { observable } from "mobx";
import { observer } from "mobx-react";
import SiteComponent from "./Site.component";
import SearchonMap from './MapSearch';

const GOOGLE_MAP_API_KEY = 'AIzaSyDjVdfFI2EG9sYyqTkWxu2X1FjXUgQgrkw';
// const GOOGLE_MAP_API_KEY = `AIzaSyCb1xprYSpXd0q_yDsJ1W2UGhfl9_YGKU0`;


declare global {
    interface Window {
        google: any;
    }
};

export interface IModelSiteProps {
    coordinateDetailsData: any;
}

let google = window.google; // ok now

@observer
export default class MapComponent extends React.Component<IModelSiteProps> {

    constructor(props: IModelSiteProps) {
        super(props);
        this.state = {
            center: {
                lat: 30.42419403634421,
                lng: 90.0926995893311
               
            },
            zoom: 9,
            count: 0,
            newShapeCoordinate: { addSite: true, coordinateList: [], selectCoordinate: [] },
            storeShapeCoordinate: [],
            triggerShaps: [],
            selectShapIndex: -1
        };

        this.setSelection = this.setSelection.bind(this);
    }

    @observable
    private googleMapRef: any = React.createRef();
    @observable
    private googleMap: any = createRef;
    // @observable
    // private marker:any = createRef;
    public state: any = {};
    public map: any = {};
    public drawingManager: any = {};

    @observable
    private siteMapEnable: boolean = false;
    private selectedShape: any;
    private curseldiv: any;
    private selectedColor: any


    clearSelection() {

        if (this.selectedShape) {
            if (typeof this.selectedShape.setEditable == 'function') {
                this.selectedShape.setEditable(false);
                this.selectColor(this.selectedShape.set('fillColor', 'rgba(255, 255, 255, 0.5)'));
               
            }
            this.selectedShape = null;
        }
        //this.curseldiv.innerHTML = "<b>cursel</b>:";
    }

    setSelection = (shape: any, isNotMarker: any, count: number) => {
        if (this.state.storeShapeCoordinate.length > 0) {
            this.state.selectShapIndex = count - 1;
            this.setState({ newShapeCoordinate: { addSite: false, coordinateList: this.state.storeShapeCoordinate, selectCoordinate: this.state.storeShapeCoordinate[count - 1] } });
        }
        this.clearSelection();
        this.selectedShape = shape;
        if (isNotMarker)
            shape.setEditable(true);
        this.selectColor(shape.get('fillColor'));
        shape.set('fillColor', '#009999');
        this.updateCurSelText(shape);
    }


    updateCurSelText(shape: any) {
    }

    selectColor = (color: any) => {

        this.selectedColor = color;
        let polygonOptions = this.drawingManager.get('polygonOptions');
        polygonOptions.strokeColor = this.selectedColor;
        polygonOptions.fillColor = '#009999';
        this.drawingManager.set('polygonOptions', polygonOptions);
    }

    drawBermudaTriangle(triangleCoords: any) {
        if (triangleCoords.length > 0) {
            this.state.selectShapIndex = -1;
            this.state.storeShapeCoordinate.push(triangleCoords);
            this.setState({ center: triangleCoords[0], newShapeCoordinate: { addSite: true, coordinateList: this.state.storeShapeCoordinate, selectShapIndex: this.state.selectShapIndex } });
        }

        const bermudaTriangle = new window.google.maps.Polygon({
            paths: triangleCoords,
            strokeColor: "#009999",
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: "rgba(255, 255, 255, 0.5)",
            fillOpacity: 0.35,
            editable: false
        });
        bermudaTriangle.setMap(this.map);
        this.state.triggerShaps.push(bermudaTriangle);
        this.state.count += 1;
        let count: any = this.state.count;
        window.google.maps.event.addListener(bermudaTriangle, 'click', () => {
            this.setSelection(bermudaTriangle, bermudaTriangle, count);
        });
    }

    // helper functions
    createGoogleMap(triangleCoords: any) {

        this.drawingManager = new window.google.maps.drawing.DrawingManager({
            drawingMode: window.google.maps.drawing.OverlayType.MARKER,
            drawingControl: true,
            drawingControlOptions: {
                position: window.google.maps.ControlPosition.TOP_CENTER,
                //drawingModes: ['polygon']
                drawingModes: [window.google.maps.drawing.OverlayType.POLYGON]
            },
            markerOptions: {

                draggable: true,
                //editable: true,

            },
            polygonOptions: {
                fillColor: 'rgba(255, 255, 255, 0.5)',
                strokeWeight: 1,
                editable: true,
                zIndex: 1,
                strokeColor: '#009999',
                strokeOpacity: 0.8,
                fillOpacity: 0.35,

            }
            
        });

        if (triangleCoords.length > 0) {
            console.log(triangleCoords[0]);
            this.setState({ center: triangleCoords[0] });
        }
        this.map = new window.google.maps.Map(this.googleMapRef.current, {
            zoom: this.state.zoom,
            center: this.state.center,
            // mapTypeId: "terrain"
        });

        // Construct the polygon.

        this.drawBermudaTriangle(triangleCoords);
        this.drawingManager.setMap(this.map);
        this.curseldiv = document.getElementById('cursel');

        //polygon draw complete 
        window.google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (e: any) => {


            //~ if (e.type != google.maps.drawing.OverlayType.MARKER) {
            let isNotMarker: any = (e.type != window.google.maps.drawing.OverlayType.MARKER);
            // Switch back to non-drawing mode after drawing a shape.
            this.drawingManager.setDrawingMode(null);

            let newShape: any = e.overlay;
            newShape.type = e.type;
            this.state.triggerShaps.push(newShape);
            this.state.count += 1;
            let count: any = this.state.count;
            this.state.selectShapIndex = -1;
            window.google.maps.event.addListener(newShape, 'click', () => {
                this.setSelection(newShape, isNotMarker, count);

            });

            let coordinateList: any = [];
            if (typeof (newShape.getPath) === 'function') {
                for (let i = 0; i < newShape.getPath().getLength(); i++) {
                    let coordinate = newShape.getPath().getAt(i).toUrlValue().split(',');
                    coordinateList.push({ lat: parseFloat(coordinate[0]), lng: parseFloat(coordinate[1]) });
                }

                //Dynamic coordinateList to state
                this.state.storeShapeCoordinate.push(coordinateList);

                //WIP: After complete drawing : Add site name in sitedetail component
                //WIP: pass co-ordinate to site component
                this.setState({ newShapeCoordinate: { addSite: true, coordinateList: this.state.storeShapeCoordinate, selectCoordinate: this.state.storeShapeCoordinate[this.state.storeShapeCoordinate.length - 1], selectShapIndex: this.state.selectShapIndex } });

            }

        })
        const centerControlDiv = document.createElement("div");
        this.CenterControl(centerControlDiv, this.map); // @ts-ignore TODO(jpoehnelt)

        centerControlDiv.index = 1;
        this.map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(
            centerControlDiv
        );

        /* Search Map Start */
        let input: any = document.getElementById("pac-input") as HTMLElement;
        let searchBox: any = new window.google.maps.places.SearchBox(input);
       this.map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input); // Bias the SearchBox results towards current map's viewport.
        this.map.addListener("bounds_changed", () => {
            searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
        });
        let markers: google.maps.Marker[] = []; // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();
            let map: any = this.map;
        
            if (places.length == 0) {
              return;
            }
        
            // Clear out the old markers.
            markers.forEach((marker: any) => {
              marker.setMap(null);
            });
            markers = [];
        
            // For each place, get the icon, name and location.
            const bounds = new google.maps.LatLngBounds();
            places.forEach((place: any) => {
              if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
              }
              const icon = {
                url: place.icon as string,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
              };
        
              // Create a marker for each place.
              markers.push(
                new google.maps.Marker({
                  map,
                  icon,
                  title: 'India',
                  position: {'lat': 20.593684, 'lng': 78.96288}
                })
              );
        
              if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
            });
            map.fitBounds(bounds);
          });
          /* Search Map End */
    }

    //Sidebar
    CenterControl(centerControlDiv: HTMLDivElement, map: any) {
        // Set CSS for the control border.
        const controlUI = document.createElement("div");
        controlUI.style.backgroundColor = "#fff";
        controlUI.style.border = "2px solid #fff";
        controlUI.style.borderRadius = "3px";
        controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
        controlUI.style.cursor = "pointer";
        controlUI.style.marginBottom = "22px";
        controlUI.style.textAlign = "center";
        controlUI.title = "Click to View Sidebar";
        centerControlDiv.appendChild(controlUI); // Set CSS for the control interior.

        const controlText = document.createElement("div");
        controlText.style.color = "rgb(25,25,25)";
        controlText.style.fontFamily = "Roboto,Arial,sans-serif";
        controlText.style.fontSize = "16px";
        controlText.style.lineHeight = "38px";
        controlText.style.paddingLeft = "5px";
        controlText.style.paddingRight = "5px";
        controlText.innerHTML = "<i class='fa fa-bars'></i>";
        controlUI.appendChild(controlText); // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener("click", () => {
            this.setState({ center: this.state.storeShapeCoordinate[0], newShapeCoordinate: { addSite: true, coordinateList: this.state.storeShapeCoordinate, selectShapIndex: this.state.selectShapIndex } });
            this.siteMapEnable = !this.siteMapEnable;
        });
    }


    componentDidMount() {
        const match: any = this.props;
        console.log(match.location.state, '...');
        const googleMapScript = document.createElement('script');
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=drawing,places`;
        window.document.body.appendChild(googleMapScript);
        googleMapScript.addEventListener('load', () => {
            let triangleCoords: any = match.location.state;
            this.googleMap.current = this.createGoogleMap(triangleCoords);
        })
        
    }

    coordinateDetails = (arg: any) => {
        console.log(arg, '....test....');

        //sample data
        // const triangleCoordsTest = [
        //     { lat: 37.42390182131783, lng: -122.0914977709329 },
        //     { lat: 37.42419403634421, lng: -122.0926995893311 },
        //     { lat: 37.42301710721216, lng: -122.0922532985281 }
        // ];

        if (arg.length > 0) {
            //Drawing for new coordinate
            this.drawBermudaTriangle(arg);
        }
    }

    getSiteDetails = (arg: any) => {
        let index: any = arg.id - 1;
        window.google.maps.event.trigger(this.state.triggerShaps[index], 'click', {})
    }
    render() {

        let mapStyles: any = {
            width: '100%',
            height: '550px',
            float: 'left',
        };

        if (!this.siteMapEnable) {
            mapStyles.width = '100%';
        } else {
            mapStyles.width = '75%';
        }
        return (

            <div>
                 {/* <SearchonMap></SearchonMap> */}
                 <div>
                    <input
                        id="pac-input"
                        className="controls"
                        type="text"
                        placeholder="Search Box"
                    />
                 </div>
                <div className=" clearfix sidebarStyle "> {this.siteMapEnable ? <SiteComponent coordinateDetailsData={this.coordinateDetails} setSiteDetails={this.getSiteDetails} newShapeCoordinate={this.state.newShapeCoordinate} /> : null}</div>
                <div
                    id="google-map"
                    ref={this.googleMapRef}
                    style={mapStyles}
                />

            </div >
        );
    }

}