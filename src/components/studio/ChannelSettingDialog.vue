<template>
  <div>
    <v-data-table
    :headers="headers"
    :items="getChannels"
    :page.sync="page"
    :items-per-page="itemsPerPage"
    hide-default-footer
    class="elevation-1"
    @page-count="pageCount = $event"
  >
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
  <div class="text-center pt-2">
    <v-pagination
      v-model="page"
      :length="pageCount"
    ></v-pagination>
  </div>

   <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.title"
                      label="Channel title"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      outlined
                      disable
                      name="Description"
                      label="Description"
                      :value="editedItem.description"
                    ></v-textarea>

                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="editedItem.category"
                      :items="categories"
                      label="Category : "
                      item-text="category"
                      item-value="category"
                      outlined
                      multiple
                      return-object
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </div>
</template>
<script>
  export default {
    name: 'ChannelSettingDialog',
    components : {},
    props : {
      favoritesChannels : {
        type : Array,
        default : () => {}
      },
      setFavoritesChannel : {
        type : Function,
        default : () => {}
      },
      config : {
        type : Object,
        default : ()=>{return null}
      }
    },
    data () { 
      return {
        selected : [],
        categories : [
          "Info",
          "Sport",
          "Gospel",
          "Découverte"
        ],
        progress: 0,
        dialog: false,
        page: 1,
        pageCount: 0,
        itemsPerPage: 10,
        dialogDelete: false,
        headers: [
          {
            text: 'title',
            align: 'start',
            sortable: false,
            value: 'title',
          },
          { text: 'Category', value: 'category' },
          {text: 'Actions', value: 'actions', sortable: false }
        ],
        channels : [],
        editedIndex: -1,
        editedItem: {
          id : '1',
          title: '',
          description : '',
          category :''
        },
        defaultItem: {
          id : '2',
          title: '',
          description : '',
          category :''
        }
      }
    },
    computed : {
      getChannels : function() {
        return Object.assign([], this.channels)
      }
    },
    watch : {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
      favoritesChannels : {
        handler : function() {
          this.channels = this.favoritesChannels
          this.setFavoritesChannel(this.channels)
        },
        immediate : true
      },
      config : {
        handler : function() {
          if(this.config && this.config.categories)
            this.categories = this.config.categories
        },
        deep : true,
        immediate : true
      }
    },
    methods : {
      editItem (item) {
        this.editedIndex = this.channels.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        this.editedIndex = this.channels.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      deleteItemConfirm () {
        this.channels.splice(this.editedIndex, 1)
        this.setFavoritesChannel(this.channels)
        this.closeDelete()
      },
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      save () {
        if(this.editedIndex > -1) {
          Object.assign(this.channels[this.editedIndex], this.editedItem)
          this.channels =  Object.assign([], this.channels)
          this.setFavoritesChannel(this.channels)
        } 
        this.close()
      }
    }
  }
</script>
