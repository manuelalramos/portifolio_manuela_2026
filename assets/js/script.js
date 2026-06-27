const topo = document.querySelector("#topo");
const entrada = document.querySelector("#entrada");
const linksComAncora = document.querySelectorAll("a[href*='#']");
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

if (entrada) {
  document.documentElement.classList.add("entrada-ativa");

  window.setTimeout(function () {
    entrada.style.display = "none";
    document.documentElement.classList.remove("entrada-ativa");
  }, 2600);
}

window.addEventListener("scroll", mudarTopo);

mudarTopo();
prepararLinksSuaves();
prepararCopiaDeChave();
