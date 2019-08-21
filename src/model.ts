import fs from 'fs'
import path from 'path'
import Joi from '@hapi/joi'
import core from '@actions/core'
import github from '@actions/github'
import colorHash from 'color-hash'
import octokit from './octokit'
import ActionRecord from './action-record'

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
    actionRecord.models[model.name] = new Model(model.schema)
  }))
}

export class Model {
  public schema: Joi
  public validate: Joi.validate

  constructor (schema: Joi) {
    this.schema = schema
    this.validate = schema.validate
  }
}