const topo = document.querySelector("#topo");
const cursor = document.querySelector("#cursor");
const entrada = document.querySelector("#entrada");
const pecas = document.querySelectorAll("[data-peca]");

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

pecas.forEach(function (peca) {
  deixarArrastavel(peca);
});

window.addEventListener("mousemove", moverCursor);
window.addEventListener("scroll", mudarTopo);

if (entrada) {
  setTimeout(function () {
    entrada.style.display = "none";
  }, 3100);
}

mudarTopo();
