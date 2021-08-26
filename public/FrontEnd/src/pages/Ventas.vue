
<template>
  <v-app>
    <v-container fluid>
      <template>
        <v-data-table v-if="muestra == 0" class="ancho-tabla elevation-15" :headers="headers" :items="ventas" :search="search" >
          <template v-slot:top>
            <v-toolbar flat >
              <v-toolbar-title style="margin-right:150px">Ventas</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field  v-model="search"  append-icon="mdi-magnify" label="Buscar" single-line  hide-details ></v-text-field>
              <v-divider  class="mx-4"   inset  vertical ></v-divider>
              <v-spacer></v-spacer>
               <v-icon  medium   class="mr-4" @click="crearPDF()"  >mdi-download</v-icon>
              <v-btn depressed dark  class="mb-2" color="#04253a"  @click="cambioPage(1,false)" >Nuevo</v-btn>
            </v-toolbar>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-icon  small  class="mr-2" @click="cambioPage(2,item)" >mdi-clipboard-outline </v-icon>
            <template v-if="item.estado">
              <v-icon small class="mr-2"  @click="activarDesactivarItem(2,item)" >mdi-check</v-icon>
            </template>
            <template v-else>
              <v-icon  small  @click="activarDesactivarItem(1,item)"  >mdi-block-helper</v-icon>
            </template>
          </template>

           <!-- Activo / Inactivo  -->
            <template v-slot:[`item.estado`]="{ item }">
              <span class="blue--text" v-if="item.estado == 1">Activo
              </span>
              <span class="red--text" v-if="item.estado == 0">Inactivo
              </span>
            </template>

        </v-data-table>
      </template>
      <!--cambiar de vista para generar factura-->
      <template>
        <div v-if="muestra==1" class="container pa-4 white grid-list-sm">
            <v-container fluid>
              <v-row> 
                <v-btn   @click="guardar2()"  depressed dark   class="mb-2"> Generar venta</v-btn>
                <v-spacer></v-spacer>
                <v-btn   @click="cambioPage(0,false)"  color="red" dark class="mb-2"> Cancelar</v-btn>
              </v-row>
              <!--formulario-->
              <v-row>
                <v-col cols="4"><v-autocomplete v-model="editedItem.tipo_comprobante"  :items="tiposComprobantaVenta"   label="Tipo Comprobante" ></v-autocomplete></v-col>
                <v-col cols="4"> <v-text-field  v-model="editedItem.serie_comprobante"  label="Serie comprobante"></v-text-field></v-col>
                <v-col cols="4"><v-text-field  type="number" min="0" v-model="editedItem.num_comprobante"  label="Numero comprobante"></v-text-field></v-col>
              </v-row>
              <v-row>
                <v-col cols="8"> <v-autocomplete  v-model="editedItem.persona" :items="clientes"  label="Cliente"  ></v-autocomplete> </v-col>
                <v-col cols="4">  <v-text-field  type="number" min="0" v-model="editedItem.impuesto" default=0 label="Impuesto"></v-text-field></v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div  style="margin: 30px 50px 10px 20px;"><span class="black--text">Total parcial : {{totalVendido}}</span></div>        
                </v-col>
                <v-col>
                  <div  style="margin: 30px 50px 10px 20px;"><span class="black--text">Total impuesto : {{TotalFinalImpuesto}}</span></div>
                </v-col>
                <v-col>
                  <div  style="margin: 30px 50px 10px 20px;" ><span class="black--text">Total neto : {{totalVendido+TotalFinalImpuesto}}</span></div>        
                </v-col>
              </v-row>                           

                          
              <v-row>  
              <!--tabla con todos los articulos-->            
                <v-col>
                  <v-data-table class="ancho-tabla elevation-15"  :headers="mostradorArticulosTitle" :items="mostradorArticulos" :search="search" >
                    <template v-slot:top>
                      <v-toolbar flat >
                        <v-toolbar-title>Articulos</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-text-field  v-model="search"  append-icon="mdi-magnify" label="Buscar" single-line  hide-details ></v-text-field>
                        <v-divider  class="mx-4"   inset  vertical ></v-divider>
                      </v-toolbar>
                    </template>
                    <!--opcion para agregar al array para vender-->
                    <template  v-slot:[`item.actions`]="{ item }">
                      <v-icon  small  class="mr-2" @click="facturar(item)" >mdi-cart </v-icon>
                    </template>
                  </v-data-table>  
                </v-col>
                <!--tabla con los articulos vendidos-->
                <v-col>
                  <v-data-table class="ancho-tabla elevation-15" :headers="facturaArticulosTitle" :items="facturaArticulos"   >
                    <template v-slot:top>
                      <v-toolbar flat >
                        <v-toolbar-title>Carrito</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-text-field  v-model="search"  append-icon="mdi-magnify" label="Buscar" single-line  hide-details ></v-text-field>
                        <v-divider  class="mx-4"   inset  vertical ></v-divider>
                      </v-toolbar>
                    </template>
                    <!--modificar las cantidades-->
                    <template  v-slot:[`item.cantidad`]="props">
                      <v-text-field  v-model="props.item.cantidad" default="1" min=0 name="quantity"  outlined type="number"></v-text-field>
                    </template>

                    <template v-slot:[`item.subtotal`]="{ item }">
                      {{item.precio*item.cantidad}}
                    </template>
                    <!--opcion para quitar el articulo del array de venta-->
                    <template v-slot:[`item.actions`]="{ item }">
                      <v-icon  small  class="mr-2" @click="desfacturar(item)" >mdi-delete </v-icon>
                    </template>
                  </v-data-table> 
                </v-col>  
              </v-row>  
            </v-container>                
        </div>
      </template>
      <template>
        <!--para mostar a detalle la factura-->
        <div v-if="muestra==2" class="container pa-4 white grid-list-sm">
          <v-container>
            <v-row>
              <v-btn   @click="cambioPage(0,false)"  dark color="#04253a">Volver</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="#04253a" dark> Descargar
              <v-icon  medium class="mr-4" @click="crearPDFVenta()" right>mdi-download </v-icon>
              </v-btn>
            </v-row>
          </v-container>
          <template>
            <br>      
            <v-row>
              <v-container class="ventaInfo">
              <div >
                <v-row no-gutters>
                  <v-col >
                    <v-card class="pa-1" outlined style="font-weight:bold; text-align: center">DETALLE DE FACTURA</v-card>
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col >
                    <v-card class="pa-1" outlined >
                      <strong>Fecha: </strong>{{ventaConDetalleFecha}}<br>
                    </v-card>
                  </v-col>
                  <v-col >
                    <v-card class="pa-1" outlined >
                      <strong>Estado: </strong>{{ventaConDetalleEstado}}<br>
                    </v-card>
                  </v-col>
                </v-row>

              <!-- Datos Cliente -->
                <v-row no-gutters>
                  <v-col cols="5">
                    <v-card class="pa-1" outlined >
                      <strong>Cliente: </strong>{{datosCliente.nombre}}<br>
                
                    </v-card>
                  </v-col>

                  <v-col cols="3">
                    <v-card class="pa-1" outlined >
                      <strong>Tipo documento: </strong>{{datosCliente.tipoDocumento}}<br>
                                     
                    </v-card>
                  </v-col>

                  <v-col cols="4">
                    <v-card class="pa-1" outlined >
                      <strong>Número documento: </strong>{{datosCliente.numeroDocumento}}<br>                                            
                    </v-card>
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="5">
                    <v-card class="pa-1" outlined >
                      <strong>Email: </strong>{{datosCliente.email}}<br>
                
                    </v-card>
                  </v-col>

                  <v-col cols="3">
                    <v-card class="pa-1" outlined >
                      <strong>Telefono: </strong>{{datosCliente.telefono}}<br>
                                   
                    </v-card>
                  </v-col>

                  <v-col cols="4">
                    <v-card class="pa-1" outlined >
                      <strong>Direccion: </strong>{{datosCliente.direccion}}<br>                                           
                    </v-card>
                  </v-col>
                </v-row>
                <!-- Datos Vendedor -->
                <v-row no-gutters>
                  <v-col cols="5">
                    <v-card class="pa-1" outlined >
                      <strong>Vendedor:  </strong> {{datosUsuario.nombre}}<br>
                
                    </v-card>
                  </v-col>

                  <v-col cols="3">
                    <v-card class="pa-1" outlined >
                      <strong>Tipo Comprobante: </strong> {{ventaConDetalleTipoComp}}<br>
                                
                    </v-card>
                  </v-col>

                  <v-col cols="1">
                    <v-card class="pa-1" outlined >
                      <strong>Serie: </strong> {{ventaConDetalleSerie}}<br>
                                                      
                    </v-card>
                  </v-col>

                  <v-col cols="3">
                    <v-card class="pa-1" outlined >
                      <strong>Número Comprobante: </strong> {{ventaConDetalleNumComp}}<br>                                          
                    </v-card>
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="4">
                    <v-card class="pa-1" outlined >
                      <strong>Total parcial: </strong>{{ventaConDetalleTotal}}<br>
                
                    </v-card>
                  </v-col>

                  <v-col cols="4">
                    <v-card class="pa-1" outlined >
                      <strong>Total impuesto({{ventaConDetalleImpuesto*100}}%): </strong>{{ventaConDetalleTotal*ventaConDetalleImpuesto}} <br>
                                  
                    </v-card>
                  </v-col>

                  <v-col cols="4">
                    <v-card class="pa-1" outlined >
                      <strong>Total Neto: </strong> {{ventaConDetalleTotal+(ventaConDetalleTotal*ventaConDetalleImpuesto)}}                                             
                    </v-card>
                  </v-col>
                </v-row>             
              </div>
                </v-container>
              
            </v-row>
            <v-row>
              <v-col >
                <v-data-table class="ancho-tabla elevation-15 "  :headers="articulosVendidos"   :items="articuloIncluido" >
                  <template v-slot:top>
                    <v-toolbar  flat >
                      <v-toolbar-title>Articulos vendidos</v-toolbar-title>
                    </v-toolbar>
                  </template>
                </v-data-table>
              </v-col >
            </v-row>
          </template>
        </div>
      </template>
    </v-container>
  </v-app>
