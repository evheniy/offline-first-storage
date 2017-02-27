const debug = require('debug')('storage');

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
                async getCacheDate() {},
                async updateCacheDate() {},
                ttl: 86400, // 24 hours
            },
            config
        );
    }

    async getData() {
        debug('Get data from cache');
        let data = await this.config.getDataFromCache();
        debug(data);

        if (!data) {
            debug('Get data from source');

            data = await this.config.getDataFromSource();
            await this.config.setDataToCache(data);

            debug('Updating date');
            await this.config.updateCacheDate();

        } else {

            setTimeout(
                async () => {
                    debug('Checking actual date');

                    const timeNow = new Date().valueOf();
                    debug('Time now: %s', timeNow);

                    const time = await this.config.getCacheDate();
                    debug('Cached time: %s', time);

                    const timeWithTTL = ((parseInt(time, 10) || new Date().valueOf()) + parseInt(this.config.ttl, 10));
                    debug('Time with TTL: %s', timeWithTTL);

                    const isDateActual = timeWithTTL > new Date().valueOf();
                    debug(isDateActual);

                    if (!isDateActual) {

                        debug('Updating data');
                        await this.config.setDataToCache(
                            await this.config.getDataFromSource()
                        );

                        debug('Updating date');
                        await this.config.updateCacheDate();
                    }
                },
                0
            );
        }

        debug(data);

        return data;
    }
};
