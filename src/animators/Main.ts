import { IAction } from "../Actions";
import { IBattleInfo } from "../Battles";
import { IUnderEachTeam } from "../Teams";
import { Animator } from "./Animator";
import { Introductions } from "./Introductions";
import { Queue } from "./Queue";

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
        const queue: Queue = new Queue();

        queue.add((next: () => void): void => {
            this.animations.start(next);
        });

        queue.add((next: () => void): void => {
            this.introductions.run(next);
        });

        queue.run((): void => this.waitForActions(this.battleInfo));
    }

    /**
     * Waits for actions from each team's selector.
     * 
     * @param battleInfo   State for the ongoing battle.
     */
    private waitForActions(battleInfo: IBattleInfo): void {
        const actions: Partial<IUnderEachTeam<IAction>> = {};
        let completed: number = 0;

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
