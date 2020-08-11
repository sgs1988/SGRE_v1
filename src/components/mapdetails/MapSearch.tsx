import React, { Component, createRef } from 'react';
import { observable } from "mobx";
import { observer } from "mobx-react";
// import Autocomplete from 'react-google-autocomplete';

const GOOGLE_MAP_API_KEY = 'AIzaSyDjVdfFI2EG9sYyqTkWxu2X1FjXUgQgrkw';

export default class SearchonMap extends React.Component{
    render(){
        return(
            <div className= "searchHeader">
               <span className = "projHead"> New Project</span>
               <input
                    id="pac-input"
                    className="controls"
                    type="text"
                    placeholder="Search Box"
                    />
                    <i className="fa fa-search" aria-hidden="true"></i>
            </div>
        );
    }
}