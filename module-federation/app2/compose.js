import {renderFooter} from './footer'
import {renderCopyRight} from './copyright'
export function createApp(){
}
createApp()

import('romoteApp1/Header').then((res)=>{
  console.log(res.renderHeader);
  const appNode = document.querySelector("#app")
  renderFooter(appNode)
  renderCopyRight(appNode)
  console.log("app2 container");
  res.renderHeader(appNode)
})
