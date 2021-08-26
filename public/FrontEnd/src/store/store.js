import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({

    state:{
        token:"",
        rol:"",
        idUser:""
    },

    mutations:{
        setToken(state, value){
            state.token = value;
        },
        setRol(state, value){
            state.rol = value;
        },

        setIdUser(state,value){
            state.idUser = value;
        }
    },

    actions:{
        setToken(context, value){
            context.commit("setToken",value);
        },
        setRol(context, value){
            context.commit("setRol",value);
        },
        setIdUser(context,value){
            context.commit("setIdUser",value);
        }
    }
})

