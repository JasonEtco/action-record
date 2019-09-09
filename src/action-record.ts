import { GitHub, context } from '@actions/github'
import { Context } from '@actions/github/lib/context'
import Model from './model'

export default class ActionRecord {
  /**
   * An object of all the available models
   */
  public models: { [key: string]: Model }

  public github: GitHub
  public context: Context

  constructor () {
    this.github = new GitHub(process.env.GITHUB_TOKEN as string)
    this.models = {}
    this.context = context
  }
}
