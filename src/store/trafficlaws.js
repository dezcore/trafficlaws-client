import jwt_decode from "jwt-decode"

export default {
    state: {
        tokens : null,
        searchField : '',
        responses : {},
        vResponse : null,
        credential : null,
        userResponses: null,
        showResponse : false, 
        defaultResponses : [],
        playerReady : {state : false},
    },
    mutations : {
        updateTokens(state, tokens) {
            state.tokens = tokens
        },
        updatePlayerReady(state,  playerReady) {
            state.playerReady = playerReady
        },
        updateSearchField(state, searchField) {
            state.searchField = searchField
        },
        updateShowResponse(state, showResponse) {
            state.showResponse = showResponse
        },
        updateResponses(state, responses) {
            state.responses = responses
        },
        updateCredential(state, credential) {
            state.credential = credential === null ? credential : jwt_decode(credential)
        },
        updateVResponse : function(state, vResponse) {
            state.vResponse = Object.assign({}, vResponse)
        },
        updateUserResponses(state, userResponses){
            state.userResponses = Object.assign({}, userResponses)
        },
        updateDefaultResponses(state, defaultResponses) {
            state.defaultResponses =  Object.assign([], defaultResponses)
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
