import { IAction } from "./Actions";
import { IActor } from "./Actors";
import { ISelector } from "./Selectors";

/**
 * Descriptor for a team.
 */
export enum Team {
    /**
     * The opponent's team.
     */
    opponent,

    /**
     * The player's team.
     */
    player
}

/**
 * Data storage for something each team has.
 * 
 * @type T   Data stored for each team.
 */
export interface IUnderEachTeam<T> {
    /**
     * Opponent value for the data.
     */
    opponent: T;

    /**
     * Player value for the data.
     */
    player: T;

    [i: string /* "opponent" | "player" */]: T;
}

/**
 * Common attributes for teams of actors.
 */
export interface ITeamBase {
    /**
     * Actors that will fight.
     */
    actors: IActor[];

    /**
     * Character appearing to direct the actors.
     */
    leader?: ITeamLeader;
}

/**
 * External descriptor of a team of actors to be engaged in battle.
 */
export interface ITeamDescriptor extends ITeamBase {
    /**
     * How the team chooses their actions.
     */
    selector: string;
}

/**
 * A team of actors engaged in battle.
 */
export interface ITeam extends ITeamBase {
    /**
     * How the team chooses their actions.
     */
    selector: ISelector;
}

/**
 * A player or NPC leading a battle team.
 */
export interface ITeamLeader {
    /**
     * Textual name for the leader.
     */
    nickname: string[];

    /**
     * Sprite title for the leader's Thing.
     */
    title: string[];
}

/**
 * An action with the team that wants to execute it.
 */
export interface ITeamAction {
    /**
     * Action chosen by the team.
     */
    action: IAction;

    /**
     * Team that chose the action.
     */
    team: Team;
}

/**
 * Orders teams' chosen actions.
 * 
 * @param actions   Actions chosen by each team.
 * @returns Team actions ordered for battle.
 */
export interface IActionsOrderer {
    (actions: IUnderEachTeam<IAction>): ITeamAction[];
}
