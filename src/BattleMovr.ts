import { IAnimations } from "./Animations";
import { IBattleInfo, IBattleOptions, IBattleTeam } from "./Battles";
import { IBattleMovr, IBattleMovrSettings } from "./IBattleMovr";
import { ITeam } from "./Teams";

/**
 * Drives RPG-like battles between two teams of actors.
 */
export class BattleMovr implements IBattleMovr {
    /**
     * Animations for various battle activities.
     */
    private readonly animations: IAnimations;

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
        this.animations = settings.animations;
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

        return this.battleInfo = {
            ...options,
            choices: {},
            teams: {
                opponent: this.createTeamFromInfo(options.teams.opponent),
                player: this.createTeamFromInfo(options.teams.player)
            }
        };
    }

    /**
     * Creates a battle team from starting info.
     * 
     * @param team   Starting info on a team.
     * @returns A battle team for the starting info.
     */
    private createTeamFromInfo(team: ITeam): IBattleTeam {
        return {
            ...team,
            orderedActors: team.actors.slice(),
            selectedActor: team.actors[0],
            selectedIndex: 0
        };
    }
}
