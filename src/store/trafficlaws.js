export default {
    state: {
        user : null,
        searchField : '',
        responses : {}
    },
    mutations : {
        updateUser(state, user) {
            state.user = user
        },
        updateSearchField(state, searchField) {
            state.searchField = searchField
        },
        updateResponses(state, responses) {
            state.responses = responses
        }
    }
}
