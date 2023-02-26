
import {ElementDefn, Section, SectionProgressType} from "../types";

require("./setup/setup");

//import { shallowMount, createLocalVue } from '@vue/test-utils'
//const localVue = createLocalVue()
//localVue.use(Vuex)

const elt:ElementDefn = {
    type:"plant",
    props:{
        name: "a",
        id:"1234"
    },
    id: "1234",
    editable: true,
    deleteable: false

};

const section: Section = {
    challenge:{
        description:[]
    }/*,
    elements:[
        elt,
        elt,
        elt
    ]*/
};
/*

describe('test levelModule basics', function () {

    beforeEach(()=>{
        levelModule.reset();
        progressModule.reset();
    });

    it('should have defaults', () => {
        expect(levelModule.sections.length).toEqual(0);
        //expect(levelModule.sectionProgress.currentSectionIndex).toEqual(0);
    });

    it('should setSections', () => {
        levelModule.init([
            section,
            section
        ]);
        progressModule.init({
            currentSectionIndex:1,
            sectionViewIndex:1,
            sectionStatus:[]
        });
        expect(levelModule.sections.length).toEqual(2);
        expect(levelModule.sectionProgress.currentSectionIndex).toEqual(1);
    });

    it('should proceed', async () => {
        levelModule.init({
            sections:[
                section,
                section
            ],
            sectionProgress: {
                currentSectionIndex:1,
                sectionViewIndex:1,
                sectionStatus:[]
            }
        });
        expect(levelModule.sectionProgress.currentSectionIndex).toEqual(1);
        await levelModule.startPlayingSection();
        expect(levelModule.sections.length).toEqual(2);
        expect(levelModule.sectionProgress.currentSectionIndex).toEqual(2);
    });

});

*/
