const debug = require('debug')('ofs');

module.exports = class {
    constructor(config) {

        debug('Storage created');
        debug(config);

        this.config = Object.assign(
            {
                async getDataFromSource() {
                    throw new Error('You should set up "getDataFromSource" method!');
                },
                async getDataFromCache() {
                    throw new Error('You should set up "getDataFromCache" method!');
                },
                async setDataToCache() {
                    throw new Error('You should set up "setDataToCache" method!');
                },
                async getCacheDate() {
                    return new Date().valueOf();
                },
                async updateCacheDate() {},
                ttl: 86400, // 24 hours
            },
            config
        );
    }

    async getData() {
        let data = await this.config.getDataFromCache();

        if (!data) {
            data = await this.config.getDataFromSource();
            await this.config.setDataToCache(data);
        }

        setTimeout(
            async () => {
                const time = await this.config.getCacheDate();

                if (new Date().valueOf() > ((time || 0) + this.config.ttl)) {

                    await this.config.setDataToCache(
                        await this.config.getDataFromSource()
                    );

                    await this.config.updateCacheDate();
                }
            },
            0
        );

        return data;
    }
};
