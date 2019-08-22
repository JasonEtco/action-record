import fs from 'fs'
import path from 'path'
import * as core from '@actions/core'

/**
 * Checks if the provided argument is a function
 */
function isFunction (functionToCheck: Function) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
 }

/**
 * Finds the relevant event file for a given event and returns the function
 */
export default function findEventFunction (event: string): Function | null {
  const cwd = process.env.GITHUB_WORKSPACE as string
  const baseDir = core.getInput('baseDir')
  const filename = core.getInput(`events.${event}`) || `${event}.js`
  const pathToFile = path.join(cwd, baseDir, 'events', filename)

  core.debug(`Going to find event function: ${pathToFile}`)
  
  // Verify that the file exists
  if (!fs.existsSync(pathToFile)) return null

  // Require the JS file
  const func = require(pathToFile)

  // Verify that they've exported a function
  if (!isFunction(func)) throw new Error(`${pathToFile} does not export a function!`)

  // Return the function to be run
  core.debug(`${event} event function is good to go!`)
  return func
}
