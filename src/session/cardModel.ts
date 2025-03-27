
export enum CardStatus {
    HIDDEN = 'hidden',
    REVEALED = 'revealed',
}

export enum CardType {
    SILEX = "silex",
    AMADOU = "amadou",
    BRINDILLE = "brindille",
    BUCHE =  "buche",
    HERBE_SECHE = "herbeSeche",
    SABLE = "sable",
    TERRE = "terre",
    ROC = "roc"
}

export class CardModel {
    static sequence = 0;

    uuid: number
    type : CardType 
    status: CardStatus = CardStatus.HIDDEN
    found: boolean = false
    needed: boolean
    
    constructor(type: CardType, needed: boolean) {
        this.uuid = CardModel.sequence++
        this.type = type
        this.needed = needed
    }
}