
export type CoordinateMapping = {
    offsetX:number,
    offsetY:number,
    gridSize:number
};

export type ElementDefn = {
    type:string,
    props:{
        name: string,
        id:string,
        color?: any | null,
        x?: number,
        y?: number,
        angle?:number,
        scaleX?:number,
        scaleY?:number,
        coordinates?:CoordinateMapping,
        image?:string,
        visibleAtStart?: boolean
    }
    id: string,
    editable: boolean
    deleteable: boolean
};

export interface ISkulptSuspension {
    code:string,
    colno:number,
    lineno: number,
    globals:Record<string, any>,
    locals:Record<string, any>,
    temps:Record<string, any>
}

interface ISkulptValue{
    v:string | number
}

interface ISkulptTraceback {
    filename:string,
    lineno:string
}

export interface ISkulptError {
    args: {
        v : (number | ISkulptValue)[]
    },
    traceback: ISkulptTraceback[]
}

export type MapDefn = number[][];

export type Point = {
    x:number,
    y:number
}

export type Challenge = {
    description: string[],
    options?:{
        lockedLines?:number[]
    }
}

export type Hint = {
    content: string
}

export type Section = {
    hints?:Hint[],
    info?:Info[],
    challenge:Challenge,
    elements?:ElementDefn[]
}

export type PlatformData = {

};

export type TiledElementDefn = {
    _scene: number,
    _type: "platform" | "flower" | "plant",
    _name:string
};

export type SaveLoadData = {
    sections:Section[],
    sectionProgress:SectionProgress
}

export interface IScene{
    cameras:{
        main:{
            visible: boolean,
            scrollX:number,
            scrollY:number
        }
    }
    tweens:{
        add:(config:any)=>void
    }
    setup:()=>void
}

export interface IElementManager{
    manageScene(scene:IScene):void;
}

export type WayPointPos = {
    x: number,
    y: number,
    section: number
}

export enum WaypointType{
    START = "start",
    END = "end",
    INFO = "info"
}

/** named with underscores because 'Tiled' exports like that **/
export type WayPointStart = {
    _id:number,
    _section: number,
    _type: WaypointType.START,
    _cameraX:number,
    _cameraY:number
};

export type WayPointEnd = {
    _id:number,
    _section: number,
    _type:WaypointType.END
};

export type WayPointInfo = {
    _id:number,
    _type:WaypointType.INFO
};

export type Info = {
    position?: Point,
    description:string[],
    type:string,
    label?:string,
    autoShow?: boolean,      // show the dialog when you hit it?
}

export type WayPoint = WayPointStart | WayPointEnd | WayPointInfo;

export enum SectionProgressType{
    PENDING = "pending",                                // not started yet
    CODE = "code",                                      // write the code
    PLAY = "play",                                      // play - walk to the next level
    COMPLETE = "complete"                               // complete
}

export type SectionStatus = {
    status:  SectionProgressType,
    hintsSeen:Record<string, boolean>,
    infoSeen:Record<string, boolean>,
    code: string
};

export type SectionProgress = {
    currentSectionIndex: number,
    sectionViewIndex:number,
    sectionStatus: SectionStatus[]
};

export enum CodeStatus{
    IDLE = "init",
    RUNNING = "running",
    COMPLETE = "complete"
}

export type PhaserEventData = {
    stopPropagation: () => void
}

