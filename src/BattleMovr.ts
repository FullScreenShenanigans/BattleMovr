import { BattleOutcome, IAnimations } from "./Animations";
import { Main as MainAnimator } from "./animators/Main";
import { IBattleInfo, IBattleOptions, IBattleTeam } from "./Battles";
import { IBattleMovr, IBattleMovrSettings } from "./IBattleMovr";
import { ISelectorFactories } from "./Selectors";
import { IActionsOrderer, ITeamBase, ITeamDescriptor } from "./Teams";

/**
 * Drives RPG-like battles between two teams of actors.
 */
export class BattleMovr implements IBattleMovr {
    /**
     * Selector factories keyed by type name.
     */
    private readonly actionsOrderer: IActionsOrderer;

    /**
     * Animations for various battle activities.
     */
    private readonly animations: IAnimations;

    /**
     * Selector factories keyed by type name.
     */
    private readonly selectorFactories: ISelectorFactories;

    /**
     * Animator for the current battle, if one is happening.
     */
    private animator?: MainAnimator;

    /**
     * Battle info for the current battle, if one is happening.
     */
    private battleInfo?: IBattleInfo;

    /**
     * Initializes a new instance of the BattleMovr class.
     * 
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IBattleMovrSettings) {
        this.actionsOrderer = settings.actionsOrderer;
        this.animations = settings.animations;
        this.selectorFactories = settings.selectorFactories;
    }

    /**
     * @returns Battle info for the current battle.
     */
    public getBattleInfo(): IBattleInfo {
        if (!this.battleInfo) {
            throw new Error("There is no current battle.");
        }

        return this.battleInfo;
    }

    /**
     * Starts a new battle.
     * 
     * @param options   Options to start the battle.
     * @returns Battle info for the new battle.
     */
    public startBattle(options: IBattleOptions): IBattleInfo {
        if (this.battleInfo) {
            throw new Error("A battle is already happening.");
        }

        this.battleInfo = {
            ...options,
            choices: {},
            teams: {
                opponent: this.createTeamFromInfo(options.teams.opponent),
                player: this.createTeamFromInfo(options.teams.player)
            }
        };

        this.animator = new MainAnimator(
            {
                animations: this.animations,
                battleInfo: this.battleInfo
            },
            this.actionsOrderer);

        this.animator.run();

        return this.battleInfo;
    }

    /**
     * Stops the current battle.
     * 
     * @param outcome   Why the battle stopped.
     */
    public stopBattle(outcome: BattleOutcome): void {
        if (!this.battleInfo) {
            throw new Error(`No battle is happening.`);
        }

        this.animations.complete(
            outcome,
            (): void => {
                this.animator = undefined;
                this.battleInfo = undefined;
            });

    }

    /**
     * Creates a battle team from starting info.
     * 
     * @param team   Starting info on a team.
     * @returns A battle team for the starting info.
     */
    private createTeamFromInfo(team: ITeamDescriptor & ITeamBase): IBattleTeam {
        if (!this.selectorFactories[team.selector]) {
            throw new Error(`Unknown selector type: '${team.selector}.`);
        }

        return {
            ...team,
            orderedActors: team.actors.slice(),
            selectedActor: team.actors[0],
            selectedIndex: 0,
            selector: this.selectorFactories[team.selector]()
        };
    }
}
