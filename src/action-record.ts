import Model from './model'

export default class ActionRecord {
  /**
   * An object of all the available models
   */
  public models: { [key: string]: Model }

  constructor () {
    this.models = {}
  }
}
