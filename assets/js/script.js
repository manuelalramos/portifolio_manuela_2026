const topo = document.querySelector("#topo");
const entrada = document.querySelector("#entrada");
const cursor = document.querySelector("#cursor");
const linksComAncora = document.querySelectorAll("a[href*='#']");
const linksDoMenu = document.querySelectorAll(".menu a");
const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function mudarTopo() {
  if (!topo) {
    return;
  }

  topo.classList.toggle("com-fundo", window.scrollY > 40);
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
    });
  });
}

function atualizarMenuAtivo() {
  if (!linksDoMenu.length) {
    return;
  }

  const paginaCertificados = window.location.pathname.includes("certificados.html");
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
    const ativo = paginaCertificados
      ? href.includes("certificados.html")
      : href.endsWith("#" + idAtivo);

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
prepararCopiaDeChave();
prepararRevelacao();
prepararLuzDoCursor();
atualizarMenuAtivo();
