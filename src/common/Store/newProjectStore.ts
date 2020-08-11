import { observable, action, computed } from "mobx";
import { ProjectDetailState } from "../model/ProjectDetailsState";
import handleRequest from "../middleware/fetchMiddleware";

import { ProjectDetailsModel } from "../model/newprojectdetailsModel";

export interface IProject {
  fetchAllProjectName(callback?: any): void;
  getState: ProjectDetailState;
}

export class ProjectStore implements IProject {
  constructor(projectState: ProjectDetailState) {
    this.state = projectState;
  }
  @observable
  public state: ProjectDetailState;

  @computed
  public get getState(): ProjectDetailState {
    return this.state;
  }
  @action
  public fetchAllProjectName(callback?: any) {
    if (callback) {
      callback(true);
    }
    const config = {
      path: `/Projects`,
      method: "GET",
      success: (json: any) => this.receiveProjectsData(json),
      
    };
    handleRequest(config);
  }
    private receiveProjectsData(json: Array<ProjectDetailsModel>) {
        console.log("API called");
    this.state.projectDetailData = json;
  }
  @action
	public setProjectDetails(filter: ProjectDetailsModel) {
  	this.state.projectDetail = filter;
  } 

  public get  getProjectDetails() {
      return this.state.projectDetail;
  }

  @action
  public saveProject(projectDetail: any, callback: any, failureCallback: any) {
    console.log(projectDetail);
    const config = {
      path: `/Projects`,
      method: "POST",
      body: projectDetail,
      customErrorMessage: true,
      success: (json: any) => {
        callback(false);
        alert("Project created successfully.");
      },
      failure: (response: any) => {
        if (response.status == 409) {
          alert("Failed to create project.");
          return;
        }
        failureCallback();
      },
    };
    handleRequest(config);
  } 
 


   
}
