import { IActor } from "./Actors";

/**
 * Opposing teams in a battle.
 */
export interface IBattleTeams {
    /**
     * Opponent team.
     */
    opponent: ITeam;

    /**
     * Controlling player's team.
     */
    player: ITeam;
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
