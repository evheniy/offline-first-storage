# Offline first storage


Offline first logic for yor application

[![NPM](https://nodei.co/npm/offline-first-storage.png)](https://npmjs.org/package/offline-first-storage)

[![npm version](https://badge.fury.io/js/offline-first-storage.svg)](https://badge.fury.io/js/offline-first-storage)
[![Build Status](https://travis-ci.org/evheniy/offline-first-storage.svg?branch=master)](https://travis-ci.org/evheniy/offline-first-storage)
[![Coverage Status](https://coveralls.io/repos/github/evheniy/offline-first-storage/badge.svg?branch=master)](https://coveralls.io/github/evheniy/offline-first-storage?branch=master)
[![Linux Build](https://img.shields.io/travis/evheniy/offline-first-storage/master.svg?label=linux)](https://travis-ci.org/evheniy/)
[![Windows Build](https://img.shields.io/appveyor/ci/evheniy/offline-first-storage/master.svg?label=windows)](https://ci.appveyor.com/project/evheniy/offline-first-storage)

[![Dependency Status](https://david-dm.org/evheniy/offline-first-storage.svg)](https://david-dm.org/evheniy/offline-first-storage)
[![devDependency Status](https://david-dm.org/evheniy/offline-first-storage/dev-status.svg)](https://david-dm.org/evheniy/offline-first-storage#info=devDependencies)
[![NSP Status](https://img.shields.io/badge/NSP%20status-no%20vulnerabilities-green.svg)](https://travis-ci.org/evheniy/offline-first-storage)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/evheniy/offline-first-storage/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/evheniy/offline-first-storage.svg)](https://github.com/evheniy/offline-first-storage/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/evheniy/offline-first-storage.svg)](https://github.com/evheniy/offline-first-storage/network)
[![GitHub issues](https://img.shields.io/github/issues/evheniy/offline-first-storage.svg)](https://github.com/evheniy/offline-first-storage/issues)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/evheniy/offline-first-storage.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)


## How to install

    npm i -S offline-first-storage
    
## How to use

    const OFS = require('offline-first-storage');
    
    const cache = new OFS({
        async getDataFromSource() {},
        async getDataFromCache() {},
        async setDataToCache(data) {},
        async getCacheDate() {},
        async updateCacheDate() {},
        timeoutErrorHandler(error) {},
        ttl: 86400, // 24 hours
    });
    
    const data = await cache.getData();
    
## ioredis example
    
    const Redis = require('ioredis');
    const redis = new Redis();
    
    const key = 'test';

    const cache = new Ofs({
        async getDataFromSource() {
            return test;
        },
        async getDataFromCache() {
            return redis.get(key);
        },
        async setDataToCache(data) {
            await redis.set(key, data);
        },
        async getCacheDate() {
            return redis.get(`date_${key}`);
        },
        async updateCacheDate() {
            await redis.set(`date_${key}`, new Date().valueOf());
        },
        timeoutErrorHandler(error) {
            debug(error);
        },
        ttl: 86400,
    });
    
    const data = await cache.getData();

    
## Links

* [ioredis](https://github.com/luin/ioredis) - promise based node.js redis client
* [config](https://github.com/lorenwest/node-config) - node.js config
* [debug](https://github.com/visionmedia/debug) - node.js debugging utility