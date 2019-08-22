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
Object.defineProperty(exports, "__esModule", { value: true });
var github_1 = require("@actions/github");
var uuid_1 = __importDefault(require("uuid"));
var octokit_1 = __importDefault(require("./octokit"));
var instance_1 = __importDefault(require("./instance"));
var Model = /** @class */ (function () {
    function Model(model) {
        this.name = model.name;
        this.schema = model.schema;
        this.hooks = model.hooks;
    }
    /**
     * Convert a `where` object to a string for proper searching.
     */
    Model.prototype.whereToStr = function (where) {
        var jsonStr = JSON.stringify(where, null, 2);
        return jsonStr.slice(1, jsonStr.length - 2);
    };
    /**
     * Call the search API to return all issues with this model's label.
     */
    Model.prototype.searchForIssues = function () {
        return __awaiter(this, void 0, void 0, function () {
            var issues;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, octokit_1.default.search.issuesAndPullRequests({
                            q: "is:issue label:" + this.name
                        })];
                    case 1:
                        issues = _a.sent();
                        return [2 /*return*/, issues.data.items];
                }
            });
        });
    };
    Model.prototype.parseDataFromIssueBody = function (body) {
        var reg = /^`{3}\n([\s\S]+)\n`{3}/;
        var match = body.match(reg);
        if (match && match[1])
            return JSON.parse(match[1]);
        return {};
    };
    Model.prototype.convertIssueToJson = function (issue) {
        var json = this.parseDataFromIssueBody(issue.body);
        return __assign({}, json, { created_at: issue.created_at, issue_number: issue.number });
    };
    /**
     * Find one record that matches the provided filter object.
     */
    Model.prototype.findOne = function (where) {
        return __awaiter(this, void 0, void 0, function () {
            var issues, whereStr, found;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchForIssues()];
                    case 1:
                        issues = _a.sent();
                        whereStr = this.whereToStr(where);
                        found = issues.find(function (issue) { return issue.body.includes(whereStr); });
                        if (found)
                            return [2 /*return*/, new instance_1.default(this.convertIssueToJson(found))];
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Find all records that match the provided filter object.
     */
    Model.prototype.findAll = function (where) {
        return __awaiter(this, void 0, void 0, function () {
            var issues, whereStr_1, found;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchForIssues()];
                    case 1:
                        issues = _a.sent();
                        if (where) {
                            whereStr_1 = this.whereToStr(where);
                            found = issues.filter(function (issue) { return issue.body.includes(whereStr_1); });
                            return [2 /*return*/, found.map(function (item) { return new instance_1.default(_this.convertIssueToJson(item)); })];
                        }
                        else {
                            return [2 /*return*/, issues.map(function (item) { return new instance_1.default(_this.convertIssueToJson(item)); })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create a new record
     */
    Model.prototype.create = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            var id, data, newIssue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Validate the provided object against the model's schema
                    return [4 /*yield*/, this.schema.validate(opts)
                        // Generate a UUID
                    ];
                    case 1:
                        // Validate the provided object against the model's schema
                        _a.sent();
                        id = uuid_1.default.v4();
                        data = __assign({ action_record_id: id }, opts);
                        return [4 /*yield*/, octokit_1.default.issues.create(__assign({}, github_1.context.repo, { title: "[" + this.name + "]: " + id, body: '```\n' + JSON.stringify(data, null, 2) + '\n```', labels: [this.name] }))
                            // Return the new instance
                        ];
                    case 2:
                        newIssue = _a.sent();
                        // Return the new instance
                        return [2 /*return*/, new instance_1.default(__assign({}, data, { created_at: newIssue.data.created_at, issue_number: newIssue.data.number }))];
                }
            });
        });
    };
    return Model;
}());
exports.default = Model;
//# sourceMappingURL=model.js.map