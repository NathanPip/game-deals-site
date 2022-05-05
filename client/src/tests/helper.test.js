import { convertIDs, filterActive, filterGames, timeConverter } from '../helpers/helperFunctions';
import { gamesListTest, storesTest } from './test-data';


//convert Ids test
test('converts an array of id objects into a query parameter string', () => {
    const ids = [{game_id: "abc"}, {game_id: "def"}, {game_id: "ghi"}];
    expect(convertIDs(ids)).toBe("abc,def,ghi")
})

//filterActive stores test
test('filters out stores that are innactive', () => {
    const filteredStores = filterActive(storesTest);
    expect(filteredStores.length).toBeTruthy();
    for(let store of filteredStores) {
        expect(store.isActive).toBe(1);
    }
})

//tests to make sure titles are filtered out
test('filters games with duplicate titles out', () => {
    const filteredGames = filterGames(gamesListTest);
    const titles = gamesListTest.map(game => {
        return game.title;
    })
    const filteredTitles = filteredGames.map(game => {
        return game.title;
    })
    expect(filteredTitles).toEqual([... new Set(titles)]);
})

//tests the timeConverter function
test('converts epoch time to date string', () => {
    expect(timeConverter(1621407600)).toBe('May 19 2021');
})