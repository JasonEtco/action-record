import fs from 'fs'
import path from 'path'
import core from '@actions/core'

/**
 * Checks if the provided argument is a function
 */
function isFunction (functionToCheck: Function) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
 }

/**
 * Finds the relevant file for a given 
 */
export default function findFile (event: string) {
  const baseDir = core.getInput('baseDir')
  const filename = core.getInput(`events.${event}`) || `${event}.js`
  const pathToFile = path.join(baseDir, 'events', filename)

  // Verify that the file exists
  if (!fs.existsSync(pathToFile)) return null

  // Require the JS file
  const func = require(pathToFile)

  // Verify that they've exported a function
  if (!isFunction(func)) throw new Error(`${pathToFile} does not export a function!`)

  // Return the function to be run
  return func
}
