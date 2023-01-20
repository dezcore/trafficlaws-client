<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      flat
      v-if="loginAppBar"
    >
    </v-app-bar>
    <v-app-bar
      app
      color="primary"
      flat
      v-else
    >
      <v-app-bar-nav-icon @click.stop="drawer1 = !drawer1"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-responsive max-width="260">
        <v-text-field
          hide-details
          rounded
          clearable
          label="Search"
          v-model="searchField"
          append-outer-icon="mdi-magnify"
          color="black"
          background-color="white"
          @click:append-outer="setSearchField({key : 'Enter'})"
          @keydown="setSearchField"
        ></v-text-field>
      </v-responsive>
      <v-spacer></v-spacer>
      <v-row justify="center">
        <AuthButtons/>
      </v-row>
    </v-app-bar>
    
    <v-navigation-drawer
      v-model="drawer1"
      absolute
      bottom
      temporary
      >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item link v-for="link in links" :key="link.label" :to="link.to">
            <v-list-item-icon>
              <v-icon>{{link.icon}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{link.label}}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <div id="app">
        <v-container>
          <router-view></router-view>
        </v-container>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import {
  getAuthCode, 
  clearSession
} from "./youtube/index"
import { mapActions } from 'vuex'
import apiMixin from "./mixins/apiMixin"
import AuthButtons from "./pages/AuthButtons.vue"

export default {
  name: 'App',
  components : {
    AuthButtons
  },
  data: () => ({
    totalTabs : 0,
    searchField : '',
    currentRoute : '',
    currentUser : null,
    links: [
      {label : 'Formations', to : '/formations', icon: 'mdi-school' },
      {label : 'TrafficLaws', to : '/autocodes', icon: 'mdi-traffic-cone' },
      {label : 'Projects', to : '/projects', icon: 'mdi-folder' },
      {label : 'Models', to : '/models', icon: 'mdi-vector-square-edit' },
      {label : 'Algorithms', to : '/algorithms', icon: 'mdi-file-code'}
    ],
    drawer: false,
    drawer1: false,
    mini: true,
  }),
  watch : {
    $route : function(to) {
      if(to) 
        this.currentRoute = to.path.replace('/', '')
        this.searchField = ''
    }
  },
  computed : {
    loginAppBar : function() {
      return window.location.href.includes('/login')
    }
  },
  mixins : [
    apiMixin
  ],

  created() {
    this.fetchCredential()
    //this.closeTabHandler()
  },
  methods : {
    getAuthCode,
    clearSession,
    ...mapActions([
      'fetchCredential'
    ]),
    login : function() {
      this.getAuthCode()
    },
    setSearchField: function(event) {
      if(event && event.key === 'Enter')
        this.$store.commit("updateSearchField", this.searchField)
    },
    closeTabHandler : function() {
      window.addEventListener('beforeunload', () => {
        this.clearSession()
      })
    }
  }
}
</script>
