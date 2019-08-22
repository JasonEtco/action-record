import Model from './model';
export default class ActionRecord {
    /**
     * An object of all the available models
     */
    models: {
        [key: string]: Model;
    };
    constructor();
}
