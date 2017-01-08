import { Animator } from "./Animator";
import { Queue } from "./Queue";

/**
 * Animator for teams introducing themselves.
 */
export class Introductions extends Animator {
    /**
     * Runs the animations.
     * 
     * @param onComplete   Handler for when the animations are done.
     */
    public run(onComplete: () => void): void {
        const queue: Queue = new Queue();

        if (this.battleInfo.teams.opponent.leader) {
            queue.add((next: () => void): void => {
                this.animations.introductions.opponent(next);
            });
        }

        if (this.battleInfo.teams.opponent.leader) {
            queue.add((next: () => void): void => {
                this.animations.introductions.player(next);
            });
        }

        queue.run(onComplete);
    }
}
