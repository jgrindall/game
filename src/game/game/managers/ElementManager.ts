
/**
 *
 *  Used by Skulpt to make elements (makeElement) and various other functions needed throughout the app.
 *  For example generate the dropdowns in Blockly that we fill with the elements on your stage
 *  And update the property dropdowns.
 */

import {ElementMapping} from "../../../../pip/elements/types";
import BaseElementManager from "../../../../pip/elements/BaseElementManager";

class ElementManager extends BaseElementManager{

    /**
     * @param [options]
     */
    constructor(options?:{
        mapping?:ElementMapping
    }){
        super(options);
    }


    getElementByName(name:string){
        return this.sceneProxy.getElementByName(name);
    }



}

export default ElementManager;

