<template>
   <div class="crypto">
      
      <div class="crypto__form">
         <div class="form__inputbox">
            <input v-model="searchCrypto" type="text" placeholder="Например DOGE" class="form__input">
            <div class="form__title">Тикер</div>
         </div>
         <button @click="checkCrypto" class="form__button">Добавить</button>
      </div>

      <div class="crypto__body">
         <div class="body__search">
            <input v-model="searchTicker" type="text" placeholder="Найти тикер" class="search__input">
            <div class="search__icon"></div>
         </div>
         <div class="body__blocks">
            <block v-for="(item, index) in paginatedData" :class="{ 'block--active' : blockOnFocus === item.index }" @click="graphOnFocus = true" @deleteBlock="deleteBlock" @blockClicked="processBlock" :index="index" :id="item.index" :name="item.name" :value="item.value" class="blocks__wrapper"></block>
            <div v-if="graphOnFocus && windowWidth <= 460" :style="`grid-row:${graphCoords}`" class="body__graph">
               <div v-for="item in graphData" :style="calculateBarStyle(item)" class="graph__bar">
                  <div class="graph__hover">{{item}}$</div>
               </div>
            </div>
         </div>
         <div v-if="graphOnFocus && windowWidth > 460 " class="body__graph">
            <div v-for="item in graphData" :style="calculateBarStyle(item)" class="graph__bar">
               <div class="graph__hover">{{item}}$</div>
            </div>
         </div>
      </div>
      
      <div class="crypto__pagination">
         <div class="pagination__title">Показано {{ paginatedData.length }} результатов из {{ dataList.length }}</div>
         <div class="pagination__buttons">
            <div @click="prevPage" :class="{ 'pagination__button--disabled' : pageNumber == 0 }" class="pagination__button pagination__back">Назад</div>
            <div @click="nextPage" :class="{ 'pagination__button--disabled' : pageNumber >= pageCount - 1 }" class="pagination__button pagination__forward">Вперед</div>
         </div>
      </div>
      <!-- <router-view></router-view> -->
      <!-- <block></block> -->
   </div>
</template>

<script>
import block from './components/block.vue';
import axios from 'axios';

