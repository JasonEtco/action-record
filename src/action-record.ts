import { context } from '@actions/github'
import { Context } from '@actions/github/lib/context'
import Model from './model'

export default class ActionRecord {
  /**
   * An object of all the available models
   */
  public models: { [key: string]: Model }

  public context: Context

  constructor () {
    this.models = {}
    this.context = context
  }
}
