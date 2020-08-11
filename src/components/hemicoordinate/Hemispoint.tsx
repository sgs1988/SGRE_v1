import React, { useState } from "react";
import { Button } from "reactstrap";
import { Label, Input } from "reactstrap";
import { validationLatitudeLongitude } from './../../common/util';

interface ICoordinate {
  x: string;
  y: string;
  z: string;
  invalid: Boolean,	
  touched: Boolean
}

const HemisCoordinatePoint = () => {
  const initialCoordinates: ICoordinate[] = [
    { x: "", y: "", z: "", invalid: true, touched: false },
    { x: "", y: "", z: "", invalid: true, touched: false  },
    { x: "", y: "", z: "", invalid: true, touched: false  },
  ];
  const [coordinates, setCoordinates] = useState(initialCoordinates);

  const addCoordinates = () => {
    setCoordinates([...coordinates, { x: "", y: "", z: "",invalid: true, touched: false }]);
  };

  const deleteCoordinate = (index: number) => {
   
    let newCoordinates = coordinates.filter(
      (item, arrayIndex) => index != arrayIndex
    );
    setCoordinates(newCoordinates);
  };

  const handleChange = (value: string, index: number, type: string) => {
    let newCoordinates = coordinates.slice();
    let newCoordinate = newCoordinates[index];
   
    setCoordinates(newCoordinates);
    if(type === 'x'){
        newCoordinate.x = value
    }
    else if (type === 'y'){
        newCoordinate.y = value
    }
    else if(type === 'z'){
        newCoordinate.z = value
    }
    else{
        value = ''
    }
    showError(newCoordinate);
  };
 
  const getCoordinates = () => {
      console.log(coordinates);
  }
  const showError = (coordinate: any) =>{	
    
     let resultx = validationLatitudeLongitude.xhemis(coordinate.x);
     let resulty = validationLatitudeLongitude.yhemis(coordinate.y);
     let resultz = validationLatitudeLongitude.zhemis(coordinate.z);
     coordinate.invalid = resultx && resulty && resultz ;	
     coordinate.touched = true;	
    	
  }	
  return (
    <div className="container">
      <div className="row hemisDiv mt-3">
            <label className="col-sm-2 col-form-label">Hemisphere</label>
            <div className="col-sm-8">
                <Input
                    type="select"
                    name="country"
                    id="country"
                >
                    <option value="north">Northen(N)</option>
                    <option value="south">Southern(S)</option>
                </Input>
            </div>
        </div>
      <div className="row">
      
        {coordinates.map((item, index) => {
          return (
            <div key={index} className={!item.invalid ? 'input-group row divError' : 'input-group row'}>
                 <Label className="col-sm-2 col-form-label">Point {index + 1}</Label>
              <Input
                type="text"
                className={!item.invalid ? 'form-control w-50 col-sm-1 borderError' : 'form-control col-1'}
                onChange={(e) => handleChange(e.target.value, index, "x")}
                value={item.x}
              /><button className="close-icon hemipoint" onClick= {(ev) => handleChange('', index, "x")} type="reset"></button>
              <Input
                type="text"
                className={!item.invalid ? 'form-control col-sm-2 borderError' : 'form-control col-2'}
                onChange={(e) => handleChange(e.target.value, index, "y")}
                value={item.y}
              /><button className="close-icon hemipoint" onClick= {(ev) => handleChange('', index, "y")} type="reset"></button>
              <span className="hemipointEast">m E</span>
              <Input
                type="text"
                className={!item.invalid ? 'form-control col-sm-2 borderError' : 'form-control col-2'}
                onChange={(e) => handleChange(e.target.value, index, "z")}
                value={item.z}
              /><button className="close-icon pointz" onClick= {(ev) => handleChange('', index, "z")} type="reset"></button>
              <span className="hemipointNorth">m N</span>
              {item.invalid ?	
                  '': <span className = "errorlatlong hemiser"><i className="fa fa-exclamation-circle mr-2"></i>Format is incorrect </span> }

              {index > 2 ? (
               <Button type="button" className="btn btn-default deleteBtn"   onClick={() => {
                    deleteCoordinate(index);
                  }} >
                 <i className="fa fa-trash deleteIcon" aria-hidden="true"></i>
               </Button>
              ) : null}
            </div>
            
          );
        })}
        <div className="input-group row mt-3">
            <Label className="col-sm-1 col-form-label"></Label>
            <div className="col-sm-3 addpointHemi">
                <Input type="button" value="Add Point" className="btn addPointBtn" onClick={() => addCoordinates()} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default HemisCoordinatePoint;
