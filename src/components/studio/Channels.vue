<template>
<v-card height="500" class="overflow-auto">
    <v-tabs
      v-model="tab"
      dark
    >
      <v-tab>
        Channels
      </v-tab>
      <v-tab>
        Favorites 
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card class="mx-auto">
          <v-container fluid>
            <v-row dense>
              <v-col
                v-for=" (item, index) in currentChannels"
                :key="item.id + index"
                :cols="3"
              >
                <v-card>
                  <v-img
                    :src="item.src"
                    class="white--text align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px"
                    @click="switchChannel(item)"
                  >
                  </v-img>
                  <v-card-title class="pa-1">
                    <div class="headerClass">
                      {{item.title}}
                    </div>
                </v-card-title>
                  <v-card-text>
                    <v-row align="center">
                      <v-btn icon>
                        <v-icon size="24px" v-if="item.favorite" @click="setFavorite(item)">
                          mdi-star
                        </v-icon>
                        <v-icon size="24px" v-else @click="setFavorite(item)">
                          mdi-star-outline
                        </v-icon>
                      </v-btn>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
        </v-container>
      </v-card>
    </v-tab-item>
    <v-tab-item>
       <v-card class="mx-auto">
          <v-container fluid>
            <v-row dense>
              <v-col
                v-for=" (item, index) in favoritesChannels"
                :key="item.id + index"
                :cols="3"
              >
                <v-card>
                  <v-img
                    :src="item.src"
                    class="white--text align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px"
                    @click="switchChannel(item)"
                  >
                  </v-img>
                  <v-card-title class="pa-1">
                    <div class="headerClass">
                      {{item.title}}
                    </div>
                </v-card-title>
                 <v-card-text>
                    <v-row align="center">
                      <v-btn icon>
                        <v-icon size="24px" v-if="item.favorite" @click="removeFavorite(item, true)">
                          mdi-star
                        </v-icon>
                      </v-btn>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
        </v-container>
      </v-card>
  </v-tab-item>
</v-tabs-items>
  <FloatDialog 
    title="EditCut" 
    :showDialog="dialog"
    :setShowDialog="setShowDialog"
  >
    <template #form="{dialog}">
      <EditCutForm 
        :save="save"
        :dialog="dialog"
        :editedItem="editedItem"
      />
    </template>
  </FloatDialog>
</v-card>
</template>

<script>
  import EditCutForm from "../studio/EditCutForm.vue"
  import FloatDialog from "../studio/FloatDialog.vue"

  export default {
    name: 'Channels',
    components : {
      EditCutForm,
      FloatDialog
    },
    props : {
      setView : {
        type : Function,
        default : () => {}
      },
      channels : {
        type : Array,
        default : ()=>{return []}
      },
      addFavoriteChannel : {
        type : Function,
        default : () => {}
      }, 
      getFile : {
        type : Function,
        default : () => {}
      }
    },
    watch : {
      channels : {
        handler: function() {
          this.setFavorites()
        },
        immediate : true
      }
    },
    data () {
      return {
        tab: null,
        cuts : [],
        selected: [],
        dialog : false,
        editedItem : {},
        editedIndex: -1,
        defaultItem: {},
        currentChannels : [],
        favoritesChannels : []
      }
    },
    mounted() {
      this.initFavorites()
    },
    methods : {
       setFavorites : function() {
        if(this.channels) {
          this.currentChannels = this.channels.map((channel) => {
            if(this.favoritesChannels.some(chnl => channel.id === chnl.id))
              channel.favorite = true

            return channel
          })
        }
      },
      initFavorites : function() {
        this.getFile("favorite", (favorites) => {
          if(favorites) {            
            this.favoritesChannels = favorites.map((channel) => {
              return {...channel, favorite : true}
            })

            this.setFavorites()
          }
        })
      },
      addChannels : function() {
        if(this.selected) {
          this.addFavoriteChannel(this.selected)
        }
      },
      removeFavorite : function(item, force) {
        let favorites, channels

        if((!item.favorite || force) && this.favoritesChannels.some(channel => channel.id === item.id)) {
          channels = Object.assign([], this.channels)
          favorites = Object.assign([], this.favoritesChannels)
          this.favoritesChannels = favorites.filter(channel => channel.id !== item.id)
          this.channels = channels.map((channel) => {
            if(channel.id === item.id)
              channel.favorite = false
            return channel
          })
        }
      },
      updateFavorite : function(item) {
        if(item.favorite && !this.favoritesChannels.some(channel => channel.id === item.id)) {
          this.favoritesChannels.unshift(Object.assign({}, item))
        } else {
          this.removeFavorite(item)
        }
      },
      setFavorite : function(item) {
        if(item) {
          this.currentChannels = this.currentChannels.map((channel) => {
            if(channel.id === item.id) {
              channel.favorite = item.favorite ? !item.favorite : true
              item.favorite = channel.favorite
            }
            return channel
          })
          this.updateFavorite(item)
        }
      },
      switchChannel : function(item) {
        if(item) {
          this.setView('videosView', item.id)
        }
      },
      setShowDialog : function() {
        this.dialog = !this.dialog
      },
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      save(editedItem) {
        if(this.editedIndex > -1) {
          Object.assign(this.cuts[this.editedIndex], editedItem)
        } else {
          this.cuts.push(editedItem)
        }
        this.close()
      }
    }
  }
</script>

<style scoped>
.headerClass{
  white-space: nowrap ;
  word-break: normal;
  overflow: hidden ;
  text-overflow: ellipsis;
}
</style>
