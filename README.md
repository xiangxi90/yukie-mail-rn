# Todo

* [ ] 消息推送
* [ ] 登录页
* [ ] 读信页
* [ ] onboard逻辑
* [ ] oauth登录支持
* [ ]

通信方式

* rust暴露jni
* 


# React Native

## 数据

1. 全局导航页，外观等全局都跟随刷洗的数据存储于context中，并且会做持久化
2. 邮件数据等，使用reducer，在第一次调用后存储于内存中，并通过定义好的hook来进行数据更新以及与rust通信，最终由rust做本地持久化
3. 所有数据都只在本地运行


# Rust
