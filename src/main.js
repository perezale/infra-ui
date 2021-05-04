import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import './assets/tailwind.css'

import Keycloak from 'keycloak-js'


const Vue = createApp(App);

//Vue.use(createLogger());

let initOptions = {
  url: 'https://kc.dataviaapp.com/auth', realm: 'Verathena', clientId: 'frontend-verathena', onLoad: 'login-required'
}

let keycloak = Keycloak(initOptions);

keycloak.init({ onLoad: initOptions.onLoad }).then((auth) => {
  if (!auth) {
    window.location.reload();
  } else {
    console.log("Authenticated");

    console.log(keycloak);
    keycloak.loadUserInfo().then((info)=>console.log(info));
    console.log(keycloak.resourceAccess[initOptions.clientId].roles)
    
    Vue.config.globalProperties.$keycloak = keycloak
    
    Vue.mount('#app')

    /*new Vue({
      el: '#app',
      render: h => h(App, { props: { keycloak: keycloak } })
    })*/
  }


//Token Refresh
  setInterval(() => {
    keycloak.updateToken(70).then((refreshed) => {
      if (refreshed) {
        console.log('Token refreshed' + refreshed);
      } else {
        console.log('Token not refreshed, valid for '
          + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
      }
    }).catch(() => {
      console.error('Failed to refresh token');
    });
  }, 6000)

}).catch((err) => {
  console.log(err)
  //const logger = useLogger();
  //console.error("Authenticated Failed");
});