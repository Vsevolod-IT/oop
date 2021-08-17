/**
 * ==============================
 * Пожалуйста прочтите readMeInspector.md
 * ==============================
 */

/**
 * @constructor
 * @description Конструктор для создания пунктов меню (еды)
 * @param {Array} type -'элементы  меню из которых будет сделан обьект'
 */
 const Food = function(type) {
  this.type = [...type];
};


/**
 * @description Метод подсчета суммы цены и калорий 
 * @param {Object} menu - передаем меню из замыкания обьекта
 * @param {Array} type - передаем блюдо которое нужно из меню
 * @returns {Object} - получаем полную стоимость и ккалорийность
 */
Food.prototype.fullPrice = function(menu, key) {
  const res = {
    'price': 0,
    'kkal': 0,
  };
  for (el of key) {
    if (el === 'paid') {
      res;
    } else {
      res['price'] += menu?.[el]?.['price'];
      res['kkal'] += menu?.[el]?.['kkal'];
    }
  }
  return res;
};


/**
 * @description Функция обертка возвращающая конструктор и хранящая меню 
 * @returns {Object} - получаем конструктор для элемента меню
 */
const burger = function() {
  const menu = {
    SIZE_SMALL: {
      'price': 50,
      'kkal': 20,
    },
    SIZE_LARGE: {
      'price': 100,
      'kkal': 40,
    },
    STUFFING_CHEESE: {
      'price': 10,
      'kkal': 20,
    },
    STUFFING_SALAD: {
      'price': 20,
      'kkal': 5,
    },
    STUFFING_POTATO: {
      'price': 15,
      'kkal': 10,
    },
  };
  /**
 * @constructor
 * @description Конструктор дочерний  Food
 * @param {Array} type -'элементы  меню из которых будет сделан обьект'
 * @returns {Object} - получаем оьект с ценой,калориями,именем который не изменяем
 */
  return function Burger(type) {
    Food.call(this, type);
    const obj = this.fullPrice(menu, type);
    obj['name'] = 'BURGER';
    return {
      get: () => {
        Object.freeze(obj);
        return obj;
      },
    };
  };
};


/**
 * @description Функция обертка возвращающая конструктор и хранящая меню 
 * @returns {Object} - получаем конструктор для элемента меню
 */
const salad = function() {
  const menu = {
    CESAR: {
      'price': 100,
      'kkal': 20,
    },
    OLIVIE: {
      'price': 50,
      'kkal': 80,
    },
  };
  /**
 * @constructor
 * @description Конструктор дочерний  Food
 * @param {Array} type -'элементы  меню из которых будет сделан обьект'
 * @returns {Object} - получаем оьект с ценой,калориями,именем который не изменяем
 */
  return function Salad(type) {
    Food.call(this, type);
    const obj = this.fullPrice(menu, type);
    obj['name'] = type.join();
    return {
      get: function() {
        Object.freeze(obj);
        return obj;
      },
    };
  };
};


/**
 * @description Функция обертка возвращающая конструктор и хранящая меню 
 * @returns {Object} - получаем конструктор для элемента меню
 */
const drink = function() {
  const menu = {
    COLA: {
      'price': 50,
      'kkal': 40,
    },
    COFE: {
      'price': 80,
      'kkal': 20,
    },
  };
  /**
 * @constructor
 * @description Конструктор дочерний  Food
 * @param {Array} type -'элементы  меню из которых будет сделан обьект'
 * @returns {Object} - получаем оьект с ценой,калориями,именем который не изменяем
 */
  return function Drink(type) {
    Food.call(this, type);
    const obj = this.fullPrice(menu, type);
    obj['name'] = type.join();
    return {
      get: function() {
        Object.freeze(obj);
        return obj;
      },
    };
  };
};


/**
 * @constructor (s)
 * @description Конструкторы для создания блюд
*/
const Burger = burger();
const Salad = salad();
const Drink = drink();


