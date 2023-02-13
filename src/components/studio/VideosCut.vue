<template>
<v-slide-group
      multiple
      show-arrows
    >
      <v-slide-item
        v-for="n in 10"
        :key="n"
        v-slot="{ active, toggle }"
      >
      <v-img
            :color="active ? undefined : 'grey lighten-1'"
          src="https://picsum.photos/510/300?random"
           @click="toggle"
           height="140px"
           width="150px"
        >
           <v-scale-transition>
              <v-icon
                v-if="active"
                color="white"
                size="48"
                v-text="'mdi-close-circle-outline'"
              ></v-icon>
            </v-scale-transition> 
        </v-img>

      </v-slide-item>
    </v-slide-group>
</template>
<script>
  export default {
    name: 'VideosCut',
    methods : {}
  }
</script>
