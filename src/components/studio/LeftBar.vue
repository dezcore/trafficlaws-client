<template>
  <v-navigation-drawer
    permanent
    hide-overlay
  >
    <v-list
      nav
      dense
    >
      <v-list-item link>
        <v-list-item-icon>
          <v-icon>mdi-view-grid</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Channel</v-list-item-title>
      </v-list-item>
      <v-list-item link>
        <v-list-item-icon>
          <v-icon>mdi-youtube</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Videos</v-list-item-title>
      </v-list-item>
      <v-list-item link>
        <v-list-item-icon>
          <v-icon>mdi-star</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Starred</v-list-item-title>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
  </v-navigation-drawer>
</template>
<script>
  export default {
    name: 'LeftBar',
    methods : {}
  }
</script>
