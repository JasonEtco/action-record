import Model from './model';
export interface IssueRecord {
    action_record_id: string;
    created_at: string;
    issue_number: number;
    [key: string]: any;
}
export default class Instance {
    readonly modelName: string;
    readonly action_record_id: string;
    readonly created_at: string;
    readonly issue_number: number;
    [key: string]: any;
    constructor(model: Model, issue_record: IssueRecord);
    destroy(): Promise<import("@octokit/rest").Response<import("@octokit/rest").IssuesUpdateResponse>>;
}
