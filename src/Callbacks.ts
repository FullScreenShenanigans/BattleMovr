/**
 * Callback for when the battle is complete.
 * 
 * @param outcome   Descriptor of what finished the battle.
 */
export interface IOnBattleComplete {
    (outcome: BattleOutcome): void;
}

/**
 * Descriptors of why a battle may finish.
 */
export enum BattleOutcome {
    /**
     * The opponent team fled.
     */
    opponentFled,

    /**
     * The player's team is out of usable actors.
     */
    opponentVictory,

    /**
     * The player team fled.
     */
    playerFled,

    /**
     * The opponent's team is out of usable actors.
     */
    playerVictory,

    /**
     * Both teams are out of usable actors.
     */
    tie
}
