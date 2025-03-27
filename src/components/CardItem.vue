<script setup lang="ts">
import { CardModel, CardStatus } from "@/session/cardModel";
import { computed } from "vue";

defineOptions({
  inheritAttrs: false,
});

const emit = defineEmits(['toggle'])

const props = defineProps<{
  card: CardModel; 
}>();

const cardRevealed = computed(() => props.card.status !== CardStatus.HIDDEN);
const cardFound = computed(() => cardRevealed && props.card.found);
const cardNeeded = computed(() => props.card.needed);

const toggleCard = () => {
  //console.log("toggle : card | revealed", props.card, cardRevealed.value)
  return !(cardRevealed.value) && emit('toggle')
}

</script>

<template>
  <div
    class="card"
    @click="toggleCard"
    :class="[card.type, cardRevealed ? 'card--revealed': '', cardFound ? 'card--found': '', cardNeeded ? 'card--needed': '']"     
  >
   <div class="center" v-show="cardRevealed">{{card.type}}</div>   
    
  </div>
</template>

<style lang="scss">

.card {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  border: 1px solid black;
  background-size: cover;
  cursor: pointer;
  background-color: #0d441f;
  transition: all 1s ease;

  &.card--revealed {
    background-color: grey;
    color: black;    
    font-variant: small-caps;
    filter: grayscale(60%);

    &.amadou {
      background: url("../assets/amadou.jpg") center center;
    }
    &.brindille {
      background: url("../assets/brindille.jpg") center center;
    }
    &.buche {
      background: url("../assets/buche.jpg") center center;
    }
    &.herbeSeche {
      background: url("../assets/herbeSeche.jpg") center center;
    }
    &.roc {
      background: url("../assets/roc.jpg") center center;
    }
    &.sable {
      background: url("../assets/sable.jpg") center center;
    }
    &.silex {
      background: url("../assets/silex.jpg") center center;
    }
    &.terre {
      background: url("../assets/terre.jpg") center center;
    }
  }

  &.card--found.card--needed {
    background-color: greenyellow;
    color: #0d441f;
    filter: none;

    .center {
      text-shadow: 0 0 4px white;
      border: none;
      padding: 5px;
      font-weight: bold;
    }
  }

  &.card--disabled {
    cursor: not-allowed;
  }

  &:hover {
    box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14),
      0px 5px 22px 4px rgba(0, 0, 0, 0.12) !important;
  }
}
</style>
