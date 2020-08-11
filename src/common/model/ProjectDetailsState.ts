import { observable } from "mobx";
import { ProjectDetailsModel } from "./newprojectdetailsModel";


export class ProjectDetailState {

  @observable public projectDetailData: Array<ProjectDetailsModel> = new Array<ProjectDetailsModel>();
  
  @observable public projectDetail: ProjectDetailsModel = new ProjectDetailsModel();    
   
}
