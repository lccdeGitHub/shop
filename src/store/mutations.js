/*
直接更新state的多个方法的对象
 */
import Vue from 'vue'
import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
  RESET_USER_INFO,
  RECEIVE_INFO,
  RECEIVE_RATINGS,
  RECEIVE_GOODS,
  INCRMENT_FOOD_COUNT,
  DECRMENT_FOOD_COUNT,
  CLEAR_CART,
  RECEIVE_SEARCH_SHOPS
} from './mutation-types'

export default {
  [RECEIVE_ADDRESS] (state, {address}) {
    state.address = address
  },
  [RECEIVE_CATEGORYS] (state, {categorys}) {
    state.categorys = categorys
  },
  [RECEIVE_SHOPS] (state, {shops}) {
    state.shops = shops
  },
  [RECEIVE_USER_INFO] (state, {userInfo}) {
    state.userInfo = userInfo
  },
  [RESET_USER_INFO] (state) {
    state.userInfo = {}
  },
  [RECEIVE_INFO] (state, {info}) {
    state.info = info
  },

  [RECEIVE_RATINGS] (state, {ratings}) {
    state.ratings = ratings
  },

  [RECEIVE_GOODS] (state, {goods}) {
    state.goods = goods
  },

  [INCRMENT_FOOD_COUNT] (state, {food}) {
    // 首先需要判断food.count是否存在
    if (food.count) {
      food.count++
    } else {
      // 如果没有count 需要给他新增加一个count属性才可以
      // food.count = 1 //给food添加属性count, 值为1    没有数据绑定
      // 添加一个带数据绑定的属性
      Vue.set(food, 'count', 1)
      state.cartFoods.push(food)
    }
  },

  [DECRMENT_FOOD_COUNT] (state, {food}) {
    if (food.count) { // 只有有值才运行
      food.count--
      if (food.count === 0) {
        const index = state.cartFoods.indexOf(food)
        state.cartFoods.splice(index, 1)
      }
    }
  },

  [CLEAR_CART] (state, {foods}) {
    // 清除food中的count
    foods.forEach(food => { food.count = 0 })
    // 清除购物车
    state.cartFoods = []
  },

  [RECEIVE_SEARCH_SHOPS] (state, {searchShops}) {
    state.searchShops = searchShops
  }
}
