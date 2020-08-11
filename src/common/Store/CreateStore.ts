import { PROJECT } from '../constants/stores';
import {ProjectStore} from './newProjectStore';
import { ProjectDetailState } from '../model/ProjectDetailsState';

export function createStores(
	projectDetailState: ProjectDetailState
	
) {
	const projectStore = new ProjectStore(projectDetailState);	
	return {
		[PROJECT]: projectStore,		
	};
}