import { IActor } from "./Actors";
import { BattleOutcome, IAnimations } from "./Animations";
import { Main as MainAnimator } from "./animators/Main";
import { IBattleInfo, IBattleOptions, IBattleTeam } from "./Battles";
import { IBattleMovr, IBattleMovrSettings } from "./IBattleMovr";
import { ISelectorFactories } from "./Selectors";
import { IActionsOrderer, ITeamBase, ITeamDescriptor, Team } from "./Teams";

/**
 * Finds the index of the first alive actor.
 *
 * @param actors   A list of actors to be sent out into battle.
 * @returns Index of the first alive actor.
 */
const findFirstAliveIndex = (actors: IActor[]): number => {
    for (let i = 0; i < actors.length; i += 1) {
        if (actors[i].statistics.health.current !== 0) {
            return i;
        }
    }

    throw new Error("Cannot create team since no actors are alive.");
};

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
     * Gets whether there is a current battle.
     *
     * @returns Whether there is a current battle.
     */
    public inBattle(): boolean {
        return this.battleInfo !== undefined;
    }

    /**
     * Gets battle info for the current battle.
     *
     * @returns Battle info for the current battle.
     */
    public getBattleInfo(): IBattleInfo {
        if (this.battleInfo === undefined) {
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
        if (this.battleInfo !== undefined) {
            throw new Error("A battle is already happening.");
        }

        this.battleInfo = {
            ...options,
            choices: {},
            teams: {
                opponent: this.createTeamFromInfo(options.teams.opponent),
                player: this.createTeamFromInfo(options.teams.player),
            },
        };

        this.animator = new MainAnimator(
            {
                animations: this.animations,
                battleInfo: this.battleInfo,
            },
            this.actionsOrderer);

        this.animator.run();

        return this.battleInfo;
    }

    /**
     * Switches the selected actor for a team.
     *
     * @param team   Team switching actors.
     * @param newActor   New selected actor for the team.
     */
    public switchSelectedActor(team: Team, newActor: IActor): void {
        if (this.battleInfo === undefined) {
            throw new Error("No battle is happening.");
        }

        const battleTeam: IBattleTeam = this.battleInfo.teams[Team[team]];
        const oldActor: IActor = battleTeam.selectedActor;

        if (oldActor === newActor) {
            throw new Error("Cannot switch to the currently selected actor.");
        }

        battleTeam.actors[battleTeam.actors.indexOf(newActor)] = oldActor;
        battleTeam.actors[battleTeam.selectedIndex] = newActor;

        battleTeam.selectedActor = newActor;
    }

    /**
     * Stops the current battle.
     *
     * @param outcome   Why the battle stopped.
     * @param onComplete   Callback for when this is over.
     */
    public stopBattle(outcome: BattleOutcome, onComplete?: () => void): void {
        if (this.battleInfo === undefined) {
            throw new Error("No battle is happening.");
        }

        this.animations.complete(
            outcome,
            (): void => {
                this.animator = undefined;
                this.battleInfo = undefined;

                if (onComplete !== undefined) {
                    onComplete();
                }
            });

    }

    /**
     * Creates a battle team from starting info.
     *
     * @param team   Starting info on a team.
     * @returns A battle team for the starting info.
     */
    private createTeamFromInfo(team: ITeamDescriptor & ITeamBase): IBattleTeam {
        const selectorFactory = this.selectorFactories[team.selector];
        if (selectorFactory === undefined) {
            throw new Error(`Unknown selector type: '${team.selector}.`);
        }

        const firstAliveIndex = findFirstAliveIndex(team.actors);
        return {
            ...team,
            orderedActors: team.actors.slice(),
            selectedActor: team.actors[firstAliveIndex],
            selectedIndex: firstAliveIndex,
            selector: selectorFactory(),
        };
    }
}
