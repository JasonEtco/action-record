import github from '@actions/github'
import ActionRecord from './action-record'
import { registerModels } from './model'
import findFile from './find-file'

export default async function runEvent () {
  const actionRecord = new ActionRecord()
  await registerModels(actionRecord)
  const eventFn = findFile(github.context.eventName)
  return eventFn(actionRecord)
}
