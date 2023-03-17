<template>
<div class="text-center">
    <v-dialog
      v-model="dialog"
      hide-overlay
      persistent
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{title}}
        </v-card-title>
        <slot name="list" :dialog="dialog"></slot> 
        <slot name="table" :dialog="dialog"></slot>   
        <slot name="form" :dialog="dialog"></slot>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <slot name="buttons"></slot> 
          <v-btn
            color="primary"
            text
            @click="setShowDialog"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>

  export default {
    name: 'FloatDialog',
    props : {
      title : {
        type : String,
        default : ()=>{return ""}
      },
      showDialog : {
        type : Boolean,
        default : ()=>{return false}
      },
      setShowDialog : {
        type : Function,
        default : ()=>{}
      }
    },
    watch : {
      showDialog : function() {
        this.dialog = this.showDialog
      }
    },
    data () {
      return {
        dialog : false
      }
    },
    mounted() {
      this.movableDialogHandler()
    },
    methods : {
      bindDialogMousedownEvent: function(d) {
        document.addEventListener("mousedown", e => {
          const closestDialog = e.target.closest(".v-dialog.v-dialog--active")
          if(e.button === 0 && closestDialog != null && e.target.classList.contains("v-card__title")) { // element which can be used to move element
            d.el = closestDialog // element which should be moved
            d.mouseStartX = e.clientX
            d.mouseStartY = e.clientY
            d.elStartX = d.el.getBoundingClientRect().left
            d.elStartY = d.el.getBoundingClientRect().top
            d.el.style.position = "fixed"
            d.el.style.margin = 0
            d.oldTransition = d.el.style.transition
            d.el.style.transition = "none"
          }
        })
      },
      bindDialogMousemoveEvent: function(d) {
        document.addEventListener("mousemove", e => {
          if(d.el === undefined) return
          d.el.style.left = Math.min(
            Math.max(d.elStartX + e.clientX - d.mouseStartX, 0),
            window.innerWidth - d.el.getBoundingClientRect().width
          ) + "px"
          d.el.style.top = Math.min(
            Math.max(d.elStartY + e.clientY - d.mouseStartY, 0),
            window.innerHeight - d.el.getBoundingClientRect().height
          ) + "px"
        })
      },
      movableDialogHandler: function() {
        const d = {};
        this.bindDialogMousedownEvent(d)
        this.bindDialogMousemoveEvent(d)

        document.addEventListener("mouseup", () => {
          if (d.el === undefined) return
          d.el.style.transition = d.oldTransition
          d.el = undefined
        })

        setInterval(() => { // prevent out of bounds
          const dialog = document.querySelector(".v-dialog.v-dialog--active")
          if(dialog === null) return
          dialog.style.left = Math.min(parseInt(dialog.style.left), window.innerWidth - dialog.getBoundingClientRect().width) + "px"
          dialog.style.top = Math.min(parseInt(dialog.style.top), window.innerHeight - dialog.getBoundingClientRect().height) + "px"
        }, 100)
      }
    }
  }
</script>
