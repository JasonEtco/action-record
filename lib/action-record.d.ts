import { Context } from '@actions/github/lib/context';
import Model from './model';
export default class ActionRecord {
    /**
     * An object of all the available models
     */
    models: {
        [key: string]: Model;
    };
    context: Context;
    constructor();
}
