/// <reference path="../typings/GameStartr.d.ts" />
/// <reference path="../typings/MenuGraphr.d.ts" />

import {
    IBattleInfo, IBattleInfoDefaults, IBattleMovr, IBattleMovrSettings,
    IBattleOptions, IBattler, IBattleSettings, IGameStartr, IMenuNames,
    IPosition, IThing, IThingsContainer
} from "./IBattleMovr";

/**
 * A driver for RPG-like battles between two collections of actors.
 */
export class BattleMovr implements IBattleMovr {
    /**
     * The IGameStartr providing Thing and actor information.
     */
    private GameStarter: IGameStartr;

    /**
     * 
     */
    private things: IThingsContainer;

    /**
     * The type of Thing to create and use as the background.
     */
    private backgroundType: string;

    /**
     * The created Thing used as the background.
     */
    private backgroundThing: IThing;

    /**
     * 
     */
    private battleOptions: IBattleOptions;

    /**
     * 
     */
    private menuNames: IMenuNames;

    /**
     * 
     */
    private battleInfo: IBattleInfo;

    /**
     * 
     */
    private inBattle: boolean;

    /**
     * 
     */
    private defaults: IBattleInfoDefaults;

    /**
     * 
     */
    private positions: {
        [i: string]: IPosition;
    };

    /**
     * 
     */
    private openItemsMenuCallback: (settings: any) => void;

    /**
     * Callback to open the actors menu.
     * 
     * 
     */
    private openActorsMenuCallback: (settings: any) => void;

    /**
     * @param {IBattleMovrSettings} settings
     */
    public constructor(settings: IBattleMovrSettings) {
        if (typeof settings.GameStarter === "undefined") {
            throw new Error("No GameStarter given to BattleMovr.");
        }
        if (typeof settings.battleOptions === "undefined") {
            throw new Error("No battleOptions given to BattleMovr.");
        }
        if (typeof settings.menuNames === "undefined") {
            throw new Error("No menuNames given to BattleMovr.");
        }

        this.GameStarter = settings.GameStarter;
        this.battleOptions = settings.battleOptions;
        this.menuNames = settings.menuNames;
        this.openItemsMenuCallback = settings.openItemsMenuCallback;
        this.openActorsMenuCallback = settings.openActorsMenuCallback;

        this.defaults = settings.defaults || {};
        this.backgroundType = settings.backgroundType;
        this.positions = settings.positions;

        this.inBattle = false;
        this.things = {};
    }

    /**
     * 
     */
    public getGameStarter(): IGameStartr {
        return this.GameStarter;
    }

    /**
     * 
     */
    public getDefaults(): IBattleInfoDefaults {
        return this.defaults;
    }

    /**
     * 
     */
    public getThings(): IThingsContainer {
        return this.things;
    }

    /**
     * 
     */
    public getThing(name: string): IThing {
        return this.things[name];
    }

    /**
     * 
     */
    public getMenuNames(): IMenuNames {
        return this.menuNames;
    }

    /**
     * 
     */
    public getBattleInfo(): IBattleInfo {
        return this.battleInfo;
    }

    /**
     * 
     */
    public getBackgroundType(): string {
        return this.backgroundType;
    }

    /**
     * 
     */
    public getBackgroundThing(): IThing {
        return this.backgroundThing;
    }

    /**
     * 
     */
    public getInBattle(): boolean {
        return this.inBattle;
    }

    /**
     * 
     */
    public startBattle(settings: IBattleSettings): void {
        if (this.inBattle) {
            return;
        }

        this.inBattle = true;
        this.battleInfo = this.GameStarter.utilities.proliferate({}, this.defaults);

        // A shallow copy is used here for performance, and so Things in .keptThings
        // don't cause an infinite loop proliferating
        for (const i in settings) {
            if (settings.hasOwnProperty(i)) {
                this.battleInfo.battlers[i] = (settings as any)[i];
            }
        }

        this.battleInfo.battlers.player.selectedActor = this.battleInfo.battlers.player.actors[0];
        this.battleInfo.battlers.opponent.selectedActor = this.battleInfo.battlers.opponent.actors[0];

        this.createBackground();

        this.GameStarter.MenuGrapher.createMenu("Battle", {
            ignoreB: true
        });
        this.GameStarter.MenuGrapher.createMenu("BattleDisplayInitial");

        this.things.menu = this.GameStarter.MenuGrapher.getMenu("BattleDisplayInitial");
        this.setThing("opponent", this.battleInfo.battlers.opponent.sprite);
        this.setThing("player", this.battleInfo.battlers.player.sprite);

        this.GameStarter.ScenePlayer.startCutscene("Battle", {
            things: this.things,
            battleInfo: this.battleInfo,
            nextCutscene: settings.nextCutscene,
            nextCutsceneSettings: settings.nextCutsceneSettings
        });
    }

