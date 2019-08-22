import ActionRecord from './action-record';
/**
 * Create a label in the repo for the given model if
 * it doesn't exist. This will fail silently if it does.
 */
export declare function createModelLabel(name: string): Promise<void>;
/**
 * Register all models in the `baseDir/models` folder.
 */
export declare function registerModels(actionRecord: ActionRecord): Promise<void[]>;