/**
 * @description получение метода от родителя Food через композицию
*/
Burger.prototype = Object.create(Food.prototype);
Salad.prototype = Object.create(Food.prototype);
Drink.prototype = Object.create(Food.prototype);
Order.prototype = Object.create(Food.prototype);


// функц вызывает нужный конструктор и возвращает обьект
function callConstr(key, topping) {
  if (key === 'B') {
    return new Burger(topping);
  }

  if (key === 'S') {
    return new Salad(topping);
  }

  if (key === 'D') {
    return new Drink(topping);
  }
}


function Order(obj) {
  const orderList = {
    'paid': false,
  };
  let count = 1;

  if (!Array.isArray(obj)) {
    obj = [obj];
  }
  for (el in obj) {
    const item = obj[el];
    const keyMenu = Object.keys(item)[0];
    const topping = item[Object.keys(item)];
    const tmp = callConstr(keyMenu[0], topping);
    orderList[`item${count}`] = tmp.get();
    count++;
  }
  orderList['sum'] = this.fullPrice(orderList, Object.keys(orderList));
  return {
    get: function() {
      return orderList;
    },
    add: function(newItem) {
      if (!orderList['paid']) {
        if (!Array.isArray(newItem)) {
          newItem = [newItem];
        }
        for (el in newItem) {
          const item = newItem[el];
          const keyMenu = Object.keys(item)[0];
          const topping = item[Object.keys(item)];
          const tmp = callConstr(keyMenu[0], topping);
          orderList[`item${count}`] = tmp.get();
          orderList['sum']['price'] += tmp.get().price;
          orderList['sum']['kkal'] += tmp.get().kkal;
          count++;
        }
        return orderList;
      } else {
        console.log(`order has been paid make a new order`);
      }
    },
    paid: function(num=0) {
      if (num < orderList['sum']['price']) {
        console.log(` the amount of your order ${orderList['sum']
            ['price']} you transferred ${num}`);
      } else {
        console.log(`thank you! enjoy your food =)`);
        orderList['paid'] = true;
        return Object.freeze(this);
      }
    },
    del: function(item=0) {
      const keyObj = Object.keys(orderList).filter((el) => /item.*/.test(el));
      const keyItem = keyObj.map((el) => orderList[el]['name']);

      if (!(/item.*/.test(keyObj.join())) || (orderList['paid'])) {
        console.log(`there is no items in order`);
        return;
      }

      if (item === 'sum' || item === 'paid') {
        console.log(`Don't have permission for del this field`);
        return;
      }
      if (keyItem.includes(item)) {
        let delItem;
        for (let i = 0; i <= keyObj.length; i++) {
          delItem = keyObj[i];
          if (orderList[delItem]['name'] === item) {
            console.log(delItem);
            break;
          }
        }
        orderList['sum']['price'] -= orderList[delItem]['price'];
        orderList['sum']['kkal'] -= orderList[delItem]['kkal'];
        delete orderList[delItem];
        return orderList;
      }
      if (item === 0) {
        const delItem = keyObj.pop();
        orderList['sum']['price'] -= orderList[delItem]['price'];
        orderList['sum']['kkal'] -= orderList[delItem]['kkal'];
        delete orderList[delItem];
        return orderList;
      }
    },
    price: function() {
      return orderList['sum']['price'];
    },
    kkal: function() {
      return orderList['sum']['kkal'];
    },
  };
}


const sampleOrder1 = [
  {
    'Burger': ['SIZE_SMALL', 'STUFFING_CHEESE'],
  },
  {
    'Burger': ['SIZE_LARGE', 'STUFFING_CHEESE'],
  },
  {
    'Salad': ['CESAR'],
  },
  {
    'Drink': ['COLA'],
  },
];

const sampleOrder2 = {
  'Burger': ['SIZE_SMALL', 'STUFFING_CHEESE'],
};

