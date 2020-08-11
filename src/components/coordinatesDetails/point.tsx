import React, { useState } from "react";
import { Button } from "reactstrap";
import { Label, Input } from "reactstrap";
import { validationLatitudeLongitude } from './../../common/util';

interface ICoordinate {
  lat: string;
  long: string;
  invalid: Boolean,	
  touched: Boolean
}

export interface ICoordinateComponentProps {
  coordinateDetailsData?: any;
  coordinatePointDetails?: any;
}

const CoordinatePoint = (props: ICoordinateComponentProps) => {
  const initialCoordinates: ICoordinate[] = [
    { lat: "", long: "", invalid: true, touched: false },
    { lat: "", long: "", invalid: true, touched: false },
    { lat: "", long: "", invalid: true, touched: false },
  ];
  const [coordinates, setCoordinates] = useState(initialCoordinates);

  const addCoordinates = () => {
    setCoordinates([...coordinates, { lat: "", long: "", invalid: true, touched: false }]);
  };

  const deleteCoordinate = (index: number) => {
    let newCoordinates = coordinates.filter(
      (item, arrayIndex) => index != arrayIndex
    );
    setCoordinates(newCoordinates);
  };

  const handleChange = (value: any, index: number, type: string) => {
    let newCoordinates = coordinates.slice();
    let newCoordinate = newCoordinates[index];
    //const re = '^\d*(\.\d{0,2})?$';
    type === "lat" ? (newCoordinate.lat = value) : (newCoordinate.long = value);
    setCoordinates(newCoordinates);
    props.coordinatePointDetails(coordinates);
    showError(newCoordinate);
  };

  const getCoordinates = () => {
    console.log(coordinates);
    props.coordinateDetailsData(coordinates);
   
  }
  const showError = (newCoordinate: any) =>{	
     let result = validationLatitudeLongitude.latLong(newCoordinate.lat, newCoordinate.long);	
     newCoordinate.invalid = result;	
     newCoordinate.touched = true;	
  }	
   const resetChange = ( ev:any, value: string, index: number) =>{	
    ev.target.value = '';	
   }
  return (
    <div className="container">
      <div className="row">
        {coordinates.map((item, index) => {
          return (
            <div key={index} className= {!item.invalid ? 'input-group row divError' : 'input-group row'}  >
              <Label className="col-sm-2 col-form-label">Point {index + 1}</Label>
              <Input
                type="text"
                className={!item.invalid ? 'form-control col-2 mr-3 borderError' : 'form-control col-2 mr-3'}
                onKeyDown={(e: any)=> handleChange(e.target.value,index,"lat")}
                onChange={(e) => handleChange(e.target.value, index, "lat")}
                value={item.lat}
              />
              <button className="close-icon geolat" onClick= {(ev) => handleChange('', index, "lat")} type="reset"></button><span className="north">&deg;N</span>
              <Input
                type="text"
                className={!item.invalid ? 'form-control col-2 mr-3 borderError' : 'form-control col-2 mr-3'}
                onChange={(e) => handleChange(e.target.value, index, "long")}
                value={item.long}
              /><button className="close-icon geolong" onClick= {(ev) => handleChange('', index, "long")} type="reset"></button><span className="east">&deg;E</span>	
              {item.invalid ?	
                  '': <span className = "errorlatlong"><i className="fa fa-exclamation-circle mr-2"></i>Format is incorrect </span> }
              {index > 2 ? (
                <Button type="button" className="btn btn-default deleteBtn" onClick={() => {
                  deleteCoordinate(index);
                }} >
                  <i className="fa fa-trash deleteIcon" aria-hidden="true"></i>
                </Button>
              ) : null}
            </div>
          );
        })}
        <div className="input-group row  mt-3">
          <Label className="col-sm-2 col-form-label"></Label>
          <div className="col-sm-3 addpointDiv">
            <Input type="button" value="Add Point" className="btn addPointBtn" onClick={() => addCoordinates()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatePoint;
