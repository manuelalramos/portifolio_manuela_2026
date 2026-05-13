const topo = document.querySelector("#topo");
const cursor = document.querySelector("#cursor");
const entrada = document.querySelector("#entrada");
const pecas = document.querySelectorAll("[data-peca]");
const blocosComPassagem = document.querySelectorAll("main > section");
const linksComAncora = document.querySelectorAll("a[href*='#']");
const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let esperandoAnimacao = false;
let scrollAlvo = window.scrollY;
let scrollAnimando = false;
let animacaoDeLink = 0;
let barraScroll = null;
let barraScrollBotao = null;

function copiarTexto(texto) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(texto);
  }

  return new Promise(function (resolve, reject) {
    const campo = document.createElement("textarea");
    campo.value = texto;
    campo.setAttribute("readonly", "");
    campo.style.position = "fixed";
    campo.style.opacity = "0";
    document.body.appendChild(campo);
    campo.focus();
    campo.select();

    try {
      document.execCommand("copy");
      document.body.removeChild(campo);
      resolve();
    } catch (erro) {
      document.body.removeChild(campo);
      reject(erro);
    }
  });
}

function prepararCopiaDeChave() {
  const botoesDeChave = document.querySelectorAll("[data-chave]");

  botoesDeChave.forEach(function (botao) {
    const ajuda = botao.parentElement.querySelector("[data-chave-status]");
    const textoOriginal = ajuda ? ajuda.textContent : "";

    botao.addEventListener("click", function () {
      copiarTexto(botao.dataset.chave)
        .then(function () {
          if (!ajuda) {
            return;
          }

          ajuda.textContent = "copiado";
          ajuda.classList.add("copiado");

          window.setTimeout(function () {
            ajuda.textContent = textoOriginal;
            ajuda.classList.remove("copiado");
          }, 1600);
        })
        .catch(function () {
          if (!ajuda) {
            return;
          }

          ajuda.textContent = "nao copiou";

          window.setTimeout(function () {
            ajuda.textContent = textoOriginal;
          }, 1600);
        });
    });
  });
}

function prepararCaseInstagram() {
  const cases = document.querySelectorAll("[data-instagram-case]");

  cases.forEach(function (caseItem) {
    const palco = caseItem.querySelector("[data-instagram-palco]");
    const abrir = caseItem.querySelector("[data-instagram-open]");
    const fechar = caseItem.querySelector("[data-instagram-close]");
    const visaoProjeto = caseItem.querySelector("[data-instagram-view='projeto']");
    const visaoFeed = caseItem.querySelector("[data-instagram-view='feed']");
    const paginaInstagram = caseItem.closest(".pagina-instagram");

    if (!palco || !abrir || !fechar || !visaoProjeto || !visaoFeed) {
      return;
    }

    abrir.addEventListener("click", function () {
      palco.classList.add("feed-aberto");
      visaoProjeto.setAttribute("aria-hidden", "true");
      visaoFeed.setAttribute("aria-hidden", "false");
    });

    fechar.addEventListener("click", function () {
      palco.classList.remove("feed-aberto");
      visaoProjeto.setAttribute("aria-hidden", "false");
      visaoFeed.setAttribute("aria-hidden", "true");

      if (paginaInstagram) {
        paginaInstagram.classList.remove("carrossel-ativo");
      }
    });
  });
}

