import { IAnimations } from "./Animations";
import { IBattleInfo, IBattleOptions } from "./Battles";
import { ISelectorFactories } from "./Selectors";

/**
 * Settings to initialize a new IBattleMovr.
 */
export interface IBattleMovrSettings {
    /**
     * Animations for various battle activities.
     */
    animations: IAnimations;

    /**
     * Selector factories keyed by type name.
     */
    selectorFactories: ISelectorFactories;
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
