import { IAction } from "./Actions";

/**
 * Selectors, keyed by name.
 */
export interface ISelectors {
    [i: string]: ISelector;
}

/**
 * Methods for a team to choose their next move.
 */
export interface ISelector {
    /**
     * Determines the next action to take.
     */
    nextAction(): IAction;
}
