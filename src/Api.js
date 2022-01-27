import useFetch from './useFetch.js'

const optionsToString = (options) => {
    if(!options) return '';
    let string = "";
    for(let i=0; i<options.length; i++) {
        string += `?${options[i].key}=${options[i]}`;
    }
    return string;
}


const ApiMethods = {
    GetGameDeals: async (options) => {
        const optionsUrl = optionsToString(options);
        const list = useFetch(`https://www.cheapshark.com/api/1.0/deals${optionsUrl}`);
        return list;
    },
    GameLookUp: async (value) => {
        return useFetch(`https://www.cheapshark.com/api/1.0/games?title=${value}`)
    },
    GetGame: async (id) => {
        return useFetch(`https://www.cheapshark.com/api/1.0/games?id=${id}`);
    }
}

export default ApiMethods;