import { Team } from "./Teams";

/**
 * Effect description for a battle move.
 */
export type IMoveEffect = IDamageEffect | IStatisticEffect | IStatusEffect | ISwitchEffect;

/**
 * Move effect that deals damage.
 */
export interface IDamageEffect {
    /**
     * How much damage should be dealt.
     */
    damage: number;

    /**
     * Team whose actor is being affected.
     */
    target: Team;

    /**
     * What type of effect this is.
     */
    type: "damage";
}

/**
 * Move effect that changes a statistic.
 */
export interface IStatisticEffect {
    /**
     * How much the statistic should change.
     */
    change: number;

    /**
     * Which statistic is being affected.
     */
    statistic: string;

    /**
     * Team whose actor is being affected.
     */
    target: Team;

    /**
     * What type of effect this is.
     */
    type: "statistic";
}

/**
 * Move effect that applies a status.
 */
export interface IStatusEffect {
    /**
     * Team whose actor is being affected.
     */
    target: Team;

    /**
     * Which status is being applied.
     */
    status: string;

    /**
     * What type of effect this is.
     */
    type: "status";
}

/**
 * Move effect that switches actors.
 */
export interface ISwitchEffect {
    /**
     * Team whose actor is being affected.
     */
    target: Team;

    /**
     * Index of the actor replacing the current actor.
     */
    replacement: number;

    /**
     * What type of effect this is.
     */
    type: "switch";
}
