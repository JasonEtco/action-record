import github from '@actions/github'
import Joi from '@hapi/joi'
import uuid from 'uuid'
import octokit from './octokit'
import Instance from './instance'

export default class Model {
  public name: string
  public schema: Joi
  public validate: Joi.validate

  constructor (name: string, schema: Joi) {
    this.name = name
    this.schema = schema
    this.validate = schema.validate
  }

  whereToStr (where: any) {
    const jsonStr = JSON.stringify(where, null, 2)
    return jsonStr.slice(1, jsonStr.length - 2)
  }

  private async searchForIssues () {
    // Search for issues by this label
    const issues = await octokit.search.issuesAndPullRequests({
      q: `is:issue label:${this.name}`
    })
    return issues.data.items
  }

  async findOne (where: any) {
    const issues = await this.searchForIssues()
    const whereStr = this.whereToStr(where)
    const found = issues.find(issue => (issue.body as string).includes(whereStr))
    return new Instance(found)
  }

  async findAll (where: any): Promise<Instance[]> {
    const issues = await this.searchForIssues()
    const whereStr = this.whereToStr(where)
    const found = issues.filter(issue => (issue.body as string).includes(whereStr))
    return found.map(item => new Instance(item))
  }

  async create (opts: any): Promise<Instance> {
    // Validate the provided object against the model's schema
    await this.schema.validate(opts)

    // Generate a UUID
    const id = uuid.v4()

    // Create the new issue
    const newIssue = await octokit.issues.create({
      ...github.context.repo,
      title: `[${this.name}]: ${id}`,
      body: JSON.stringify(opts, null, 2),
      labels: [this.name]
    })

    // Return the new instance
    return new Instance({
      action_record_id: id,
      created_at: newIssue.data.created_at,
      issue_number: newIssue.data.number,
      ...opts
    })
  }
}