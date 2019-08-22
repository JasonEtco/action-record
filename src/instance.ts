export interface IssueRecord {
  action_record_id: number
  created_at: string
  issue_number: number
  [key: string]: any
}

export default class Instance {
  public issue_record: IssueRecord

  constructor (issue_record: IssueRecord) {
    this.issue_record = issue_record
  }

  async destroy () {
    // TODO: Write code
  }
}
