import { IAnimations } from "./Animations";
import { IBattleInfo, IBattleOptions } from "./Battles";
import { ISelectors } from "./Selectors";

/**
 * Settings to initialize a new IBattleMovr.
 */
export interface IBattleMovrSettings {
    /**
     * Animations for various battle activities.
     */
    animations: IAnimations;

    /**
     * Available selectors, keyed by name.
     */
    selectors: ISelectors;
}

/**
 * Drives RPG-like battles between two teams of actors.
 */
export interface IBattleMovr {
    /**
     * @returns Battle info for the current battle.
     */
    getBattleInfo(): IBattleInfo;

    /**
     * Starts a new battle.
     * 
     * @param options   Options to start the battle.
     * @returns Battle info for the new battle.
     */
    startBattle(options: IBattleOptions): IBattleInfo;
}
