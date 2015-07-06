// @echo '/// <reference path="ScenePlayr-0.2.0.ts" />'
// @echo '/// <reference path="MenuGraphr-0.2.0.ts" />'

// @ifdef INCLUDE_DEFINITIONS
/// <reference path="References/ScenePlayr-0.2.0.ts" />
/// <reference path="References/MenuGraphr-0.2.0.ts" />
/// <reference path="BattleMovr.d.ts" />
// @endif

// @include ../Source/BattleMovr.d.ts

module BattleMovr {
    "use strict";

    export class BattleMovr implements IBattleMovr {
        private GameStarter: GameStartr.IGameStartr;

        private MenuGrapher: MenuGraphr.IMenuGraphr;

        private things;

        private backgroundType;

        private backgroundThing;

        private battleMenuName;

        private battleOptionNames;

        private menuNames;

        private battleInfo;

        private inBattle;

        private defaults;

        private positions;

        private openItemsMenuCallback;

        private openActorsMenuCallback;

        /**
         * 
         */
        constructor(settings: any) {
            if (typeof settings.GameStarter === "undefined") {
                throw new Error("No GameStarter given to BattleMovr.");
            }
            if (typeof settings.MenuGrapher === "undefined") {
                throw new Error("No MenuGrapher given to BattleMovr.");
            }
            if (typeof settings.battleMenuName === "undefined") {
                throw new Error("No battleMenuName given to BattleMovr.");
            }
            if (typeof settings.battleOptionNames === "undefined") {
                throw new Error("No battleOptionNames given to BattleMovr.");
            }
            if (typeof settings.menuNames === "undefined") {
                throw new Error("No menuNames given to BattleMovr.");
            }

            this.GameStarter = settings.GameStarter;
            this.MenuGrapher = settings.MenuGrapher;
            this.battleMenuName = settings.battleMenuName;
            this.battleOptionNames = settings.battleOptionNames;
            this.menuNames = settings.menuNames;

            this.defaults = settings.defaults || {};
            this.backgroundType = settings.backgroundType;
            this.positions = settings.positions;

            this.inBattle = false;
            this.things = {};
        }


        /* Simple gets
        */

        /**
         * 
         */
        getGameStarter() {
            return this.GameStarter;
        }

        /**
         * 
         */
        getThings() {
            return this.things;
        }

        /**
         * 
         */
        getThing(name) {
            return this.things[name];
        }

        /**
         * 
         */
        getBattleInfo() {
            return this.battleInfo;
        }

        /**
         * 
         */
        getBackgroundType() {
            return this.backgroundType;
        }

        /**
         * 
         */
        getBackgroundThing() {
            return this.backgroundThing;
        }

        /**
         * 
         */
        getInBattle() {
            return this.inBattle;
        }


        /* Actor manipulations
        */

        /**
         * 
         */
        startBattle(settings) {
            if (this.inBattle) {
                return;
            }

            this.inBattle = true;

            this.battleInfo = this.GameStarter.proliferate({}, this.defaults);
            this.battleInfo = this.GameStarter.proliferate(this.battleInfo, settings);

            this.battleInfo.player.selectedActor = this.battleInfo.player.actors[0];
            this.battleInfo.opponent.selectedActor = this.battleInfo.opponent.actors[0];

            this.createBackground();

            this.MenuGrapher.createMenu("Battle", {
                "ignoreB": true
            });
            this.MenuGrapher.createMenu("BattleDisplayInitial");

            this.things.menu = this.MenuGrapher.getMenu("BattleDisplayInitial");
            this.setThing("opponent", this.battleInfo.opponent.sprite);
            this.setThing("player", this.battleInfo.player.sprite);

            this.GameStarter.ScenePlayer.startCutscene("Battle", {
                "things": this.things,
                "battleInfo": this.battleInfo,
                "nextCutscene": settings.nextCutscene,
                "nextCutsceneSettings": settings.nextCutsceneSettings
            });
        }

