import {renderHeader} from './header'
export function createApp(){
  const appNode = document.querySelector("#app")
  renderHeader(appNode)
  console.log("app1 container");
}
createApp()
