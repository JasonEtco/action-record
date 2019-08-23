import { context } from '@actions/github'
import { Schema } from '@hapi/joi'
import { IssuesCreateResponse } from '@octokit/rest'
import uuid from 'uuid'
import octokit from './octokit'
import Instance, { IssueRecord } from './instance'

type HookFn = (opts: any) => Promise<void>

interface Hooks {
  beforeValidate?: HookFn
  afterValidate?: HookFn
  beforeCreate?: HookFn
  afterCreate?: HookFn
  beforeSave?: HookFn
  afterSave?: HookFn
}

export interface ModelInput {
  name: string
  schema: Schema
  hooks?: Hooks
}

export default class Model {
  readonly name: string
  readonly schema: Schema
  public hooks?: Hooks

  constructor (model: ModelInput) {
    this.name = model.name
    this.schema = model.schema
    this.hooks = model.hooks
  }

  /**
   * Convert a `where` object to a string for proper searching.
   */
  private whereToStr (where: any) {
    const jsonStr = JSON.stringify(where, null, 2)
    return jsonStr.slice(1, jsonStr.length - 2)
  }

  /**
   * Call the search API to return all issues with this model's label.
   */
  private async searchForIssues (): Promise<IssuesCreateResponse[]> {
    // Search for issues by this label
    const issues = await octokit.search.issuesAndPullRequests({
      q: `is:issue is:open label:${this.name}`
    })
    return issues.data.items
  }

  private parseDataFromIssueBody (body: string): any {
    const reg = /^`{3}\n([\s\S]+)\n`{3}/
    const match = body.match(reg)
    if (match && match[1]) return JSON.parse(match[1])
    return {}
  }

  private convertIssueToJson (issue: IssuesCreateResponse): IssueRecord {
    const json = this.parseDataFromIssueBody(issue.body)
    return {
      ...json,
      created_at: issue.created_at,
      issue_number: issue.number
    }
  }

  /**
   * Find one record that matches the provided filter object.
   */
  async findOne (where: any) {
    const issues = await this.searchForIssues()
    const whereStr = this.whereToStr(where)
    const found = issues.find(issue => (issue.body as string).includes(whereStr))
    if (found) return new Instance(this, this.convertIssueToJson(found))
    return null
  }

  /**
   * Find all records that match the provided filter object.
   */
  async findAll (where?: any): Promise<Instance[]> {
    const issues = await this.searchForIssues()
    if (where) {
      const whereStr = this.whereToStr(where)
      const found = issues.filter(issue => (issue.body as string).includes(whereStr))
      return found.map(item => new Instance(this, this.convertIssueToJson(item)))
    } else {
      return issues.map(item => new Instance(this, this.convertIssueToJson(item)))
    }
  }

  /**
   * Create a new record
   */
  async create (opts: any): Promise<Instance> {
    // Validate the provided object against the model's schema
    await this.schema.validate(opts)

    // Generate a UUID
    const id = uuid.v4()

    const data = {
      action_record_id: id,
      ...opts
    }

    // Create the new issue
    const newIssue = await octokit.issues.create({
      ...context.repo,
      title: `[${this.name}]: ${id}`,
      body: Model.jsonToBody(data),
      labels: [this.name]
    })

    // Return the new instance
    return new Instance(this, {
      ...data,
      created_at: newIssue.data.created_at,
      issue_number: newIssue.data.number
    })
  }

  static jsonToBody (data: any) {
    return '```\n' + JSON.stringify(data, null, 2) + '\n```'
  }
}