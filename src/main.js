import Vue from 'vue'
import './utils/request'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/antd.css';
// import Antd from 'ant-design-vue';
// Vue.use(Antd)


import {
    Button,
    Checkbox,
    Col,
    Divider,
    FormModel,
    Icon,
    Input,
    Layout,
    Menu,
    message,
    Pagination,
    Popconfirm,
    Row,
    Select,
    Space,
    Switch,
    Table,
    Tabs,
    Tag,
    Tooltip,
    Tree,
    Spin,
} from 'ant-design-vue';
const myicon = Icon.createFromIconfontCN({
    scriptUrl:  'iconfont.js'
})
Vue.component('my-icon', myicon)

Vue.use(Space);
Vue.use(Button);
Vue.use(Checkbox);
Vue.use(Col);
Vue.use(Divider);
Vue.use(FormModel);
Vue.use(Icon);
Vue.use(Input);
Vue.use(Layout);
Vue.use(Menu);
Vue.use(Pagination);
Vue.use(Popconfirm);
Vue.use(Row);
Vue.use(Select);
Vue.use(Switch);
Vue.use(Table);
Vue.use(Tree);
Vue.use(Tabs);
Vue.use(Tag);
Vue.use(Tooltip);
Vue.use(Spin);


// Vue.use(Base);
// Vue.use(Affix);
// Vue.use(Anchor);
// Vue.use(AutoComplete);
// Vue.use(Alert);
// Vue.use(Avatar);
// Vue.use(BackTop);
// Vue.use(Badge);
// Vue.use(Breadcrumb);

// Vue.use(Calendar);
// Vue.use(Card);
// Vue.use(Collapse);
// Vue.use(Carousel);
// Vue.use(Cascader);

// Vue.use(DatePicker);
// Vue.use(Dropdown);
// Vue.use(Form);

// Vue.use(InputNumber);

// Vue.use(List);
// Vue.use(LocaleProvider);
// Vue.use(Mentions);
// Vue.use(Modal);

// Vue.use(Popover);
// Vue.use(Progress);
// Vue.use(Radio);
// Vue.use(Rate);

// Vue.use(Slider);
// Vue.use(Statistic);
// Vue.use(Steps);

// Vue.use(Transfer);

// Vue.use(TreeSelect);

// Vue.use(TimePicker);
// Vue.use(Timeline);
// Vue.use(Upload);
// Vue.use(Drawer);
// Vue.use(Skeleton);
// Vue.use(Comment);
// Vue.use(ConfigProvider);
// Vue.use(Empty);
// Vue.use(Result);
// Vue.use(Descriptions);
// Vue.use(PageHeader);

Vue.prototype.$message = message;

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
