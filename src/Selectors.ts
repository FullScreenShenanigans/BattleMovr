import { IAction } from "./Actions";

/**
 * Methods for a team to choose their next move.
 */
export interface ISelector {
    /**
     * Determines the next action to take.
     */
    nextAction(): IAction;
}
