import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: [],
    inputValue: '', // 文本框内容
    nextId: 5, // list中id属性取值
    viewKey: 'all' // 当前选中按钮
  },
  mutations: {
    initList (state, step) {
      state.list = step
    },
    // 为 inputValue 赋值
    setInputValue (state, val) {
      state.inputValue = val
    },
    // 将inputValue存储到list中
    addInputValue (state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue.trim(),
        done: false
      }
      state.list.push(obj)
      state.nextId++

      state.inputValue = ''
    },
    removeItem1 (state, step) {
      state.list.forEach((e, index) => {
        if (e.id === step) {
          return state.list.splice(index, 1)
        }
      })
    },
    removeItem2 (state, step) {
      // 根据id查找对应的索引
      const i = state.list.findIndex(x => x.id === step)
      // 根据索引，删除对应的元素
      if (i !== -1) {
        state.list.splice(i, 1)
      }
    },
    // 修改列表项的选中状态
    changeStatus (state, param) {
      const i = state.list.findIndex(x => x.id === param.id)
      if (i !== -1) {
        state.list[i].done = param.done
      }
    },
    // 清除已完成列表项
    listClean (state) {
      state.list = state.list.filter(x => x.done === false)
    },
    // 修改视图的关键字
    changeViewKey (state, step) {
      state.viewKey = step
    }
  },
  actions: {
    getList (context) {
      axios.get('/list.json').then(({ data }) => {
        console.log(data)
        context.commit('initList', data)
      })
    }
  },
  getters: {
    // 统计未完成任务条数
    unDoneLength (state) {
      return state.list.filter(x => x.done === false).length
    },
    // 根据key返回相应list
    infoList (state) {
      if (state.viewKey === 'done') {
        return state.list.filter(x => x.done)
      } else if (state.viewKey === 'unDone') {
        return state.list.filter(x => !x.done)
      }
      return state.list
    }
  }
})
