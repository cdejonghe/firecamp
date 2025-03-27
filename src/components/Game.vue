<script setup lang="ts">
import type { CardModel } from '@/session/cardModel';
import CardList from './CardList.vue'
import FireItem from './FireItem.vue';

import { GameModel, PlayerModel } from "@/session/models";
import { computed} from "vue";

const props = defineProps<{
  game: GameModel; 
}>();

const selectAndShuffle = (player: PlayerModel) => {
  if (player.checkActivable()) {
    props.game.selectAndShuffle(player)
  }
}

const toggleCard =  (card: CardModel, index: number) => {
  if (props.game.activePlayer.errorUuids.length == 0) {
    props.game.activePlayer.flip(index)
    if (props.game.activePlayer.checkRevealed(card)) {
      //console.log("revealed", card.type)
      if (card.needed) {
        if (props.game.activePlayer.checkMemoryEnded()) {
          props.game.activePlayer.startFire()          
        }
      }
    } 
    if ( props.game.activePlayer.errorUuids.length > 0) {
      //console.log("flipBackErrors", props.game.activePlayer.errorUuids)
      props.game.activePlayer.flipBackErrors()
    }    
  }
}

const gameTimer = computed(() => {
  let hours = "00"
    let minutes = "00"
    let seconds =  "00"
  if( props.game.gameTimerInSec > 0) {
    hours = "" + Math.floor( props.game.gameTimerInSec / 3600)
    minutes = "" + Math.floor(( props.game.gameTimerInSec % 3600) / 60)
    seconds =  "" +  props.game.gameTimerInSec % 60
    if (parseInt(minutes) < 10) {
      minutes = "0" + minutes
    }
    if (parseInt(seconds) < 10) {
      seconds = "0" + seconds
    }
  }
  return  hours + " : " + minutes + " : " + seconds  
})

</script>

<template>  
  <div class="game">  
    <div class="top">
      Fin du jeu dans {{ gameTimer }}
    </div>  
    <div class="bottom">
      <div class="left">
        
        <div class="fires">
          <div 
            class="fire" 
            v-for="(firePlayer, index) in game.players"
            :key="`fire-${index}`"
            :class="{'active': firePlayer.active, 'activable' : firePlayer.checkActivable()}"
            @click="selectAndShuffle(firePlayer)">
            <FireItem :player="firePlayer"/>
          </div>
        </div>
      </div>
      
      <div class="memory">      
        <CardList :player="game.activePlayer" @toggle-card="toggleCard"/>      
      </div>        
    </div>
  </div>
</template>

<style scoped lang="scss">
  .game {
    display: flex;
    flex-direction: column;
  }
  .top {
    color: lightgray;
  }

  .bottom {
    display: flex;
    flex-direction: row;
  }

  .left {
    flex: 1 1 auto;
    margin-right: 10px;
  }

  .fires {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px; 
  }

  .fire {
    border: 5px solid  rgba(255, 255, 255, 0.5);
    cursor: not-allowed;

    &.active {
      border: 5px solid greenyellow;
      background-color: greenyellow;
      opacity: 0.7;
    }

    &.activable {
      cursor: auto;
    }
  }

  .memory {
    flex: 1 1 auto;
  }
</style>
