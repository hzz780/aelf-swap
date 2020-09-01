#!/usr/bin/env bash
cd ~/.cocoapods/repos 
pod repo remove master
git clone https://mirrors.tuna.tsinghua.edu.cn/git/CocoaPods/Specs.git master

cd -
cd ios  
pod install --repo-update
cd ..