export class ProjectDetailsModel {
  public projectName: string= '';
  public refno: number | string | undefined;
  public notes: string = "";
  public client: string = "";
  public startDate: Date | undefined;
  public creator: string = "";
  public hemis: boolean = false;
  [key:string]: number | string | undefined | Date | boolean;
}

export class modalDetails {
  public description = [];
  public onCloseModal: boolean = true;
  public openModal: boolean = true;
  public title = [];
}