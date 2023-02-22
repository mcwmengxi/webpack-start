export function renderCopyRight(el){
  const node = document.createElement('div')
  node.innerHTML= `
    <div style="width:100%;height:64px;position: absolute;bottom:100px; background-color: aquamarine;">@copyright</div>
  `
  el.appendChild(node)
}
