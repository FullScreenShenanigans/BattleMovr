import { IAction } from "./Actions";
import { IBattleInfo } from "./Battles";

/**
 * Callback for a selector choosing an action.
 * 
 * @param action   The chosen action.
 */
export interface IOnChoice {
    (action: IAction): void;
}

/**
 * Methods for a team to choose their next move.
 */
export interface ISelector {
    /**
     * Determines the next action to take.
     * 
     * @param battleInfo   State for an ongoing battle.
     * @param onChoice   Callback for when an action is chosen.
     */
    nextAction(battleInfo: IBattleInfo, onChoice: IOnChoice): void;
}