function prepararFocoCarrossel() {
  const postsCarrossel = document.querySelectorAll("[data-carrossel]");

  postsCarrossel.forEach(function (post) {
    const paginaInstagram = post.closest(".pagina-instagram");
    const preview = post.querySelector(".insta-carrossel-preview");
    const totalSlides = preview ? preview.querySelectorAll(".insta-slide").length : 0;
    let dentroDoPost = false;
    let dentroDoPreview = false;

    if (!paginaInstagram || !preview) {
      return;
    }

    function configurarPreview() {
      const card = post.getBoundingClientRect();
      const larguraTela = window.innerWidth;
      const margem = 24;
      const gap = 16;
      const larguraBase = larguraTela > 980 ? 180 : larguraTela > 760 ? 160 : 140;
      const alturaBase = larguraBase * 1.25;
      const espacoDireita = larguraTela - card.right - margem;
      const espacoEsquerda = card.left - margem;
      const alturaDisponivel = window.innerHeight - card.top - margem;

      post.classList.remove("preview-direita", "preview-esquerda", "preview-abaixo");

      if (larguraTela <= 640) {
        post.classList.add("preview-abaixo");
        post.style.setProperty("--preview-colunas", "1");
        post.style.setProperty("--preview-largura", "250px");
        return;
      }

      if (espacoDireita >= larguraBase * 2 + gap) {
        const colunas = Math.min(3, Math.max(2, Math.floor((espacoDireita + gap) / (larguraBase + gap))));
        post.classList.add("preview-direita");
        post.style.setProperty("--preview-colunas", String(colunas));
        post.style.setProperty("--preview-largura", String(colunas * larguraBase + (colunas - 1) * gap) + "px");
        return;
      }

      if (espacoEsquerda >= larguraBase * 2 + gap) {
        const colunas = Math.min(3, Math.max(2, Math.floor((espacoEsquerda + gap) / (larguraBase + gap))));
        post.classList.add("preview-esquerda");
        post.style.setProperty("--preview-colunas", String(colunas));
        post.style.setProperty("--preview-largura", String(colunas * larguraBase + (colunas - 1) * gap) + "px");
        return;
      }

      const colunas = larguraTela > 760 ? 2 : 1;
      const linhas = Math.ceil(totalSlides / colunas);
      const largura = colunas * larguraBase + (colunas - 1) * gap;
      const altura = linhas * alturaBase + (linhas - 1) * gap;

      post.classList.add("preview-abaixo");
      post.style.setProperty("--preview-colunas", String(colunas));
      post.style.setProperty("--preview-largura", String(largura) + "px");

      if (altura > alturaDisponivel && colunas === 2) {
        post.style.setProperty("--preview-colunas", "1");
        post.style.setProperty("--preview-largura", "250px");
      }
    }

    function atualizarFoco() {
      const estaAtivo = dentroDoPost || dentroDoPreview;
      paginaInstagram.classList.toggle("carrossel-ativo", estaAtivo);
      post.classList.toggle("carrossel-aberto", estaAtivo);
      post.setAttribute("aria-expanded", estaAtivo ? "true" : "false");
    }

    post.addEventListener("mouseenter", function () {
      configurarPreview();
      dentroDoPost = true;
      atualizarFoco();
    });

    post.addEventListener("mouseleave", function () {
      dentroDoPost = false;
      atualizarFoco();
    });

    post.addEventListener("focusin", function () {
      dentroDoPost = true;
      atualizarFoco();
    });

    post.addEventListener("focusout", function () {
      dentroDoPost = false;
      atualizarFoco();
    });

    if (preview) {
      preview.addEventListener("mouseenter", function () {
        dentroDoPreview = true;
        atualizarFoco();
      });

      preview.addEventListener("mouseleave", function () {
        dentroDoPreview = false;
        atualizarFoco();
      });
    }

    if (paginaInstagram) {
      paginaInstagram.addEventListener("mouseleave", function () {
        dentroDoPost = false;
        dentroDoPreview = false;
        atualizarFoco();
      });
    }

    window.addEventListener("resize", function () {
      if (dentroDoPost || dentroDoPreview) {
        configurarPreview();
      }
    });
  });
}

function moverCursor(evento) {
  if (cursor) {
    cursor.style.left = evento.clientX + "px";
    cursor.style.top = evento.clientY + "px";
  }
}

