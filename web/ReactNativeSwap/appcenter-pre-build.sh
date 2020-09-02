#! /bin/bash
sudo gem install cocoapods

cd ios  
pod install --repo-update
cd ..