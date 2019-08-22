import { context } from '@actions/github'
import ActionRecord from './action-record'
import { registerModels } from './register-models'
import findFile from './find-file'

export default async function runEvent () {
  // Create the ActionRecord instance
  const actionRecord = new ActionRecord()
  // Register the models, setting actionRecord.models
  await registerModels(actionRecord)
  // Find the event function
  const eventFn = findFile(context.eventName)
  // Run it
  return eventFn(actionRecord)
}
