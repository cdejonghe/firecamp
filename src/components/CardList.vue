<script setup lang="ts">
import type { CardModel } from "@/session/cardModel";
import CardItem from "./CardItem.vue";
import {  PlayerModel } from "@/session/models";

const props = defineProps<{
  player: PlayerModel;   
}>();

const emit = defineEmits(['toggleCard'])

const toggleCard =  (card: CardModel, index: number) => {
  emit('toggleCard', card, index)
}

</script>

<template>
  <div>
    <div class="ok"> 
      <div class="found" v-if="player.deck.length > 0">
        Trouvé : {{ player.foundCardTypes.length }} / 6
      </div>
      <div class="type" v-for="(cardType, index) in player.foundCardTypes">
        {{ cardType }}
      </div>
    </div>
      
    <div class="memory">
      <CardItem
          v-for="(card, index) in player.deck"
          :key="`card-${card.uuid}`"
          @toggle="toggleCard(card, index)"
          :card="card"
        />
    </div>
  </div>
  
</template>

<style scoped>
 .memory {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px; 
 }

 .ok {
    display:flex;
    flex-direction: row;
 }

 .found, .type {
    padding: 5px;
 } 

</style>
