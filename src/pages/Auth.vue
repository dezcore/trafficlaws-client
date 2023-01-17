<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <router-link to="/" style="text-decoration: none; color: inherit;">
          <v-avatar
          color="red"
          size="82"
        >
          <span class="white--text text-h5">28</span>          
        </v-avatar>
        </router-link>
      </v-col>
      <v-col cols="12" class="d-flex justify-center">
        <v-card-title>Connectez-vous à Zcore</v-card-title>
      </v-col>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn icon color="green" @click="getAuthCode" data-cy="login-input">
          <v-icon aria-hidden="false">
            mdi-login
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  import {getAuthCode} from "../youtube"

  export default {
    name: 'Auth',
    methods : {
      getAuthCode
    }
  }
</script>