const sampleOrder3 = {
  'Drink': ['COLA'],
};

const sampleOrder4 = [
  {
    'Burger': ['SIZE_SMALL', 'STUFFING_CHEESE'],
  },
  {
    'Drink': ['COFE'],
  },
];

const burger1 = new Burger(['SIZE_SMALL', 'STUFFING_CHEESE']);
const burger2 = new Burger(['SIZE_LARGE', 'STUFFING_CHEESE']);
const cesar = new Salad(['CESAR']);
const cola = new Drink(['COLA']);

const order = new Order(sampleOrder1);
const order2 = new Order(sampleOrder2);

console.group(`Проверка созданных обьектов меню (бургер кола и т.д)`);
console.log(`burger1 >> `, burger1);
console.log(`burger1.get() >> `, burger1.get());
console.log(`\ncesar >> `, cesar);
console.log(`cesar.get() >> `, cesar.get());
console.log(`\ncola >> `, cola);
console.log(`cola.get() >> `, cola.get());
console.group(`Можем ли обратится к меню или как-то исзменить цену у созданного эелемента
 так как меню как такого нет и его изменить ни как нельзя`);
console.log(`burger1.price >> `, burger1.price);
console.log(`burger1.get().price >> `, burger1.get().price);
console.log(`\nможно ли изменить price полученного обьекта`);
console.log(`burger1.get().price = 'change price' >> `, burger1.get().price = 'change price');
console.log(`burger1.get().price >> `, burger1.get().price);
console.log(`\nмы не можем изменить price  в обьекте`);
console.groupEnd();
console.groupEnd();
console.group(`\nПроверка созданных Заказов `);
console.group(`\nобращение к заказу напрямую`);
console.log(`order >> `, order);
console.log(`order2 >> `, order2);
console.log(`\nнапрямую обратится к элементу заказa`);
console.log(`order.item1.price >> `, order.item1);
console.log(`order2.item1.price >> `, order2.item1);
console.groupEnd();
console.group(`\nизменить цену напрямую через get()`);
console.log(`order.get().item1.price =  'change' >> `, order.get().item1.price = 'change');
console.log(`order >> `, order);
console.log(`order.get() >> `, order.get());
console.groupEnd();
console.group(`\nДобавление элементов меню в заказ`);
console.log(`order.add(sampleOrder1) >> `, order.add(sampleOrder1));
console.log(`order.add(sampleOrder1) >> `, order.add(sampleOrder2));
console.group(`\nОплата заказа и блокировка на добавление`);
console.log(`order.paid(300) ⟱ `);
console.log(order.paid(300));
console.log(`\norder.paid() ⟱ `);
console.log(order.paid());
console.log(`\norder.paid(700) ⟱ `);
console.log( order.paid(700));
console.log(`\nоплата прошла проверяем статус заказа и пробуем добавить в него элементы`);
console.log(`\norder.get() >> `, order.get());
console.log(`order.get().paid >> `, order.get().paid);
console.log(`\norder.add(sampleOrder1) ⟱ `);
console.log(order.add(sampleOrder1));
console.log(`добавление в данный заказ закрыто`);
console.groupEnd();
console.groupEnd();
console.group(`Удаление из заказа`);
console.log(`order2.get() >> `, order2.get());
console.log(`\nво 2 заказе пока один элемент добавим в него еще 2`);
console.log(`order2.add(sampleOrder4) >> `, order2.add(sampleOrder4));
console.log(`\nсейчас в заказе 2 BURGER и 1 COLA `);
console.log(`order2.del('BURGER') >> `, order2.del('BURGER'));
console.log(`без параметров на удаление мы удалим последний элемент в заказе`);
console.log(`oreder2.del() >> `, order2.del());
console.log(`после удаления последнего элемента мы не сможем удалять еще`);
console.log(`order2.del() >> `, order2.del());
console.log(`order2.del() ⟱ `);
console.log(order2.del());
console.groupEnd();
