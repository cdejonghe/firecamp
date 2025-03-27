import { reactive } from "vue";
import { CardModel, CardType, CardStatus } from "./cardModel";

const KEY = "firegame";
const RATIO_SEC_TO_POINT = 7;
 const GAME_TIME_IN_SEC = 3600 * 3;
 const FIRE_TIMER_IN_SEC = 60 * 14;
// const GAME_TIME_IN_SEC = 60 * 4;
// const FIRE_TIMER_IN_SEC = 60 * 2;


export class PlayerSaveModel {
    name: string
    score: number = 0
    fireTimerInSec: number;

    constructor(player: PlayerModel) {
        this.name = player.name
        this.score = player.score
        this.fireTimerInSec = player.fireTimerInSec
    }
}

export class PlayerModel {
    name: string
    game: GameModel
    deck: CardModel[] = []
    revealedCard?: CardModel
    errorUuids: number[] = []
    foundCardTypes = new Array<CardType>
    score: number = 0
    fireTimerInSec : number = 0
    fireTimerInterval!: any
    active: boolean = false
    lastStartTimeMs: number = 0

    constructor(name: string, game : GameModel) {
        this.name = name        
        this.game = game
    }

    shuffle() : CardModel[] {   
        const deck: CardModel[] = []
        for (const type of [CardType.AMADOU, CardType.BUCHE, CardType.BRINDILLE, CardType.ROC, CardType.HERBE_SECHE, CardType.SILEX,]) {
            deck.push(new CardModel(type, true))
            deck.push(new CardModel(type, true))
        }
        for (const type of [CardType.SABLE, CardType.TERRE]) {
            deck.push(new CardModel(type, false))
            deck.push(new CardModel(type, false))
        }

        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        this.lastStartTimeMs = new Date().getTime()
        return this.deck = reactive([...deck])        
    }

    flip(cardIndex: number) : CardModel{
        //console.log('flip', cardIndex)
        if (!this.deck[cardIndex].found) {
            if (this.deck[cardIndex].status == CardStatus.HIDDEN) {
                this.deck[cardIndex].status = CardStatus.REVEALED
            }  else {
                this.deck[cardIndex].status = CardStatus.HIDDEN
            }
        }

        return this.deck[cardIndex]
    }

    checkRevealed(card: CardModel) : boolean {  
        if (!!this.revealedCard) {
            //console.log('check second reveal', card.type)

            if (this.revealedCard.type === card.type) {
                //console.log('reveal success')
                this.revealedCard.found = true
                card.found = true
                if( card.needed) {
                    this.foundCardTypes.push(card.type)
                }
                this.revealedCard = undefined
                return true    
            } else {
                //console.log('reveal error')
                this.errorUuids.push(card.uuid),
                this.errorUuids.push(this.revealedCard.uuid)
            }                                
        } else {
            //console.log('store revealed', card)
            this.revealedCard = card
        }
                    
        return false
    }

    checkMemoryEnded() : boolean {
        return this.foundCardTypes.length === 6
    }

    checkFireStart() : boolean {
        return this.fireTimerInSec > 0
    }
    
    checkActivable() {
        return this.game.isRunning() && !this.active && !this.checkFireStart()
    }

    flipBackErrors() {
        setTimeout(() => this.deck
            .map((card, index) => {return {card, index}})
            .filter((item) => this.errorUuids.includes(item.card.uuid))
            .forEach(item => {
                    this.flip(item.index)                    
                    this.errorUuids.pop()
                }), 700)
         this.revealedCard = undefined
    }
    
    startFire() {
        const opponentBonusScore = Math.floor((new Date().getTime() - this.lastStartTimeMs) / 8000)
        console.log('Opponent bonus score ' + opponentBonusScore, this.name)

        this.game.getInactivePlayers()
            .forEach( p => {
                p.score += opponentBonusScore
            })        

        this.setFire();
        this.active = false
    }

    setFire(fireTimerInSec : number = FIRE_TIMER_IN_SEC) {
        this.fireTimerInSec = fireTimerInSec;
        console.log('Set Fire', this.name, fireTimerInSec);
        if (this.checkFireStart()) {
            this.fireTimerInterval = setInterval(() => {
                this.fireTimerInSec -= 1;
                if (!this.game.isRunning() || this.fireTimerInSec <= 0) {
                    this.stopFire();

                } else if (this.fireTimerInSec % RATIO_SEC_TO_POINT === 0) {
                    this.score += 1;
                }
            }, 1000);
        }
    }

    stopFire() {
        clearInterval(this.fireTimerInterval);
        this.foundCardTypes.length = 0;
        console.log('Stop Fire : ', this.name);
    }

    load(ps: PlayerSaveModel) {
        this.score = ps.score
        this.setFire(ps.fireTimerInSec)
    }
}


export class GameSaveModel {
    playerSaves !: PlayerSaveModel[]
    gameTimerInSec: number = 0

    constructor() {

    }

    fromGame(game : GameModel) : GameSaveModel {
        this.playerSaves = game.players.map(player => new PlayerSaveModel(player))
        this.gameTimerInSec = game.gameTimerInSec;
        return this
    }

    fromJson(jsonString: string) : GameSaveModel {
        const json = JSON.parse(jsonString)
        this.playerSaves = json.playerSaves
        this.gameTimerInSec = json.gameTimerInSec;
        return this
    } 

    
    save() {
        localStorage.setItem(KEY, JSON.stringify(this));
    }
}

export class GameModel {
    players: PlayerModel[] = []
    activePlayer: PlayerModel
    gameTimerInSec: number = 0
    gameTimerInterval! : any
    started: boolean = false

    constructor(names: string[]) {
        names.forEach(name => {
            this.players.push(new PlayerModel(name, this))
        });
        this.activePlayer = this.players[0]        
    }    

    start( gameTimerInSec: number = GAME_TIME_IN_SEC) {
        this.gameTimerInSec = gameTimerInSec;
        if (this.gameTimerInterval) {
            clearInterval(this.gameTimerInterval);
        }
        this.gameTimerInterval = setInterval(() => {
            this.gameTimerInSec -= 1;
            if(this.started) {
                this.save()
            }
            if (this.gameTimerInSec <= 0) {
                clearInterval(this.gameTimerInterval);
            }
        }, 1000);
        this.started = true
    }

    isRunning(): boolean {
        return this.gameTimerInSec > 0
    }
    
    save() {
        //console.log("Game Saved", this.gameTimerInSec);
        new GameSaveModel().fromGame(this).save()    
    }

    load() {
        const gs = new GameSaveModel().fromJson(localStorage.getItem(KEY) || "");
        gs.playerSaves.forEach( ps => {
            const player = this.findPlayerByName(ps.name)
            if (player) {
                player.load(ps)
            }
        })
        this.start(gs.gameTimerInSec)
    }

    selectAndShuffle(player: PlayerModel) {
        if (this.isRunning()) {
        this.activePlayer.active = false
        this.players
            .filter(p => p.name === player.name)
            .map(p =>  {
                p.active = true
                this.activePlayer = p
            }) 
            this.activePlayer.shuffle()
        }    
    }

    getInactivePlayers() : PlayerModel[] {
        return  this.players
                    .filter(p => ! p.active)
    }

    findPlayerByName(name : string) {
        return this.players.find( p => p.name === name)
    }
}