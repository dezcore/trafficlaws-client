import jwt_decode from "jwt-decode"

export default {
    state: {
        tokens : null,
        searchField : '',
        responses : {},
        credential : null
    },
    mutations : {
        updateTokens(state, tokens) {
            state.tokens = tokens
        },
        updateSearchField(state, searchField) {
            state.searchField = searchField
        },
        updateResponses(state, responses) {
            state.responses = responses
        },
        updateCredential(state, credential) {
            state.credential = credential === null ? credential : jwt_decode(credential)
        }
    },
    actions : {
        fetchCredential({ commit }) {
            if(localStorage.getItem('credential'))
                commit('updateCredential', localStorage.getItem('credential'))

            if(localStorage.getItem('tokens'))
                commit('updateTokens', JSON.parse(localStorage.getItem('tokens')))
        }
    }
}
