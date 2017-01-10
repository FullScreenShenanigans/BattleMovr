import { IOnAction, IOnActions } from "../Actions";
import { ITeamAction, Team } from "../Teams";
import { Animator } from "./Animator";

/**
 * Animator for teams' actions.
 */
export class Actions extends Animator {
    /**
     * Runs a team's action.
     * 
     * @param teamAction    Action with the team that wants to execute it.
     * @param onComplete   Callback for when this is done.
     */
    public run(teamAction: ITeamAction, onComplete: () => void): void {
        const onActions: IOnActions = teamAction.team === Team.opponent
            ? this.animations.opponent.actions
            : this.animations.player.actions;

        (onActions[teamAction.action.type] as IOnAction<any>)(teamAction.action, onComplete);
    }
}
