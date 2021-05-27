<template>
  <div id="app">
    <a-input
      placeholder="请输入任务"
      class="my_ipt"
      :value="inputValue"
      @change="handleInputChange"
    />
    <a-button type="primary" @click="addItemToList()">添加事项</a-button>

    <a-list bordered :dataSource="infoList" class="dt_list">
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- 复选框 -->
        <a-checkbox :checked='item.done' @change='onChange($event, item.id)'>{{ item.info }}</a-checkbox>
        <!-- 删除链接 -->
        <a slot="actions" @click="removeItemById(item.id)">删除</a>
      </a-list-item>

      <!-- footer区域 -->
      <div slot="footer" class="footer">
        <!-- 未完成的任务个数 -->
        <span>{{ unDoneLength }}条剩余</span>
        <!-- 操作按钮 -->
        <a-button-group>
          <a-button :type="viewKey === 'all' ? 'primary' : 'default'" @click="changeList('all')">全部</a-button>
          <a-button :type="viewKey === 'unDone' ? 'primary' : 'default'" @click="changeList('unDone')">未完成</a-button>
          <a-button :type="viewKey === 'done' ? 'primary' : 'default'" @click="changeList('done')">已完成</a-button>
        </a-button-group>
        <!-- 把已经完成的任务清空 -->
        <a @click="cleanDone()">清除已完成</a>
      </div>
    </a-list>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  name: 'app',
  data () {
    return {
      data: []
    }
  },
  created () {
    this.$store.dispatch('getList')
  },
  computed: {
    ...mapState(['inputValue', 'viewKey']),
    ...mapGetters(['infoList', 'unDoneLength', 'unDoneList', 'doneList'])
  },
  methods: {
    ...mapMutations(['setInputValue', 'addInputValue', 'removeItem1', 'removeItem2', 'changeStatus', 'listClean', 'changeViewKey']),
    // 监听文本框内容变化
    handleInputChange (e) {
      // 拿到最新值，并同步到store
      console.log(e.target.value)
      this.setInputValue(e.target.value)
    },
    // 向列表项中新增 item 项
    addItemToList () {
      if (this.inputValue.trim().length <= 0) { // 判空处理
        return this.$message.warning('文本框内容不能为空')
      }
      this.addInputValue()
    },
    removeItemById (id) {
      this.removeItem1(id)
    },
    // 监听复选框选中状态的变化
    onChange (e, id) {
      // 通过 e.target.checked 可以接受到最新的选中状态
      const param = {
        id: id,
        done: e.target.checked
      }
      this.changeStatus(param)
      // 另一种写法：
      // @change='(e) => {onChange(e, item.id)}'
      // console.log(`checked = ${e.target.checked}`)
    },
    // 清除已完成绑定事件
    cleanDone () {
      this.listClean()
    },
    // 修改页面中展示的列表项
    changeList (key) {
      this.changeViewKey(key)
    }
  }
}
</script>

<style scoped>
#app {
  padding: 10px;
}

.my_ipt {
  width: 500px;
  margin-right: 10px;
}

.dt_list {
  width: 500px;
  margin-top: 10px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
