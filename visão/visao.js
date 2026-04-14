const pedidos = [
  {
    id: 1,
    nome: "Sofá Modular Infinity",
    preco: "R$ 18.900",
    imagem: "https://via.placeholder.com/300x200?text=Sofá",
    status: "Pendente"
  },
  {
    id: 2,
    nome: "Poltrona Éden",
    preco: "R$ 7.490",
    imagem: "https://via.placeholder.com/300x200?text=Poltrona",
    status: "Pendente"
  },
  {
    id: 3,
    nome: "Mesa Orgânica",
    preco: "R$ 12.900",
    imagem: "https://via.placeholder.com/300x200?text=Mesa",
    status: "Pendente"
  },
  {
    id: 4,
    nome: "Luminária Pátina",
    preco: "R$ 3.290",
    imagem: "https://via.placeholder.com/300x200?text=Luminária",
    status: "Pendente"
  },
  {
    id: 5,
    nome: "Estante Loft",
    preco: "R$ 8.900",
    imagem: "https://via.placeholder.com/300x200?text=Estante",
    status: "Pendente"
  },
  {
    id: 6,
    nome: "Cama Velvet",
    preco: "R$ 15.500",
    imagem: "https://via.placeholder.com/300x200?text=Cama",
    status: "Pendente"
  }
];

const container = document.getElementById("pedidos-container");

function marcarComoEntregue(id) {
  const index = pedidos.findIndex(p => p.id === id);

  if (index !== -1) {
    pedidos.splice(index, 1); 
  }

  renderPedidos();
}

function renderPedidos() {
  container.innerHTML = "";

  pedidos.forEach(pedido => {
    const div = document.createElement("div");
    div.classList.add("pedido");

    div.innerHTML = `
      <img src="${pedido.imagem}" alt="${pedido.nome}">
      <h3>${pedido.nome}</h3>
      <p>${pedido.preco}</p>
      <p class="${pedido.status.toLowerCase()}">Status: ${pedido.status}</p>
      ${
        pedido.status === "Pendente"
          ? `<button onclick="marcarComoEntregue(${pedido.id})">Marcar como entregue</button>`
          : ""
      }
    `;

    container.appendChild(div);
  });
}

renderPedidos();