<template>
    <v-data-table
    :headers="headers"
    :items="clientes"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title style="margin-right:150px">Clientes</v-toolbar-title>
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
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Nuevo
            </v-btn>
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
                    <v-select
                      :items="tipoDocumento"
                      v-model="editedItem.tipoDocumento"
                      label="Tipo Documento"
                    ></v-select
                      >
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.numeroDocumento"
                      label="Número Documento"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.direccion"
                      label="Dirección"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.telefono"
                      label="Teléfono"
                    ></v-text-field>
                  </v-col>

                   <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.email"
                      label="E-mail"
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
            <v-card-title class="headline">Seguro que quieres eliminar este articulo?</v-card-title>
            <v-card-actions>
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
      <v-icon small class="mr-2" @click="editar(item)"> mdi-pencil </v-icon>

      <template v-if="item.estado">
          <v-icon small @click="activarDesactivarMostrar(2, item)">
            mdi-block-helper
          </v-icon>
        </template>

        <template v-else>
          <v-icon small @click="activarDesactivarMostrar(1, item)">
            mdi-check
          </v-icon>
        </template>
      
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
            clientes: [],
            tiposPersona: ['CLIENTE'],
            tipoDocumento: ['CC', 'NIT', 'PASAPORTE', 'CE'],
            headers: [
                { text: 'Nombre', value: 'nombre' },
                { text: 'Tipo Persona', value: 'tipoPersona' },
                { text: 'Tipo Documento', value: 'tipoDocumento' },
                { text: 'Número Documento', value: 'numeroDocumento' },
                { text: 'Dirección', value: 'direccion' },
                { text: 'Teléfono', value: 'telefono' },
                { text: 'E-Mail', value: 'email' },
                { text: 'Estado', value: 'estado' },
                { text: 'Opciones', value: 'opciones', sortable: false},
            ],
            editedItem: {
                nombre: "",
                tipoDocumento: "",
                numeroDocumento: "",
                direccion: "",
                telefono: "",
                email: "",
            },
            id: "",
            dialog: false,
            dialogActivar: false,
            bd: 0,
        };
    },
    created(){
        this.listarClientes();
        console.log(this.$store.state.token);
    },

    methods: {
        listarClientes(){
            let header = { headers : {"token": this.$store.state.token}};
            axios
                .get("persona/listClientes/cliente", header)
                .then((response) =>{
                    console.log(response.data.cliente);
                    this.clientes = response.data.clientes;
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
              .put(`persona/desactivar/${id}`,
              {
                estado:0
              },
              header
              )
              .then(function(){
                me.listarClientes();
              })
              .catch(function(error){
                console.log(error);
              });
          }else if (accion==1){
            console.log(id);
            let me = this
            let header = {headers: {"token": this.$store.state.token}};
            axios
              .put(`persona/activar/${id}`,
              {
                estado:1
              },
              header
              )
              .then(function(){
                me.listarClientes();
              })
              .catch(function(error){
                console.log(error);
              });
          }
        },

        guardar(){
          if (this.bd == 0){
            console.log("guardando"+this.bd);
            let header = {headers: {"token": this.$store.state.token}};
            const me = this;
            axios 
              .post(
                "persona", 
                {
                  nombre: this.editedItem.nombre,
                  tipoPersona: 'CLIENTE',
                  tipoDocumento: this.editedItem.tipoDocumento,
                  numeroDocumento: this.editedItem.numeroDocumento,
                  direccion: this.editedItem.direccion,
                  telefono: this.editedItem.telefono,
                  email: this.editedItem.email,
                },
                header
              )
              .then((response)=>{
                console.log(response);
                me.listarClientes()
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
                `persona/${this.id}`,
                {
                  nombre: this.editedItem.nombre,
                  tipoPersona: 'CLIENTE',
                  tipoDocumento: this.editedItem.tipoDocumento,
                  numeroDocumento: this.editedItem.numeroDocumento,
                  direccion: this.editedItem.direccion,
                  telefono: this.editedItem.telefono,
                  email: this.editedItem.email,
                },
                header
              )
              .then(function(){
                me.listarClientes();
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
          this.editedItem.nombre = item.nombre ,
          this.editedItem.tipoPersona = 'CLIENTE',
          this.editedItem.tipoDocumento=item.tipoDocumento ,
          this.editedItem.numeroDocumento=item.numeroDocumento,
          this.editedItem.direccion=item.direccion ,
          this.editedItem.telefono=item.telefono ,
          this.editedItem.email=item.email ,
          this.dialog = true;
        },

        desactivar(){
          this.dialogActivar = true;
        },

        limpiarCajas(){
          this.editedItem.nombre ="";
          this.editedItem.tipoDocumento="";
          this.editedItem.numeroDocumento="" ;
          this.editedItem.direccion="",
          this.editedItem.telefono="" ;
          this.editedItem.email="" ;
        }

    }
}
</script>

<style >

</style>