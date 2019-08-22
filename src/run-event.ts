import { context } from '@actions/github'
import ActionRecord from './action-record'
import { registerModels } from './register-models'
import findEventFunction from './find-event-function'

export default async function runEvent () {
  // Create the ActionRecord instance
  const actionRecord = new ActionRecord()
  // Register the models, setting actionRecord.models
  await registerModels(actionRecord)
  // Find the event function
  const eventFn = findEventFunction(context.eventName)
  if (eventFn) {
    // Run it
    return eventFn(actionRecord)
  }
}