export default {
   name: 'App',
   components: {
      block
   },
   data() {
      return {
         graphOnFocus: false,
         graphCoords: 0,
         windowWidth: 0,
         blockOnFocus: '',
         dataList: ['ETH', 'ETH', 'ETH', 'ETH', 'ETH', 'ETH', 'ETH', 'ETH', 'ETH', 'ETH', 'ETH', 'ETH', 'ETH', 'ETH'],
         pageNumber: 0,
         searchCrypto: '',
         apiKey: '48fa6ac6c3648c1bbc0de21933441e288b8b74efc97c5912a202f7a86a762a52',
         ws: '',
         graphData: [],
         currentData: {},
         searchTicker: '',
         // filteredData: []


      }
   },
   computed: {
      pageCount() {
         const length = this.filteredData.length;
         return Math.ceil(length / 6)
      },
      paginatedData() {
         const start = this.pageNumber * 6;
         const end = start + 6;
         return this.filteredData.slice(start, end);
      },
      filteredData() {
         // this.filteredData = [];
         
         // this.filteredData = this.paginatedData.filter(item => {
         //    console.log(item)
         //    return item.name.toString().indexOf(this.searchTicker) !== -1
         // })
         return this.dataList.filter(item => {
               // console.log(item.name.toString().toLowerCase().indexOf(this.searchTicker.toString().toLowerCase()) != -1)
               // console.log(item.name.toString().indexOf(this.searchTicker) !== -1)
               return item.name.toString().toLowerCase().indexOf(this.searchTicker.toString().toLowerCase()) != -1
            })
      }
   },
   watch: {
      blockOnFocus() {
         this.graphData = []
      },
   },
   methods: {
      checkCrypto() {
         axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${this.searchCrypto}&tsyms=USD&api_key=${this.apiKey}`).then(r => {
            console.log(r)
            if (r.data.USD) {
               // console.log('OK')
               S.push('dataList', {
                  name: this.searchCrypto,
                  value: 0
               })
               this.searchCrypto = ''
               this.redrawList();
            } else if (r.data.Response == 'Error') {
               this.searchCrypto = ''
            }
         })
      },
      redrawList() {
         let dataList = S.get('dataList', true)
         dataList.forEach((item, index) => {
            item['index'] = index;
         })
         S.set('dataList', dataList, true, false);
         console.log(dataList)
         this.dataList = dataList;

         this.createRequest();
      },
      prevPage() {
         this.pageNumber--;
         this.blockOnFocus = '';
         this.graphOnFocus = '';
      },
      nextPage() {
         this.pageNumber++;
         this.blockOnFocus = '';
         this.graphOnFocus = '';
      },
      processBlock(id, index) {
         this.changeGraphPosition(index);
         this.blockOnFocus = id;
      },
      deleteBlock(id) {
         // console.log(id)
         S.splice('dataList', id, 1);
         this.graphData = [];
         this.blockOnFocus = '';
         this.graphOnFocus = '';
         this.redrawList();
      },
      changeGraphPosition(index) {
         // console.log(data)
         this.graphCoords = (index + 2) + '/' + (index + 3)
      },
      getWidth() {
         // console.log()
         this.windowWidth = document.body.clientWidth;
      },
      processMessage(message) {
         // console.log(message.data)
         let data = JSON.parse(message.data);
         // console.log(data)
         if(data.TYPE == 2) {
            // console.log(data)
            this.dataList.forEach(item => {
               if (item.name === data.FROMSYMBOL && data.PRICE) {
                  item.value = data.PRICE
               }
            })
            this.currentData = data;
            this.checkForGraph(data);
            S.set('dataList', this.dataList, 1, 0)
         }
      },
      checkForGraph(data) {
         // let data = this.currentData
         // console.log('CHECK FOR GRAPH')
         // if (this.removeGraph) {
         //    this.graphData = []
         //    this.removeGraph = false
         // }
         // console.log(this.blockOnFocus && data.FROMSYMBOL === this.dataList[this.blockOnFocus].name)
         // console.log(this.blockOnFocus, data.FROMSYMBOL, this.dataList[this.blockOnFocus].name, data.FROMSYMBOL === this.dataList[this.blockOnFocus].name)
         // console.log(this.dataList[this.blockOnFocus].name)
         if (this.blockOnFocus !== '' && data.FROMSYMBOL === this.dataList[this.blockOnFocus].name && data.PRICE) {
            // console.log(data.FROMSYMBOL)
            if (this.graphData.length < 20) {
               this.graphData.push(data.PRICE)
            } else {
               this.graphData.shift()
               this.graphData.push(data.PRICE)
            }

         }
      },
      calculateBarStyle(value) {
         let fullWidth = 90;
         let barWidth = fullWidth / this.graphData.length;
         let max = Math.max(...this.graphData);
         let min = Math.min(...this.graphData);
         // console.log(this.graphData);
         // console.log(min, max, value, (value - min) / (max - min) * 100)
         let height
         if (this.graphData.length == 1) {
            height = 100;
         } else {
            height = ((value - min) / (max - min)) * 100 + 10; // +10 for minimum height value of 10%
         }
         return `width: ${barWidth}%; height: ${height}%;`
      },
      createRequest() {
         let requestList = [];
         this.dataList.forEach(item => {
            requestList.push(`2~Coinbase~${item.name}~USD`);
         })
         let subRequest = {
            "action": "SubAdd",
            "subs": requestList
         }
         this.ws.send(JSON.stringify(subRequest))
      }
   },
   created() {
      window.addEventListener('resize', e => {
         this.getWidth();
      })
      window.dispatchEvent(new Event('resize'))
      this.dataList = S.set('dataList', [], false, true)['dataList'] || S.get('dataList', true)
      // window.onresize = this.triggerResize();
      var vm = this;
      // console.log(this.apiKey)
      var ws = new WebSocket('wss://streamer.cryptocompare.com/v2?api_key=' + this.apiKey);
      this.ws = ws;
      ws.onopen = function onSteamOpen() {
         vm.createRequest()
      }
      ws.onmessage = function onSteamMessage(message) {
         vm.processMessage(message)
      }
   }
}
</script>