function mudarTopo() {
  if (!topo) {
    return;
  }

  if (window.scrollY > 40) {
    topo.classList.add("com-fundo");
  } else {
    topo.classList.remove("com-fundo");
  }
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
      peca.dataset.mexeu = "sim";
      peca.style.left = evento.clientX - posicaoX + "px";
      peca.style.top = evento.clientY - posicaoY + "px";
      peca.style.right = "auto";
      peca.style.bottom = "auto";
    }
  });

  peca.addEventListener("pointerup", function (evento) {
    arrastando = false;

    if (mexeu) {
      evento.preventDefault();
    }
  });

  peca.addEventListener("click", function (evento) {
    if (peca.dataset.mexeu === "sim") {
      evento.preventDefault();
      peca.dataset.mexeu = "nao";
    }
  });
}

function limiteDoScroll() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function limitarScroll(valor) {
  return Math.min(Math.max(valor, 0), limiteDoScroll());
}

function moverScrollComInercia() {
  const atual = window.scrollY;
  const distancia = scrollAlvo - atual;

  if (Math.abs(distancia) < 0.4) {
    window.scrollTo(0, scrollAlvo);
    scrollAnimando = false;
    pedirAtualizacaoVisual();
    return;
  }

  window.scrollTo(0, atual + distancia * 0.18);
  pedirAtualizacaoVisual();
  requestAnimationFrame(moverScrollComInercia);
}

function animarScrollInercial(destino) {
  if (movimentoReduzido) {
    window.scrollTo(0, limitarScroll(destino));
    return;
  }

  scrollAlvo = limitarScroll(destino);

  if (!scrollAnimando) {
    scrollAnimando = true;
    requestAnimationFrame(moverScrollComInercia);
  }
}

function rolagemDoMouse(evento) {
  if (movimentoReduzido || evento.ctrlKey) {
    return;
  }

  evento.preventDefault();
  animacaoDeLink += 1;

  const unidade = evento.deltaMode === 1
    ? 46
    : evento.deltaMode === 2
      ? window.innerHeight
      : 1.65;

  animarScrollInercial(scrollAlvo + evento.deltaY * unidade);
}

function animarScrollAte(destino) {
  animacaoDeLink += 1;

  const idDaAnimacao = animacaoDeLink;
  const inicio = window.scrollY;
  const final = limitarScroll(destino);
  const distancia = final - inicio;
  const duracao = 1400;
  const comeco = performance.now();

  function suavizar(progresso) {
    return progresso < 0.5
      ? 4 * progresso * progresso * progresso
      : 1 - Math.pow(-2 * progresso + 2, 3) / 2;
  }

  function animar(agora) {
    if (idDaAnimacao !== animacaoDeLink) {
      return;
    }

    const tempo = Math.min((agora - comeco) / duracao, 1);
    const valor = inicio + distancia * suavizar(tempo);

    window.scrollTo(0, valor);
    scrollAlvo = valor;
    pedirAtualizacaoVisual();

    if (tempo < 1) {
      requestAnimationFrame(animar);
    } else {
      scrollAlvo = final;
    }
  }

  requestAnimationFrame(animar);
}

function prepararLinksSuaves() {
  linksComAncora.forEach(function (link) {
    link.addEventListener("click", function (evento) {
      const url = new URL(link.href);

      if (url.pathname !== window.location.pathname || !url.hash) {
        return;
      }

      const alvo = document.querySelector(url.hash);

      if (!alvo) {
        return;
      }

      evento.preventDefault();

      if (movimentoReduzido) {
        alvo.scrollIntoView();
        return;
      }

      animarScrollAte(alvo.offsetTop);
      history.pushState(null, "", url.hash);
    });
  });
}

function atualizarPassagem() {
  if (movimentoReduzido) {
    return;
  }

  const meioDaTela = window.innerHeight / 2;
  const limite = window.innerHeight * 0.9;

  blocosComPassagem.forEach(function (bloco) {
    const posicao = bloco.getBoundingClientRect();
    const meioDoBloco = posicao.top + posicao.height / 2;
    const distancia = Math.abs(meioDoBloco - meioDaTela);
    const forca = 1 - Math.min(distancia / limite, 1);
    const opacidade = 0.36 + forca * 0.64;
    const deslocamento = (1 - forca) * 26;

    bloco.style.opacity = opacidade.toFixed(3);
    bloco.style.transform = "translateY(" + deslocamento.toFixed(1) + "px)";
  });
}

