import axios from 'axios';
import * as Bitquery from './bitquery';

const lastBarsCache = new Map();
const configurationData = {
    supports_marks: false,
    supports_timescale_marks: false,
    supports_time: true,
    supported_resolutions: [
        '1', '3', '5', '15', '30', '60', '120', '240', '1D', '3D', '1W', '1M'
    ]
};

export default {
    // This method is used by the Charting Library to get a configuration of your datafeed
    // (e.g. supported resolutions, exchanges and so on)
    onReady: (callback) => {
        console.log('[onReady]: Method called!!');
        setTimeout(() => callback(configurationData));
    },

    resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) =>{
        console.log('[resolveSymbol]: Method called!!');
        const response = await axios.post(
            Bitquery.endpoint, {
                query: Bitquery.GET_COIN_INFO,
                variables: {
                    "tokenAddress": symbolName
                },
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": "BQYyGwlM3uQRKbNrPS01UwFpoDHrTaEq"
                }
            }
        );
        // const coin = response.data.data.ethereum.dexTrades[0].baseCurrency;
        // console.log(response.data.data.ethereum.dexTrades[0].quotePrice);
        console.log(response.data.data.ethereum.dexTrades[0].baseCurrency);

        const coin = response.data.data.ethereum.dexTrades[0].baseCurrency;
        if(!coin){
            onResolveErrorCallback();
        }else{
            const symbol = {
                ticker: symbolName,
                name: `${coin.symbol}/USD`,
                session: '24x7',
                timezone: 'Etc/UTC',
                minmov: 1,
                pricescale: 10000000,
                has_intraday: true,
                intraday_multipliers: ['1', '5', '15', '30', '60'],
                has_empty_bars: true,
                has_weekly_and_monthly: false,
                supported_resolutions: configurationData.supported_resolutions,
                volume_precision: 1,
                data_status: 'streaming',
            }
            //onSymbolResolvedCallback(symbol);
            onSymbolResolvedCallback(symbol)
        }
    },

}

