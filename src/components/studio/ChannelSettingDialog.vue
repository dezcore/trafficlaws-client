<template>
  <div>
    <v-data-table
    :headers="headers"
    :items="currentChannels"
    :page.sync="page"
    :items-per-page="itemsPerPage"
    hide-default-footer
    class="elevation-1"
    @page-count="pageCount = $event"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
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
                      v-model="editedItem.name"
                      label="Channel name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="selected"
                      :items="categories"
                      name="category"
                      item-text="category"
                      item-value="category"
                      attach
                      chips
                      label="Category : "
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
      </v-toolbar>
    </template>
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
  </div>
</template>
<script>
  export default {
    name: 'ChannelSettingDialog',
    components : {},
    props : {
      channels : {
        type : Array,
        default : () => {}
      },
    },
    data () { 
      return {
        selected : [],
        categories : [
          "Info",
          "Sport",
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
            text: 'channel',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          { text: 'Category', value: 'category' },
          {text: 'Actions', value: 'actions', sortable: false }
        ],
        currentChannels : [],
        editedIndex: -1,
        editedItem: {
          name: '',
          category :''
        },
        defaultItem: {
          name: '',
          category :''
        }
      }
    },
    watch : {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
      channels : {
        handler : function() {
          console.log("channels : ", this.channels)
        },
        immediate : true
      }
    },
    created () {
      this.initialize()
    },
    methods : {
      initialize () {
        this.currentChannels = [
          {
            name : 'Channel1',
            category :'Sport'
          }
        ]
      },
      editItem (item) {
        this.editedIndex = this.currentChannels.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        this.editedIndex = this.currentChannels.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      deleteItemConfirm () {
        this.currentChannels.splice(this.editedIndex, 1)
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
        if (this.editedIndex > -1) {
          Object.assign(this.currentChannels[this.editedIndex], this.editedItem)
        } else {
          this.currentChannels.push(this.editedItem)
        }
        this.close()
      }
    }
  }
</script>
