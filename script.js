const projetos = [
  {
    titulo: "Posts para Instagram",
    categoria: "instagram",
    tipo: "galeria de posts",
    sigla: "IG",
    cor: "#18476f",
    resumo: "Carrosseis, posts estaticos e campanhas para redes sociais.",
    texto: "Esse projeto abre a galeria de posts. Depois voce pode trocar os blocos coloridos por imagens reais dos seus trabalhos.",
    acao: "galeria",
    botao: "abrir galeria"
  },
  {
    titulo: "Banners para Site",
    categoria: "design",
    tipo: "design e marketing",
    sigla: "WEB",
    cor: "#ef7067",
    resumo: "Banners, pecas comerciais e criativos para campanhas digitais.",
    texto: "Area para mostrar banners de site, pecas promocionais e layouts de campanha com detalhes de objetivo, publico e resultado.",
    acao: "detalhes",
    botao: "ver detalhes"
  },
  {
    titulo: "UX Design",
    categoria: "ux",
    tipo: "ui/ux",
    sigla: "UX",
    cor: "#b9cf65",
    resumo: "Fluxos, telas, prototipos e estudos de experiencia.",
    texto: "Inspirado na pagina UI/UX da Najlaa: aqui voce pode abrir detalhes com contexto, processo, ferramentas e telas do projeto.",
    acao: "detalhes",
    botao: "ver detalhes"
  },
  {
    titulo: "Projetos FIAP",
    categoria: "ads",
    tipo: "faculdade ads",
    sigla: "ADS",
    cor: "#5aaed8",
    resumo: "Trabalhos da faculdade, desafios e sistemas simples.",
    texto: "Espaco para documentar sua evolucao no curso de ADS: logica, sistemas, banco de dados, UX e projetos interdisciplinares.",
    acao: "detalhes",
    botao: "ver detalhes"
  },
  {
    titulo: "Projetos de Codigo",
    categoria: "codigo",
    tipo: "front-end",
    sigla: "DEV",
    cor: "#092d4c",
    resumo: "HTML, CSS, JavaScript, landing pages e jogos simples.",
    texto: "Esse card leva direto para a area de codigo do portfolio.",
    acao: "codigo",
    botao: "ir para codigo"
  }
];

const postsInstagram = [
  { titulo: "Post 01", cor: "#18476f", rotacao: "-2deg" },
  { titulo: "Post 02", cor: "#ef7067", rotacao: "2deg" },
  { titulo: "Post 03", cor: "#b9cf65", rotacao: "-1deg" },
  { titulo: "Post 04", cor: "#5aaed8", rotacao: "3deg" },
  { titulo: "Post 05", cor: "#8a6a45", rotacao: "-3deg" },
  { titulo: "Post 06", cor: "#092d4c", rotacao: "1deg" }
];

const topo = document.querySelector("#topo");
const cursor = document.querySelector("#cursor");
const entrada = document.querySelector("#entrada");
const pecas = document.querySelectorAll("[data-peca]");
const cardsProjetos = document.querySelector("#cardsProjetos");
const gradeInstagram = document.querySelector("#gradeInstagram");
const modal = document.querySelector("#modal");
const fecharModal = document.querySelector("#fecharModal");
const modalCategoria = document.querySelector("#modalCategoria");
const modalTitulo = document.querySelector("#modalTitulo");
const modalTexto = document.querySelector("#modalTexto");
const modalLink = document.querySelector("#modalLink");

function moverCursor(evento) {
  cursor.style.left = evento.clientX + "px";
  cursor.style.top = evento.clientY + "px";
}

function mudarTopo() {
  if (window.scrollY > 40) {
    topo.classList.add("com-fundo");
  } else {
    topo.classList.remove("com-fundo");
  }
}

function rolarPara(id) {
  const destino = document.querySelector(id);

  if (destino) {
    destino.scrollIntoView({ behavior: "smooth" });
  }
}

function mostrarProjetos() {
  cardsProjetos.innerHTML = "";

  projetos.forEach(function (projeto, indice) {
    const card = document.createElement("article");
    const rotacao = indice % 2 === 0 ? "-1.5deg" : "1.5deg";

    card.className = "card-projeto";
    card.style.setProperty("--rotacao", rotacao);
    card.innerHTML = `
      <div class="arte-projeto" style="--cor: ${projeto.cor}">
        <strong>${projeto.sigla}</strong>
      </div>
      <div class="info-projeto">
        <span>${projeto.tipo}</span>
        <h3>${projeto.titulo}</h3>
        <p>${projeto.resumo}</p>
        <div class="card-acoes">
          <button type="button" data-acao="${projeto.acao}">${projeto.botao}</button>
        </div>
      </div>
    `;

    card.querySelector("button").addEventListener("click", function () {
      executarAcao(projeto);
    });

    cardsProjetos.appendChild(card);
  });
}

function mostrarPostsInstagram() {
  gradeInstagram.innerHTML = "";

  postsInstagram.forEach(function (post) {
    const item = document.createElement("div");
    item.className = "post-fake";
    item.style.setProperty("--cor", post.cor);
    item.style.setProperty("--rotacao", post.rotacao);
    item.textContent = post.titulo;
    gradeInstagram.appendChild(item);
  });
}

function executarAcao(projeto) {
  if (projeto.acao === "codigo") {
    rolarPara("#codigo");
  }

  if (projeto.acao === "galeria") {
    rolarPara("#instagram");
  }

  if (projeto.acao === "detalhes") {
    abrirModal(projeto);
  }
}

function abrirModal(projeto) {
  modalCategoria.textContent = projeto.tipo;
  modalTitulo.textContent = projeto.titulo;
  modalTexto.textContent = projeto.texto;
  modalLink.href = "#projetos";
  modal.classList.add("aberto");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-aberto");
}

function fecharProjeto() {
  modal.classList.remove("aberto");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-aberto");
}

function deixarArrastavel(peca) {
  let arrastando = false;
  let posicaoX = 0;
  let posicaoY = 0;
  let mexeu = false;

  peca.addEventListener("pointerdown", function (evento) {
    arrastando = true;
    mexeu = false;
    posicaoX = evento.clientX - peca.offsetLeft;
    posicaoY = evento.clientY - peca.offsetTop;
    peca.setPointerCapture(evento.pointerId);
  });

  peca.addEventListener("pointermove", function (evento) {
    if (arrastando) {
      mexeu = true;
      peca.style.left = evento.clientX - posicaoX + "px";
      peca.style.top = evento.clientY - posicaoY + "px";
      peca.style.right = "auto";
      peca.style.bottom = "auto";
    }
  });

  peca.addEventListener("pointerup", function () {
    arrastando = false;

    if (!mexeu) {
      rolarPara(peca.dataset.destino);
    }
  });
}

pecas.forEach(function (peca) {
  deixarArrastavel(peca);
});

fecharModal.addEventListener("click", fecharProjeto);

modal.addEventListener("click", function (evento) {
  if (evento.target === modal) {
    fecharProjeto();
  }
});

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") {
    fecharProjeto();
  }
});

window.addEventListener("mousemove", moverCursor);
window.addEventListener("scroll", mudarTopo);

setTimeout(function () {
  entrada.style.display = "none";
}, 3100);

mostrarProjetos();
mostrarPostsInstagram();
mudarTopo();
