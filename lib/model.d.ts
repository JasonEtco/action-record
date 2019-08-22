import { Schema } from '@hapi/joi';
import Instance from './instance';
declare type HookFn = (opts: any) => Promise<void>;
interface Hooks {
    beforeValidate?: HookFn;
    afterValidate?: HookFn;
    beforeCreate?: HookFn;
    afterCreate?: HookFn;
    beforeSave?: HookFn;
    afterSave?: HookFn;
}
export interface ModelInput {
    name: string;
    schema: Schema;
    hooks: Hooks;
}
export default class Model {
    name: string;
    schema: Schema;
    hooks: Hooks;
    constructor(model: ModelInput);
    /**
     * Convert a `where` object to a string for proper searching.
     */
    private whereToStr;
    /**
     * Call the search API to return all issues with this model's label.
     */
    private searchForIssues;
    /**
     * Find one record that matches the provided filter object.
     */
    findOne(where: any): Promise<Instance>;
    /**
     * Find all records that match the provided filter object.
     */
    findAll(where?: any): Promise<Instance[]>;
    /**
     * Create a new record
     */
    create(opts: any): Promise<Instance>;
}
export {};