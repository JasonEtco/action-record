import fs from 'fs'
import path from 'path'
import Joi from '@hapi/joi'
import * as core from '@actions/core'
import { context } from '@actions/github'
import colorHash from 'color-hash'
import ActionRecord from './action-record'
import octokit from './octokit'
import Model, { ModelInput } from './model'

/**
 * Create a label in the repo for the given model if
 * it doesn't exist. This will fail silently if it does.
 */
export async function createModelLabel (name: string) {
  // Create new label if it doesn't exist
  try {
    await octokit.issues.createLabel({
      ...context.repo,
      name,
      color: colorHash.hex(name)
    })
  } catch (err) {
    core.debug(err.message)
    // TODO: Handle errors. If this throws because the label
    // already exists, ignore the error. Else, throw.
  }
}

type ModelFn = (opts: { Joi: typeof Joi }) => ModelInput

/**
 * Register all models in the `baseDir/models` folder.
 */
export async function registerModels (actionRecord: ActionRecord) {
  const cwd = process.env.GITHUB_WORKSPACE as string
  const baseDir = core.getInput('baseDir')
  const modelsDir = path.join(cwd, baseDir, 'models')
  core.debug(`Loading the models directory: ${modelsDir}`)

  const modelFiles = fs.readdirSync(modelsDir)
  core.debug(`Found ${modelFiles.length} models`)

  return Promise.all(modelFiles.map(async modelFile => {
    // Require the exported object
    const pathToModelFile = path.join(modelsDir, modelFile)
    core.debug(`Requiring model file: ${pathToModelFile}`)
    const modelFn = require(pathToModelFile) as ModelFn
    const model = modelFn({ Joi })
    
    // Create the model label
    await createModelLabel(model.name)

    // Add it to the ActionRecord class
    actionRecord.models[model.name] = new Model(model)
  }))
}
