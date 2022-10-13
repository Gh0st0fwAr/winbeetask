<template>
   <div @click="$emit('block-clicked', index)" class="block">
      <div class="block__title">{{name}}</div>
      <div class="block__price">{{value}}$</div>
      <div @click.stop="$emit('delete-block', id)" class="block__icon"></div>    
   </div>
</template>

<script>
export default {
   name: 'block',
   data() {
      return {
         value: 0
      }
   },
   methods: {
      // processMessage(message) {
      //    console.log(JSON.parse(message.data))
      //    const data = JSON.parse(message.data);
      //    // console.log(data.TYPE)
      //    if (data.TYPE == 2) {
      //       console.log('TYPE == 2')
      //    }
      // }
   },
   props: {
      index: Number,
      name: String,
      value: Number,
      id: Number
   },
   created() {
      // var vm = this;
      // console.log(this.apiKey)
      // var ws = new WebSocket('wss://streamer.cryptocompare.com/v2?api_key=' + this.apiKey);
      // ws.onopen = function onSteamOpen() {
      //    var subRequest = {
      //       "action": "SubAdd",
      //       "subs": [`2~Coinbase~${vm.name}~USD`, `2~Coinbase~ETH~USD`, `2~Coinbase~DOGE~USD` ]
      //    };
      //    console.log(subRequest)
      //    ws.send(JSON.stringify(subRequest));
      // }
      // ws.onmessage = function onSteamMessage(message) {
      //    vm.processMessage(message)
      // }
   }
}
</script>