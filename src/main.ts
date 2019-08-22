import * as core from '@actions/core'
import runEvent from './run-event'

async function run () {
  try {
    core.debug('Running event')
    await runEvent()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
