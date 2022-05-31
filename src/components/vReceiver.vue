<template>
  <div>
    <div class="TitleClass">
      <a-button v-if="showAddButton" type="primary" @click="showAddModalHandler">添加接受者</a-button>
      <a-form-model
          v-if="showFormModel"
          ref="ruleForm"
          :model="form"
          :rules="rules"
          layout="inline"
      >
        <a-form-model-item ref="name" label="Name" prop="name" placeholder="input placeholder">
          <a-input v-model="form.name"/>
        </a-form-model-item>

        <a-form-model-item ref="Telephone" label="Telephone" prop="Telephone">
          <a-input v-model="form.Telephone"/>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="onSubmit">
            添加
          </a-button>
          <a-button type="primary" style="margin-left: 10px;" @click="CancelShowFormModel">
            取消
          </a-button>
          <a-button style="margin-left: 10px;" @click="resetForm">
            重置
          </a-button>

        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="tableClass">
      <a-table
          :columns="columns"
          :row-key="record => record.id"
          :data-source="ReceiverData"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
      >
        <template
            v-for="col in ['name', 'telephone']"
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
                  <span>是否禁用接收者</span>
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
import {CreateReceiver, DelReceiver, ListReceiver, UpdateReceiver} from './api/receiver'

export default {
  name: "vReceiver",
  data() {
    return {
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
      showAddButton: true,
      showFormModel: false,
      other: '',
      form: {
        name: '',
        Telephone: '',
      },
      rules: {
        name: [{required: true, message: '请输入姓名', trigger: 'change'}],
        Telephone: [{required: true, message: '请输入手机号', trigger: 'change'}],

      },

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
    this.ListReceiverHandler();
  },
  methods: {
    handleTableChange(pagination) {
      let defaultPage = {
        page_index: pagination.current,
        page_size: pagination.pageSize
      }
      //
      ListReceiver(defaultPage).then(res => {
        if (res.data.flag) {
          this.ReceiverData = res.data.data.data
          this.pagination.total = res.data.data.count;
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg);
        }
      });
    },


    showAddModalHandler() {
      this.showAddModal = true
      this.showFormModel = true
      this.showAddButton = false
    },
    CancelShowFormModel() {
      this.showAddButton = true
      this.showFormModel = false
    },

    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.showAddButton = true
          this.showFormModel = false
          this.CreateReceiverHandler()

        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    CreateReceiverHandler() {
      this.loading = true;
      CreateReceiver(this.form).then(res => {
        if (res.data.flag) {
          this.loading = false;
          this.form = {}
          this.ListReceiverHandler();
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg);
        }
      });
    },
    ListReceiverHandler() {
      ListReceiver(this.defaultPage).then(res => {
        if (res.data.flag) {
          this.ReceiverData = res.data.data.data
          this.pagination.total = res.data.data.count;
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg);
        }
      });
    },
    edit(obj) {
      this.CacheReceiverData = {}
      this.CacheReceiverData = JSON.parse(JSON.stringify(this.ReceiverData))


      this.modifyItem = obj
      const newData = [...this.ReceiverData];
      const target = newData.find(item => obj.id === item.id);
      this.editingKey = obj.id;
      if (target) {
        target.editable = true;
        this.ReceiverData = newData;
      }
    },
    save(record) {
      UpdateReceiver(this.modifyItem).then(res => {
        if (res.data.flag) {
          const newData = [...this.ReceiverData];
          const target = newData.find(item => record.id === item.id);
          if (target) {
            delete target.editable;
            // 合并数组
            Object.assign(newData, target);
            this.ReceiverData = newData;
          }
          this.editingKey = '';

        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg);
        }
      });
    },
    cancel() {
      this.ReceiverData = this.CacheReceiverData;
      this.editingKey = '';
    },

    handleChange(value, key, column) {
      if (column === "telephone") {
        this.modifyItem.telephone = value
      } else if (column === "name") {
        this.modifyItem.name = value
      }
    },
    onChange(checked, record) {
      if (checked) {
        record.enable = 0;
      } else {
        record.enable = 1;
      }

      UpdateReceiver(record).then(res => {
        if (res.data.flag) {
          const newData = [...this.ReceiverData];
          const target = newData.find(item => record.id === item.id);
          if (target) {
            delete target.editable;
            // 合并数组
            Object.assign(newData, target);
            this.ReceiverData = newData;
          }
          this.editingKey = '';
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg);
        }
      });
    },


    deleteItem(record) {
      console.log(record)
      let params = {
        id: record.id
      }
      DelReceiver(params).then(res => {
        if (res.data.flag) {
          this.ReceiverData = this.ReceiverData.filter(t => t.id != params.id)
          this.editingKey = '';
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg);
        }
      });
    }
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