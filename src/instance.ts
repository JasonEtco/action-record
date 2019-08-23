import { context } from '@actions/github'
import Model from './model'
import octokit from './octokit'

export interface IssueRecord {
  action_record_id: string
  created_at: string
  issue_number: number
  [key: string]: any
}

export default class Instance {
  readonly modelName: string
  readonly action_record_id: string
  readonly created_at: string
  readonly issue_number: number

  // Index signature
  [key: string]: any

  constructor (model: Model, issue_record: IssueRecord) {
    this.modelName = model.name

    const {
      action_record_id,
      created_at,
      issue_number,
      ...rest
    } = issue_record

    this.action_record_id = action_record_id
    this.created_at = created_at
    this.issue_number = issue_number

    Object.assign(this, rest)
  }

  async destroy () {
    return octokit.issues.update({
      ...context.repo,
      issue_number: this.issue_number,
      state: 'closed'
    })
  }
}
