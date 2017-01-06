import { IActor } from "./Actors";

/**
 * Titles of actions that a team may take in battle.
 */
export type IActionType = "flee" | "item" | "move" | "switch";

/**
 * A chosen action to be performed by a team in battle.
 */
export type IAction = IFleeAction | IItemAction | IMoveAction | ISwitchAction;

/**
 * Action for a team attempting to leave the battle.
 */
export interface IFleeAction {
    /**
     * What type of action this is.
     */
    type: "flee";
}

/**
 * Action for a team using an item.
 */
export interface IItemAction {
    /**
     * Descriptor of the item being used.
     */
    item: string;

    /**
     * What type of action this is.
     */
    type: "item";
}

/**
 * Action for a team's selected actor using a move.
 */
export interface IMoveAction {
    /**
     * Descriptor of the move being used.
     */
    move: string;

    /**
     * What type of action this is.
     */
    type: "move";
}

/**
 * Action for a team switching actors.
 */
export interface ISwitchAction {
    /**
     * Another actor to bring out.
     */
    newActor: IActor;

    /**
     * What type of action this is.
     */
    type: "switch";
}
