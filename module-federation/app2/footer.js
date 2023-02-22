export function renderFooter(el){
  const node = document.createElement('div')
  node.innerHTML= `
    <div style="width:100%;height:64px;position: fixed;bottom: 0;background-color: aquamarine;">footer</div>
  `
  el.appendChild(node)
}

