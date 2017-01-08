import { IAction, IFleeAction, IItemAction, IMoveAction, ISwitchAction } from "./Actions";
import { IUnderEachTeam, Team } from "./Teams";

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

/**
 * Animations for various battle activities.
 */
export interface IAnimations {
    /**
     * Animations for teams introducting themselves.
     */
    introductions: IUnderEachTeam<IOnIntroduction>;

    /**
     * Action animations, keyed by their type codes.
     */
    onActions: IOnActions;

    /**
     * Animation for when the battle is complete.
     */
    onComplete: IOnBattleComplete;

    /**
     * Animation for when an actor's health changes.
     */
    onHealthChange: IOnHealthChange;

    /**
     * Animation for an actor getting knocked out.
     */
    onKnockout: IOnKnockout;

    /**
     * Animation for a battle starting.
     */
    onStart: IOnStart;
}

/**
 * Animation for a team introducing themselves.
 * 
 * @param onComplete   Callback for when the animation is done.
 */
export interface IOnIntroduction {
    (onComplete: () => void): void;
}

/**
 * Action animations, keyed by their type codes.
 */
export interface IOnActions {
    /**
     * Action for a team attempting to leave the battle.
     */
    flee: IOnAction<IFleeAction>;

    /**
     * Action for a team using an item.
     */
    item: IOnAction<IItemAction>;

    /**
     * Action for a team's selected actor using a move.
     */
    move: IOnAction<IMoveAction>;

    /**
     * Action for a team switching actors.
     */
    switch: IOnAction<ISwitchAction>;
}

/**
 * Animation for when a team performs a move action.
 * 
 * @param team   Which team is performing the action.
 * @param action   Action being performed.
 * @param onComplete   Callback for when the action is done.
 * @type TAction   Type of action being performed.
 */
export interface IOnAction<TAction extends IAction> {
    (team: Team, action: TAction, onComplete: () => void): void;
}

/**
 * Animation for when the battle is complete.
 * 
 * @param outcome   Descriptor of what finished the battle.
 */
export interface IOnBattleComplete {
    (outcome: BattleOutcome): void;
}

/**
 * Animation for when an actor's health changes.
 * 
 * @param team   Which team's actor is being affected.
 * @param health   New value for the actor's health.
 * @param onComplete   Callback for when this is done.
 */
export interface IOnHealthChange {
    (team: Team, health: number, onComplete: () => void): void;
}

/**
 * Animation for when an actor gets knocked out.
 * 
 * @param team   Which team's actor is knocked out.
 * @param onComplete   Callback for when this is done.
 */
export interface IOnKnockout {
    (team: Team, onComplete: () => void): void;
}

/**
 * Animation for a battle starting.
 * 
 * @param onComplete   Callback for when this is done.
 */
export interface IOnStart {
    (onComplete: () => void): void;
}
