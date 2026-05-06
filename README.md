# Portfolio da Manuela

Este projeto e uma landing page artistica em HTML, CSS e JavaScript com visual de portfolio editorial/collage.

## Arquivos

- `index.html`: conteudo da pagina, secoes, menu e textos.
- `assets/pages/projetos.html`: indice das categorias de projeto.
- `assets/pages/instagram.html`: pagina dos projetos de Instagram.
- `assets/pages/ux.html`: pagina dos projetos de UI/UX.
- `assets/pages/ads.html`: pagina dos projetos de ADS.
- `assets/pages/codigo.html`: pagina dos projetos de Codigo.
- `assets/css/styles.css`: cores, tamanhos, animacoes, pastas e responsividade.
- `assets/js/script.js`: luz do mouse, entrada animada e navbar com fundo ao rolar.
- `LOGO.svg`: sua logo.

## Onde editar os projetos

Os atalhos em formato de pasta ficam na Home, dentro de `index.html`, na secao:

```txt
home-projetos
```

A pagina indice fica em `assets/pages/projetos.html`.

Cada tipo de projeto tem uma pagina propria:

- `assets/pages/instagram.html`: galeria de posts.
- `assets/pages/ux.html`: projeto visual no estilo de case.
- `assets/pages/ads.html`: trabalhos da faculdade.
- `assets/pages/codigo.html`: projetos de programacao.

O menu do topo tambem tem um dropdown em `projetos`, com link direto para cada uma dessas paginas.

Cada pagina usa esta ideia:

- lado esquerdo: texto do projeto.
- lado direito: imagens que aparecem durante o scroll.
- para trocar imagem, coloque o arquivo na pasta certa ou mude o `src` da imagem no HTML.

## Pastas de imagens

A pagina de projetos ja procura imagens nestas pastas:

```txt
projetos/instagram/image.png
projetos/instagram/post-01.png
projetos/instagram/post-02.png
projetos/instagram/post-03.png
projetos/instagram/banner-01.png

projetos/ux/image.png
projetos/ux/desktop.png
projetos/ux/mobile.png
projetos/ux/processo.png

projetos/ads/image.png
projetos/ads/logica.png
projetos/ads/documentacao.png

projetos/codigo/image.png
projetos/codigo/game.png
```

Se a imagem ainda nao existir, o site continua funcionando com o visual de pasta e placeholder.

## About e creative license

O About agora espera uma imagem pronta da carteira.

Salve sua arte na pasta com este nome:

```txt
creative-license.png
```

Quando esse arquivo existir, o site mostra a imagem automaticamente. Se ele ainda nao existir, aparece um placeholder dizendo onde colocar.

## CV

O botao de CV aponta para `CV-Manuela.pdf`. Coloque seu PDF com esse nome na pasta para o download funcionar.
