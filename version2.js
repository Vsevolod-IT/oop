
/**
 * ==============================
 * Пожалуйста прочтите readMeInspector.md
 * ==============================
 */


 'use strict';

 /**
  * @description меню блюд с последующим вызовом IIFE функции для заморозки
  *              меню не изменяемое
  */
 const menu = {
   burger:{
     type: {
       large: {
         'price': 100,
         'kkal': 40,
       },
       small: {
         'price': 50,
         'kkal': 20,
       },
     },
     stuffing: {
       cheese: {
         'price': 10,
         'kkal': 20,
       },
       salad: {
         'price': 20,
         'kkal': 5,
       },
       potato: {
         'price': 15,
         'kkal': 10,
       },
     }
   },
   drink: {
     type: {
       cola: {
         'price': 50,
         'kkal': 40,
       },
       cofe: {
         'price': 80,
         'kkal': 20,
       },
     },
   },
   salad: {
     type: {
       cesar: {
         'price': 100,
         'kkal': 20,
       },
       olivie: {
         'price': 50,
         'kkal': 80,
       },
     },
   },
 };
 
 (function () {
   Object.freeze(menu);
   let k1 = Object.keys(menu)
   for(k1 in menu) {
     Object.freeze(menu[k1])
     let k2 = Object.keys(menu[k1])
     for(k2 in menu[k1]) {
       let k3 = Object.keys(menu[k1][k2])
       Object.freeze(menu[k1][k2])
       for(k3 in menu[k1][k2]) {
         Object.freeze(menu[k1][k2][k3])
       }
     }
   }
 }())
 
 
 /**
  * @constructor
  * @description Конструктор для создания пунктов меню (еды)
  * @param {String} type -'это тип или размер продукта, у бургера это размер
  *                        у остальных обьектов это тип (кола или кофе)'
  * @returns обьект ключом которого будет выступать имя конструктора с 
  *          его типом\размером
  */
 const Food = function(type) {
   this.name = `${this.constructor.name} ${type}`
 }
 
 
 
 /**
  * @constructor 
  * @description Конструктор бургеров наследует от  Food this.name
  *              так же была применина IIFE функция для проверки валидности
  *              введенных аргументов,чтобы после ее использования 
  *              в памяти не хранилось от ее работы ничего.
  *              Аргумент должен быть 1 размер и 1 начинка
  * @param {String} type -размер small | large
  * @param {String} stuffing -начинка cheese | salad | potato
  * @returns обьект бургер с суммой (цена и калории) размером, начинкой
  *          после создания весь обьект блокируется на изменения
  */
 const Burger = function(type, stuffing) {
 
   function test(){
     const testType = ['small', 'large'];
     const testStuff = ['cheese', 'salad', 'potato'];
     if (!testType.includes(type) || !testStuff.includes(stuffing)) {
       throw new Error(`doesn't correct order for the burger (name of size or stuff)`)
     }
   };
   test();
 
   if (arguments.length !== 2) {
     throw new Error(` 1 argument fo size / 1 argument for stuff not more or less`)
   }
 
   Food.call(this, type)
   this.size = type;
   this.stuff = stuffing;
   this.sum = {
     'price' : menu.burger.type[type]['price'] + menu.burger.stuffing[stuffing]['price'],
     'kkal' : menu.burger.type[type]['kkal'] + menu.burger.stuffing[stuffing]['kkal'],
   }
   Object.freeze(this)
 }
 
 
 /**
  * @description методы записанные в прототип бургера 
  * @returns возвращают размер и начинку
  */
 Burger.prototype.getSize = function() {
   return this.size
 }
 
 Burger.prototype.getStuf = function() {
   return this.stuff
 }
 
 
 
 /**
  * @constructor
  * @description Конструктор салатов наследует от  Food - this.name
  *              на основе типа и граммовки создает салат
  * @param {String} type -тип cesar | olivie
  * @param {Number} gramm -от 100 до 500 гр
  * @returns салат с посчитатонной стоимостью салата и калориями
  *          так же возвращает вес созданного салата
  */
 const Salad = function(type, gramm) {
 
 
   function test() {
     const testType = ['cesar', 'olivie'];
     if(!testType.includes(type)) {
       throw new Error(`doesn't correct name of salad`)
     }
     if(gramm < 100 || gramm > 500) {
       throw new Error(`porcion from 100gr to 500gr`)
     }
   }
   test()
 
   if(arguments.length !== 2) {
     throw new Error(`1 arg for name of salad / 1 arg for porcion (gramm)`)
   }
 
   Food.call(this, type);
 
   const price = menu.salad.type[type]['price'] * gramm / 100;
   const kkal = menu.salad.type[type]['kkal']  * gramm / 100;
 
   this.sum = {
     price: price,
     kkal: kkal
   };
   this.weight = gramm;
 
   Object.freeze(this.sum)
   Object.freeze(this)
 }
 
 
 /**
  * @description метод записанный в прототип салата 
  * @returns возвращает вес созданного экземпляра
  */
 Salad.prototype.getWeight = function() {
   return this.weight
 }
 
 
 /**
  * @constructor
  * @description Конструктор напитков наследует от  Food - this.name
  * @param {String} type -тип cola | cofe
  * @returns обьект с именем и суммой
  */
 const Drink = function(type) {
 
   function test(){
     const testType = ['cola', 'cofe']
     if(!testType.includes(type)) {
       throw new Error(`doesn't correct name of drink`)
     }
   }
   test()
 
   if(arguments.length !== 1) {
     throw new Error(`only 1 argument for drink`)
   }
 
   Food.call(this,type)
   this.sum = menu.drink.type[type];
   Object.freeze(this)
 }
 
 
 
 /**
  * @constructor
  * @description Конструктор заказов создает обьект с суммой и 
  *              статусом оплаты после вызывает свой метод для 
  *              добавления эелементов
  * @param {Object} obj - пример  {burger : ['small', 'cheese'],
  * @returns обьект с пунктами из меню, с возможностью добавлять и удалять
  *          по наименованию
  */
 const Order = function(obj) {
   this.orderList = {
     paid : false,
     sum : {
       price:0,
       kkal:0,
     },
   }
   this.count = 1;
   if (obj) {this.add(obj)}
 }
 
 
 
 /**
  * @description функция вызывает конструткор исходя из аргументов
  *              и передает в него парамметры
  * @param {String} constr - ключь (имя) конструктора (burger,salad...)
  * @param {Array} arr - массив с параметрами для конструктора
  * @returns возвращает экземпляр созданный конструктором
  */
 function callConstructs(constr, arr){
   if(constr === 'burger') {return new Burger(...arr)};
   if(constr === 'salad') {return new Salad(...arr)};
   if(constr === 'drink') {return new Drink(...arr)};
 }
 
 /**
  * @description метод записанный в прототип Order, проверяет можно ли
  *              добавить элемент в заказ (не оплачен ли он) если нет до 
  *              добавляет элемент 
  * @param {Object} obj - обьект с именем конструктора и массивом его парамметров
  *                       или экземпляр из конструктора (Burger, Salad, Drink)
  */
 Order.prototype.add = function(obj) {
   
   if (this.orderList.paid) {
     return `order  has been paid create a new order`
   }
   if (obj.constructor.name === 'Object'){
     for(let i in obj){
       let tmp = callConstructs(i, obj[i]);
       this.orderList[`item${this.count}`] = tmp;
       this.orderList.sum.price += tmp.sum.price;
       this.orderList.sum.kkal += tmp.sum.kkal;
       this.count++ 
     }
     return this.orderList
   } else { 
     this.orderList[`item${this.count}`] = obj;
     this.orderList.sum.price += obj.sum.price;
     this.orderList.sum.kkal += obj.sum.kkal; 
     this.count++
    }
 }
 
 
 /**
  * @description метод записанный в прототип Order, проверяет есть ли 
  *              пункты меню в ордере для удаления
  *              если есть удалит последний добавленный элемент
 
  */
 Order.prototype.dell = function() {
   const keyOrder = Object.keys(this.orderList)
   if(keyOrder.length <= 2){
     return `No items for dell`
   }
   if(this.orderList.paid) {return `order has been paid create a new`}
   this.count--
   this.orderList.sum.price -= this.orderList[`item${this.count}`].sum.price;
   this.orderList.sum.kkal -= this.orderList[`item${this.count}`].sum.kkal; 
   delete this.orderList[`item${this.count}`]
 }
 
 
 /**
  * @description метод записанный в прототип Order
  * @returns возвращает сумму заказа
  */
 Order.prototype.getPrice = function() {
   return this.orderList.sum.price;
 }
 
 
 /**
  * @description метод записанный в прототип Order
  * @returns возвращает сумму калорий
  */
 Order.prototype.getKkal = function() {
   return this.orderList.sum.kkal;
 }
 
 
 /**
  * @description метод записанный в прототип Order, проверяет оплату
  *              и если сумма достаточна блокирует весь обьект на дальнейшее 
  *              изменение
  * @returns изменяет статус оплаты (paid)
  */
 Order.prototype.paid = function(num=0) {
   if (this.orderList.paid) {return `already paid`}
   if (num < this.orderList.sum.price) {return `insufficient funds`}
   this.orderList.paid = true;
   Object.freeze(this)
   return `enjoy your food`
 }
 
 
 // Demo block
 
 // Переменные для демонстрации
 const burger = new Burger('small', 'potato')
 const burger2 = new Burger('large','potato')
 
 const salad = new Salad('cesar', 150)
 const salad2 = new Salad('olivie', 500)
 
 const drink = new Drink('cola')
 const drink2 = new Drink('cofe')
 
 const exampleOrd = {
   burger : ['small', 'cheese'],
   salad : ['olivie', 250],
   drink : ['cofe']
 }
 
 const order = new Order(burger2)
 const order2 = new Order(exampleOrd)
 const order3 = new Order()


