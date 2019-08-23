export interface IssueRecord {
  action_record_id: number
  created_at: string
  issue_number: number
  [key: string]: any
}

export default class Instance implements IssueRecord {
  readonly action_record_id: number
  readonly created_at: string
  readonly issue_number: number

  constructor (issue_record: IssueRecord) {
    const {
      action_record_id,
      created_at,
      issue_number,
      ...rest
    } = issue_record

    this.action_record_id = action_record_id
    this.created_at = created_at
    this.issue_number = issue_number

    for (const key in rest) {
      Object.defineProperty(this, key, {
        get: () => rest[key]
      })
    }
  }

  async destroy () {
    // TODO: Write code
  }
}
