<template>
<div>
  <v-row>
    <v-col
      cols="9"
    >
      <v-select
        item-disabled
        v-model="selected"
        :items="defaultCategories"
        label="Categories"
        outlined
        @click="close"
      ></v-select>
    </v-col>
    <v-col cols="3">
      <div class="mt-3 ml-2">
        <v-icon  @click="deleteItem">mdi-delete</v-icon>
        <v-menu 
          offset-y
          v-model="menuDialog"
          :close-on-click="false"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon  v-bind="attrs" v-on="on">mdi-plus</v-icon>
          </template>
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Category
            </v-card-title> 
            <v-form>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="category"
                    label="Category"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                color="primary"
                text
                @click="add"
              >
                Add
              </v-btn>
              <v-btn
                color="primary"
                text
                @click="close"
              >
                Close
              </v-btn>
            </v-card-actions>    
          </v-card>
        </v-menu>
      </div>
    </v-col>
  </v-row>
</div>
</template>
<script>

  export default {
    name: 'CategoriesForm',
    components : {},
    props : {
      categories : {
        type : Array,
        default : () => { return []}
      },
      setCategories : {
        type : Function,
        default : () => {}
      }
    },
    data () { 
      return {
        selected : null,
        category : null,
        menuDialog : false,
        defaultCategories : []   
      }
    },
    watch : {
      categories : {
        handler : function() {
          if(this.categories) {
            this.defaultCategories = this.categories
          }
        },
        immediate : true
      }
    },
    methods : {
      close : function() {
        if(this.menuDialog) {
          this.category = null
          this.menuDialog = false 
       }
      },
      add : function() {
        if(this.defaultCategories && !this.defaultCategories.some(category => category === this.category)) {
          this.defaultCategories.push(this.category)
          this.setCategories(this.defaultCategories)
          this.close()
        } else {
          console.log("Item exist")
        }
      },
      deleteItem : function() {
        if(this.selected) {
          this.defaultCategories = this.defaultCategories.filter(category => category !== this.selected)
          this.setCategories(this.defaultCategories)
        }
      }
    }
  }
</script>