console.group(`Демонстрационный блок программы,
 часть кода закоментированна так как вызывает ошибку`)
console.group(`\nменю и его неизменность`)
console.log(`menu >> `, menu)
console.log(`код выз ошибку и закоментирован`)

/** так как код выз ошибку он закоментированн */
// console.log(`menu = 0 >> `, menu = 0)
// console.log(`menu.burger = 0 >> `, menu.burger = 0)

console.log(`\nдоступ только на чтение`)
console.log(`menu.burger`, menu.burger)
console.groupEnd()

console.group(`\nЭкземпляры меню`)
console.log(`burger`, burger)
console.log(`salad`, salad)
console.log(`drink`, drink)

console.log(`\nтак же как и меню доступ только на чтение`)
console.log(`код выз ошибку и закоментирован`)

/** так как код выз ошибку он закоментированн */
// console.log(burger.name = 0)
// console.log(burger.sum = 0)

console.log(`\nнеправильные аргументы в конструктор вызовут ошибку`)
console.log(`код выз ошибку и закоментирован`)

/** так как код выз ошибку он закоментированн */
let test;
// console.log(`test = new Burger('wrongName', 'cheese')`, test = new Burger('wrongName', 'cheese'))
// console.log(`test = new Burger('large', 'cheese', 'dopArg')`, test = new Burger('large', 'cheese', 'dopArg'))

