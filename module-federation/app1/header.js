export function renderHeader(el){
  const node = document.createElement('div')
  node.innerHTML= `
  <div style="      width: 100%;
  height: 64px;
  background: #023032;
  color: #fff;" >header</div>
`
  el.appendChild(node)
}

