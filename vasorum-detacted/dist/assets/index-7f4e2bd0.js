import{q as l,h as g}from"./index-f644aaf1.js";const n=(e,a)=>{a==401&&(localStorage.removeItem("token"),g.push("/login"))};async function c(e,a,o,s=n){try{const t=await l.post(e,a,{headers:{}});console.log("post"),console.log(t),t.status==200?o(t.data):s(t.data,t.status)}catch(t){t.response?s(t.response.data.message,t.response.status):s(t.message)}}function i(e,a,o,s=n){return l.get(e,{params:a,headers:{Authorization:localStorage.getItem("Authorization")}}).then(t=>{console.log(t.status),t.status==200?(console.log(t.data),o(t.data,t.status)):s(t.data,t.status)}).catch(t=>{t.response?s(t.response.data.message,t.response.status):s(t.message)})}export{i as g,c as p};
