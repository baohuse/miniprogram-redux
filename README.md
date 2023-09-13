# miniprogram-redux

`miniprogram-redux` 是一个可以将智能小程序页面和组件连接到 Redux 的库。它提供了订阅 store、检查更新数据和触发重新渲染的功能。


## 安装

```shell
yarn add @tuya-miniapp/miniprogram-redux
```

## 使用方法


```javascript
// app.js
import { setGlobalStore, connectPage, connectComponent } from '@tuya-miniapp/miniprogram-redux';
import { store } from 'path/to/store';

setGlobalStore(store);

// 挂载在全局下，方便使用

if(typeof wx === 'object'){
  wx.ConnectPage = connectPage;
  wx.ConnectComponent = connectComponent;
}

App({
    ...
})
```

###  在Page 中使用

```javascript
import { connectPage } from '@tuya-miniapp/redux-connect-page';

wx.ConnectPage({
  onLoad: function() {
    // 页面特定逻辑
  },
  ...
}, 
/* mapStateToData */
(state) => {
  /** 从 store 中选择当前页面所需的状态 */
  const xx = selectXX();
  return {
    xx,
  }
}, 
/* mapDispatchToMethods */
(dispatch) => ({
  dispatch
}))
```

###  在 Component 中使用

```javascript
import { connectComponent } from '@tuya-miniapp/redux-connect-page';

wx.ConnectComponent({
  properties: {
    // 组件属性
  },
  data: {
    // 组件数据
  },
  lifetimes: {
    // 组件生命周期方法
  },
  methods: {
    // 组件方法
  },
  ...
}, 
/* mapStateToData */
(state) => {
  /** 从 store 中选择当前组件所需的状态 */
  const xx = selectXX();
  return {
    xx,
  }
}, 
/* mapDispatchToMethods */
(dispatch) => ({
  dispatch
}))

```