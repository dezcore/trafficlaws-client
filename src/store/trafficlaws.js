import jwt_decode from "jwt-decode"

export default {
    state: {
        searchField : '',
        responses : {},
        credential : null
    },
    mutations : {
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
        }
    }
}
