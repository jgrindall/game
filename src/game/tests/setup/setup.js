// import ElementManager from "../../elements/ElementManager";

window.IS_MOCHA = true;
global.IS_MOCHA = true;

require("../../../../js/skulptjs/skulpt.min");
require("../../../../js/skulptjs/skulpt-stdlib");
require("../../../../js/skulptjs/debugger");

const SkulptOptions = require("../../../pip/code/SkulptOptions");
SkulptOptions.setup();

require("../../../pip/elements/ElementTypes");

global.T = window.T;
