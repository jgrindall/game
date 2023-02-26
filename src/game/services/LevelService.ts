/**
 * Load the pupil's progress
 */

import sections from "./sections";
import {SaveLoadData, SectionProgressType} from "../types";

class LevelService{
	async load(): Promise<SaveLoadData>{
		const data:SaveLoadData = {
			sections: sections,
			sectionProgress:{
				currentSectionIndex: 0,
				sectionViewIndex:0,
				sectionStatus:[
					{
						hintsSeen:{},
						infoSeen:{},
						status:SectionProgressType.PENDING,
						code:""
					},
					{
						hintsSeen:{},
						infoSeen:{},
						status:SectionProgressType.PENDING,
						code:""
					},
					{
						hintsSeen:{},
						infoSeen:{},
						status:SectionProgressType.PENDING,
						code:""
					}
				]
			}
		};
		return Promise.resolve(data);
	}
}
export default LevelService;