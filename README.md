# aCrownFunding
AlgorandHackThon



## 介绍
本项目为基于Algorand区块链的众筹项目

Google slide:https://docs.google.com/presentation/d/1_4ro9mAll4cQzBRRchwaoKHq8_oxEIEwCmYZ2HFh4Qs/edit?usp=sharing

## 安装
目前仅有dev版本
- 安装 `node.js@latest`，`Python3`，`Pyteal`，安装后运行 `python3 funder.py` 以编译合约。
- 将生成的 `approval.teal`,`clear.teal`,`escrow.teal`复制到 `express` 目录下
- 在express目录下使用 `yarn run start` 启动后端。
- 在crown_funding 目录下使用 `yarn run start` 启动前端。访问前端地址。

## 使用条件
浏览器安装 algosigner
