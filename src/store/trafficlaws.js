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
            const tokens = localStorage.getItem('tokens')
            const credential = localStorage.getItem('credential')

            if(credential && credential !== 'null')
                commit('updateCredential', localStorage.getItem('credential'))
                
            if(tokens && tokens !== 'null')
                commit('updateTokens', JSON.parse(localStorage.getItem('tokens')))
        }
    }
}
