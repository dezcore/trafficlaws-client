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
        <div id="gLogin"></div>  
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  export default {
    name: 'Login',
    mounted() {
      console.log("auth : ",  window.google.accounts.id)
      if(window.google) {
        console.log("element : ", document.getElementById("gLogin"))
        this.initLoginsButton()
        window.addEventListener("load", this.initLoginsButton)
      } else {
        window.addEventListener("load", this.initLoginsButton)
      }
    },
    methods : {
      initLoginsButton : function() {
        window.google.accounts.id.renderButton(
          document.getElementById("gLogin"),
          {theme: "outline", size: "large" }  // customization attributes
        )
      }
    }
    
  }
</script>
