<template>
    <v-data-table
    :headers="headers"
    :items="categorias"
    :search="search"
    class="elevation-1"
    >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title style="margin-right:150px">Categorias</v-toolbar-title>
        <spacer></spacer> 
        <!-- barra buscar -->
          <v-text-field id="brSea" v-model="search" append-icon="mdi-magnify"  label="Buscar" single-line hide-details></v-text-field>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"> Nuevo </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.nombre"
                      label="Nombre"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.descripcion"
                      label="Descripción"
                    ></v-text-field>
                  </v-col>
              
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="guardar">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Seguro que quieres eliminar esta categoria?</v-card-title>
            <v-card-actions class="actions">
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.opciones`]="{ item }">
       <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-icon small class="mr-2" @click="editar(item)" v-bind="attrs" v-on="on" > mdi-pencil </v-icon>
        </template>
            <span>Editar</span>
            </v-tooltip>
      <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
      <template v-if="item.estado">
          <v-icon small @click="activarDesactivarMostrar(2, item)" v-bind="attrs" v-on="on">
            mdi-block-helper
          </v-icon>
        </template>

        <template v-else>
          <v-icon small @click="activarDesactivarMostrar(1, item)" v-bind="attrs" v-on="on">
            mdi-check
          </v-icon>
        </template>
        </template>            
            <span>Activar/Desactivar</span>
            </v-tooltip>

    </template>

    <template v-slot:[`item.estado`]="{ item }">
      <span class="blue--text" v-if="item.estado == 1">Activo
      </span>
      <span class="red--text" v-if="item.estado == 0">Inactivo
      </span>
    </template>

    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios';

export default {
    data(){
        return{
            search:"",
            categorias: [],
            headers: [
                { text: 'Nombre', value: 'nombre' },
                { text: 'Descripción', value: 'descripcion' },
                { text: 'Estado', value: 'estado' },
                { text: 'Opciones', value: 'opciones', sortable: false}
            ],
            editedItem: {
                nombre: "",
                descripcion: "",
                estado: 0,
            },

            id: "",
            dialog: false,
            dialogActivar: false,
            bd: 0,
        };
    },
    created(){
        this.listarCategorias();
        console.log(this.$store.state.token);
    }, 

    

    methods: {
        listarCategorias(){
            let header = { headers : {"token": this.$store.state.token}};
            axios
                .get("Categoria", header)
                .then((response) =>{
                    console.log(response.data.categoria);
                    this.categorias = response.data.categoria;
                })
                .catch((error)=>{
                    console.log(error.response);
                })
        },

        activarDesactivarMostrar(accion, item){
          let id = item._id;
          console.log(accion);
          if (accion==2){
            console.log(id);
            let me = this
            let header = {headers: {"token": this.$store.state.token}};
            axios
              .put(`categoria/desactivar/${id}`,
              {
                estado:0
              },
              header
              )
              .then(function(){
                me.listarCategorias();
              })
              .catch(function(error){
                console.log(error);
              });
          }else if (accion==1){
            console.log(id);
            let me = this
            let header = {headers: {"token": this.$store.state.token}};
            axios
              .put(`categoria/activar/${id}`,
              {
                estado:1
              },
              header
              )
              .then(function(){
                me.listarCategorias();
              })
              .catch(function(error){
                console.log(error);
              });
          }
        },

        // guardar y editar
        guardar(){
          if (this.bd == 0){
            console.log("guardando"+this.bd);
            let header = {headers: {"token": this.$store.state.token}};
            const me = this;
            axios 
              .post(
                "categoria", 
                {
                  nombre: this.editedItem.nombre,
                  descripcion: this.editedItem.descripcion,
                },
                header
              )
              .then((response)=>{
                console.log(response);
                me.listarCategorias()
                this.limpiarCajas()
              })
              .catch((error)=>{
                console.log(error.response);
              })
          }else{
            const me = this;
            let header = {headers: {"token": this.$store.state.token}};
            axios 
              .put(
                `categoria/${this.id}`,
                {
                  nombre: this.editedItem.nombre,
                  descripcion: this.editedItaaem.descripcion
                },
                header
              )
              .then(function(){
                me.listarCategorias();
                me.limpiarCajas();
              })
              .catch(function(error){
                console.log(error);
              })
          }
        },

        editar(item){
          console.log(item);
          this.bd = 1;
          this.id = item._id;
          this.editedItem.nombre = item.nombre;
          this.editedItem.descripcion = item.descripcion;
          this.dialog = true;
        },

        desactivar(){
          this.dialogActivar = true;
        },

        limpiarCajas(){
          this.editedItem.nombre="";
          this.editedItem.descripcion="";
        }
    }
}
</script>

<style>
.actions{
  margin: 10px;
  padding: 10px;
}
</style>