
    <template>
      <div v-if="this.$store.state.token != ''" >
  <!-- <v-system-bar color="#04253a"></v-system-bar> -->
   <v-app-bar color="#04253a" dark prominent height="50px">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <v-btn icon @click="logOut()">Salir<v-icon>mdi-logout</v-icon></v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      bottom
      temporary
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          
        >
        <!-- GRUPO ALMACÉN -->
        <template v-if="this.$store.state.rol=='ADMIN_ROL' || this.$store.state.rol=='ALMACENISTA_ROL' || this.$store.state.rol=='VENDEDOR_ROL'">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon class="icons_groups" color="#04253a" left>inventory</v-icon>
                  Almacén
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          
          <v-list-item to="/categorias">
            <v-list-item-content>
              <v-list-item-title>
                <v-icon class="icons_groups" color="rgba(4, 37, 58, 0.6)" left small>view_list</v-icon>
                Categorias
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          

          <v-list-item to="/articulos">
            <v-list-item-content>
              <v-list-item-title>
                <v-icon class="icons_groups" color="rgba(4, 37, 58, 0.6)" left small>view_list</v-icon>
                Articulos
              </v-list-item-title>
            </v-list-item-content>

          </v-list-item>
          </v-list-group>
        </template>

        <!-- GRUPO COMPRAS -->
        <template v-if="this.$store.state.rol=='ADMIN_ROL' || this.$store.state.rol=='ALMACENISTA_ROL'">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon class="icons_groups" color="#04253a" left>shopping_cart</v-icon>
                  Compras
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          <v-list-item to="/ingresos">
            <v-list-item-content>
              <v-list-item-title>
                <v-icon class="icons_groups" color="rgba(4, 37, 58, 0.6)" left small>view_list</v-icon>
                Ingresos
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/proveedores">
            <v-list-item-content>
              <v-list-item-title>
                <v-icon class="icons_groups" color="rgba(4, 37, 58, 0.6)" left small>view_list</v-icon>
                Proveedores
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          </v-list-group>   
        </template>

        <!-- GRUPO VENTAS -->

        <template v-if="this.$store.state.rol=='ADMIN_ROL' || this.$store.state.rol=='VENDEDOR_ROL'">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon class="icons_groups" color="#04253a" left>point_of_sale</v-icon>
                  Ventas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          
          <v-list-item to="/ventas">
            <v-list-item-content>
              <v-list-item-title>
                <v-icon class="icons_groups" color="rgba(4, 37, 58, 0.6)" left small>view_list</v-icon>
                Ventas
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/clientes">
            <v-list-item-content>
              <v-list-item-title>
                <v-icon class="icons_groups" color="rgba(4, 37, 58, 0.6)" left small>view_list</v-icon>
                Clientes
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          </v-list-group>   
        </template>

        <!-- GRUPO ACCESOS -->

        <template v-if="this.$store.state.rol=='ADMIN_ROL' ">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon class="icons_groups" color="#04253a" left>people_alt</v-icon>
                  Accesos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          <v-list-item to="/usuario">
            <v-list-item-content>
              <v-list-item-title>
                <v-icon class="icons_groups" color="rgba(4, 37, 58, 0.6)" left small>people</v-icon>
                Usuarios
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          </v-list-group>   
        </template>

        <!-- GRUPO CONSULTAS -->

        <template v-if="this.$store.state.rol=='ADMIN_ROL' || this.$store.state.rol=='ADMIN_ROL'">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon class="icons_groups" color="#04253a" left>storefront</v-icon>
                  Consultas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          <v-list-item to="/consultaVenta">
            <v-list-item-content>
              <v-list-item-title>
                <v-icon class="icons_groups" color="rgba(4, 37, 58, 0.6)" left small>point_of_sale</v-icon>
                Consultas Ventas
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/consultaCompra">
            <v-list-item-content>
              <v-list-item-title>
                <v-icon class="icons_groups" color="rgba(4, 37, 58, 0.6)" left small>shopping_cart</v-icon>
                Consultas Compras
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          </v-list-group>   
        </template>
          
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  
  </div>
   

</template>
<script>
export default {
    data: () => ({
      drawer : false,
      group : null, 
      token: '',
      
    }),

     methods:{
       logOut(){
        this.$router.push("/");
        this.$store.dispatch("setToken", this.token);
      }
     }
}
</script>

<style scoped>


</style>