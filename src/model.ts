import fs from 'fs'
import path from 'path'
import Joi from '@hapi/joi'
import core from '@actions/core'
import github from '@actions/github'
import colorHash from 'color-hash'
import octokit from './octokit'
import ActionRecord from './action-record'
import Instance from './instance'

export async function createModelLabel (name: string) {
  // Create new label if it doesn't exist
  try {
    await octokit.issues.createLabel({
      ...github.context.repo,
      name,
      color: colorHash.hex(name)
    })
  } catch (err) {
    // TODO: Handle errors. If this throws because the label
    // already exists, ignore the error. Else, throw.
  }
}

export async function registerModels (actionRecord: ActionRecord) {
  const baseDir = core.getInput('baseDir')
  const modelsDir = path.join(baseDir, 'models')
  const modelFiles = fs.readdirSync(modelsDir)

  return Promise.all(modelFiles.map(async modelFile => {
    const model = require(path.join(modelsDir, modelFile))
    await createModelLabel(model.name)
    actionRecord.models[model.name] = new Model(model.name, model.schema)
  }))
}

export class Model {
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
}