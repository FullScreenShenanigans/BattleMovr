import { IAction } from "../Actions";
import { IBattleInfo } from "../Battles";
import { IUnderEachTeam } from "../Teams";
import { Animator } from "./Animator";
import { Introductions } from "./Introductions";

/**
 * Root animator for a battle.
 */
export class Main extends Animator {
    /**
     * Animator for teams introducing themselves.
     */
    private readonly introductions: Introductions = new Introductions(this);

    /**
     * Runs the animations.
     */
    public run(): void {
        this.animations.onStart((): void => {
            this.introductions.run((): void => {
                this.waitForActions(this.battleInfo);
            });
        });
    }

    /**
     * Waits for actions from each team's selector.
     * 
     * @param battleInfo   State for the ongoing battle.
     */
    private waitForActions(battleInfo: IBattleInfo): void {
        let completed: number = 0;
        let actions: Partial<IUnderEachTeam<IAction>> = {};

        const onChoice: Function = (): void => {
            completed += 1;
            if (completed === 2) {
                this.executeActions(actions as IUnderEachTeam<IAction>);
            }
        };

        battleInfo.teams.opponent.selector.nextAction(
            battleInfo,
            (action: IAction): void => {
                actions.opponent = action;
                onChoice();
            });

        battleInfo.teams.player.selector.nextAction(
            battleInfo,
            (action: IAction): void => {
                actions.opponent = action;
                onChoice();
            });
    }

    /**
     * Executes each team's chosen actions.
     * 
     * @param actions   Chosen actions by the teams.
     */
    private executeActions(actions: IUnderEachTeam<IAction>): void {
        console.log("Executing", actions);
    }
}
