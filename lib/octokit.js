"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var github_1 = require("@actions/github");
// Export a singleton
var octokit = new github_1.GitHub(process.env.GITHUB_TOKEN);
exports.default = octokit;
//# sourceMappingURL=octokit.js.map