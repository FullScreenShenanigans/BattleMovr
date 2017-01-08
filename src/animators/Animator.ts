import { IAnimations } from "../Animations";
import { IBattleInfo } from "../Battles";

/**
 * Settings to initialize a new instance of the Animator class.
 */
export interface IAnimatorSettings {
    /**
     * Animations for various battle activities.
     */
    readonly animations: IAnimations;

    /**
     * Battle info for the battle.
     */
    readonly battleInfo: IBattleInfo;
}

/**
 * Runs battle animations.
 */
export abstract class Animator {
    /**
     * Animations for various battle activities.
     */
    public readonly animations: IAnimations;

    /**
     * Battle info for the battle.
     */
    public readonly battleInfo: IBattleInfo;

    /**
     * Initializes a new instance of the Animator class.
     * 
     * @param animations   Animations for various battle activities.
     * @param battleInfo   Battle info for the battle.
     */
    public constructor(settings: IAnimatorSettings | Animator) {
        this.animations = settings.animations;
        this.battleInfo = settings.battleInfo;
    }

    /**
     * Runs the animations.
     * 
     * @param onComplete   Handler for when the animations are done.
     */
    public abstract run(onComplete: () => void): void;
}
