<script setup lang="ts">
import Game from './components/Game.vue'

import { GameModel } from "@/session/models";
import { ref} from "vue";

const game = ref(new GameModel( ["Bugs Survivors",	"Cloud Conquerors",	"Gardians of the Firewall",	"Kernel Explorers",	"Terminal Adventurers",	"Wild Hackers"]))

const newGame = () => {
  game.value.start()  
}

const loadGame = () => {
  game.value.load()  
}

</script>

<template>  
  <div>
    <div class="launch" v-if="!game.started">  
      <button class="btn" @click="newGame">Nouveau</button>
      <button class="btn" @click="loadGame">Recharger</button>
    </div>
    <Game :game="game" v-if="game.started"/>
  </div>
</template>

<style scoped lang="scss">
  .launch {
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }
  .btn {
    padding: 10px;
    margin: 5px;
    background-color: green;    
    opacity: 0.5;
    border-radius: 10px;    
  }
</style>
