<template>
  <div>
    <div class="TitleClass">
      <a-button v-if="showProAddButton" type="primary" @click="showAddModalHandler">添加订阅规则</a-button>
      <a-form-model
          v-if="showFormModel"
          ref="ruleForm"
          :model="form"
          :rules="rules"
          layout="inline"
      >
        <a-form-model-item ref="rule" label="Rule" prop="rule" >
          <a-select
              show-search
              style="width: 300px"
              placeholder="请选择Rule名称"
              @change="handleSelectChange"
          >
            <a-select-option :value="item" v-for="(item,index) in PrometheusRules" :key="index">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Receiver" prop="selectUserIds"  >
          <a-select
              mode="multiple"
              label-in-value
              placeholder="请添加接收者"
              style="width: 300px"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="fetchUser"
              @change="handleChange"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
            <a-select-option v-for="d in users" :key="d.id">
              {{ d.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item ref="label" label="Label" prop="label"  >
          <a-input v-model="form.label" placeholder='多个请用","隔开'/>
        </a-form-model-item>

        <a-form-model-item>
          <a-button type="primary" @click="onSubmit">
            添加
          </a-button>
        </a-form-model-item>


      </a-form-model>
    </div>
    <div class="tableClass">
      <!--      <a-table-->
      <!--          :columns="columns"-->
      <!--          :row-key="record => record.id"-->
      <!--          :data-source="ReceiverData"-->
      <!--          :pagination="pagination"-->
      <!--          :loading="loading"-->
      <!--          @change="handleTableChange"-->
      <!--      >-->
      <!--        <template-->
      <!--            v-for="col in ['name', 'telephone']"-->
      <!--            :slot="col"-->
      <!--            slot-scope="text, record"-->
      <!--        >-->
      <!--          <div :key="col">-->
      <!--            <a-input-->
      <!--                v-if="record.editable"-->
      <!--                style="margin: -5px 0"-->
      <!--                :value="text"-->
      <!--                @change="e => handleChange(e.target.value, record.id, col)"-->
      <!--            />-->
      <!--            <template v-else>-->
      <!--              {{ text }}-->
      <!--            </template>-->
      <!--          </div>-->
      <!--        </template>-->

      <!--        <template slot="action" slot-scope="text, record">-->
      <!--          <div class="editable-row-operations">-->
      <!--          <span v-if="record.editable">-->
      <!--            <a @click="() => save(record)">保存</a>-->
      <!--            &lt;!&ndash;            <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.id)">&ndash;&gt;-->
      <!--              <a @click="cancel()">取消</a>-->
      <!--            &lt;!&ndash;            </a-popconfirm>&ndash;&gt;-->
      <!--          </span>-->
      <!--            <span v-else>-->
      <!--              <a :disabled="editingKey !== ''" @click="() => edit(record)">修改</a>-->
      <!--              <a-divider type="vertical"/>-->
      <!--              <a-tooltip placement="top">-->
      <!--                <template slot="title">-->
      <!--                  <span>是否禁用接收者</span>-->
      <!--                </template>-->
      <!--                  <a-switch :default-checked="record.enable===0" size="small"-->
      <!--                            @change="(checked) => onChange(checked,record)">-->
      <!--                    <a-icon slot="checkedChildren" type="check"/>-->
      <!--                    <a-icon slot="unCheckedChildren" type="close"/>-->
      <!--                </a-switch>-->
      <!--              </a-tooltip>-->
      <!--              <a-divider type="vertical"/>-->
      <!--              <a-popconfirm title="确定删除吗？"     ok-text="确定"     cancel-text="取消"   @confirm="() => deleteItem(record)"    >-->
      <!--                    <a :disabled="editingKey !== ''" >删除</a>-->
      <!--              </a-popconfirm>-->

      <!--          </span>-->
      <!--          </div>-->
      <!--        </template>-->


      <!--      </a-table>-->
    </div>


  </div>
</template>

<script>
import {fetchPrometheusRules} from "@/components/api/prometheus";
import {searchReceiver} from './api/receiver'
import {CreateSubscribe} from './api/subscribe'

export default {
  name: "vSubscribe",
  data() {
    return {
      showProAddButton: true,
      PrometheusRules: [],
      rules: {
        rule: [{required: true, message: '请选择Rule', trigger: 'change'}],
        selectUserIds: [{required: true, message: '请添加告警接受者', trigger: 'change'}],
        label: [{required: true, message: '请输入Label', trigger: 'change'}],
      },
      form: {
        rule: '',
        selectUserIds:[],
        label:"",
      },
      fetching: false,
      users: [],





      pagination: {
        pageSize: 10, // 默认每页显示数量
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ["10", "15", "20", "25"], // 每页数量选项
        showTotal: (total) => `共计${total}条`, // 显示总数
        showSizeChange: (current, pageSize) => (this.pageSize = pageSize), // 改变每页数量时更新显示
        total: 0,
      },
      loading: false,
      columns: [
        {title: 'Name', dataIndex: 'name', scopedSlots: {customRender: 'name'}},
        {title: 'Telephone', dataIndex: 'telephone', scopedSlots: {customRender: 'telephone'}},
        {title: 'Action', key: 'action', scopedSlots: {customRender: 'action'}}
      ],
      showAddModal: false,
      showFormModel: false,
      other: '',


      defaultPage: {
        page_index: 1,
        page_size: 10,
      },
      ReceiverData: [],
      editingKey: '',

      modifyItem: {},

      CacheReceiverData: {},
    };
  },

  mounted() {
    this.fetchPrometheusRulesHandler();
  },
  methods: {
    fetchPrometheusRulesHandler() {
      fetchPrometheusRules().then(res => {
        if (res.data.flag) {
          this.PrometheusRules = res.data.data.data
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg);
        }
      });
    },
    showAddModalHandler() {
      this.showAddModal = true
      this.showFormModel = true
      this.showProAddButton = false
    },
    handleSelectChange(value) {
      this.form.rule = value
    },
    fetchUser(value) {
      this.fetching = true;
      searchReceiver({name: value}).then(res => {
        if (res.data.flag) {
          this.users = res.data.data.data
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg);
        }
      });
    },
    handleChange(value) {
      this.form.selectUserIds=[]
      value.forEach((item) => {
        this.form.selectUserIds.push({id:item.key,name:item.label})
      });
    },
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.showProAddButton = true
          this.showFormModel = false
          this.CreateSubscribeHandler()
        } else {
          return false;
        }
      });
    },
    CreateSubscribeHandler(){
      CreateSubscribe(this.form).then(res => {
        if (res.data.flag) {
          this.form={}
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg);
        }
      })
    },

  },


}
</script>

<style scoped>
.TitleClass {
  border-bottom: 1.5px solid #7675753D;
  padding-bottom: 10px;
  height: 50px;
}

.tableClass {
  padding-top: 15px;
}

.editable-row-operations a {
  margin-right: 8px;
}
</style>