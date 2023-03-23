export default {
    state: {
        cutsCpt : {value : 0},
        currentPlayList : [],
        favoritesChannels : [],
        selectCuts : {state : false},
        clearCuts : {state : false}
    },
    mutations : {
        updateCutsCpt(state, cutsCpt) {
            state.cutsCpt = cutsCpt
        },
        updateClearCuts(state, clearCuts) {
            state.clearCuts = clearCuts
        },
        updateSelectCuts(state, selectCuts) {
            state.selectCuts = selectCuts
        },
        updateCurrentPlayList(state, currentPlayList) {
            state.currentPlayList = currentPlayList
        },
        updateFavoritesChannels(state, favoritesChannels) {
            state.favoritesChannels = favoritesChannels
        }
    }
}
