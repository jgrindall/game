/**
 * hard-coded elements
 */

import {getUniqueId} from "../utils/Utils";
import {ElementDefn, Section} from "../types";

const getPlant = (name:number):ElementDefn=>{
    const id = getUniqueId();
    return {
        "type": "plant",
        "props": {
            "name": "plant" + name,
            "id": id,
            "color": null,
            "x": 170 + name * 1000,
            "y": 200,
            "angle":0,
            "scaleX":1,
            "scaleY":1,
            "image": "/images/pythonator/bush2.png",
            "visibleAtStart": true
        },
        "id": id,
        "editable": true,
        "deleteable": false
    };
};

const getLadder = (name:number):ElementDefn=>{
    const id = getUniqueId();
    return {
        "type": "ladder",
        "props": {
            "name": "ladder" + name,
            "id": id,
            "color": null,
            "x": 350 + name * 1100,
            "y": 340,
            "angle":0,
            "scaleX":1,
            "scaleY":1,
            "image": "/images/pythonator/ladder.png",
            "visibleAtStart": true
        },
        "id": id,
        "editable": true,
        "deleteable": false
    };
};

const getFlower = (name:number):ElementDefn=>{
    const id = getUniqueId();
    return {
        "type": "flower",
        "props": {
            "name": "flower" + name,
            "id": id,
            "color": null,
            "x": 320 + name * 1200,
            "y": 400,
            "angle":0,
            "scaleX":1,
            "scaleY":1,
            "image": "/images/pythonator/flower.png",
            "visibleAtStart": true
        },
        "id": id,
        "editable": true,
        "deleteable": false
    };
};

const getContainer = (name:number):ElementDefn=>{
    const id = getUniqueId();
    return {
        "type": "container",
        "props": {
            "name": "container" + name,
            "id": id,
            "color": null,
            coordinates:{
                offsetX:0,
                offsetY:0,
                gridSize:64
            },
            "x": 8 + name * 18,
            "y": 4,
            "angle":0,
            "scaleX":1,
            "scaleY":1,
            "image": "/images/pythonator/container.png",
            "visibleAtStart": true
        },
        "id": id,
        "editable": true,
        "deleteable": false
    };
};

const getPlatform = (name:number):ElementDefn=>{
    const id = getUniqueId();
    return {
        "type": "platform",
        "props": {
            "name": "platform" + name,
            "id": id,
            "color": null,
            "x": 770,
            "y": 750,
            "angle":0,
            "scaleX":1,
            "scaleY":1,
            "image": "/images/pythonator/platform.png",
            "visibleAtStart": true
        },
        "id": id,
        "editable": true,
        "deleteable": false
    };
};

const sections: Section[] = [
    {
        hints:[
            {
                content: "hint 0"
            },
            {
                content: "hint 1"
            },
            {
                content: "hint 2"
            }
        ],
        info:[
            {
                label:"Instructions",
                type:"abc",
                autoShow: true,
                description:[
                    "A You need to...",
                    "B You need to...",
                    "C You need to..."
                ]
            },
            {
                type:"",
                label:"Something here too...",
                autoShow: false,
                description:[
                    "G You need to...",
                    "H You need to...",
                    "I You need to..."
                ]
            },
            {
                label:"Something here...",
                type:"abc",
                autoShow: true,
                description:[
                    "D You need to...",
                    "E You need to...",
                    "F You need to..."
                ]
            }
        ],
        challenge:{
            description:[
                "challenge",
                "bbb",
                "ccc"
            ]
        },
        elements:[
            getPlant(0),
            getPlant(1),
            getLadder(0),
            getFlower(0),
            getPlatform(0)
        ]
    },
    {
        challenge:{
            description:[
                "challenge",
                "bbb",
                "ccc"
            ]
        },
        elements:[
            getPlant(2),
            getPlant(3),
            getLadder(1),
            getFlower(1),
            getContainer(0)
        ]
    },
    {
        challenge:{
            description:[
                "challenge",
                "bbb",
                "ccc"
            ]
        },
        elements:[
            getPlant(4),
            getPlant(5),
            getLadder(2),
            getFlower(2)
        ]
    },
    {
        challenge:{
            description:[
                "challenge",
                "bbb",
                "ccc"
            ]
        },
        elements:[
            getPlant(6),
            getPlant(7),
            getLadder(3),
            getFlower(3)
        ]
    },
    {
        challenge:{
            description:[
                "challenge",
                "bbb",
                "ccc"
            ]
        },
        elements:[
            getPlant(8),
            getPlant(9),
            getLadder(4),
            getFlower(4)
        ]
    },
    {
        challenge:{
            description:[
                "challenge",
                "bbb",
                "ccc"
            ]
        },
        elements:[
            getPlant(10),
            getPlant(11),
            getLadder(5),
            getFlower(5)
        ]
    }
];

export default sections;
