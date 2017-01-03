import { IOnBattleComplete } from "./Callbacks";
import { IBattleTeams } from "./Teams";

/**
 * Options to start a battle.
 */
export interface IBattleOptions {
    /**
     * Callback for when the battle is complete.
     */
    onComplete: IOnBattleComplete;

    /**
     * Opposing teams in the battle.
     */
    teams: IBattleTeams;
}
