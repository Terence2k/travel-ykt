import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue';

// import Ant3uI from "/Users/xuyifei/Documents/study/npm/ant_vue3_ui_ts/lib/index"; // 这种引入不能打包之后不能使用
import Ant3uI from 'ant3-ui';

import App from './App.vue';
import './styles/index.less';
import router from './router';
import 'ant-design-vue/dist/antd.css';
import './router/permission';

const app = createApp(App);

app.use(createPinia());
app.use(Antd);
// app.use(Ant3uI, {
//   uploadUrl: "https://s.youdi.net/router/upload/save/file", // 初始化上传路径
//   dealTableRes: (res: any) => {
//     return {
//       total: res.pageInfo.total,
//       list: res.data,
//     };
//   },
// });
app.use(router);
app.mount('#app');
