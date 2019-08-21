import { Model } from './model'

export default class ActionRecord {
  public models: { [key: string]: Model }

  constructor () {
    this.models = {}
  }
}