</template>


<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
  export default {
    data: () => ({      
      drawer:false,
      search: '',
      muestra :0,
      msgError:'',
      headers: [
        { text: 'Fecha', value: 'createAt' },
        { text: 'Vendedor', value: 'usuario.nombre' ,width:'10%'},
        { text: 'Cliente', value: 'persona.nombre' },
        { text: 'Tipo Comprobante', value: 'tipo_comprobante' ,width:'10%'},
        { text: 'Serie Comprobante', value: 'serie_comprobante',width:'10%' },
        { text: 'Número Comprobante', value: 'num_comprobante',width:'10%' },
        { text: 'Impuesto', value: 'impuesto' ,width:'10%'},
        { text: 'Total', value: 'total',width:'10%' },
        { text: 'Estado', value: 'estado',width:'10%' },
        { text: 'Acciones', value: 'actions', sortable: false,width:'10%' }
      ],
      ventas: [
        {
        usuario:'', persona:'',  tipo_comprobante:'', serie_comprobante:'',
        num_comprobante:'', impuesto:0,total:0, detalles:'', createAt:'',
        }
      ],
      ventaConDetalleFecha:'',
      ventaConDetalleEstado:'',
      ventaConDetalleCliente:'',
      ventaConDetalleVendedor:'',
      ventaConDetalleTipoComp:'',
      ventaConDetalleSerie:'',
      ventaConDetalleNumComp:'',
      ventaConDetalleImpuesto:'',
      ventaConDetalleTotal:'',
      ventaConDetalleDetalles:[],
      datosCliente:{},//almacenar datos del cliente
      datosUsuario:{},//almacenar datos del usuario
      articulosVendidos:[
        { text: 'Nombre', value: 'articulo', },
        { text: 'Cantidad', value: 'cantidad', },
        { text: 'Precio uni.', value: 'precio', },
        { text: 'Precio total', value: 'precioTotal', },
      ],
      artiVendidos:[{_id:'',articulo:'',cantidad:'',precio:''}],
      articuloIncluido:[{_id:'',articulo:'',cantidad:'',precio:'',precioTotal:''}],
      editedItem:{
        persona:'',  tipo_comprobante:'', serie_comprobante:'',
        num_comprobante:'', impuesto:'',total:'', detalles:[],
      },
      tiposComprobantaVenta:["FACTURA","NOTA DEBITO","NOTA CREDITO"],
      clientes:[],
      mostradorArticulosTitle:[
        {text:'Codigo',value:'codigo',sortable: false},
        {text:'Nombre',value:'articulo',sortable: false},
        {text:'Cantidad',value:'cantidad',sortable: false},
        {text:'Precio',value:'precio',sortable: false},
        {text:'Agregar',value:'actions',sortable: false}
      ],
      mostradorArticulosLlegar:[{_id:'',estado:'',codigo:'',articulo:'',precio:0,cantidad:0}],
      mostradorArticulos:[{_id:'',codigo:'',articulo:'',precio:0,cantidad:0}],
      facturaArticulosTitle:[
        {text:'Nombre',value:'articulo',width:'15%',sortable: false},
        {text:'Cantidad',value:'cantidad',sortable: false},
        {text:'Precio',value:'precio',sortable: false},
        {text:'Sub total',value:'subtotal',sortable: false},
        {text:'Eliminar',value:'actions',sortable: false}
      ],
      facturaArticulos:[  ],
      editedIndex: -1,
      bd:0,
      
    }),
    created(){
      this.obtenerVenta();
    },
    methods: {
    
      msjcompra:function(alerta){ Swal.fire({ position: 'top', icon: 'error', title: alerta, showConfirmButton: false, timer: 2000})  },
      listo:function(){ Swal.fire({ position: 'top', icon: 'success', title: 'Venta realizada', showConfirmButton: false, timer: 2000})  },

      cambioPage(num,item){
        if(num==0){
          this.muestra=num;
        }else if(num==1){
          this.muestra=num;
          this.obtenerPersonas();
          this.obtenerArticulos();
        }else{
          this.muestra=num;
          this.traerVentaDetalle(item);
        }
      },
      obtenerVenta(){
            let header = { headers : {"token": this.$store.state.token}};
            axios
                .get("Venta", header)
                .then((response) =>{
                    console.log(response.data.venta);
                    this.ventas = response.data.venta;
                })
                .catch((error)=>{
                    console.log(error.response);
                })
        },
      

      activarDesactivarItem (accion , item) {
        let id = item._id;
        console.log(accion);
        if(accion == 2){
          console.log(id);
          let me = this
          let header = {headers:{"token" : this.$store.state.token}};
          axios.put(`venta/desactivar/${id}`, {}, header)
            .then(function(){
              me.obtenerVenta();
            })
            .catch(function(error){
              console.log(error);
              if(!error.response.data.msg){
                console.log(error.response);
                this.msgError = error.response.data.errors[0].msg;
                this.msjcompra(this.msgError);
              }else{
                this.msgError = error.response.data.msg;
                console.log(error.response.data.msg);
                this.msgError =error.response.data.msg;
                this.msjcompra(this.msgError);
              }
            });
        }else if (accion==1){
          console.log(id);
          let me = this
          let header = {headers:{"token" : this.$store.state.token}};
          axios.put(`venta/activar/${id}`,{},header)
            .then(function(){
              me.obtenerVenta();
            })
            .catch(function(error){
              console.log(error);
              if(!error.response.data.msg){
                console.log(error.response);
                this.msgError = error.response.data.errors[0].msg;
                this.msjcompra(this.msgError);
              }else{
                this.msgError = error.response.data.msg;
                console.log(error.response.data.msg);
                this.msgError =error.response.data.msg;
                this.msjcompra(this.msgError);
              }
            });
        }
      },
      crearPDF(){
        var rows=[];
        this.ventas.map(function(x){
          rows.push({
            createAt: x.createAt,
            usuario: x.usuario.nombre,
            persona: x.persona.nombre,
            tipoComprobante: x.tipoComprobante,
            serieComprobante: x.serieComprobante,
            numComprobante: x.numComprobante,
            impuesto: x.impuesto,
            total: x.total
          });
        });
        var doc = new jsPDF();
        doc.autoTable({
          didDrawPage:function(){
            doc.text("Lista de Ventas",14,10);
          },
          columnStyles: {
            0: {cellWidth:22 },
            1: {cellWidth:'auto' },
            2: {cellWidth:'auto' },
            3: {cellWidth:'auto' },
            4: {cellWidth:'auto' },
            5: {cellWidth:'auto' },
            6: {cellWidth:'auto' },
            7: {cellWidth: 'auto'},
          },
          headStyles: { fillColor: '#23323a', textColor: '#B9F6CA',  halign: 'left'  },
          body: rows,
          columns :[
            {title:"CreatedAt",dataKey:"createAt"},
            {title:"Usuario",dataKey:"usuario"},
            {title:"Persona",dataKey:"persona"},
            {title:"Tipo Comprobante",dataKey:"tipoComprobante"},
            {title:"Serie Comprobante",dataKey:"serieComprobante"},
            {title:"# Comprobante",dataKey:"numComprobante"},
            {title:"Impusto",dataKey:"impuesto"},
            {title:"Total",dataKey:"total"},
          ]
        })
        doc.save("Ventas.pdf");
      },
      //traer venta con detalles
      traerVentaDetalle(item){
        let id = item._id;
        let header = {headers:{"token" : this.$store.state.token}};
        
        axios.get(`venta/${id}`,header)
          .then(response =>{
            //console.log(response);
            this.ventaConDetalleFecha=response.data.venta.createAt
            this.ventaConDetalleEstado=response.data.venta.estado
            this.ventaConDetalleCliente=response.data.venta.persona
            this.ventaConDetalleVendedor=response.data.venta.usuario
            this.ventaConDetalleTipoComp=response.data.venta.tipo_comprobante
            this.ventaConDetalleSerie=response.data.venta.serie_comprobante
            this.ventaConDetalleNumComp=response.data.venta.num_comprobante
            this.ventaConDetalleImpuesto=response.data.venta.impuesto
            this.ventaConDetalleTotal=response.data.venta.total
            this.ventaConDetalleDetalles=response.data.venta.detalles
            this.artiVendidos=this.ventaConDetalleDetalles
            this.meter(this.ventaConDetalleDetalles)
            this.traerCliente(this.ventaConDetalleCliente)
            this.traerUsuario(this.ventaConDetalleVendedor)
            // console.log(this.ventaConDetalleCliente);
          })
          .catch((error) =>{
            //console.log(error.response);
            if(!error.response.data.msg){
                //console.log(error.response);
                this.msgError = error.response.data.errors[0].msg;
                this.msjcompra(this.msgError);
              }else{
                this.msgError = error.response.data.msg;
                //console.log(error.response.data.msg);
                this.msgError =error.response.data.msg;
                this.msjcompra(this.msgError);
              }
          })
      },
      
      traerCliente(item){
        let id = item;
        let header = {headers:{"token" : this.$store.state.token}};
        axios.get(`persona/${id}`,header)
          .then(response =>{
            console.log('persona');
            console.log(response);
            this.datosCliente=response.data.persona;
          })
          .catch((error) =>{
            console.log(error.response);
            if(!error.response.data.msg){
                console.log(error.response);
                this.msgError = error.response.data.errors[0].msg;
                this.msjcompra(this.msgError);
              }else{
                this.msgError = error.response.data.msg;
                console.log(error.response.data.msg);
                this.msgError =error.response.data.msg;
                this.msjcompra(this.msgError);
              }
          })
      },

      traerUsuario(item){
        let id = item;
        let header = {headers:{"token" : this.$store.state.token}};
        axios.get(`usuario/${id}`,header)
          .then(response =>{
            console.log('usuario');
            console.log(response);
            this.datosUsuario=response.data.usuario;
          })
          .catch((error) =>{
            console.log(error.response);
            if(!error.response.data.msg){
                console.log(error.response);
                this.msgError = error.response.data.errors[0].msg;
                this.msjcompra(this.msgError);
              }else{
                this.msgError = error.response.data.msg;
                console.log(error.response.data.msg);
                this.msgError =error.response.data.msg;
                this.msjcompra(this.msgError);
              }
          })
      },

      meter(ventaConDetalleDetalles){
        // console.log(ventaConDetalleDetalles);
        var aPush=[];
        ventaConDetalleDetalles.map(function(x){
          aPush.push({
            _id:x._id,
            articulo:x.articulo,
            cantidad:x.cantidad,
            precio:x.precio,
            precioTotal:x.cantidad*x.precio,
          })
        });
        // console.log(aPush);
        this.articuloIncluido=aPush
      },
      crearPDFVenta(){
        const doc = new  jsPDF();
        let rows =[];
        this.ventaConDetalleDetalles.map(function(x){
          rows.push({
            nombre : x.nombre,
            cantidad : x.cantidad,
            precio : x.precio,
            precioSub : x.precio*x.cantidad
          })
        })
        doc.setFontSize(11);
        doc.text(`Fecha : ${this.ventaConDetalleFecha}`,15,15);
        doc.text(`Estado : ${this.ventaConDetalleEstado}`,150,15);
        doc.text(`Cliente :                 ${this.ventaConDetalleCliente.nombre}`,15,35);
        doc.text(`Tipo documento :   ${this.datosCliente.tipoDocumento}`,15,40);
        doc.text(`Num documento :   ${this.datosCliente.numDocumento}`,15,45);
        doc.text(`Email :                     ${this.datosCliente.email}`,15,50);
        doc.text(`Telefono :                ${this.datosCliente.telefono}`,15,55);
        doc.text(`Direccion :               ${this.datosCliente.direccion}`,15,60);
        doc.text(`Vendedor :               ${this.ventaConDetalleVendedor.nombre}`,15,70);
        doc.text(`Tipo comprobante :  ${this.ventaConDetalleTipoComp}`,15,75);
        doc.text(`Serie :                      ${this.ventaConDetalleSerie}`,15,80);
        doc.text(`# Comprobante :      ${this.ventaConDetalleNumComp}`,15,85);
        doc.text(`Total parcial:           ${this.ventaConDetalleTotal} `,15,95);
        doc.text(`Impuesto (${this.ventaConDetalleImpuesto}) :            ${this.ventaConDetalleTotal*this.ventaConDetalleImpuesto}`,15,100);
        doc.text(`Total Neto:              ${this.ventaConDetalleTotal+(this.ventaConDetalleTotal*this.ventaConDetalleImpuesto)}`,15,105);
        doc.autoTable({
          didDrawPage:function(){
            doc.text("Articulos vendidos:",15,115);
          },
          startY: 120,
          columnStyles: {
            0: {cellWidth: 40},
            1: {cellWidth: 40},
            2: {cellWidth: 40},
            3: {cellWidth: 'auto'},
          },
          headStyles: { fillColor: '#23323a', textColor: '#B9F6CA',  halign: 'left'  },
          body:rows,
          columns :[
          {header:"Articulo",dataKey:"nombre"},
          {header:"Cantidad",dataKey:"cantidad"},
          {header:"Precio Uni",dataKey:"precio"},
          {header:"Precio Total",dataKey:"precioSub"},
          ],
          cursor: { x: 15, y: 115 }
        }),
        doc.save("Factura de venta.pdf");
      },
      obtenerPersonas(){
        let me = this;
        let clientesArray=[];
        let header = {headers:{"token" : this.$store.state.token}};
        axios.get("persona/listClientes/cliente",header)
          .then(response =>{
            console.log(response.data.clientes);
            clientesArray = response.data.clientes;
            clientesArray.map(function(x){
              if(x.estado==1){
                me.clientes.push({text:x.nombre,value:x._id})
              }
            })
          })
          .catch((error) =>{
            console.log(error.response);
            if(!error.response.data){
              console.log(error.response);
              this.msgError = error.response.data.errors[0].msg;
              this.msjcompra(this.msgError);
            }else{
              this.msgError = error.response.data.msg;
              console.log(error.response.data.msg);
              this.msgError =error.response.data.msg;
              this.msjcompra(this.msgError);
            }
          })
      },
      meterArticulos(mostradorArticulosLlegar){
        var articles=[];
        mostradorArticulosLlegar.map(function(x){
          if(x.estado!=0 && x.stock>0){
            articles.push({
              _id:x._id,
              codigo:x.codigo,
              articulo:x.nombre,
              precio:x.precioventa,
              cantidad:x.stock
            })
          }
        })
        console.log(articles);
        this.mostradorArticulos=articles;
      },
      obtenerArticulos(){
        let header = {headers:{"token" : this.$store.state.token}};
        axios.get("articulo",header)
        .then(response =>{   
          console.log(response);  
          this.mostradorArticulosLlegar = response.data.articulo
          this.meterArticulos(this.mostradorArticulosLlegar);
        })
        .catch((error) =>{
          console.log(error.response);
        })
      },
      facturar(item){
        this.editedIndex=this.mostradorArticulos.indexOf(item);
        this.facturaArticulos.push(item);
        this.mostradorArticulos.splice(this.editedIndex,1);
        console.log(this.facturaArticulos);
        console.log(this.editedIndex);
      },
      desfacturar(item){
        this.editedIndex=this.facturaArticulos.indexOf(item)
        this.mostradorArticulos.push(item)
        this.facturaArticulos.splice(this.editedIndex,1)
        console.log(this.facturaArticulos);
        console.log(this.editedIndex);
      },
      guardar2(){
        var usuario=this.$store.state.idUser;
        var persona=this.editedItem.persona;
        var tipo_comprobante=this.editedItem.tipo_comprobante;
        var serie_comprobante=this.editedItem.serie_comprobante;
        var num_comprobante=this.editedItem.num_comprobante;
        var impuesto=this.editedItem.impuesto/100;
        var total= this.totalVendido;
        var detalles=this.facturaArticulos;
        console.log(usuario);
        console.log(persona);
        console.log(tipo_comprobante);
        console.log(serie_comprobante);
        console.log(num_comprobante);
        console.log(impuesto);
        console.log(total);
        console.log(detalles);
        this.guardar(usuario,persona,tipo_comprobante,serie_comprobante,num_comprobante,impuesto,total,detalles)
      },
      guardar(user,person,tipo,serie,num,imp,total,deta){
        console.log('estoy guardando'+this.bd);
        let header = {headers:{"token" : this.$store.state.token}};
        axios.post('venta',{
          usuario:user,
          persona:person,
          tipo_comprobante:tipo,
          serie_comprobante:serie,
          num_comprobante:num,
          impuesto:imp,
          total:total,
          detalles:deta
          },header)
            .then((response)=>{
              console.log(response);
              this.obtenerVenta();
              this.obtenerPersonas();
              this.obtenerArticulos();
              this.reset();
              this.listo();
            })
            .catch((error)=>{
                console.log(error.response);
            })
      },
      reset(){
        this.editedItem.persona='';
        this.editedItem.tipo_comprobante='';
        this.editedItem.serie_comprobante='';
        this.editedItem.num_comprobante='';
        this.editedItem.impuesto='';
        this.editedItem.total='';
        this.facturaArticulos=[]
      },
    },
    computed:{
      
      totalVentas(){
          return this.ventas.reduce((suma,venta)=>{
            return suma + parseFloat(venta.total)
          },0)
      },
      totalVendido(){
          return this.facturaArticulos.reduce((suma,articulo)=>{
            return suma + (parseInt(articulo.cantidad)*articulo.precio)
          },0)
      },
      TotalFinalImpuesto(){
        if(!this.editedItem.impuesto)return 0
        var totalImpues =this.totalVendido*this.editedItem.impuesto/100 
        return totalImpues.toFixed(2)
      },
      
    }
  }
</script>

<style>
  .ancho-tabla table{
    table-layout: fixed;
    
  }

</style>

