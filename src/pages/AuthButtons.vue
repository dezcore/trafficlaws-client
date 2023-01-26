<template>
  <div>
    <v-toolbar dense floating color="primary" v-if="getUser">   
      <span class="white--text" @v-on:click="signOut">Logout</span>
        <v-divider class="mx-2" vertical></v-divider>
        <v-menu
          min-width="200px"
          rounded
          offset-y
         >
          <template v-slot:activator="{ on }">
            <v-btn icon  v-on="on" class="white--text">
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>
            <v-card>             
             <v-list-item-group>
               <v-list-item>
                 <v-list-item-icon>
                  <v-icon v-text="'mdi-account-details'"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="getUser.name"></v-list-item-title>
                </v-list-item-content>
               </v-list-item>
               <v-divider></v-divider>
               <v-list-item>
                 <v-list-item-icon>
                  <v-icon v-text="'mdi-logout'"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="'Logout'" v-on:click="signOut"></v-list-item-title>
                </v-list-item-content>
               </v-list-item>
             </v-list-item-group>
            </v-card>
         </v-menu>
      </v-toolbar>
      <v-toolbar dense floating color="primary" v-else>   
        <span class="white--text" @v-on:click="signOut">Login</span>
        <v-divider class="mx-2" vertical></v-divider>
        <v-btn icon class="white--text" @v-on:click="signOut">
          <v-icon> mdi-login-variant</v-icon>
        </v-btn>
      </v-toolbar>
    </div>
</template>
<script>
import {
  signOut, 
} from "./../youtube/index"
import apiMixin from "./../mixins/apiMixin"

  export default {
    name: 'AuthButtons',
    data: () => ({

    }),
    mixins : [
      apiMixin
    ],
    computed : {
      getUser() {
        let user = JSON.parse(window.localStorage.getItem('user'))
        return user && user.name ? user : null
      }
    },
    methods : {
      signOut
    }
  }
</script>
