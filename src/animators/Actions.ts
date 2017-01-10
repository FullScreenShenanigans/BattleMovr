import { IOnAction, IOnActions } from "../Actions";
import { ITeamAndAction, Team } from "../Teams";
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
    public run(teamAction: ITeamAndAction, onComplete: () => void): void {
        if (this.battleInfo.teams[Team[teamAction.source.team]].selectedActor !== teamAction.source.actor) {
            onComplete();
            return;
        }

        const onActions: IOnActions = teamAction.source.team === Team.opponent
            ? this.animations.opponent.actions
            : this.animations.player.actions;

        (onActions[teamAction.action.type] as IOnAction<any>)(teamAction.action, onComplete);
    }
}
