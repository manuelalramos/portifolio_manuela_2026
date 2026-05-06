# Portfolio da Manuela

Este projeto e uma landing page artistica em HTML, CSS e JavaScript com visual de portfolio editorial/collage.

## Arquivos

- `index.html`: conteudo da pagina, secoes, menu e textos.
- `styles.css`: cores, tamanhos, animacoes, passaporte visual e responsividade.
- `script.js`: cards de projetos, modal de detalhes, galeria de Instagram, luz do mouse, posters arrastaveis e navbar com fundo ao rolar.
- `LOGO.svg`: sua logo.

## Onde editar os projetos

Abra `script.js` e procure por:

```js
const projetos = [
```

Cada projeto segue este modelo:

```js
{
  titulo: "Nome do projeto",
  categoria: "instagram",
  tipo: "design e marketing",
  sigla: "IG",
  cor: "#ec6f66",
  resumo: "Texto curto que aparece no card.",
  texto: "Descricao maior que aparece nos detalhes.",
  acao: "galeria",
  botao: "abrir galeria"
}
```

- `acao: "galeria"` leva para a galeria de Instagram.
- `acao: "codigo"` leva para a area de codigo.
- `acao: "detalhes"` abre o modal com mais informacoes.

## Galeria de Instagram

No `script.js`, procure por:

```js
const postsInstagram = [
```

Por enquanto os posts sao blocos coloridos. Quando voce tiver imagens reais, coloque os arquivos na pasta e depois trocamos esses blocos por imagens.

## About e passaporte

O passaporte atual foi feito com HTML e CSS porque nao havia um arquivo de passaporte na pasta. Quando voce colocar a imagem real na pasta, da para substituir a div `.passaporte` por uma imagem.

## CV

O botao de CV aponta para `CV-Manuela.pdf`. Coloque seu PDF com esse nome na pasta para o download funcionar.
