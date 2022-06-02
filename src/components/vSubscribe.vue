<template>
  <div>
    <div class="TitleClass"  ref="top">
      <a-button v-if="showProAddButton" type="primary" @click="showAddModalHandler">添加订阅规则</a-button>
      <a-form-model
          v-if="showFormModel"
          ref="ruleForm"
          :model="form"
          :rules="rules"
          layout="inline"
      >
        <a-form-model-item ref="rule" label="Rule" prop="rule">
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
        <a-form-model-item label="Receiver" prop="selectUserIds">
          <a-select
              mode="multiple"
              label-in-value
              placeholder="请添加接收者"
              style="width: 300px"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="fetchUser"
              @change="SelectHandleChange"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
            <a-select-option v-for="d in users" :key="d.id">
              {{ d.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item ref="label" label="Label" prop="label">
          <a-input v-model="form.label" placeholder='多个请用","隔开'/>
        </a-form-model-item>

        <a-form-model-item>
          <a-button type="primary" @click="onSubmit">
            添加
          </a-button>
          <a-button type="primary" style="margin-left: 10px;" @click="CancelShowFormModel">
            取消
          </a-button>
        </a-form-model-item>


      </a-form-model>
    </div>
    <div class="tableClass">
            <a-table
                :columns="columns"
                :row-key="record => record.id"
                :data-source="SubscribeData"
                :pagination="pagination"
                :loading="loading"
                @change="handleTableChange"
            >
              <template
                  v-for="col in ['rule_name', 'label']"
                  :slot="col"
                  slot-scope="text, record"
              >
                <div :key="col">
                  <a-input
                      v-if="record.editable"
                      style="margin: -5px 0"
                      :value="text"
                      @change="e => handleChange(e.target.value, record.id, col)"
                  />
                  <template v-else>
                    {{ text }}
                  </template>
                </div>
              </template>





              <template slot="action" slot-scope="text, record">
                <div class="editable-row-operations">
                <span v-if="record.editable">
                  <a @click="() => save(record)">保存</a>
                  <!--            <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.id)">-->
                    <a @click="cancel()">取消</a>
                  <!--            </a-popconfirm>-->
                </span>
                  <span v-else>
                    <a :disabled="editingKey !== ''" @click="() => edit(record)">修改</a>
                    <a-divider type="vertical"/>
                    <a-tooltip placement="top">
                      <template slot="title">
                        <span>是否禁用订阅规则</span>
                      </template>
                        <a-switch :default-checked="record.enable===0" size="small"
                                  @change="(checked) => onChange(checked,record)">
                          <a-icon slot="checkedChildren" type="check"/>
                          <a-icon slot="unCheckedChildren" type="close"/>
                      </a-switch>
                    </a-tooltip>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确定删除吗？"     ok-text="确定"     cancel-text="取消"   @confirm="() => deleteItem(record)"    >
                          <a :disabled="editingKey !== ''" >删除</a>
                    </a-popconfirm>

                </span>
                </div>
              </template>


            </a-table>
    </div>


  </div>
</template>

<script>
import {fetchPrometheusRules} from "@/components/api/prometheus";
import { searchReceiver, } from './api/receiver'
import {CreateSubscribe, DelSubscribe, ListSubscribe,UpdateSubscribe} from './api/subscribe'
import moment from "moment"

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
        selectUserIds: [],
        label: "",
      },
      fetching: false,
      users: [],
      defaultPage: {
        page_index: 1,
        page_size: 10,
      },

      pagination: {
        pageSize: 10, // 默认每页显示数量
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ["10", "15", "20", "25"], // 每页数量选项
        showTotal: (total) => `共计${total}条`, // 显示总数
        showSizeChange: (current, pageSize) => (this.pageSize = pageSize), // 改变每页数量时更新显示
        total: 0,
      },
      SubscribeData: [],
      columns: [
        {title: 'Prom Rule名称', dataIndex: 'rule_name', scopedSlots: {customRender: 'rule_name'}},
        {title: '标签', dataIndex: 'label', scopedSlots: {customRender: 'label'}},
        {title: '修改时间', dataIndex: 'timestamp', customRender: function (time) {
            return  moment.unix(time).format("YYYY-MM-DD hh:mm:ss");
          },},
        {title: '操作', key: '操作', scopedSlots: {customRender: 'action'}},
      ],
      CacheSubscribeData: {},

      
      loading: false,

      showAddModal: false,
      showFormModel: false,
      other: '',
      editingKey: '',

      modifyItem: {},


    };
  },

  mounted() {
    this.fetchPrometheusRulesHandler();
    this.ListSubscribeHandler();
    // let topHeight = this.$refs.top.offsetHeight // 头部高度
    // console.log(topHeight)
  },
  methods: {

    handleTableChange(pagination) {
      let defaultPage = {
        page_index: pagination.current,
        page_size: pagination.pageSize
      }
      ListSubscribe(defaultPage).then(res => {
        if (res.data.flag) {
          this.SubscribeData = res.data.data.data
          this.pagination.total = res.data.data.count;
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg);
        }
      });
    },
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
    SelectHandleChange(value) {
      this.form.selectUserIds = []
      value.forEach((item) => {
        this.form.selectUserIds.push({id: item.key, name: item.label.trim()})
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
    CreateSubscribeHandler() {
      CreateSubscribe(this.form).then(res => {
        if (res.data.flag) {
          this.form = {}
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg);
        }
      })
    },
    ListSubscribeHandler() {
          ListSubscribe(this.defaultPage).then(res => {
        if (res.data.flag) {
          this.SubscribeData = res.data.data.data;
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg);
        }
      })
    },
    CancelShowFormModel() {
      this.showProAddButton = true
      this.showFormModel = false
    },
    edit(obj) {
      this.CacheSubscribeData = {}
      this.CacheSubscribeData = JSON.parse(JSON.stringify(this.SubscribeData))
      this.modifyItem = obj
      const newData = [...this.SubscribeData];
      const target = newData.find(item => obj.id === item.id);
      this.editingKey = obj.id;
      if (target) {
        target.editable = true;
        this.SubscribeData = newData;
      }
    },
    onChange(checked, record) {
      if (checked) {
        record.enable = 0;
      } else {
        record.enable = 1;
      }

      UpdateSubscribe(record).then(res => {
        if (res.data.flag) {
          const newData = [...this.SubscribeData];
          const target = newData.find(item => record.id === item.id);
          if (target) {
            delete target.editable;
            // 合并数组
            Object.assign(newData, target);
            this.SubscribeData = newData;
          }
          this.editingKey = '';
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg);
        }
      });
    },
    save(record) {
      UpdateSubscribe(this.modifyItem).then(res => {
        if (res.data.flag) {
          const newData = [...this.SubscribeData];
          const target = newData.find(item => record.id === item.id);
          if (target) {
            delete target.editable;
            // 合并数组
            Object.assign(newData, target);
            this.SubscribeData = newData;
          }
          this.editingKey = '';

        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg);
        }
      });
    },
    cancel() {
      this.SubscribeData = this.CacheSubscribeData;
      this.editingKey = '';
    },
    deleteItem(record) {
      let params = {
        id: record.id
      }
      DelSubscribe(params).then(res => {
        if (res.data.flag) {
          this.SubscribeData = this.SubscribeData.filter(t => t.id != params.id)
          this.editingKey = '';
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg);
        }
      });
    },
    handleChange(value, key, column) {
      if (column === "label") {
        this.modifyItem.label = value
      } else if (column === "rule_name") {
        this.modifyItem.rule_name = value
      }
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