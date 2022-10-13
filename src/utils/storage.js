class FriendlyStorage {
   
   returnCurrentData() {
      return localStorage;
   }

   returnCurrentKeys() {
      let keysArr = [];
      for (var item in localStorage) {
         keysArr.push(item)
      }
      return keysArr
   }

   clear() {
      for (var item in localStorage) {
         localStorage.removeItem(item)
      }
      return localStorage
   }

   _isExist(key) {
      return !(!localStorage.getItem(key))
   }

   _notExist(key) {
      console.error(`Item "${key}" does not exist`)
      return false
   }

   get(key, flat = false) {
      if(!(this._isExist(key))) {
         this._notExist(key)
         return false
      } else if (flat == false) {
         const item = localStorage.getItem(key);

         if(this._checkForJson(item)) {
            let itemObj = {};
            itemObj[key] = this._fromJson(item);
            return itemObj;
         } else {
            let itemObj = {};
            itemObj[key] = item;
            return itemObj;
         }
      } else {
         const item = localStorage.getItem(key);

         if(this._checkForJson(item)) {
            return this._fromJson(item);
         } else {
            return item;
         }
      }
   }

   put(key, dataKey, dataValue) {
      if (this._isExist(key)) {
         let oldVal = this.get(key);
         if (this._isTypeCorrect('Object', oldVal[key], 'Put')) {
            let newVal = oldVal[key]
            newVal[dataKey] = dataValue;
            this.set(key, newVal, true);
         }

      } else {
         this._notExist(key)
      }
   }

   setProperty(key, dataKey, dataValue) {
      if (this._isExist(key)) {
         let value = this.get(key); //key: {key1: val1}
         let flatVal = value[key]; //{key1: val1}
         if (flatVal.hasOwnProperty(dataKey) === false && this._isTypeCorrect('Object', value[key], 'changeProperty')) {
            flatVal[dataKey] = dataValue; // {dataKey: dataValue, key1: val1}
            value = flatVal; // key: {dataKey: dataValue, key1: val1}
            this.set(key, value, true)
         } else {
            console.error(`Property ${dataKey} already exists`)
            return false
         }
      }
   }

   changeProperty(key, dataKey, dataValue) {
      if (this._isExist(key)) {
         let value = this.get(key);
         let flatVal = value[key]; 
         if (flatVal.hasOwnProperty(dataKey) === true && this._isTypeCorrect('Object', value[key], 'changeProperty')) {
            flatVal[dataKey] = dataValue; 
            value = flatVal; 
            this.set(key, value, true)
         } else {
            console.error(`Property ${dataKey} does not exists`)
            return false
         }
      }
   }

   checkProperty(key, dataKey) {
      if (this._isExist(key)) {
         let value = this.get(key);
         let flatVal = value[key]; 
         if (flatVal.hasOwnProperty(dataKey) === true && this._isTypeCorrect('Object', value[key], 'checkProperty')) {
            return true
         } else {            
            return false
         }
      }
   }

   push(key, ...args) {
      if (this._isExist(key)) {
         let oldVal = this.get(key);
         if (this._isTypeCorrect('Array', oldVal[key], 'Push')) {
            let newVal = oldVal[key];
            args.forEach(value => {
               newVal.push(value);
            })
            this.set(key, newVal, true);
            return this.get(key)
         } 

      } else {
         this._notExist(key)
      }
   }
   

   splice(key, index, length) {
      if (this._isExist(key)) {
         let oldVal = this.get(key);
         if (this._isTypeCorrect('Array', oldVal[key], 'Splice')) {
            let newVal = oldVal[key];
            newVal.splice(index, length);
            this.set(key, newVal, true);
            return true
         }

      } else {
         this._notExist(key)
      }
   }

   delete(key, property) {
      if (this._isExist(key)) {
         let oldVal = this.get(key);
         if (this._isTypeCorrect('Object', oldVal[key], 'delete')) {
            let newVal = oldVal[key];
            delete newVal[property]
            this.set(key, newVal, true);
         } 

      } else {
         this._notExist(key)
      }
   }

   _isTypeCorrect(type, val, method) {
      /* =============================
         Hack: Checking type coincidence 
         Object.prototype.toString.call(val) returns string
         like [object Type], which we can use as an example for comparison
        ============================= */
      let check = Object.prototype.toString.call(val).slice(8, -1);
      check == 'String' ? check = 'Array' : ''
      if (check == type) {
         return true
      } else {
         this._displayTypeError(method)
      }
   }

   _displayTypeError(type) {
      switch(type) {
         case 'Push':
         case 'Splice':
         case 'changeProperty':
         case 'setProperty':
         case 'checkProperty':
            console.error(type + ' method works only with Arrays and Strings, use another method instead');
            return false;
            break;
         case 'Put':
         case 'Delete':
            console.error(type + ' method works only with Objects, use another method instead');
            return false;
            break;
      }
   }

   _checkForJson(obj) {
      // For some reason this block causes an error
      // try {
      //    JSON.parse(obj)
      // } catch {
      //    return false
      // }
      if (JSON.parse(obj)) {
         return true
      } else {
         return false
      }
   }

   _toJson(obj) {
      return JSON.stringify(obj)
   }

   _fromJson(obj) {
      return JSON.parse(obj)
   }

   getObj(key) {
      let obj = {};
      obj[key] = this._fromJson(this.get(key)[key]);
      return obj
   }


   set(key, value, force = false, silent = false) {
      if (!this._isExist(key) || (this._isExist(key) && force == true)) {
         if (key) {
            let obj = {};
            obj[key] = value;
            localStorage.setItem(key, this._toJson(value))
            return this.get(key);
         } else {
            console.error('The function must contain arguments')
            return false
         }
      } else if (this._isExist(key) && silent === true) {
         return false
      } else {
         console.error('Cannot rewrite an existing object, use "force" option instead')
         return false
      }
   }
}

window.S = new FriendlyStorage();

export default S