<script setup lang="ts">
import type { PlayerModel } from '@/session/models';
import { computed } from 'vue';

const props = defineProps<{
  player: PlayerModel;   
}>();

const fireStarted = computed(() => {
  return props.player.checkFireStart()
})

const fireTimer = computed(() => {
  let minutes = "" + Math.floor(props.player.fireTimerInSec / 60)
  let seconds =  "" + props.player.fireTimerInSec % 60
  if (parseInt(minutes) < 10) {
    minutes = "0" + minutes
  }
  if (parseInt(seconds) < 10) {
    seconds = "0" + seconds
  }
  return  minutes + " : " + seconds
})

const score = computed(() => {
  return props.player.score
})

</script>

<template>
  <div>
    <div class="board">
      <div>{{ player.name }} <span v-show="score > 0">&nbsp;|&nbsp; {{ score }} pts</span> </div>        
    </div>
    
    <div class="camp">
      <div class="timer" v-if="fireStarted">
        {{fireTimer}}
      </div>
      <div class="feux">        
        <div class="flame" v-if="fireStarted"></div>
      </div>        
    </div>      
</div>
</template>

<style scoped>
  .board {
    padding-left: 1rem;
    text-shadow: 1px 1px 6px white;
    opacity: 1;
    color: #020;
  }
  .camp {  
    position: relative;      
    background:#000;
    opacity: 0.7;
    color: white;
  }

  .feux {    
	  display: flex;
	  justify-content: center;
	  align-items: end;
	  height: 320px;
    width: 320px;;
  }

  .timer {
    position: absolute;
    background:#000;
    top: 20px;
    width: 100%;
    text-align: center;
  }
  
  .flame{
    width:120px;
    height:120px;
    background:linear-gradient(-45deg, red, orange);
    border-radius: 120px 120px 0px 120px;
    transform:rotate(-135deg);
    animation:.1s flame infinite;
    filter:blur(10px);
    position:relative;
    box-shadow:17px 20px 90px #700;
    border:45px solid black;
    border-left-width:25px;
    border-top-width:25px;
    
    &:after,
    &:before{
      content:'';
      width:100px;
      height:100px;
      display:block;
      position:absolute;
      background:linear-gradient(-45deg, red, #ffff00);
      animation:.2s flame infinite;
      transform:scale(.8) rotate(20deg);
      border-radius: 100px 100px 0px 100px;
      top:20px;
    }
    &:before{
      top:0;
      animation-duration:.09s;
      transform:scale(.9) rotate(-15deg) translate(10px, 0px);
    }
  }

  @keyframes flame {
    0% {height:120px; width:120px;}
    50% {height:110px; width:110px;}
    100% {height:120px; width:120px;}
  }
</style>
