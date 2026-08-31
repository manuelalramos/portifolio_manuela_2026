const topo = document.querySelector("#topo");
const entrada = document.querySelector("#entrada");
const cursor = document.querySelector("#cursor");
const botaoMenu = document.querySelector(".menu-botao");
const menuPrincipal = document.querySelector(".menu");
const linksComAncora = document.querySelectorAll("a[href*='#']");
const linksDoMenu = document.querySelectorAll(".menu a");
const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function mudarTopo() {
  if (!topo) {
    return;
  }

  topo.classList.toggle("com-fundo", window.scrollY > 40);
}

function fecharMenu() {
  if (!topo || !botaoMenu) {
    return;
  }

  topo.classList.remove("menu-aberto");
  document.documentElement.classList.remove("menu-aberto-site");
  botaoMenu.setAttribute("aria-expanded", "false");
  botaoMenu.setAttribute("aria-label", "Abrir menu");
  botaoMenu.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
}

function alternarMenu() {
  if (!topo || !botaoMenu) {
    return;
  }

  const menuAberto = topo.classList.toggle("menu-aberto");
  document.documentElement.classList.toggle("menu-aberto-site", menuAberto);
  botaoMenu.setAttribute("aria-expanded", String(menuAberto));
  botaoMenu.setAttribute("aria-label", menuAberto ? "Fechar menu" : "Abrir menu");
  botaoMenu.innerHTML = menuAberto
    ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
    : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
}

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
      alvo.scrollIntoView({
        behavior: movimentoReduzido ? "auto" : "smooth",
        block: "start"
      });
      history.pushState(null, "", url.hash);
      fecharMenu();
    });
  });
}

function prepararMenuMobile() {
  if (!botaoMenu || !menuPrincipal) {
    return;
  }

  botaoMenu.addEventListener("click", alternarMenu);

  linksDoMenu.forEach(function (link) {
    link.addEventListener("click", fecharMenu);
  });

  window.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      fecharMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 780) {
      fecharMenu();
    }
  });
}