function pedirAtualizacaoVisual() {
  if (esperandoAnimacao) {
    return;
  }

  esperandoAnimacao = true;

  requestAnimationFrame(function () {
    mudarTopo();
    atualizarPassagem();
    atualizarBarraScroll();
    esperandoAnimacao = false;
  });
}

function criarBarraScroll() {
  const barra = document.createElement("div");
  const botao = document.createElement("div");

  barra.className = "barra-scroll";
  botao.className = "barra-scroll-botao";
  barra.appendChild(botao);
  document.body.appendChild(barra);
  barraScroll = barra;
  barraScrollBotao = botao;

  let arrastando = false;

  function rolarPeloPonteiro(evento) {
    const area = barra.getBoundingClientRect();
    const limiteScrollAtual = limiteDoScroll();
    const espaco = Math.max(1, area.height - botao.offsetHeight);
    const posicao = Math.min(Math.max(evento.clientY - area.top - botao.offsetHeight / 2, 0), espaco);

    animacaoDeLink += 1;
    scrollAlvo = limiteScrollAtual * (posicao / espaco);
    window.scrollTo(0, scrollAlvo);
    pedirAtualizacaoVisual();
  }

  botao.addEventListener("pointerdown", function (evento) {
    arrastando = true;
    botao.setPointerCapture(evento.pointerId);
  });

  botao.addEventListener("pointermove", function (evento) {
    if (arrastando) {
      rolarPeloPonteiro(evento);
    }
  });

  botao.addEventListener("pointerup", function () {
    arrastando = false;
  });

  barra.addEventListener("click", function (evento) {
    if (evento.target === barra) {
      rolarPeloPonteiro(evento);
    }
  });
}

function atualizarBarraScroll() {
  const barra = barraScroll;
  const botao = barraScrollBotao;

  if (!barra || !botao) {
    return;
  }

  if (document.documentElement.classList.contains("entrada-ativa")) {
    barra.classList.add("barra-scroll-sumida");
    return;
  }

  const alturaTotal = document.documentElement.scrollHeight;
  const limiteScrollAtual = limiteDoScroll();

  if (limiteScrollAtual <= 0) {
    barra.classList.add("barra-scroll-sumida");
    return;
  }

  barra.classList.remove("barra-scroll-sumida");

  const alturaBarra = barra.clientHeight;
  const alturaBotao = Math.max(44, alturaBarra * (window.innerHeight / alturaTotal));
  const espaco = Math.max(0, alturaBarra - alturaBotao);
  const posicaoBotao = Math.min(espaco, (window.scrollY / limiteScrollAtual) * espaco);

  botao.style.height = alturaBotao + "px";
  botao.style.transform = "translateY(" + posicaoBotao + "px)";
}

pecas.forEach(function (peca) {
  deixarArrastavel(peca);
});

window.addEventListener("mousemove", moverCursor);
window.addEventListener("wheel", rolagemDoMouse, { passive: false, capture: true });
window.addEventListener("scroll", pedirAtualizacaoVisual);
window.addEventListener("resize", pedirAtualizacaoVisual);

if (entrada) {
  document.documentElement.classList.add("entrada-ativa");
  setTimeout(function () {
    entrada.style.display = "none";
    document.documentElement.classList.remove("entrada-ativa");
    if (barraScroll) {
      barraScroll.classList.remove("barra-scroll-sumida");
    }
    pedirAtualizacaoVisual();
  }, 3100);
}

blocosComPassagem.forEach(function (bloco) {
  bloco.classList.add("passagem-scroll");
});

criarBarraScroll();
if (entrada && barraScroll) {
  barraScroll.classList.add("barra-scroll-sumida");
}
prepararLinksSuaves();
prepararCopiaDeChave();
prepararCaseInstagram();
prepararFocoCarrossel();
pedirAtualizacaoVisual();
