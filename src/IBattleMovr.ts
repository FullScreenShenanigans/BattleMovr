/// <reference path="../typings/GameStartr.d.ts" />
/// <reference path="../typings/MenuGraphr.d.ts" />
/// <reference path="../typings/MapScreenr.d.ts" />

/**
 * Extended IGameStartr with menus.
 */
export interface IGameStartr extends GameStartr.GameStartr {
    /**
     * In-game menu and dialog creation and management for GameStartr.
     */
    MenuGrapher: MenuGraphr.IMenuGraphr;
}

/**
 * Menus available during battle, keyed by name.
 */
export interface IBattleOptions {
    [i: string]: IBattleOption;
}

/**
 * Description of a menu available during battle.
 */
export interface IBattleOption {
    /**
     * A callback that opens the menu.
     */
    callback: () => void;

    /**
     * Text displayed in the options menu.
     */
    text: (string | MenuGraphr.IMenuWordCommand)[];
}

/**
 * Names of known menus, such as those triggered by battle options.
 */
export interface IMenuNames {
    moves: string;
}

export interface IPosition {
    left?: number;
    top?: number;
}

export interface IThingsContainer {
    menu?: IThing;
    [i: string]: IThing;
}

export interface IThing extends GameStartr.IThing {
    groupType: string;
}

export interface IMenu extends IThing { }

export interface IBattleSettings {
    nextCutscene: string;
    nextCutsceneSettings: string;
}

export interface IBattleInfo {
    exitDialog?: string;
    items?: any;
    nextCutscene?: string;
    nextCutsceneSettings?: any;
    nextRoutine?: string;
    nextRoutineSettings?: any;
    battlers: IBattlers;
}

export interface IBattlers {
    /**
     * The opponent battler's information.
     */
    opponent?: IBattler;

    /**
     * The player's battle information.
     */
    player?: IBattler;

    [i: /* "opponent" | "player" */ string]: IBattler;
}

export interface IBattleInfoDefaults {
    exitDialog: string;
}

export interface IBattler {
    actors: IActor[];
    category: string;
    hasActors?: boolean;
    name: string[];
    selectedActor?: IActor;
    selectedIndex?: number;
    sprite: string;
}

export interface IActor {
    Attack: number;
    AttackNormal: number;
    Defense: number;
    DefenseNormal: number;
    EV: {
        Attack: number;
        Defense: number;
        Special: number;
        Speed: number;
    };
    HP: number;
    HPNormal: number;
    IV: {
        Attack: number;
        Defense: number;
        HP: number;
        Special: number;
        Speed: number;
    };
    Special: number;
    SpecialNormal: number;
    Speed: number;
    SpeedNormal: number;
    experience: IActorExperience;
    level: number;
    moves: IMove[];
    nickname: string[];
    status: string;
    title: string[];
    types: string[];
}

export interface IActorExperience {
    current: number;
    next: number;
    remaining: number;
}

export interface IMove {
    title: string;
    remaining: number;
}

export interface IBattleMovrSettings {
    GameStarter: IGameStartr;
    battleMenuName: string;
    battleOptions: IBattleOptions;
    menuNames: IMenuNames;
    openItemsMenuCallback: (settings: any) => void;
    openActorsMenuCallback: (settings: any) => void;
    defaults?: any;
    backgroundType?: string;
    positions?: any;
}

/**
 * A driver for RPG-like battles between two collections of actors.
 */
export interface IBattleMovr {
    getGameStarter(): IGameStartr;
    getDefaults(): IBattleInfoDefaults;
    getThings(): { [i: string]: IThing };
    getThing(name: string): IThing;
    getMenuNames(): IMenuNames;
    getBattleInfo(): IBattleInfo;
    getBackgroundType(): string;
    getBackgroundThing(): IThing;
    getInBattle(): boolean;
    startBattle(settings: IBattleSettings): void;
    closeBattle(callback?: () => void): void;
    showPlayerMenu(): void;
    setThing(name: string, title: string, settings?: any): IThing;
    playMove(choicePlayer: string): void;
    switchActor(battlerName: string, i: number): void;
    createBackground(): void;
    deleteBackground(): void;
}
