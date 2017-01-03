import { IActor } from "./Actors";
import { ISelector } from "./Selectors";

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
}

/**
 * A team of actors to be engaged in battle.
 */
export interface ITeam {
    /**
     * Actors that will fight.
     */
    actors: IActor[];

    /**
     * Character appearing to direct the actors.
     */
    leader?: ITeamLeader;

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
    title: string;
}