console.log(`\nу бургера и салата есть свои методы для определ размера и начинки`)
console.log(`burger.getSize() >> `, burger.getSize())
console.log(`burger.getStuff() >> `, burger.getStuf())
console.log(`salad.getWeight() >> `, salad.getWeight())
console.groupEnd();

console.group(`\nЗаказ и его методы`)
console.log(`order >> `, order)
console.log(`order2 >> `, order2)
console.log(`\nмы можем создавать пустой заказ и потом добавлять в него элементы`)
console.log(`order3 >> `, order3)

console.log(`\nудаление невозможно без пунктов меню`)
console.log(`order3.dell() >> `, order3.dell())

console.log(`\nудаление убирает последний добавленный элемент`)
console.log(`order2.dell() >> `, order2.dell())

console.log(`\nдобавление как по одному пункту меню так и списком`)
console.log(`\nдобавляем список exampleOrd >>  `, exampleOrd);
console.log(`\norder2.add(exampleOrd) >> `, order2.add(exampleOrd))

console.log(`\nдобавим один экземпляр конструктора`)
console.log(`\norder.add(burger2)`, order.add(burger2))
console.log(`order >> `, order)
console.log(`мы можем добавлять одинаковые блюда`)

console.log(`\nоплата заказа проверяет достаточно ли денег и если да блокирует 
любое добавление или удаление заказа`)
console.log(`order2.paid(100) >> `, order2.paid(100))
console.log(`order2.paid(450) >> `, order2.paid(450))
console.log(`order2.paid(450) >> `, order2.paid(450))
console.log(`order2.dell() >> `, order2.dell())
console.log(`order2.add(burger) >> `, order2.add(burger))

console.log(`послед 2 метода показать цену и показать калории`)
console.log(`\norder.getPrice() >> `, order.getPrice())
console.log(`\norder.getKkal() >> `, order.getKkal())
console.groupEnd()
console.groupEnd()

