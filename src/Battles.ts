import { IAction } from "./Actions";
import { IActor } from "./Actors";
import { IOnBattleComplete } from "./Callbacks";
import { ITeam, IUnderEachTeam } from "./Teams";

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
    teams: IUnderEachTeam<ITeam>;
}

/**
 * State for an ongoing battle.
 */
export interface IBattleInfo extends IBattleOptions {
    /**
     * What each team has decided to do, if anything yet.
     */
    choices: IUnderEachTeam<IAction | undefined>;

    /**
     * Which team is currently acting, if either.
     */
    currentTurn?: "player" | "opponent";

    /**
     * Opposing teams in the battle.
     */
    teams: IUnderEachTeam<IBattleTeam>;
}

/**
 * Extended team information during a battle.
 */
export interface IBattleTeam extends ITeam {
    /**
     * Real order of actors in the current battle.
     */
    orderedActors: IActor[];
}
