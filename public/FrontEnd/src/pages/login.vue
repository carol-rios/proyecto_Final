<template>
    <div id="_login"> 
        <v-container >
            <v-card width="500" class="cardL" color="rgb(255, 255, 255, 0.8)">
                <div class="app">
                <v-app id="login">
                    <v-form ref="form">
                    <h1>Inicio Sesión</h1>
                    <v-text-field v-model="email" label="E-mail" append-icon="email" solo></v-text-field>  
                    <v-text-field v-model="pass" label="Password" append-icon="lock" type="password" solo></v-text-field>
                    <v-btn id="btn_login" dark color="#04253a" @click="ingresar()"> Ingresar </v-btn>
                    <br>
                    <router-link class="recovery" to="/recovery">¿Olvidó su contraseña?</router-link>
                    </v-form>
                </v-app>
                </div>
            </v-card>
        </v-container>
    </div>   
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
            pass:"",
            email:""
        }  
    },
    methods: {
        ingresar(){
            axios.post("usuario/login", {email:this.email, password:this.pass})
            .then(response =>{
                this.$store.dispatch("setToken", response.data.token);
                this.$store.dispatch("setRol", response.data.usuario.rol);
                this.$store.dispatch("setIdUser", response.data.usuario._id)
                console.log(response.data.usuario._id);
                this.$router.push("/grafica");

            }).catch((error)=>{
                console.log(error.response);
            })
        }
    },    
}
</script>


<style>
html{
  overflow: scroll;
}

#_login{
    background-image: url("../assets/1.jpg"); 
    background-size: cover;
    width: 100%;
    height: 100vh;
    
    
}
.app{
    padding: 50px;
    height: 100%;
    box-shadow: 0px 0px 105px 22px rgba(0, 0, 0, 0.637);
    background-color: rgba(255, 255, 255, 0.151);
}

.app h1 {
    text-align: center;
}

.cardL{
    margin:auto;
    margin-top: 95px;
    height: 340px;
}

#login{
    height: 0px;
}
#login h1{
    margin-top: -20px;
    margin-bottom: 20px;
    color: #04253a;
}

#btn_login{
    margin-left: 140px;
    margin-bottom: 10px;
}

.recovery{
    margin-left: 117px;
}

</style>