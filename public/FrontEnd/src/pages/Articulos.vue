<template>
    <v-data-table
    :headers="headers"
    :items="articulos"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title style="margin-right:150px">Articulos</v-toolbar-title>
        <spacer></spacer>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details ></v-text-field>

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
                      v-model="editedItem.codigo"
                      label="Código"
                    ></v-text-field>
                  </v-col>

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
                          :items="categoria"
                          v-model="editedItem.categoria.nombre"
                          v-if="bd == 0"
                          :menu-props="{ top: true, offsetY: true }"
                          label="Categorias"
                        ></v-select>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.stock"
                      label="Stock"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.precioventa"
                      label="Precio Venta"
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
              <v-btn color="blue darken-1" text @click="dialog = false" >Cancelar </v-btn>
              <v-btn color="blue darken-1" text @click="guardar" > Guardar </v-btn>
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

    <!-- Activo / Inactivo  -->
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
            articulos: [],
            categoria:[],
            headers: [
                { text: 'Código', value: 'codigo' },
                { text: 'Nombre', value: 'nombre' },
                { text: 'Categoria', value: 'categoria.nombre' },
                { text: 'Stock', value: 'stock' },
                { text: 'Precio', value: 'precioventa' },
                { text: 'Descripción', value: 'descripcion' },
                { text: 'Estado', value: 'estado' },
                { text: 'Opciones', value: 'opciones', sortable: false}
            ],
            editedItem: {
                codigo:"",
                nombre: "",
                stock: "",
                precio: "",
                descripcion: "",
                categoria:"",
            },
            id: "",
            dialog: false,
            dialogActivar: false,
            bd: 0,
        };
    },
    created(){
        this.listarArticulos();
        this.selectCategoria();
        console.log(this.$store.state.token);
    },

    methods: {
        listarArticulos(){
            let header = { headers : {"token": this.$store.state.token}};
            axios
                .get("Articulo", header)
                .then((response) =>{
                    console.log(response.data.articulo);
                    this.articulos = response.data.articulo;
                })
                .catch((error)=>{
                    console.log(error.response);
                })
        },

        selectCategoria() {
          let me = this;
          let categoriaArray = [];
          let header = { headers: { "token": this.$store.state.token } };
            axios
            .get("categoria", header)
            .then(function (response) {
            categoriaArray = response.data.categoria;
            categoriaArray.map(function (x) {
            me.categoria.push({ text: x.nombre, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error.response);
        });
    },

        activarDesactivarMostrar(accion, item){
          let id = item._id;
          console.log(accion);
          if (accion==2){
            console.log(id);
            let me = this
            let header = {headers: {"token": this.$store.state.token}};
            axios
              .put(`articulo/desactivar/${id}`,
              {
                estado:0
              },
              header
              )
              .then(function(){
                me.listarArticulos();
              })
              .catch(function(error){
                console.log(error);
              });
          }else if (accion==1){
            console.log(id);
            let me = this
            let header = {headers: {"token": this.$store.state.token}};
            axios
              .put(`articulo/activar/${id}`,
              {
                estado:1
              },
              header
              )
              .then(function(){
                me.listarArticulos();
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
                "articulo", 
                {
                  codigo: this.editedItem.codigo,
                  nombre: this.editedItem.nombre,
                  categoria: this.editedItem.categoria,
                  stock: this.editedItem.stock,
                  precio: this.editedItem.precio,
                  descripcion: this.editedItem.descripcion,
                  estado: this.editedItem.estado,
                },
                header
              )
              .then((response)=>{
                console.log(response);
                me.listarArticulos()
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
                `articulo/${this.id}`,
                {
                  codigo: this.editedItem.codigo,
                  nombre: this.editedItem.nombre,
                  categoria: this.editedItem.categoria,
                  stock: this.editedItem.stock,
                  precio: this.editedItem.precio,
                  descripcion: this.editedItem.descripcion,
                  estado: this.editedItem.estado,
                },
                header
              )
              .then(function(){
                me.listarArticulos();
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
          this.editedItem.codigo = item.codigo;
          this.editedItem.nombre = item.nombre;
          this.editedItem.categoria = item.categoria;
          this.editedItem.stock = item.stock;
          this.editedItem.precio = item.precio;
          this.editedItem.descripcion = item.descripcion;
          this.editedItem.estado = item.estado;
          this.dialog = true;
        },

        desactivar(){
          this.dialogActivar = true;
        },

        limpiarCajas(){
          this.editedItem.codigo="";
          this.editedItem.nombre="";
          this.editedItem.categoria="";
          this.editedItem.stock="";
          this.editedItem.precio="";
          this.editedItem.descripcion="";
          this.editedItem.estado="";
        }
    }
}
</script>

<style >

</style>