<template>
  <div class="container login-page">
    <div class="col-lg-4 col-md-6 ml-auto mr-auto">
     <div>
  <Particlescomponent />
  </div>
      <card class="card-login card-white">
        <template slot="header">
          <img src="img//logo1.0.png" alt="" />
        </template>

        <div>
          <base-input
            name="email"
            v-model="user.email"
            placeholder="Email"
            addon-left-icon="tim-icons icon-email-85"
          >
          </base-input>

          <base-input
            name="password"
            v-model="user.password"
            type="password"
            placeholder="Password"
            addon-left-icon="tim-icons icon-lock-circle"
            @keyup.enter="login"

          >
          </base-input>
        </div>

        <div slot="footer">
          <base-button
            native-type="submit"
            type="primary"
            class="mb-3"
            size="lg"
            @click="login"
            block
          >
            Login
          </base-button>
          <div class="pull-left">
            <h6>
              <nuxt-link class="link footer-link" to="/register">
                Create Account
              </nuxt-link>
            </h6>
          </div>

          <div class="pull-right">
            <h6><a href="#help!!!" class="link footer-link">Need Help?</a></h6>
          </div>
        </div>
      </card>
    </div>
  </div>
</template>

<script>

  
 // import(/*webpackChunkName: "Particlescomponent"*/ "@/components/Particlescomponent");
  import Particlescomponent from "@/components/Particlescomponent.vue";


const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  middleware: 'notAuthenticated',
  name: "login-page",
  layout: "auth",

  components: {
    Particlescomponent
  
  },

  data() {
    return {
      user: {
        email: "",
        password: ""
      }
    };
  },
  mounted(){
 
  },
  methods: {
    login(){
      this.$axios.post("/login", this.user)
      .then((res) =>{
        if(res.data.status == "success"){
          this.$notify({
            type: "success",
            icon: "tim-icons icon-check-2",
            message: "Bienvenido " + res.data.userData.name            
          });
          console.log(res.data);

          const auth = {
            token: res.data.token,
            userData: res.data.userData
          }
          //Guardar Token y datos del usuario en la store
          this.$store.commit('setAuth', auth);
          //Guardar Token y datos del usuario en localStorege 
          localStorage.setItem('auth',JSON.stringify(auth));

          $nuxt.$router.push('/dashboard');


          return;
        }
      })
      .catch((e) => {
        if (e.response.data.error.errors.email.kind == "unique"){
           this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: "El usuario ya existe",        
          });
          return;
        }else{
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Hubo un error al crear el usuario",        
          });
          return;
        }
      })
    },

    resetForm(){
      this.user.name = "",
      this.user.password = "",
      this.user.email = ""
    },


  }

};
</script>

<style>
.navbar-nav .nav-item p {
  line-height: inherit;
  margin-left: 5px;
}


</style>