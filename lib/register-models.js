"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var joi_1 = __importDefault(require("@hapi/joi"));
var core = __importStar(require("@actions/core"));
var github_1 = require("@actions/github");
var color_hash_1 = __importDefault(require("color-hash"));
var octokit_1 = __importDefault(require("./octokit"));
var model_1 = __importDefault(require("./model"));
/**
 * Create a label in the repo for the given model if
 * it doesn't exist. This will fail silently if it does.
 */
function createModelLabel(name) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, octokit_1.default.issues.createLabel(__assign({}, github_1.context.repo, { name: name, color: color_hash_1.default.hex(name) }))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.createModelLabel = createModelLabel;
/**
 * Register all models in the `baseDir/models` folder.
 */
function registerModels(actionRecord) {
    return __awaiter(this, void 0, void 0, function () {
        var cwd, baseDir, modelsDir, modelFiles;
        var _this = this;
        return __generator(this, function (_a) {
            cwd = process.env.GITHUB_WORKSPACE;
            baseDir = core.getInput('baseDir');
            modelsDir = path_1.default.join(cwd, baseDir, 'models');
            core.debug("Loading the models directory: " + modelsDir);
            modelFiles = fs_1.default.readdirSync(modelsDir);
            core.debug("Found " + modelFiles.length + " models");
            return [2 /*return*/, Promise.all(modelFiles.map(function (modelFile) { return __awaiter(_this, void 0, void 0, function () {
                    var pathToModelFile, modelFn, model;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                pathToModelFile = path_1.default.join(modelsDir, modelFile);
                                core.debug("Requiring model file: " + pathToModelFile);
                                modelFn = require(pathToModelFile);
                                model = modelFn({ Joi: joi_1.default });
                                // Create the model label
                                return [4 /*yield*/, createModelLabel(model.name)
                                    // Add it to the ActionRecord class
                                ];
                            case 1:
                                // Create the model label
                                _a.sent();
                                // Add it to the ActionRecord class
                                actionRecord.models[model.name] = new model_1.default(model);
                                return [2 /*return*/];
                        }
                    });
                }); }))];
        });
    });
}
exports.registerModels = registerModels;
//# sourceMappingURL=register-models.js.map