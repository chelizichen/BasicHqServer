#!/bin/bash  

readonly ServerName="BasicHqServer"
rm -r ./build
rm ./$ServerName.tar.gz
mkdir ./build

npm run build

cp ./sgrid.yml ./build/
cp package.json ./build/
cp package-lock.json ./build/
cp -r ./views/ ./build/views/
cp -r ./public/ ./build/public/
cd build 
npm i --production

tar -cvf $ServerName.tar.gz ./*

mv $ServerName.tar.gz ../
