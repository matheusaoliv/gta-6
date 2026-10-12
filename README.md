# GTA VI — Contagem Regressiva

Uma contagem regressiva cinematográfica, **feita por fã**, para o lançamento de
**Grand Theft Auto VI em 19 de novembro de 2026** (PS5 e Xbox Series X|S).
Ela usa o [site oficial](https://www.rockstargames.com/VI) como referência e
tenta ir além dele em movimento e interatividade.

> Projeto não oficial e sem fins lucrativos. Não é afiliado à Rockstar Games
> nem à Take-Two Interactive.

## O que tem na página

| Seção | Destaques |
|---|---|
| **Portão de som** | Loader com o logo "VI" se preenchendo. Você escolhe entrar com ou sem trilha, e ao entrar a câmera atravessa o "I" do logo. |
| **Contagem (hero)** | Arte oficial renderizada em **WebGL**: aparece por um dissolve de "nascer do sol", tem miragem de calor, aberração cromática, parallax de mouse e grão de filme. Os dígitos giram como num **caça-níquel** antes de parar no tempo real. |
| **Mergulho pelo VI** | O logo vira uma janela recortada sobre Vice City e cresce com o scroll até a imagem tomar a tela inteira. |
| **Trailers** | Trailer 1, Trailer 2 e *An Extended Look*. Abrem em modal, e a rádio pausa sozinha e volta quando você fecha. |
| **Jason & Lucia** | Painéis que se expandem no hover, com galeria automática e revelação em cortina. |
| **Rostos de Leonida** | Scroll horizontal fixado, com as ilustrações oficiais em camadas e parallax. |
| **Leonida** | As 6 regiões trocam com o scroll: transição em máscara, logos oficiais e um "cartão-postal" que gira. |
| **Rádio Leonida** | Dial no estilo do jogo com as **6 prévias oficiais das rádios** (Flash FM, Cocoteo FM, Back Country, AfroBank, The Chamber, Dirty South). Tem lista de faixas sincronizada, HUD de troca de estação igual ao do GTA, chiado de sintonia, visualizador e controles na tela de bloqueio (Media Session). |
| **A capa se monta** | Os 10 painéis da arte oficial voam em 3D e se encaixam com o scroll. |
| **Cartões-postais** | Galeria em esteiras infinitas que reagem à velocidade do scroll, dá para arrastar e abre em lightbox (teclado e swipe). |
| **A jornada** | Mostra, com 7 casas decimais, quanto da espera desde o Trailer 1 já passou, mais uma linha do tempo com o marcador "você está aqui". |
| **Final** | "Nos vemos em Leonida", com um botão que baixa um arquivo `.ics` (pré-download em 12/11 e lançamento em 19/11) e outro para compartilhar. |

Detalhes extras:

- Player fixo da rádio, que some no hero e na seção da rádio.
- Cursor personalizado com rótulos e botões magnéticos.
- Barra de progresso de leitura, menu mobile e o título da aba com os dias restantes.

## Como rodar

O site é estático (HTML, CSS e JS), sem build. Os vídeos do YouTube precisam
de uma origem `http(s)`, então sirva a pasta com qualquer servidor estático:

```bash
npx http-server . -p 8080 -c-1
# ou
python3 -m http.server 8080
```

Depois abra `http://localhost:8080`.

### Publicar no GitHub Pages

1. Vá em **Settings → Pages** do repositório.
2. Em *Source*, escolha **Deploy from a branch**, depois a branch e a pasta `/ (root)`.
3. O site fica em `https://<usuário>.github.io/gta-6/`.

As tags `og:url` e `og:image` do `index.html` já apontam para
`https://matheusaoliv.github.io/gta-6/`. Se publicar em outro endereço,
ajuste essas duas tags.

## Estrutura

```
index.html
assets/
  css/main.css          # tokens, layout e componentes
  js/data.js            # datas, estações (faixas + tempos) e lugares
  js/main.js            # contagem, scroll (Lenis + ScrollTrigger), seções, modais, cursor
  js/radio.js           # player das rádios, HUD, visualizador e Media Session
  js/radio-levels.js    # envelopes de energia (4 bandas, 20 fps) de cada prévia
  js/webgl.js           # shader do hero
  js/vendor/            # GSAP 3.15 (ScrollTrigger, SplitText, CustomEase) e Lenis 1.3
  fonts/                # Big Shoulders Display, Manrope, Mr Dafoe, IBM Plex Mono (OFL)
  img/                  # artes e capturas oficiais otimizadas em WebP
```

## Notas importantes

- **Horário:** a contagem vai até a **meia-noite de 19/11/2026 no fuso do
  visitante**, porque a Rockstar ainda não anunciou o horário exato de
  liberação. Para mudar, edite `release` em `assets/js/data.js`.
- **Música:** as prévias das rádios **não estão neste repositório**. Elas são
  tocadas direto de `rockstargames.com`. O site oficial não libera CORS, então
  o visualizador usa envelopes de energia pré-calculados (`radio-levels.js`),
  sincronizados com o tempo da faixa. Se a Rockstar mudar os arquivos, o
  player mostra um aviso com link para a página oficial de música.
- **An Extended Look:** esse vídeo tem restrição de idade no YouTube e não pode
  ser incorporado. No lugar dele, o modal mostra links para YouTube, Netflix e
  a versão em alta qualidade do site oficial. Os trailers 1 e 2 tocam
  normalmente dentro da página.
- **Acessibilidade:** com `prefers-reduced-motion` ligado, a página desativa
  o scroll suave, os pins, o WebGL e as animações longas. Também há navegação
  por teclado (modais com Esc e foco preso, setas no dial da rádio e na
  galeria) e textos alternativos em português.

## Créditos

- Grand Theft Auto VI, os logotipos, as artes, as capturas, os trailers e as
  prévias de rádio: © Rockstar Games / Take-Two Interactive e seus
  licenciadores.
- Trailers: canal oficial da Rockstar Games no YouTube.
- Bibliotecas: [GSAP](https://gsap.com) (licença padrão "no charge") e
  [Lenis](https://github.com/darkroomengineering/lenis) (MIT).
- Fontes (SIL Open Font License), via Fontsource: Big Shoulders Display,
  Manrope, Mr Dafoe e IBM Plex Mono.