function atualizarMenuAtivo() {
  if (!linksDoMenu.length) {
    return;
  }

  const paginaCertificados = window.location.pathname.includes("certificados.html")
    || window.location.pathname.includes("certificates.html");
  let idAtivo = "";

  if (paginaCertificados) {
    idAtivo = "certificados";
  } else {
    const secoes = ["inicio", "sobre", "projetos", "contato"]
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);

    const linhaDeLeitura = window.innerHeight * 0.38;

    secoes.forEach(function (secao) {
      if (secao.getBoundingClientRect().top <= linhaDeLeitura) {
        idAtivo = secao.id;
      }
    });

    if (!idAtivo) {
      idAtivo = "inicio";
    }
  }

  linksDoMenu.forEach(function (link) {
    const href = link.getAttribute("href") || "";
    const linkDeIdioma = link.classList.contains("idioma-link");
    const linkDeCertificados = href.includes("certificados.html") || href.includes("certificates.html");
    const ativo = !linkDeIdioma && (paginaCertificados
      ? linkDeCertificados
      : href.endsWith("#" + idAtivo));

    link.classList.toggle("ativo", ativo);

    if (ativo) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function prepararRevelacao() {
  const elementos = document.querySelectorAll([
    ".hero-conteudo",
    ".sobre-texto",
    ".license-wrap",
    ".faixa-palavras",
    ".secao-cabecalho",
    ".projeto-card",
    ".processo-linha li",
    ".contato > .detalhe",
    ".contato > h2",
    ".contato-resumo",
    ".links a",
    ".footer-grid",
    ".certificado-card"
  ].join(","));

  if (!elementos.length) {
    return;
  }

  elementos.forEach(function (elemento) {
    elemento.classList.add("revelar");
  });

  if (movimentoReduzido || !("IntersectionObserver" in window)) {
    elementos.forEach(function (elemento) {
      elemento.classList.add("revelar-visivel");
    });
    return;
  }

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entradaObservada) {
      if (!entradaObservada.isIntersecting) {
        return;
      }

      entradaObservada.target.classList.add("revelar-visivel");
      observador.unobserve(entradaObservada.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px"
  });

  elementos.forEach(function (elemento) {
    observador.observe(elemento);
  });
}

function prepararLuzDoCursor() {
  if (!cursor || movimentoReduzido || window.matchMedia("(pointer: coarse)").matches) {
    return;
  }

  window.addEventListener("mousemove", function (evento) {
    cursor.classList.add("cursor-ativo");
    cursor.style.transform = "translate3d(" + (evento.clientX - 13) + "px, " + (evento.clientY - 13) + "px, 0)";
  });

  window.addEventListener("mouseleave", function () {
    cursor.classList.remove("cursor-ativo");
  });
}

function prepararScrollFlutuante() {
  const mediaDesktop = window.matchMedia("(min-width: 681px)");
  const barra = document.createElement("div");
  const thumb = document.createElement("div");
  let arrastando = false;
  let deslocamentoDoClique = 0;
  let metricasAtuais = null;

  barra.className = "scrollbar-flutuante";
  thumb.className = "scrollbar-flutuante-thumb";
  barra.setAttribute("aria-hidden", "true");
  barra.appendChild(thumb);
  document.body.appendChild(barra);

  function obterMetricasScroll() {
    const alturaPagina = document.documentElement.scrollHeight;
    const alturaTela = document.documentElement.clientHeight;
    const podeMostrar = mediaDesktop.matches && alturaPagina > alturaTela;

    if (!podeMostrar) {
      return null;
    }

    const margemThumb = 10;
    const alturaTrilho = Math.max(0, barra.clientHeight - margemThumb * 2);
    const alturaThumb = Math.max(44, (alturaTela / alturaPagina) * alturaTrilho);
    const limiteScroll = alturaPagina - alturaTela;
    const limiteThumb = alturaTrilho - alturaThumb;

    return {
      margemThumb: margemThumb,
      alturaThumb: alturaThumb,
      limiteScroll: limiteScroll,
      limiteThumb: limiteThumb
    };
  }

  function rolarParaPosicaoDoThumb(posicaoThumb) {
    const metricas = metricasAtuais || obterMetricasScroll();

    if (!metricas || metricas.limiteThumb <= 0) {
      return;
    }

    const posicaoNormalizada = Math.min(
      metricas.limiteThumb,
      Math.max(0, posicaoThumb - metricas.margemThumb)
    );
    const progresso = posicaoNormalizada / metricas.limiteThumb;

    window.scrollTo({
      top: progresso * metricas.limiteScroll,
      behavior: "auto"
    });
  }

  function atualizarScroll() {
    metricasAtuais = obterMetricasScroll();
    barra.style.display = metricasAtuais ? "block" : "none";

    if (!metricasAtuais) {
      return;
    }

    const posicaoThumb = metricasAtuais.margemThumb
      + (metricasAtuais.limiteScroll > 0
        ? (window.scrollY / metricasAtuais.limiteScroll) * metricasAtuais.limiteThumb
        : 0);

    thumb.style.height = metricasAtuais.alturaThumb + "px";
    thumb.style.transform = "translateY(" + posicaoThumb + "px)";
  }

  thumb.addEventListener("pointerdown", function (evento) {
    if (!mediaDesktop.matches) {
      return;
    }

    metricasAtuais = obterMetricasScroll();

    if (!metricasAtuais) {
      return;
    }

    const retanguloThumb = thumb.getBoundingClientRect();

    arrastando = true;
    deslocamentoDoClique = evento.clientY - retanguloThumb.top;
    barra.classList.add("arrastando");
    thumb.setPointerCapture(evento.pointerId);
    evento.preventDefault();
  });

  barra.addEventListener("pointerdown", function (evento) {
    if (evento.target === thumb || !mediaDesktop.matches) {
      return;
    }

    metricasAtuais = obterMetricasScroll();

    if (!metricasAtuais) {
      return;
    }

    const retanguloBarra = barra.getBoundingClientRect();
    rolarParaPosicaoDoThumb(evento.clientY - retanguloBarra.top - (metricasAtuais.alturaThumb / 2));
    evento.preventDefault();
  });

  thumb.addEventListener("pointermove", function (evento) {
    if (!arrastando) {
      return;
    }

    const retanguloBarra = barra.getBoundingClientRect();
    rolarParaPosicaoDoThumb(evento.clientY - retanguloBarra.top - deslocamentoDoClique);
  });

  thumb.addEventListener("pointerup", function (evento) {
    if (!arrastando) {
      return;
    }

    arrastando = false;
    barra.classList.remove("arrastando");
    thumb.releasePointerCapture(evento.pointerId);
  });

  thumb.addEventListener("pointercancel", function () {
    arrastando = false;
    barra.classList.remove("arrastando");
  });

  window.addEventListener("scroll", atualizarScroll);
  window.addEventListener("resize", atualizarScroll);
  atualizarScroll();
}

if (entrada) {
  document.documentElement.classList.add("entrada-ativa");

  window.setTimeout(function () {
    entrada.style.display = "none";
    document.documentElement.classList.remove("entrada-ativa");
  }, 2600);
}

window.addEventListener("scroll", function () {
  mudarTopo();
  atualizarMenuAtivo();
});
window.addEventListener("resize", atualizarMenuAtivo);

mudarTopo();
prepararLinksSuaves();
prepararMenuMobile();
prepararCopiaDeChave();
prepararRevelacao();
prepararLuzDoCursor();
prepararScrollFlutuante();
atualizarMenuAtivo();
