"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var core = __importStar(require("@actions/core"));
/**
 * Checks if the provided argument is a function
 */
function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
/**
 * Finds the relevant event file for a given event and returns the function
 */
function findEventFunction(event) {
    var baseDir = core.getInput('baseDir');
    var filename = core.getInput("events." + event) || event + ".js";
    var pathToFile = path_1.default.join(baseDir, 'events', filename);
    // Verify that the file exists
    if (!fs_1.default.existsSync(pathToFile))
        return null;
    // Require the JS file
    var func = require(pathToFile);
    // Verify that they've exported a function
    if (!isFunction(func))
        throw new Error(pathToFile + " does not export a function!");
    // Return the function to be run
    return func;
}
exports.default = findEventFunction;
//# sourceMappingURL=find-event-function.js.map