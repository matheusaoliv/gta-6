<div align="center">

# GTA VI — Contagem Regressiva

**Uma contagem regressiva cinematográfica, feita por fã, para o lançamento de
Grand Theft Auto VI em 19 de novembro de 2026.**

[**▶ Ver ao vivo**](https://matheusaoliv.github.io/gta-6/) ·
[Recursos](#o-que-tem-no-site) ·
[Vídeos e idade](#vídeos-dentro-do-site-com-verificação-de-idade) ·
[Rádio](#rádio-leonida) ·
[Rodar localmente](#como-rodar)

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-online-ff4f9a?style=flat-square&logo=github)
![GSAP](https://img.shields.io/badge/GSAP-3.15-88ce02?style=flat-square&logo=greensock&logoColor=white)
![Lenis](https://img.shields.io/badge/Lenis-1.3-ffc56b?style=flat-square)
![WebGL](https://img.shields.io/badge/WebGL-shader%20próprio-7b6cff?style=flat-square&logo=webgl&logoColor=white)
![Sem build](https://img.shields.io/badge/build-nenhum-45f0d1?style=flat-square)

![Contagem regressiva com Jason e Lucia sentados num carro em Vice City](docs/hero.jpg)

</div>

Inspirado no [site oficial](https://www.rockstargames.com/VI), o projeto tenta
ir além dele em movimento e interatividade: arte em WebGL, o logo "VI" virando
portal, rádio do jogo tocando de verdade e o *An Extended Look* passando dentro
da página, junto com os trailers 1 e 2.

> **Projeto não oficial e sem fins lucrativos.** Não é afiliado à Rockstar Games
> nem à Take-Two Interactive. Todo o conteúdo do jogo pertence aos seus donos.

---

## O que tem no site

| | |
|---|---|
| ![Mergulho pelo logo VI até Vice City](docs/vice-city.jpg) | **Mergulho pelo VI.** O logo vira uma janela recortada sobre Vice City e cresce com o scroll até a imagem tomar a tela inteira. É a assinatura do site oficial, reimaginada. |
| ![Regiões de Leonida](docs/leonida.jpg) | **Leonida.** As 6 regiões (Vice City, Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia e Mount Kalaga) trocam com o scroll, com transição em máscara, logos oficiais e um cartão-postal que gira. |
| ![Rádio Leonida](docs/radio.jpg) | **Rádio Leonida.** Um dial no estilo do jogo com as 6 prévias oficiais das rádios. A lista de faixas é sincronizada, há o aviso de troca de estação igual ao do GTA, chiado de sintonia e um visualizador que reage à música. |
| ![Capa oficial se montando](docs/capa.jpg) | **A capa se monta.** Os 10 painéis da arte oficial voam em 3D e se encaixam com o scroll. |
| ![Jason e Lucia](docs/personagens.jpg) | **Jason & Lucia e o elenco.** Painéis que se expandem no hover, galerias automáticas e o elenco de apoio em scroll horizontal, com as ilustrações oficiais em camadas. |
| ![A jornada](docs/jornada.jpg) | **A jornada.** Mostra, com 7 casas decimais, quanto da espera desde o Trailer 1 já passou, mais uma linha do tempo com o marcador "você está aqui". |

Também tem:

- **Entrada:** portão de som, onde você escolhe entrar com ou sem trilha, e um mergulho pelo "I" do logo.
- **Contagem:** dígitos que giram como num caça-níquel, e a contagem acompanha você no menu e no título da aba.
- **Trailers:** os três vídeos oficiais tocam num player próprio, dentro de um modal. A rádio pausa sozinha e volta quando você fecha.
- **Galeria:** 24 capturas oficiais em esteiras infinitas que reagem ao scroll, com arraste e lightbox (teclado e swipe).
- **Guia do lançamento:** a hora em que GTA VI libera em cada país (das 11 janelas da PlayStation Store), convertida para o relógio de quem visita e com contagem por linha; o passo a passo para jogar antes no Xbox pela Nova Zelândia; os fatos confirmados (pré-download, 212 GB, preço, 30 FPS, reviews, trilha) com links para as fontes; e perguntas frequentes com dados estruturados para o Google.
- **Contagem no fuso certo:** no Brasil a contagem vai até a meia-noite de Brasília mesmo para quem está em Manaus ou Cuiabá, e nos EUA e Canadá até a meia-noite da costa leste, como a loja libera.
- **Passagem para Vice City:** em [`passagem.html`](https://matheusaoliv.github.io/gta-6/passagem.html) cada fã emite o cartão de embarque do voo LA 1119 (veja abaixo).
- **Agenda e compartilhamento:** o botão de agenda abre as opções Google Agenda, Calendário da Apple, Outlook e arquivo `.ics`, com o lançamento (19/11) e a liberação na Nova Zelândia (18/11, para jogar antes no Xbox). A opção do seu aparelho aparece primeiro. Outro botão compartilha a contagem.
- **Detalhes:** player fixo da rádio, cursor personalizado, botões magnéticos e grão de filme.

<div align="center">

![Versão mobile](docs/mobile.jpg)

*Tudo funciona no celular, inclusive o player e a rádio.*

</div>

---

## Passagem para Vice City

Um balcão de check-in da Leonida Airways (companhia fictícia criada para o site)
em que o fã monta o próprio cartão de embarque para o lançamento:

- **Ao vivo:** o bilhete se monta enquanto você digita, com as letras girando
  como num letreiro de aeroporto.
- **Escolhas:** cidade de partida (Brasil, Portugal, mundo e as cidades da série),
  classe (Econômica, Executiva ou Primeira, cada uma com foto e paleta próprias),
  quem viaja com você (Jason, Lucia, os dois ou sozinho) e a rádio de bordo.
- **Assento e localizador** saem do nome: o mesmo nome gera sempre o mesmo bilhete.
- **QR code de verdade:** abre o bilhete da pessoa no site. O estado vai na URL,
  sem servidor e sem cadastro.
- **Dois bilhetes:** vertical (1080x1800) e horizontal com canhoto destacável
  (2000x820), cada um exportável sozinho ou como post.
- **Posts prontos** para os dois bilhetes: story do Instagram (1080x1920), feed
  vertical 4:5 (1080x1350) e feed horizontal 1,91:1 (1920x1005), com
  compartilhamento direto no celular (Web Share).
- **Carimbo de chegada:** a partir da meia-noite de 19/11 todo bilhete sai
  carimbado pela imigração de Leonida.
- **Bilhetes secretos** para alguns nomes da série.

Tudo é desenhado num `<canvas>`
([`assets/js/passagem.js`](assets/js/passagem.js)). O QR usa a
[qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (MIT).

---

## Vídeos dentro do site, com verificação de idade

![Verificação de idade antes do vídeo](docs/verificacao-idade.jpg)

Antes do primeiro vídeo, o site pede a **data de nascimento** e só libera para
quem tem 18 anos ou mais (classificação indicativa no Brasil; ESRB Mature 17+).

- **Como funciona:** é uma autodeclaração, igual à do site da Rockstar. A
  resposta fica só no navegador (`localStorage`, se você marcar "lembrar"). Quem
  informa menos de 18 anos fica bloqueado na sessão.
- **Por que não usar o player do YouTube:** os vídeos de GTA VI estão
  bloqueados para reprodução fora do YouTube (erro 150 do player), e a
  verificação de idade de lá depende da conta logada. Por isso os vídeos tocam
  num player próprio.

O que acontece com cada vídeo:

| Vídeo | Onde toca | Por quê |
|---|---|---|
| **An Extended Look** | **Dentro do site**, no player próprio | A Rockstar publica o vídeo em MP4 (H.264) no CDN de vídeo dela, em 360p, 720p, 1080p e 4K, com **legendas oficiais em português**. O player transmite direto de lá. |
| **Trailer de lançamento** | **Dentro do site**, no player próprio | Em 1080p, convertido do download oficial e hospedado aqui (40 MB); em 4K, o arquivo oficial da Rockstar (H.264, cerca de 70 Mbps) direto do CDN dela. |
| **Trailer 1** e **Trailer 2** | **Dentro do site**, no player próprio | A Rockstar só oferece esses trailers como download 4K em MPEG-4 Part 2, codec que nenhum navegador reproduz. Eles foram convertidos para H.264 1080p (cerca de 3,7 Mbps, com `faststart` para começar a tocar antes de baixar tudo) e ficam em [`assets/video/`](assets/video/): 41 MB e 78 MB. |

Para refazer a conversão a partir dos arquivos oficiais:

```bash
# Trailer_1 -> gtavi-trailer-1, Trailer_2 -> gtavi-trailer-2, Launch_Trailer -> gtavi-launch-trailer
for n in Trailer_1 Trailer_2 Launch_Trailer; do
  out=gtavi-$(echo "$n" | tr 'A-Z_' 'a-z-')
  ffmpeg -i "https://media-rockstargames-com.akamaized.net/VI/downloads/videos/GTAVI_$n/GTAVI_$n.mp4" \
    -map 0:v:0 -map 0:a:0 -vf "scale=1920:1080:flags=lanczos,format=yuv420p" \
    -c:v libx264 -preset slow -crf 21 -maxrate 4000k -bufsize 8000k -profile:v high -level 4.1 -g 60 \
    -c:a aac -b:a 160k -ac 2 -map_metadata -1 -write_tmcd 0 -movflags +faststart \
    "assets/video/$out-1080p.mp4"
done
```

O player próprio tem:

- Seletor de qualidade de 360p a 4K no An Extended Look, que lembra sua escolha.
- Legendas em pt-BR, inglês e espanhol, com as falas em português já ligadas.
- Opção de continuar de onde você parou.
- Picture-in-picture e tela cheia.
- Atalhos de teclado:

  | Tecla | Ação |
  |---|---|
  | `Espaço` ou `K` | tocar/pausar |
  | `←` `→` | 5 s |
  | `J` `L` | 10 s |
  | `↑` `↓` | volume |
  | `M` | mudo |
  | `C` | legendas |
  | `F` | tela cheia |
  | `0`–`9` | pular para 0–90% do vídeo |

---

## Rádio Leonida

As prévias das rádios são as **oficiais**, publicadas pela Rockstar em
08/10/2026 em [rockstargames.com/VI/music](https://www.rockstargames.com/VI/music).
O áudio é transmitido direto de lá, sem cópias neste repositório.

| Estação | Gênero | Apresentadores |
|---|---|---|
| Flash FM | Pop | Robyn e Alex |
| Cocoteo FM | Latina moderna | El Martillo e La Gata |
| Back Country Radio | Country | MW e Delta Dawne |
| AfroBank FM | Amapiano e clássicos africanos | Burna e Palmsy |
| The Chamber 106.6 | Metal | DJ Tom e DJ Kerry |
| Dirty South Classics | Rap clássico do Sul | Trick e Trina |

Como o site oficial não libera CORS, o navegador não deixa analisar o áudio em
tempo real. Para o visualizador reagir à música mesmo assim, o
[`radio-levels.js`](assets/js/radio-levels.js) guarda a energia de cada prévia
em 4 bandas de frequência, 20 vezes por segundo, calculada antes e sincronizada
com o tempo da faixa.

---

## Como rodar

O site é 100% estático: HTML, CSS e JavaScript puro, sem build nem dependências
para instalar. Os vídeos precisam de uma origem `http(s)`, então sirva a pasta
com qualquer servidor estático:

```bash
git clone https://github.com/matheusaoliv/gta-6.git
cd gta-6
npx http-server . -p 8080 -c-1     # ou: python3 -m http.server 8080
```

Depois abra `http://localhost:8080`.

### Publicação

O site publicado sai da branch **`gh-pages`** via GitHub Pages. Para atualizar,
envie o conteúdo para essa branch:

```bash
git push origin HEAD:gh-pages
```

O GitHub reconstrói o site em menos de um minuto. Como o GitHub Pages deixa
o navegador guardar CSS e JS por 10 minutos, troque o `?v=` dos arquivos em
`index.html` e `passagem.html` a cada publicação; assim ninguém fica com a
página nova rodando um script antigo. As tags `og:url` e
`og:image` do `index.html` apontam para `https://matheusaoliv.github.io/gta-6/`;
se publicar em outro endereço, ajuste essas duas tags.

### Personalizar

Quase todo o conteúdo editável está em [`assets/js/data.js`](assets/js/data.js):

- **Datas:** `release` (padrão: meia-noite de 19/11/2026 no fuso do visitante,
  porque o horário oficial de liberação ainda não foi anunciado), `preload` e
  `trailer1`. Os links do Google Agenda e do Outlook seguem essas datas; se
  mudá-las, atualize também o [`assets/gta-vi.ics`](assets/gta-vi.ics).
- **Rádios:** `stations`, com a URL de cada prévia e os tempos das faixas.
- **Vídeos:** `videos`, com as fontes por qualidade, legendas e links.
- **Lugares:** `places`, com os textos das regiões.

---

## Por dentro

```
index.html                 # estrutura e conteúdo das seções
passagem.html              # passagem para Vice City
assets/
  css/main.css             # tokens de design, layout e componentes
  gta-vi.ics               # os dois eventos para o Calendário da Apple e outros apps
  js/data.js               # datas, rádios, vídeos e lugares
  js/main.js               # contagem, scroll (Lenis + ScrollTrigger), seções, modais, cursor
  js/passagem.js           # gerador do cartão de embarque (canvas, QR, exportação)
  js/player.js             # verificação de idade e player de vídeo
  js/radio.js              # rádio, HUD, visualizador e Media Session
  js/radio-levels.js       # energia pré-calculada das prévias (4 bandas, 20 fps)
  js/webgl.js              # shader do hero (dissolve, miragem, aberração cromática, grão)
  js/vendor/               # GSAP 3.15 (ScrollTrigger, SplitText, CustomEase), Lenis 1.3 e qrcode-generator 1.4
  fonts/                   # Big Shoulders Display, Manrope, Mr Dafoe e IBM Plex Mono (OFL)
  img/                     # artes e capturas oficiais otimizadas em WebP (~11 MB)
  video/                   # trailers 1, 2 e de lançamento convertidos para H.264 1080p
docs/                      # imagens deste README
```

### Movimento

- **Scroll:** suave com Lenis, sincronizado ao ScrollTrigger.
- **Seções fixadas com scrub:** o mergulho pelo VI, o elenco em scroll horizontal, as regiões de Leonida e a capa se montando.
- **Textos:** revelados com SplitText, usando máscara por linha.
- **Hero:** shader WebGL próprio, que pausa quando sai da tela ou quando a aba fica oculta.

### Acessibilidade

- Com `prefers-reduced-motion` ligado, o site desativa o scroll suave, os pins, o WebGL e as animações longas.
- Os diálogos fecham com `Esc` e prendem o foco, o dial da rádio funciona com setas, e as imagens têm textos alternativos em português.
- A contagem é anunciada por um `role="timer"` só para leitores de tela, atualizado a cada minuto.

### Desempenho

- Imagens em WebP com `width`/`height` e carregamento preguiçoso.
- Fontes auto-hospedadas com `preload`.
- A entrada não trava: o shader é compilado e a imagem do hero é decodificada (com `createImageBitmap`, fora da thread principal) enquanto o portão de som ainda está na tela. No clique, só sobra animação de `transform` e `opacity`.
- O shader tem teto de densidade e de pixels totais (menor no celular), e o visualizador da rádio e as esteiras da galeria param quando saem da tela.
- Nada de vidro desfocado (`backdrop-filter`) por cima do canvas animado, e o grão de filme fica parado no celular.
- Os vídeos só baixam quando você dá play (`preload="metadata"`), e as rádios tocam direto do servidor oficial.

---

## Créditos e aviso legal

- **Conteúdo do jogo:** Grand Theft Auto VI, logotipos, artes, capturas,
  trailers e prévias de rádio são © Rockstar Games / Take-Two Interactive e
  seus licenciadores. Eles são usados aqui sem fins lucrativos, como homenagem
  de fã.
- **Vídeos:** o An Extended Look é transmitido do CDN oficial da Rockstar; os
  trailers 1 e 2 são os downloads oficiais da Rockstar, apenas convertidos de
  formato para tocar no navegador.
- **Bibliotecas:** [GSAP](https://gsap.com) (licença padrão "no charge") e
  [Lenis](https://github.com/darkroomengineering/lenis) (MIT).
- **Fontes:** Big Shoulders Display, Manrope, Mr Dafoe e IBM Plex Mono, todas
  sob a SIL Open Font License, via Fontsource.
