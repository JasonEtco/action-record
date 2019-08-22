"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var github_1 = require("@actions/github");
var ActionRecord = /** @class */ (function () {
    function ActionRecord() {
        this.models = {};
        this.context = github_1.context;
    }
    return ActionRecord;
}());
exports.default = ActionRecord;
//# sourceMappingURL=action-record.js.map