    /**
     * 
     */
    public closeBattle(callback?: () => void): void {
        if (!this.inBattle) {
            return;
        }

        this.inBattle = false;

        for (const i in this.things) {
            if (this.things.hasOwnProperty(i)) {
                this.GameStarter.physics.killNormal(this.things[i]);
            }
        }

        this.deleteBackground();

        this.GameStarter.MenuGrapher.deleteMenu("Battle");
        this.GameStarter.MenuGrapher.deleteMenu("GeneralText");
        this.GameStarter.MenuGrapher.deleteMenu("BattleOptions");

        if (callback) {
            callback();
        }

        this.GameStarter.ScenePlayer.playRoutine("Complete");

        if (this.battleInfo.nextCutscene) {
            this.GameStarter.ScenePlayer.startCutscene(
                this.battleInfo.nextCutscene, this.battleInfo.nextCutsceneSettings);
        } else if (this.battleInfo.nextRoutine) {
            this.GameStarter.ScenePlayer.playRoutine(
                this.battleInfo.nextRoutine, this.battleInfo.nextRoutineSettings);
        } else {
            this.GameStarter.ScenePlayer.stopCutscene();
        }
    }

    /**
     * 
     */
    public showPlayerMenu(): void {
        this.GameStarter.MenuGrapher.createMenu("BattleOptions", {
            ignoreB: true
        });

        this.GameStarter.MenuGrapher.addMenuList("BattleOptions", {
            options: Object.keys(this.battleOptions)
                .map((text: string): any => {
                    return {
                        text,
                        callback: this.battleOptions[text].callback
                    };
                })
        });

        this.GameStarter.MenuGrapher.setActiveMenu("BattleOptions");
    }

    /**
     * 
     */
    public setThing(name: string, title: string, settings?: any): IThing {
        const position: IPosition = this.positions[name] || {};
        const battleMenu: MenuGraphr.IMenu = this.GameStarter.MenuGrapher.getMenu("Battles");
        let thing: IThing = this.things[name];

        if (thing) {
            this.GameStarter.physics.killNormal(thing);
        }

        thing = this.things[name] = this.GameStarter.ObjectMaker.make(title, settings);

        this.GameStarter.things.add(
            thing,
            battleMenu.left + (position.left || 0) * this.GameStarter.unitsize,
            battleMenu.top + (position.top || 0) * this.GameStarter.unitsize);

        this.GameStarter.GroupHolder.switchMemberGroup(thing, thing.groupType, "Text");

        return thing;
    }

    /**
     * 
     */
    public playMove(choicePlayer: string): void {
        const choiceOpponent: string = this.GameStarter.MathDecider.compute(
            "opponentMove",
            this.battleInfo.battlers.player,
            this.battleInfo.battlers.opponent);

        const playerMovesFirst: boolean = this.GameStarter.MathDecider.compute(
            "playerMovesFirst",
            this.battleInfo.battlers.player,
            choicePlayer,
            this.battleInfo.battlers.opponent,
            choiceOpponent);

        if (playerMovesFirst) {
            this.GameStarter.ScenePlayer.playRoutine("MovePlayer", {
                extRoutine: "MoveOpponent",
                choicePlayer: choicePlayer,
                choiceOpponent: choiceOpponent
            });
        } else {
            this.GameStarter.ScenePlayer.playRoutine("MoveOpponent", {
                nextRoutine: "MovePlayer",
                choicePlayer: choicePlayer,
                choiceOpponent: choiceOpponent
            });
        }
    }

    /**
     * 
     */
    public switchActor(battlerName: string, i: number): void {
        const battler: IBattler = this.battleInfo.battlers[battlerName];

        if (battler.selectedIndex === i) {
            this.GameStarter.ScenePlayer.playRoutine("PlayerSwitchesSamePokemon");
            return;
        }

        battler.selectedIndex = i;
        battler.selectedActor = battler.actors[i];

        this.GameStarter.ScenePlayer.playRoutine((battlerName === "player" ? "Player" : "Opponent") + "SendOut");
    }

    /**
     * 
     */
    public createBackground(): void {
        if (!this.backgroundType) {
            return;
        }

        this.backgroundThing = this.GameStarter.things.add(this.backgroundType);

        this.GameStarter.physics.setWidth(
            this.backgroundThing,
            this.GameStarter.MapScreener.width / 4);

        this.GameStarter.physics.setHeight(
            this.backgroundThing,
            this.GameStarter.MapScreener.height / 4);

        this.GameStarter.GroupHolder.switchMemberGroup(
            this.backgroundThing,
            this.backgroundThing.groupType,
            "Text");
    }

    /**
     * 
     */
    public deleteBackground(): void {
        if (this.backgroundThing) {
            this.GameStarter.physics.killNormal(this.backgroundThing);
        }
    }
}
