export default {
    state: {
        favoritesChannels : []
    },
    mutations : {
        updateFavoritesChannels(state, favoritesChannels) {
            state.favoritesChannels = favoritesChannels
        }
    }
}