        /**
         * 
         */
        closeBattle(callback?) {
            var i: string;

            if (!this.inBattle) {
                return;
            }

            this.inBattle = false;

            for (i in this.things) {
                this.GameStarter.killNormal(this.things[i]);
            }

            this.deleteBackground();

            (<any>this.GameStarter.MapScreener).inMenu = false;
            this.MenuGrapher.deleteMenu("Battle");
            this.MenuGrapher.deleteMenu("GeneralText");
            this.MenuGrapher.deleteMenu("BattleOptions");

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
        showPlayerMenu() {
            this.MenuGrapher.createMenu("BattleOptions", {
                "ignoreB": true
            });

            this.MenuGrapher.addMenuList("BattleOptions", {
                "options": [{
                    "text": this.battleOptionNames["moves"],
                    "callback": this.openMovesMenu
                }, {
                        "text": this.battleOptionNames["items"],
                        "callback": this.openItemsMenu
                    }, {
                        "text": this.battleOptionNames["actors"],
                        "callback": this.openActorsMenu
                    }, {
                        "text": this.battleOptionNames["exit"],
                        "callback": this.startBattleExit
                    }]
            });

            this.MenuGrapher.setActiveMenu("BattleOptions");
        }

        /**
         * 
         */
        setThing(name: string, title: string, settings?: any): GameStartr.IThing {
            var position = this.positions[name] || {},
                battleMenu = this.MenuGrapher.getMenu(this.battleMenuName),
                thing = this.things[name];

            if (thing) {
                this.GameStarter.killNormal(thing);
            }

            thing = this.things[name] = this.GameStarter.ObjectMaker.make(title, settings);

            this.GameStarter.addThing(
                thing,
                battleMenu.left + (position.left || 0) * this.GameStarter.unitsize,
                battleMenu.top + (position.top || 0) * this.GameStarter.unitsize);

            this.GameStarter.GroupHolder.switchObjectGroup(
                thing,
                thing.groupType,
                "Text");

            return thing;
        }

        /* In-battle menus
        */

        /**
         * 
         */
        openMovesMenu() {
            var actorMoves = this.battleInfo.player.selectedActor.moves,
                moveOptions = [],
                move, i;

            for (i = 0; i < actorMoves.length; i += 1) {
                move = actorMoves[i];
                moveOptions[i] = {
                    "text": move.title.toUpperCase(),
                    "remaining": move.remaining,
                    "callback": this.playMove.bind(self, move.title)
                };
            }

            for (i = actorMoves.length; i < 4; i += 1) {
                moveOptions[i] = {
                    "text": "-"
                };
            }

            this.MenuGrapher.createMenu(this.menuNames.moves);
            this.MenuGrapher.addMenuList(this.menuNames.moves, {
                "options": moveOptions
            });
            this.MenuGrapher.setActiveMenu(this.menuNames.moves);
        }

        /**
         * 
         */
        openItemsMenu() {
            this.openItemsMenuCallback({
                "items": this.battleInfo.items,
                "position": {
                    "horizontal": "right",
                    "vertical": "bottom",
                    "offset": {
                        "left": 0
                    }
                },
                "size": {
                    "height": 44
                },
                "container": "Battle",
                "backMenu": "BattleOptions",
                "scrollingItems": 4
            });
        }

        /**
         * 
         */
        openActorsMenu(callback) {
            this.openActorsMenuCallback({
                "backMenu": "BattleOptions",
                "container": "Battle",
                "onSwitch": this.switchActor
            });
        }

        /* Battle shenanigans
        */

        /**
         * 
         */
        playMove(choicePlayer) {
            var choiceOpponent = this.GameStarter.MathDecider.compute(
                "opponentMove", this.battleInfo.player, this.battleInfo.opponent),
                playerMovesFirst = this.GameStarter.MathDecider.compute(
                    "playerMovesFirst", this.battleInfo.player, choicePlayer, this.battleInfo.opponent, choiceOpponent);

            if (playerMovesFirst) {
                this.GameStarter.ScenePlayer.playRoutine("MovePlayer", {
                    "nextRoutine": "MoveOpponent",
                    "choicePlayer": choicePlayer,
                    "choiceOpponent": choiceOpponent
                });
            } else {
                this.GameStarter.ScenePlayer.playRoutine("MoveOpponent", {
                    "nextRoutine": "MovePlayer",
                    "choicePlayer": choicePlayer,
                    "choiceOpponent": choiceOpponent
                });
            }
        }

        /**
         * 
         */
        switchActor(battlerName, i) {
            var battler = this.battleInfo[battlerName];

            if (battler.selectedIndex === i) {
                this.GameStarter.ScenePlayer.playRoutine("PlayerSwitchesSamePokemon");
                return;
            }

            battler.selectedIndex = i;
            battler.selectedActor = battler.actors[i];

            this.GameStarter.ScenePlayer.playRoutine(
                (battlerName === "player" ? "Player" : "Opponent") + "SendOut");
        }


        /* Battle exits
        */

        /**
         * 
         */
        startBattleExit() {
            if (this.battleInfo.opponent.category === "Trainer") {
                this.GameStarter.ScenePlayer.playRoutine("BattleExitFail");
                return;
            }

            this.MenuGrapher.deleteMenu("BattleOptions");
            this.MenuGrapher.addMenuDialog(
                "GeneralText",
                this.battleInfo.exitDialog || this.defaults.exitDialog || "",
                this.closeBattle);
            this.MenuGrapher.setActiveMenu("GeneralText");
        }


        /* Utilities
        */

        /**
         * 
         */
        createBackground() {
            if (!this.backgroundType) {
                return;
            }

            this.backgroundThing = this.GameStarter.addThing(this.backgroundType);

            this.GameStarter.setWidth(this.backgroundThing, this.GameStarter.MapScreener.width / 4);
            this.GameStarter.setHeight(this.backgroundThing, this.GameStarter.MapScreener.height / 4);

            this.GameStarter.GroupHolder.switchObjectGroup(
                this.backgroundThing,
                this.backgroundThing.groupType,
                "Text");
        }

        /**
         * 
         */
        deleteBackground() {
            if (this.backgroundThing) {
                this.GameStarter.killNormal(this.backgroundThing);
            }
        }
    }
}
