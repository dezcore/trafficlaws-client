<template>
  <div>
    <v-row>
      <v-col cols="2">
        <v-card height="600" class="overflow-auto">
          <v-list
            nav
            dense
          >
            <v-btn
              outlined
              color="indigo"
              block
              class="mb-2"
              @click="newChat"
            >
              New chat
            </v-btn>
            <v-list-item-group
              v-model="selectedItem"
              color="primary"
            >   
              <v-list-item
                 v-for="(chat, index) in chats"
                :key="chat.title + index"
              >
              <v-list-item-icon>
                <v-icon v-text="'mdi-message'"></v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title v-text="chat.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
      </v-list>
        </v-card>
      </v-col>
      <v-col cols="10">
        <v-card height="600" class="overflow-auto">
          <v-card-text>
            <form>
              <v-row 
                v-for="(conversation, index) in getConversations"
                :key="index"
              >
                <v-col cols="1" class="d-flex justify-end">
                  <v-avatar>
                     <img
                        :src="conversation.src"
                     >
                  </v-avatar>
                </v-col>
                <v-col cols="11">
                  <v-textarea
                    v-model="conversation.comment"
                    :label="conversation.name"
                    outlined
                    :rows="conversation.rows"
                  ></v-textarea>

                </v-col>
              </v-row>
            </form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-textarea
      v-model="chatInput"
      label="Send"
      outlined
      :rows="getRow"
      class="mt-2"
      clear-icon="mdi-close-circle"
      @click:append-outer="setChatInput({key : 'Enter'})"
      @keydown="setChatInput"
    ></v-textarea>
  </div>
</template>

<script>
  import apiMixin from "../mixins/apiMixin"

  export default {
    name: 'OpenAI',
    data () {
      return {
        chatInput : '',
        right: null,
        selectedItem: 0,
        chats : [
          {
            title : 'Default1',
            conversations : []
          }
        ]
      }
    },
    mixins : [
      apiMixin
    ],
    computed : {
      getRow : function() {
        let rows = 1, maxRows = 5

        if(this.chatInput) {
          rows = this.chatInput.split('\n').length
          rows = rows < maxRows ? rows : maxRows
        }
        return rows
      },
      getConversations : function() {
        let conversations = []
        
        if(this.chats) {
          conversations = this.chats[this.selectedItem].conversations
        }

        return conversations
      }
    },
    methods : {
      setChatInput : function(event) {
        if(event && event.key === 'Enter') {
          if(this.chats) {
            this.chats[this.selectedItem].conversations.push({
              name:'User',
              comment : this.chatInput,
              rows : this.chatInput.split('\n').length,
              src : 'https://cdn.vuetifyjs.com/images/john.jpg'
            })
          }
          this.getAiResponse(this.chatInput, (res) => {
            if(res) {
              this.chats[this.selectedItem].conversations.push({
                 name:'Bot',
                comment : res.data,
                rows : res.data.trim().split('\n').length,
                src : 'https://cdn.vuetifyjs.com/images/lists/2.jpg'
              })
            }
            this.chatInput = ''
          })
        }
      },
      newChat : function() {
        if(this.chats) {
          this.chats.push({
            title : 'Default' + (this.chats.length + 1),
            conversations : []
          })
        }
      },
      getAiResponse : function(request, callBack) {
        const parameters = {
          prompt : request
        }

        if(request && parameters) {
          this.getDataByBody(process.env.VUE_APP_API_URL + "/openai/chatgpt/test", parameters, (response) => {
            if(callBack)
              callBack(response)
          })
        }
      }
    }
  }
</script>
