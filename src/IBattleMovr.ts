import { IAnimations } from "./Animations";
import { IBattleInfo, IBattleOptions } from "./Battles";
import { ISelector } from "./Selectors";
import { IUnderEachTeam } from "./Teams";

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
    selectors: IUnderEachTeam<ISelector>;
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
