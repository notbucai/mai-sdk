# mai: JavaScript stack trace

[![build status](https://img.shields.io/travis/CurtisCBS/monitor/master.svg?style=flat-square)](https://travis-ci.org/CurtisCBS/monitor)
[![npm version](https://img.shields.io/npm/v/mai.svg?style=flat-square)](https://www.npmjs.com/package/mai)
[![npm downloads](https://img.shields.io/npm/dm/mai.svg?style=flat-square)](https://www.npmjs.com/package/mai)

## 简介

通过对 error 事件的监听，获取异常相关信息并缓存，在一定时间之后报告处理。

## 功能

捕获页面 JavaScript 异常报错，捕获异常类型包含:

1. JavaScript runtime 异常捕捉 √
2. 静态资源 load faided 异常捕捉 √
3. console.error 的异常捕获 √
4. try..catch 错误捕获 √
5. 记录静态资源加载时长

## 实现概述

* 通过对 [`window.onerror`](https://developer.mozilla.org/en/docs/Web/API/GlobalEventHandlers/onerror) 进行监听，捕获 JavaScript 的运行时异常，记录错误：event + 错误来源(source) + 错误行数 + 错误列数等数据
* 通过对 `window.addEventListener` 监听 `error` 事件类型，获取静态资源报错，包含 JavaScript 文件，CSS 文件，图片，视频，音频。
* 主要针对 vue 的异常捕获，重写了 `console.error` 事件，在捕获异常先记录错误信息的描述，再 `next` 到原始的 `console.error`
* 提供包装函数对其进行 try..catch 包装，捕获异常并处理

## 使用指南

### Example

#### script mode

```html
<script src="../dist/mai.js"></script>

<script>
  mai.init({
    delay: 1000,
    maxError: 10,
    sampling: 1,
    report: function(errorLogs) {
      console.table(errorLogs)
    }
  })
</script>
```

#### module mode

1.安装

```sh
npm install mai --save
```

2.在文件中添加

```javascript
import mai from 'mai'

mai.init({
  concat: false,
  report: function(errorLogs) {
    // console.log('send')
  }
})
```

### API

| 字段       | 描述                | 类型       | 默认值                                     | 备注                      |
| -------- | ----------------- | -------- | --------------------------------------- | ----------------------- |
| concat   | 是否延时处理，默认延时 2s 处理 | Boolean  | `true`                                  |                         |
| delay    | 错误处理间隔时间，单位 ms    | Number   | `2000`                                  | 当 `concat` 为 `false` 无效 |
| maxError | 一次处理的异常报错数量限制     | Number   | `16`                                    | 当 `concat` 为 `false` 无效 |
| sampling | 采样率               | Number   | `1`                                     | 0 - 1 之间                |
| report   | 错误报告函数            | Function | `errorLogs => console.tabel(errorLogs)` | `errorLogs` 定义见下述说明     |

#### 关于 errorLogs：

```javascript
[
  {
    type: 1, // 参考错误类型
    desc: '', // 错误描述信息
    stack: 'no stack', // 堆栈信息。无堆栈信息时返回 'no stack'
  },
  // ...
]
```

#### 错误类型

```javascript
var ERROR_RUNTIME = 1
var ERROR_SCRIPT = 2
var ERROR_STYLE = 3
var ERROR_IMAGE = 4
var ERROR_AUDIO = 5
var ERROR_VIDEO = 6
var ERROR_CONSOLE = 7
var ERROR_TRY_CATCH = 8
```

### try..catch 捕获

mai 暴露出一个 `tryJS` 对象，可以处理 try..catch 包裹等

#### 将函数使用 try..catch 包装

```javascript
import mai from 'mai';

this.handleSelect = mai.tryJS.wrap(this.handleSelect);
```

#### 只包装参数

```javascript
function test(type, callback) {
  // ...
  callback()
}

(mai.tryJS.wrapArgs(test))(4, function() {
  a = b
})
```

这时候只对参数进行 try..catch 包装

## 后续功能

记录性能数据，包含:

* 记录 pv 和 uv
* 记录页面加载时长

performance api 兼容性情况 (看到 no support 绝望，iOS不可用！)

| Chrome | Edge | Firefox (Gecko) | Internet Explorer | Opera | Safari (WebKit) |
| ------ | ---- | --------------- | ----------------- | ----- | --------------- |
| 43.0   | yes  | 41              | 10                | 33    | No support      |
