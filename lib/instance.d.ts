export interface IssueRecord {
    action_record_id: number;
    created_at: string;
    issue_number: number;
    [key: string]: any;
}
export default class Instance {
    issue_record: IssueRecord;
    constructor(issue_record: IssueRecord);
    destroy(): Promise<void>;
}
