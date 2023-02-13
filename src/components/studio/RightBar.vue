<template>
  <v-navigation-drawer
    permanent
    width="100%"
  >
    <v-row
      class="fill-height"
      no-gutters
    >
      <v-navigation-drawer
        mini-variant
        permanent
      >

        <v-list
          dense
          nav
        >
          <v-list-item
            v-for="item in items"
            :key="item.title"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
      </v-navigation-drawer>

      <v-list class="grow">
        <v-list-item
          v-for="link in links"
          :key="link"
          link
        >
          <v-list-item-title v-text="link"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-row>
    </v-navigation-drawer>
</template>
<script>
  export default {
    name: 'RightBar',
    data () {
      return {
        items: [
          { title: 'Home', icon: 'mdi-view-dashboard' },
          { title: 'About', icon: 'mdi-forum' },
        ],
        links: ['Home', 'Contacts', 'Settings'],
        mini: true,
      }
    },
    methods : {}
  }
</script>
