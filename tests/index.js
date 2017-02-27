const chai = require('chai');
const expect = chai.expect;
const config = require('config');
const Redis = require('ioredis');
const redis = new Redis(config.redis);
const pause = require('promise-pause-timeout');
const OFS = require('../index');

const key = 'test';

describe('Offline first storage', () => {

    beforeEach(async () => {
        await redis.del(key);
        await redis.del(`date_${key}`);
    });

    afterEach(async () => {
        await redis.del(key);
        await redis.del(`date_${key}`);
    });

    it('should test getDataFromCache error', async () => {
        const ofs = new OFS({});
        try {
            await ofs.getData();
        } catch (error) {
            expect(error.message).to.be.equal('You should set up "getDataFromCache" method!');
        }
    });

    it('should test getDataFromSource error', async () => {
        const ofs = new OFS({
            async getDataFromCache() {},
        });
        try {
            await ofs.getData();
        } catch (error) {
            expect(error.message).to.be.equal('You should set up "getDataFromSource" method!');
        }
    });

    it('should test setDataToCache error', async () => {
        const ofs = new OFS({
            async getDataFromCache() {},
            async getDataFromSource() {},
        });
        try {
            await ofs.getData();
        } catch (error) {
            expect(error.message).to.be.equal('You should set up "setDataToCache" method!');
        }
    });

    it('should test flow', async () => {
        let isGetDataFromCache = false;
        let isGetDataFromSource = false;
        let isSetDataToCache = false;
        let isGetCacheDate = false;
        let isUpdateCacheDate = false;

        const ofs = new OFS({
            async getDataFromSource() {
                isGetDataFromSource = true;
                return 'test';
            },
            async getDataFromCache() {
                isGetDataFromCache = true;
                return redis.get(key);
            },

            async setDataToCache(data) {
                isSetDataToCache = true;
                await redis.set(key, data);
            },
            async getCacheDate() {
                isGetCacheDate = true;
                return redis.get(`date_${key}`);
            },
            async updateCacheDate() {
                isUpdateCacheDate = true;
                await redis.set(`date_${key}`, (new Date().valueOf() - 100).toString(10));
            },
            ttl: 0,
        });

        const data = await ofs.getData();

        await pause(10);

        expect(isGetDataFromCache).is.true;
        expect(isGetDataFromSource).is.true;
        expect(isSetDataToCache).is.true;
        expect(isGetCacheDate).is.true;
        expect(isUpdateCacheDate).is.true;

        expect(data).to.be.equal('test');
    });

    it('should test flow with cached data', async () => {
        let isGetDataFromCache = false;
        let isGetDataFromSource = false;
        let isSetDataToCache = false;
        let isGetCacheDate = false;
        let isUpdateCacheDate = false;

        const ofs = new OFS({
            async getDataFromSource() {
                isGetDataFromSource = true;
                return 'test';
            },
            async getDataFromCache() {
                isGetDataFromCache = true;
                return redis.get(key);
            },

            async setDataToCache(data) {
                isSetDataToCache = true;
                await redis.set(key, data);
            },
            async getCacheDate() {
                isGetCacheDate = true;
                return redis.get(`date_${key}`);
            },
            async updateCacheDate() {
                isUpdateCacheDate = true;
                await redis.set(`date_${key}`, (new Date().valueOf() - 100).toString(10));
            },
            ttl: 0,
        });

        await redis.set(key, 'test');

        const data = await ofs.getData();

        await pause(10);

        expect(isGetDataFromCache).is.true;
        expect(isGetDataFromSource).is.true;
        expect(isSetDataToCache).is.true;
        expect(isGetCacheDate).is.true;
        expect(isUpdateCacheDate).is.true;

        expect(data).to.be.equal('test');
    });

    it('should test flow with actual data', async () => {
        let isGetDataFromCache = false;
        let isGetDataFromSource = false;
        let isSetDataToCache = false;
        let isGetCacheDate = false;
        let isUpdateCacheDate = false;

        const ofs = new OFS({
            async getDataFromSource() {
                isGetDataFromSource = true;
                return 'test';
            },
            async getDataFromCache() {
                isGetDataFromCache = true;
                return redis.get(key);
            },

            async setDataToCache(data) {
                isSetDataToCache = true;
                await redis.set(key, data);
            },
            async getCacheDate() {
                isGetCacheDate = true;
                return redis.get(`date_${key}`);
            },
            async updateCacheDate() {
                isUpdateCacheDate = true;
                await redis.set(`date_${key}`, new Date().valueOf().toString(10));
            },
            ttl: 1000,
        });

        await redis.set(`date_${key}`, new Date().valueOf().toString(10));

        const data = await ofs.getData();

        await pause(10);

        expect(isGetDataFromCache).is.true;
        expect(isGetDataFromSource).is.true;
        expect(isSetDataToCache).is.true;
        expect(isGetCacheDate).is.true;
        expect(isUpdateCacheDate).is.false;

        expect(data).to.be.equal('test');
    });

    it('should test flow with actual data and small ttl', async () => {
        let isGetDataFromCache = false;
        let isGetDataFromSource = false;
        let isSetDataToCache = false;
        let isGetCacheDate = false;
        let isUpdateCacheDate = false;

        const ofs = new OFS({
            async getDataFromSource() {
                isGetDataFromSource = true;
                return 'test';
            },
            async getDataFromCache() {
                isGetDataFromCache = true;
                return redis.get(key);
            },

            async setDataToCache(data) {
                isSetDataToCache = true;
                await redis.set(key, data);
            },
            async getCacheDate() {
                isGetCacheDate = true;
                return redis.get(`date_${key}`);
            },
            async updateCacheDate() {
                isUpdateCacheDate = true;
                await redis.set(`date_${key}`, new Date().valueOf().toString(10));
            },
            ttl: 1,
        });

        await redis.set(`date_${key}`, new Date().valueOf().toString(10));

        await pause(10);

        const data = await ofs.getData();

        await pause(10);

        expect(isGetDataFromCache).is.true;
        expect(isGetDataFromSource).is.true;
        expect(isSetDataToCache).is.true;
        expect(isGetCacheDate).is.true;
        expect(isUpdateCacheDate).is.true;

        expect(data).to.be.equal('test');
    });

});
