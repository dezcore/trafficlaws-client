<template>
<FloatDialog
  :showDialog="dialog"
  :hideOverlay="false"
  :showCloseButton="false"
  title="App configuration"
>
  <template #form>
      <v-progress-linear
        v-model="progress"
        v-if="showProgress"
        height="28"
      >
        <strong>{{progress}}%</strong>
      </v-progress-linear>
       <v-card-text>
      <v-form
          ref="form"
          lazy-validation
        >
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="configuration.appFolder"
                label="App folder : "
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="configuration.configFile"
                label="Configuration file : "
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="configuration.favoritesFile"
                label="Favorites file : "
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="configuration.playListFile"
                label="PlayList file : "
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
       </v-card-text>
  </template>
  <template #buttons>
    <v-btn
      text
      color="primary"
      @click="save(configuration)"
    >
      Save
    </v-btn>
  </template>
</FloatDialog>

</template>
<script>
  import FloatDialog from "./FloatDialog.vue"

  export default {
    name: 'AppConfiguration',
    components : {
      FloatDialog
    },
    props : {
      dialog : {
        type : Boolean,
        default : () => {return false}
      },
      save : {
        type : Function,
        default : () => {}
      }
    },
    data () { 
      return {
        progress : "",
        showProgress : false,
        configuration : {
          appFolder : 'AppFolder',
          configFile : "settings.json",
          playListFile : "playList.json",
          favoritesFile : "favorites.json",
          categories  : [
            'News',
            'Autos & Vehicles',  
            'Comedy', 
            'Education', 
            'Entertainment',
            'Film & Animation',
            'Gaming',
            'Sports',
            'Travel & Events',
            'Music',
            'People and Blogs'
          ] 
        }
      }
    }
  }
</script>
