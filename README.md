# ant3_vue3_ts

#### 介绍

丽江一卡通 使用 vue3 + ant3 + vite 搭建的后台系统

### 功能包含

### 使用说明
需要node 12.18.0 版本及以上
`npm install `

`npm run dev`

### 目录结构规范

```
|-- config  
|    |-- vite              vite插件配置
|    |-- constant.ts       定义常量存放位置
|-- vite.config.ts         vite项目配置
|-- tsconfig.json          ts配置
|-- readConfig.ts          配置文件读取，使用fs模块读取，主要为冷加载无法获取配置文件的地方提供读取配置，比如vite.config.ts中也能实现读取配置文件了
|-- index.html             vue应用挂载入口
|-- public                 文件夹，可放入静态js，css，图片，ico文件等（不参与编译），可直接引入到index.html中的文件放在这里
|-- .env                   环境变量，此文件任何环境下都读取
|-- .env.development       开发环境变量，只有在开发环境会读取
|-- .env.production        生产环境变量，只有在生产环境会读取
|-- src                    业务功能模块
|   |-- api                各给模块的接口导出
|   |-- assets             静态资源模块
|   |-- enum               定义的枚举
|   |-- components         全局组件或使用频繁的组件放到这里
|   |-- hooks              vue3特性的setup封装放到这里，类似react hooks中的useState等，新增的话，请新建相应的文件夹存放，以区分不同模块的hooks，相同的hooks可以统一封装放入hooks下一级目录
|   |-- network            接口请求模块封装
|   |   |-- axios          axios请求工具封装
|   |   |-- request        请求方法的封装
|   |-- router             <路由模块，具体可查看文件夹，新建模块应用，请放入其下modules/目录下，引入到router.cinfig.ts模块下的accessRoutes里>
|   |-- stores              pinia状态管理器
|   |-- styles             公共或全局样式文件可以放到这里
|   |-- types              ts定义导出类型
|   |-- utils              各种工具文件、表达校验文件放到这里
|   |-- views              <各个业务页面、组件放到这里，新建应用页面>
|   |-- App.vue            vue根组件
|   |-- *.d.ts             ts各种类型定义文件
|   └── main.ts            vue入口加载文件         
```

### antdv:
https://www.antdv.com/components/overview


