/**
 * Codes for actions that a team may take in battle.
 */
export enum ActionType {
    /**
     * The team will attempt to leave the battle.
     */
    Flee,

    /**
     * An item will be used.
     */
    Item,

    /**
     * The team's currently selected actor will perform a move.
     */
    Move,

    /**
     * A different actor will be switched out.
     */
    Switch
}

/**
 * A chosen action to be performed by a team in battle.
 */
export type IAction = IFleeAction | IItemAction | IMoveAction | ISwitchAction;

/**
 * Action for a team attempting to leave a battle.
 */
export interface IFleeAction {
    /**
     * What type of action this is.
     */
    type: ActionType.Flee;
}

/**
 * Action for a team using an item.
 */
export interface IItemAction {
    /**
     * What type of action this is.
     */
    type: ActionType.Item;

    /**
     * Descriptor of the item being used.
     */
    item: string[];
}

/**
 * Action for a team's selected actor using a move.
 */
export interface IMoveAction {
    /**
     * What type of action this is.
     */
    type: ActionType.Move;

    /**
     * Descriptor of the move being used.
     */
    move: string[];
}

/**
 * Action for a team switching actors.
 */
export interface ISwitchAction {
    /**
     * What type of action this is.
     */
    type: ActionType.Switch;

    /**
     * Index of the actor to bring out.
     */
    newIndex: number;
}
