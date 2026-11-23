/* Segredos de Leonida: easter eggs, carros raros e trapaças de GTA VI.
   Fatos conferidos em guias publicados depois do lançamento (fontes em cada item); o texto é nosso.
   Coordenadas no sistema do gtadb (x para leste, y para norte); r = raio da área aproximada.
   Usado por guias.html (fichas) e mapa.html (camada de segredos). */
window.VI_GUIAS = (function () {
  'use strict';
  var S = {
    click: ['The Click', 'https://www.theclick.gg/gta-6-easter-egg-locations/'],
    clickR: ['The Click', 'https://www.theclick.gg/gta-6-randys-wish-list-cars/'],
    mg: ['MapGenie', 'https://mapgenie.io/grand-theft-auto-6/maps/leonida'],
    sk: ['Sportskeeda', 'https://www.sportskeeda.com/esports/all-randy-vehicle-locations-gta-6'],
    sk5: ['Sportskeeda', 'https://www.sportskeeda.com/esports/gta-6-5-rarest-cars-get'],
    ppx: ['PowerPyx', 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/'],
    kotaku: ['Kotaku', 'https://kotaku.com/live-updates-on-gta-6-the-biggest-launch-in-gaming-history-2000758030'],
    egt: ['Endgame Tools', 'https://endgametools.com/en/gta-6/news/gta-6-easter-eggs'],
    meow: ['MeowDB', 'https://meowdb.com/gta6/vehicles'],
    gr: ['Game Rant', 'https://gamerant.com/gta-6-how-get-paul-walker-mitsubishi-eclipse-fast-and-furious-easter-egg/'],
    ig: ['Insider Gaming', 'https://insider-gaming.com/paul-walker-gta-6-easter-egg/'],
    vgt: ['VGTimes', 'https://vgtimes.com/gaming-news/175138-how-to-find-paul-walkers-mitsubishi-eclipse-in-gta-6.html'],
    sr: ['Screen Rant', 'https://screenrant.com/gta-6-cheats-ps5-xbox/'],
    rb: ['Red Bull Gaming', 'https://www.redbull.com/int-en/gta-6-cheat-codes'],
    kg: ['KeenGamer', 'https://www.keengamer.com/articles/guides/gta-6-all-cheat-codes-for-ps5-and-xbox-and-how-to-unlock-them/']
  };

  /* ---------------------------------------------------------------- easter eggs */
  var eggs = [
    {
      id: 'ovo-na-torre', kind: 'segredo', ok: 1, x: -2543, y: -2346, r: 120, exact: 1,
      t: 'O ovo de Páscoa no alto da torre',
      sum: 'Um ninho gigante com ovos pintados no topo da maior torre de TV de Leonida. Arremesse um e veja onde ele cai.',
      where: 'Torre de TV de Bluegrass, ao norte de Hamlet (sul de Vice-Dale County). É a mais alta do mapa e aparece de longe.',
      when: 'A qualquer hora, desde que o mundo aberto é liberado.',
      steps: [
        'Siga até as fazendas de Bluegrass, ao norte de Hamlet, e mire na torre estaiada mais alta do horizonte.',
        'Passe pelo portão e encare a escada. A subida leva de 6 a 15 minutos.',
        'No topo, interaja com o ninho e pegue um dos ovos listrados.',
        'Vá até a borda e jogue o ovo com a barra de força cheia.',
        'Uma cena curta mostra o ovo acertando o para-brisa de um corretor de imóveis lá embaixo.'
      ],
      reward: 'Uma cena escondida. Lá em cima ainda tem um paraquedas (o salto conta para os 100%) e uma influenciadora para conversar.',
      note: 'Para pular a escada, sobrevoe a torre e desça de paraquedas na plataforma do ninho.',
      src: [['GamerHour', 'https://gamerhour.net/guides/gta-6-throwing-real-easter-egg-off-tallest-tower-easter-egg/'], S.click, ['Gamer Social Club', 'https://gamersocialclub.ca/2026/11/18/grand-theft-auto-vi-where-to-find-and-use-the-easter-egg/'], S.kotaku, ['WikiGames', 'https://wikigames.net/grand-theft-auto-vi-easter-egg-on-radio-tower/']]
    },
    {
      id: 'pe-grande', kind: 'criatura', ok: 1, x: -2650, y: -4050, r: 700,
      t: 'Pé-Grande no Lago Cottonmouth',
      sum: 'Um rugido no pântano, um vulto peludo atravessando a estrada e um altar na mata. Chegue perto e Jason apaga.',
      where: 'Pântano do Lago Cottonmouth, ao sul de Grassrivers, perto da ponte para Cottonmouth.',
      when: 'Sem horário definido. Dá para ir logo no começo do jogo.',
      steps: [
        'Dirija até o pântano do Lago Cottonmouth, perto da ponte.',
        'Vá devagar e escute: um rugido grave indica que você chegou.',
        'A criatura aparece na estrada, em cima de uma carcaça, e corre para a mata.',
        'Siga até um altar amarrado numa árvore, cercado de flores.',
        'Fique parado ao lado do altar. Jason desmaia e, na cena, só dá para ver os pés enormes chegando.'
      ],
      reward: 'Uma cena escondida. Ainda não se sabe se há uma continuação.',
      note: 'Abra o modo foto quando ouvir o rugido para ver a criatura antes que ela fuja. Alguns sites citam uma sequência de objetivos chamada “Skunk Ape” em Gullet Marsh, ainda sem passo a passo.',
      src: [['Insider Gaming', 'https://insider-gaming.com/where-to-find-bigfoot-gta-6/'], ['VGTimes', 'https://vgtimes.com/gaming-news/175042-players-have-already-found-bigfoot-in-grand-theft-auto-6.html'], ['GamerHour', 'https://gamerhour.net/guides/gta-6-bigfoot-easter-egg/'], S.egt]
    },
    {
      id: 'casa-ufo-simulacao', kind: 'segredo', ok: 1, x: -1150, y: 2950, r: 700,
      t: 'A casa do OVNI e o morador da simulação',
      sum: 'A casa da foto misteriosa escondida em GTA San Andreas em 2021 existe em Belville. Na garagem, alguém descobriu que vive num jogo.',
      where: 'Belville, Leonard County. A rua exata ainda não foi publicada; o círculo cobre o bairro.',
      when: 'De dia, quando a garagem fica aberta.',
      steps: [
        'Rode por Belville atrás de uma casa térrea clara com duas palmeiras na frente, igual à da foto do OVNI.',
        'Entre na garagem durante o dia.',
        'Leia o mural “IT’S A SIMULATION”, com notas como “Identical People” e “Who is L, who is J?”.',
        'Repare nos folhetos de barcos: o morador planeja fugir de Leonida pelo mar.'
      ],
      reward: 'Só o mistério.',
      note: 'Em 2021 a Rockstar pôs no bar Lil’ Probe’Inn, de GTA San Andreas Definitive Edition, a foto de uma casa com um disco voador em cima. A comunidade de mapeamento achou a casa no dia do lançamento. “L” e “J” parecem ser Lucia e Jason.',
      src: [['PC Gamer', 'https://www.pcgamer.com/games/grand-theft-auto/the-5-year-long-mystery-of-the-ufo-house-has-finally-been-solved-in-gta-6-but-one-npc-knows-too-much/'], ['Dexerto', 'https://www.dexerto.com/gta/gta-6-screenshot-hidden-in-san-andreas-back-in-2021-was-real-and-the-house-has-a-dark-secret-3429837/'], S.click]
    },
    {
      id: 'iate-michael-gta-5', kind: 'referencia', ok: 1, x: -2354, y: -5532, r: 150,
      t: 'O iate do Michael, de GTA V',
      sum: 'O barco ao lado da casa de Jason é do mesmo modelo do iate que Michael perdeu em GTA V, e o GPS mostra Los Santos.',
      where: 'Casa de Jason, sobre palafitas, em Key Lento (Leonida Keys).',
      when: 'Desde o começo do jogo.',
      steps: [
        'Vá até a casa de Jason em Key Lento, onde a história começa.',
        'Procure o barco Marquis atracado ao lado.',
        'Suba a bordo e chegue perto da tela do GPS: ela mostra um trecho do mapa de Los Santos.'
      ],
      reward: 'Só a referência.',
      note: 'Em GTA V, o iate é levado num caminhão na missão “Father/Son” e nunca volta. A Rockstar não confirmou que é o mesmo barco; GTA V tinha uma piada parecida com o mapa de GTA IV.',
      src: [['Game Rant', 'https://gamerant.com/grand-theft-auto-6-gta-5-easter-egg-michael-boat/'], ['EGW News', 'https://egw.news/gaming/news/38600/players-have-found-michaels-yacht-from-gta-5-in-gt-UcQyKxybD'], ['TechJuice', 'https://www.techjuice.pk/gta-6-easter-egg-links-jasons-boat-to-michael-from-gta-5/']]
    },
    {
      id: 'carro-paul-walker', kind: 'referencia', ok: 1, x: 550, y: 1320, r: 330, car: 'penumbra-ff-paul-walker',
      t: 'O carro do Paul Walker (com cobra no porta-malas)',
      sum: 'Um Penumbra verde com a pintura do Eclipse de Velozes e Furiosos, trancado numa garagem de Vespucci Island.',
      where: 'Mansão em Vespucci Island, nas Rialto Islands, entre Vice City e Vice Beach.',
      when: 'Assim que o mundo aberto é liberado.',
      steps: [
        'Entre em Vespucci Island e vire à esquerda no primeiro cruzamento: é a primeira casa à direita.',
        'Force a porta lateral da garagem, desligue o alarme na parede do fundo e abra o portão pelo interruptor.',
        'Quebre o vidro do Penumbra e faça a ligação direta.',
        'Arrombe o porta-malas se quiser a segunda surpresa.'
      ],
      reward: 'O Penumbra FF verde, placa HAD YOU. O passo a passo para ficar com ele está em Carros raros.',
      note: 'Cor, adesivo do capô e aerofólio vêm do Eclipse de Brian O’Conner no primeiro filme. A cobra do porta-malas brinca com “tem uma cobra na minha bota”, do Woody, de Toy Story.',
      src: [S.gr, S.ig, S.vgt, S.click]
    },
    {
      id: 'cachorro-jet-ski', kind: 'criatura', ok: 1, x: -2779, y: -5237, r: 900,
      t: 'Cool Dog, o cachorro do jet ski',
      sum: 'Um cachorro de óculos escuros pilotando jet ski em alto-mar. Faça amizade e ele leva Jason até a Ilha dos Cachorros.',
      where: 'Mar aberto a oeste de Key Lento (Gambit Bay) é onde mais aparece. A ilha fica no sul de Grassrivers.',
      when: 'A qualquer hora, depois do primeiro dia de Jason, quando o barco dele já está liberado.',
      steps: [
        'Pegue o barco de Jason no píer de casa, em Key Lento, e siga para oeste até o mar aberto.',
        'Desligue o motor, pule na água e nade para longe do barco.',
        'Em 20 a 30 segundos começam os latidos. Use o Foco para achar a direção.',
        'Chegue perto, segure L2 para focar no Cool Dog e escolha Elogiar. Jason sobe na garupa.',
        'Fique no jet ski até ele parar na Ilha dos Cachorros, onde vários cães vivem embaixo de um barco virado.',
        'Siga o Cool Dog: ele cava e acha uma carteira perto de um corpo.',
        'No buraco à esquerda do barco virado, perto dos brinquedos, pegue os óculos escuros.'
      ],
      reward: 'Carteira com cerca de US$ 1.200 e os óculos Sports Wrap Shade. Brincar de bola ou frisbee com os cães enche o Foco.',
      note: 'O cachorro já aparecia no trailer de lançamento. A inspiração seria um golden retriever que pilotava jet ski de colete e óculos em Fort Lauderdale. Os guias ainda divergem sobre a posição exata da ilha e o valor da carteira.',
      src: [['TheGamer', 'https://www.thegamer.com/grand-theft-auto-6-gta-dog-island-location-cool-where-to-find-ocean-guide/'], ['GamingBible', 'https://www.gamingbible.com/news/gta-6-jet-skiing-cool-dog-inspired-real-life-809147-20261119'], ['Playday', 'https://playday.one/2026/11/19/gta-6-cool-dog-easter-egg/'], S.click, S.kotaku]
    },
    {
      id: 'apartamento-dexter', kind: 'referencia', ok: 1, x: 1560, y: 2120, r: 300,
      t: 'Trinity Apartments, o prédio do Dexter',
      sum: 'Um prédio de Vice Beach copiado do apartamento de Dexter, com o “kit” do serial killer no telhado e sacos no fundo do mar.',
      where: 'Washington Island, norte de Vice Beach, perto da loja Top Fun Drones.',
      when: 'A qualquer hora, depois das primeiras missões.',
      steps: [
        'Vá até Washington Island e ache o Trinity Apartments, ao lado da Top Fun Drones.',
        'Compare as escadas externas e as passarelas com as do prédio da série.',
        'Suba no telhado: corda, fita, luvas, caixas de ferramentas, faca e seringa.',
        'No cais da frente está o barco Lure Predator L35P, cópia do Slice of Life.',
        'Mergulhe perto do prédio para achar os sacos de lixo no fundo.'
      ],
      reward: 'Só a homenagem: a porta do apartamento não abre.',
      note: '“Trinity” lembra o Assassino da Trindade, vilão da 4ª temporada. A Rockstar não confirmou a referência; a prova está na arquitetura e nos objetos.',
      src: [['TheGamer', 'https://www.thegamer.com/gta-6-grand-theft-auto-dexter-show-reference-discovery/'], S.egt, S.click]
    },
    {
      id: 'posto-caranguejos', kind: 'segredo', ok: 1, x: -3600, y: -4400, r: 900,
      t: 'O laboratório de caranguejos de Pelican Valley',
      sum: 'Um posto de pesquisa abandonado no pântano, com senha no chão, cofre e uma submetralhadora trancada no fim do píer.',
      where: 'Pântanos do sudoeste de Pelican Valley, logo ao norte das Keys. Complexo principal e um prédio trancado no píer.',
      when: 'A qualquer hora.',
      steps: [
        'Contorne a casa central e ligue o interruptor de energia na parede externa.',
        'No prédio principal, leia o que está escrito no chão de uma sala lateral: é a senha do computador.',
        'O computador dá metade da dica do cofre. A outra metade está no bilhete do galpão dos caranguejos mortos, que fala do único espécime que deu certo.',
        'Abra o cofre: dinheiro e o código da porta do prédio do píer.',
        'Use o código no píer e pegue a arma.'
      ],
      reward: 'Submetralhadora Crabshack VF5, pouco mais de US$ 1.000 e um jet ski.',
      note: 'Não publicamos as senhas: todas as pistas estão no próprio lugar, e resolver é a graça. A VF5 é uma das melhores armas para o começo.',
      src: [['The Big Lead', 'https://www.thebiglead.com/gta-6-pelican-valley-crab-research-outpost-computer-password-keypad-codes/'], ['Yahoo Tech', 'https://tech.yahoo.com/gaming/articles/gta-6-pelican-valley-crab-134156659.html'], S.click]
    },
    {
      id: 'caranguejo-gigante', kind: 'criatura', ok: 0, x: -3679, y: -3601, r: 750,
      t: 'O caranguejo gigante de Gullet Marsh',
      sum: 'Um caranguejo mutante enorme ataca Jason dentro de uma casa no pântano. Ainda não se sabe o que dispara a cena.',
      where: 'Uma casa em Gullet Marsh, Mariana County, nos pântanos do sudoeste, a oeste de Hamlet.',
      when: 'Desconhecido. Parece ser um encontro raro.',
      steps: [
        'Vá até Gullet Marsh, em Mariana County.',
        'Entre nas casas da região. No vídeo que circulou, o ataque acontece quando Jason explora uma delas.',
        'Qual casa e o gatilho exato ainda não foram publicados.'
      ],
      reward: 'Uma cena rara.',
      note: 'O Kotaku lembrou a piada do “caranguejo gigante” de Genji 2, na apresentação da Sony na E3 de 2006. O laboratório de Pelican Valley fica perto, mas resolvê-lo não dispara o ataque, até onde se sabe.',
      src: [S.kotaku, S.click, ['WikiGames', 'https://wikigames.net/grand-theft-auto-vi-easter-eggs/']]
    },
    {
      id: 'hotel-ocean-view', kind: 'referencia', ok: 1, x: 1960, y: 639, r: 60, exact: 1,
      t: 'Hotel Ocean View, o primeiro esconderijo de Tommy',
      sum: 'O hotel onde Tommy Vercetti começa GTA Vice City (2002) está em Ocean Beach, com o mesmo neon.',
      where: 'Ocean Beach, Vice City.',
      when: 'A qualquer hora.',
      steps: ['Vá até Ocean Beach e procure o letreiro. Não precisa de mais nada.'],
      reward: 'Só a visita.',
      note: 'O hotel já aparecia no primeiro trailer. A Rockstar não confirmou nenhuma participação de Tommy em GTA VI.',
      src: [['SVG', 'https://www.svg.com/1463286/gta-6-tommy-vercetti-ocean-view-question/'], ['Heist Atlas', 'https://heistatlas.com/en/database/secrets/ocean-view-hotel/']]
    },
    {
      id: 'livros-red-dead-liberty-city', kind: 'referencia', ok: 0, x: -1059, y: 6490, r: 120, exact: 1,
      t: 'Livros sobre Red Dead e Liberty City',
      sum: 'Um romance de faroeste em New Austin e as memórias de alguém de Liberty City, escondidos em Leonida.',
      where: 'Jacob’s Tavern, em Millport (norte de Leonida), e a casa de Jason em Key Lento.',
      when: 'O livro da casa de Jason só existe no capítulo 1. Depois ele some.',
      steps: [
        'Red Dead Redemption: no bar Jacob’s Tavern, em Millport, leia o romance sobre um caubói de New Austin.',
        'Liberty City: ainda no capítulo 1, procure “Lethal by Design: A Liberty City Memoir” numa mesa redonda da casa de Jason.'
      ],
      reward: 'As referências. O livro da casa de Jason conta como colecionável e pode ser perdido.',
      note: 'New Austin é a região de faroeste de Red Dead Redemption; Liberty City é a Nova York da série, de GTA IV. O pino marca a taverna; o outro livro fica na casa de Jason.',
      src: [S.click, S.egt]
    }
  ];

  /* ---------------------------------------------------------------- carros raros */
  var CLON = 'Capítulo 3 em diante, com o Clonador de Chaves.';
  var LUX = 'Abra com o Clonador de Chaves: tem alarme e rastreador avançado.';
  var cars = [
    {
      id: 'penumbra-ff-paul-walker', grp: 'escondido', ok: 1, x: 550, y: 1320, r: 330, egg: 'carro-paul-walker',
      t: 'Maibatsu Penumbra FF',
      sub: 'Versão do Eclipse 1995 de Brian O’Conner, de Velozes e Furiosos',
      where: 'Garagem de uma mansão em Vespucci Island (Rialto Islands), entre Vice City e Vice Beach.',
      when: 'Logo no começo, sem ferramenta especial.',
      steps: [
        'Cruze a ponte para Vespucci Island. No primeiro cruzamento, vire à esquerda: é a primeira casa à direita (portão branco e cerca viva alta).',
        'Force a portinha ao lado da garagem. O alarme da casa toca.',
        'Na parede do fundo, desligue o painel do alarme e use o interruptor que abre o portão.',
        'Quebre o vidro e faça a ligação direta girando os dois analógicos.',
        'Espere o alarme do carro parar ainda dentro da garagem, para não atrair a polícia.'
      ],
      reward: 'O Penumbra verde, placa HAD YOU, bem mais rápido que o carro inicial. Registre para ficar com ele; o vidro se conserta em oficina ou posto.',
      note: 'Arrombe o porta-malas e uma cobra dá o bote. A Rockstar não confirmou a homenagem.',
      src: [S.gr, S.ig, S.vgt, S.click]
    },
    {
      id: 'gauntlet-hellfire', grp: 'randy', ok: 1, x: -2495, y: -3422, r: 150, value: 10120,
      t: 'Bravado Gauntlet Hellfire',
      where: 'No fim da rua interna do ferro-velho All Grade Scrapyard, sudeste de Hamlet, ao lado de um contêiner vermelho.',
      when: CLON + ' O ferro-velho tem guardas armados.',
      steps: [
        'Entre no All Grade Scrapyard, colado ao ferro-velho da gangue M7, no sudeste de Hamlet.',
        'Siga a rua de dentro até o fim. O Gauntlet está ao lado do contêiner vermelho.',
        'Aproxime-se devagar: os guardas atiram se perceberem o roubo. Abra com o Clonador.',
        'Leve até a garagem do Randy (ícone verde RK).'
      ],
      reward: 'Pagamento do Randy.',
      note: 'O mais fácil de achar, porque está sempre no mesmo ponto. O difícil é sair inteiro.',
      src: [S.clickR, S.sk5, S.ppx, S.mg, S.sk]
    },
    {
      id: 'pegassi-infernus', grp: 'randy', ok: 1, x: -865, y: 776, r: 120, value: 17160,
      t: 'Pegassi Infernus',
      where: 'Nível 7 do prédio-garagem da delegacia de Vice-Dale, sudoeste de Crosstown (Vice City).',
      when: CLON,
      steps: [
        'Use o elevador pequeno do lado de fora do estacionamento da delegacia e suba até o nível 7.',
        LUX,
        'Saia rápido: a rampa passa pela frente da delegacia.',
        'Entregue na garagem do Randy.'
      ],
      reward: 'Pagamento do Randy.',
      note: 'Planeje a rota de fuga antes de subir. Com o rastreador avançado, a polícia chega rápido.',
      src: [S.clickR, ['Push Square', 'https://www.pushsquare.com/guides/gta-6-randys-wish-list-vehicle-locations'], S.mg, S.sk]
    },
    {
      id: 'pegassi-toros', grp: 'randy', ok: 1, x: 0, y: -1010, r: 200,
      t: 'Pegassi Toros',
      where: 'Na frente do Pegassi Residences, Bayside Drive, em Tequesta Retreat (Vice City).',
      when: CLON,
      steps: [
        'Vá até Tequesta Retreat, a ilha dos prédios de luxo ao sul do centro.',
        'O SUV costuma estar parado em frente às torres do Pegassi Residences.',
        'Abra com o Clonador e leve até a garagem do Randy.'
      ],
      reward: 'Pagamento do Randy.',
      note: 'Bom para começar a lista: perto do centro e sem guardas.',
      src: [S.clickR, ['Overgear', 'https://overgear.com/guides/gta-6/vehicles-and-cars-guide/']]
    },
    {
      id: 'pegassi-vitello', grp: 'randy', ok: 0, x: 636, y: 3764, r: 220, value: 18865,
      t: 'Pegassi Vitello',
      where: 'Garagem sul de uma mansão no lado sul de Vinewood Beach, a do portão branco basculante.',
      when: CLON,
      steps: ['Procure a mansão de portão branco basculante no sul de Vinewood Beach.', 'O Vitello fica na garagem do lado sul. ' + LUX, 'Leve até a garagem do Randy.'],
      reward: 'Pagamento do Randy.',
      note: 'Outro guia achou o carro numa mansão de Flamingo Parkway, em Waning Sands. Se uma garagem estiver vazia, tente a outra.',
      src: [S.clickR, ['Sweat School', 'https://sweatschool.app/gta-6/vehicles/pegassi-vitello/'], S.mg, S.sk]
    },
    {
      id: 'ascot-paragon', grp: 'randy', ok: 0, x: -1627, y: 3495, r: 220, value: 16555,
      t: 'Ascot Paragon',
      where: 'Garagem de uma mansão sem muros nos subúrbios ao norte de Belville.',
      when: CLON,
      steps: ['Ache a mansão sem muros ao norte de Belville.', 'O portão da garagem fica fechado: entre por uma janela aberta.', LUX, 'Leve até a garagem do Randy.'],
      reward: 'Pagamento do Randy.',
      note: 'Também já foi visto em frente à The Banana Hole, em Shore Drive (Ocean Beach). A avenida dos hotéis é boa para caçar carros da lista.',
      src: [S.clickR, S.mg, S.sk]
    },
    {
      id: 'piccia-furia', grp: 'randy', ok: 1, x: -1101, y: -2779, r: 150, value: 23045,
      t: 'Piccia Furia',
      where: 'Mansão amarela no extremo sul de Peacock Estates (Palladia Lane), junto à garagem separada.',
      when: CLON,
      steps: ['Vá até a última mansão da ilha sul de Peacock Estates: casa amarela com garagem separada.', 'O Furia fica do lado direito da garagem. ' + LUX, 'Leve até a garagem do Randy.'],
      reward: 'Pagamento do Randy, um dos maiores da lista.',
      note: 'O Zorrusso Tsunami (veículo de destaque) fica numa mansão vizinha: dá para pegar os dois na mesma viagem.',
      src: [S.clickR, S.mg, S.sk]
    },
    {
      id: 'pfister-growler', grp: 'randy', ok: 0, x: 1650, y: 820, r: 450,
      t: 'Pfister Growler',
      where: 'Prédio-garagem de Fig Street, em Ocean Beach (Vice Beach).',
      when: CLON,
      steps: ['Ache o prédio-garagem de Fig Street, em Ocean Beach.', 'Suba os andares até encontrar o Growler.', 'Abra com o Clonador e leve até a garagem do Randy.'],
      reward: 'Pagamento do Randy.',
      note: 'Só um guia publicou este ponto. O círculo cobre Ocean Beach porque a rua ainda não está no mapa comunitário.',
      src: [S.clickR]
    },
    {
      id: 'bravado-banshee', grp: 'randy', ok: 0, x: -1637, y: -1802, r: 150, value: 7315,
      t: 'Bravado Banshee',
      where: 'Dentro do showroom da Sunrise Premium Autos, El Joven Blvd, norte de Southside (Vice City).',
      when: CLON,
      steps: ['Vá até a Sunrise Premium Autos, na El Joven Blvd.', 'O Banshee está dentro do showroom. ' + LUX, 'Leve até a garagem do Randy.'],
      reward: 'Pagamento do Randy.',
      note: 'O troféu Capital Offense pede um Banshee azul de concessionária no sul de Vice City; tudo indica que é este, então dá para fazer os dois juntos.',
      src: [S.clickR, S.mg, S.sk, S.ppx]
    },
    {
      id: 'granforma-zorrusso', grp: 'randy', ok: 1, x: 1995, y: 112, r: 120,
      t: 'Granforma Zorrusso',
      where: 'Primeiro piso do estacionamento do Hathaway Apartments, canto leste, sul de Ocean Beach.',
      when: 'Missão principal “Clonin’ Keys, Makin’ GS”, no capítulo 3.',
      steps: ['Avance até a missão “Clonin’ Keys, Makin’ GS”.', 'No Hathaway Apartments, pule o muro leste para entrar no estacionamento.', 'O Zorrusso está no primeiro piso, no canto leste. Siga a missão e entregue ao Randy.'],
      reward: 'O Clonador de Chaves e a Lista de Desejos do Randy liberada. Este já conta como a primeira entrega.',
      note: 'Não precisa achar outro Zorrusso. Existe ainda o Zorrusso Tsunami, versão de destaque em Peacock Estates.',
      src: [S.clickR, S.ppx, S.meow, S.mg, S.sk]
    },
    {
      id: 'invetero-coquette-d10', grp: 'randy', ok: 0, x: 94, y: 328, r: 150, value: 9350,
      t: 'Invetero Coquette D10',
      where: 'Docas oeste de Waxman Island, no depósito de cerca azul, ao lado de um contêiner vermelho.',
      when: CLON,
      steps: ['Vá até as docas do lado oeste de Waxman Island.', 'Pule a cerca azul do depósito pelo lado esquerdo.', 'O Coquette amarelo está ao lado do contêiner vermelho. Abra com o Clonador (tem alarme).', 'Leve até a garagem do Randy.'],
      reward: 'Pagamento do Randy.',
      note: 'O depósito é ponto de roubo e pode ter vigias.',
      src: [S.mg, S.sk]
    },
    {
      id: 'pegassi-tempesta', grp: 'randy', ok: 0, x: -1970, y: 7029, r: 200,
      t: 'Pegassi Tempesta',
      where: 'Na entrada de uma cabana de madeira no lado oeste do Lake Tallaloko, norte de Leonida.',
      when: CLON,
      steps: ['Suba até o Lake Tallaloko.', 'No lado oeste do lago, ache a cabana pequena de madeira.', 'O Tempesta está no canto da entrada. Abra com o Clonador.', 'A garagem do Randy fica longe: dirija com cuidado para ele chegar inteiro.'],
      reward: 'Pagamento do Randy.',
      note: 'Não confunda com o Tempesta Valiant, o de destaque, parado em frente ao Vice Museum of Art.',
      src: [S.clickR, S.sk5, S.mg, S.sk]
    },
    {
      id: 'tanque-mile-zero', grp: 'militar', ok: 0, x: -6956, y: -6403, r: 450,
      t: 'Tanque e caça P-996 Lazer',
      sub: 'Base aérea Mile Zero',
      where: 'Mile Zero Air Station, em Goose Key, no fim da Route 1 (extremo oeste das Keys).',
      when: 'A qualquer hora. Conte com nível alto de procurado ao entrar.',
      steps: ['Siga a Route 1 pelas Keys até o fim, em Goose Key.', 'Tanque: entre na base, ache o tanque e saia dirigindo.', 'Caça: o P-996 Lazer fica na pista. Voe baixo para demorar a ser visto.'],
      reward: 'Troféu Challenging Tank por roubar o tanque. O caça é um dos veículos mais rápidos do jogo.',
      note: 'É o Fort Zancudo de Leonida. Depois da campanha, os dois também viram trapaças (veja a aba Trapaças).',
      src: [S.ppx, S.meow, ['Leonidaverse', 'https://leonidaverse.com/en/codex/gta-6-vehicles']]
    },
    {
      id: 'pegassi-infernus-gold-rope', grp: 'destaque', ok: 0, x: -2734, y: 4546, r: 120, value: 17160,
      t: 'Pegassi Infernus Gold Rope',
      where: 'Sob a cobertura da varanda de uma casa pequena na beira d’água, Reservoir St, Ambrosia.',
      when: CLON,
      steps: ['Siga a Reservoir St, em Ambrosia, até as casas na beira d’água.', 'O carro está na varanda coberta de uma casa pequena.', LUX],
      reward: 'Um carro único, para registrar ou vender.',
      note: 'Ponto publicado só pelo MapGenie até agora.',
      src: [S.mg]
    },
    {
      id: 'pegassi-tempesta-valiant', grp: 'destaque', ok: 0, x: 1805, y: 1476, r: 100,
      t: 'Pegassi Tempesta Valiant',
      where: 'Pátio em frente ao Vice Museum of Art, sul de Washington Beach (Vice Beach).',
      when: CLON,
      steps: ['Vá até o Vice Museum of Art.', 'O Tempesta Valiant está no pátio da frente.', LUX + ' Saia antes da polícia.'],
      reward: 'Um carro único, para registrar ou vender.',
      note: 'Ponto publicado só pelo MapGenie até agora.',
      src: [S.mg]
    },
    {
      id: 'granforma-zorrusso-tsunami', grp: 'destaque', ok: 0, x: -1054, y: -2675, r: 150, value: 23375,
      t: 'Granforma Zorrusso Tsunami',
      where: 'Garagem de uma mansão no lado sul de Peacock Estates.',
      when: CLON,
      steps: ['Vá até o lado sul de Peacock Estates.', 'O Tsunami está dentro da garagem de uma das mansões.', LUX],
      reward: 'Um carro único, para registrar ou vender.',
      note: 'O Piccia Furia da lista do Randy fica na mansão vizinha.',
      src: [S.mg]
    },
    {
      id: 'truffade-thrax-andrew-node', grp: 'destaque', ok: 0, x: 804, y: 424, r: 150, value: 23375,
      t: 'Truffade Thrax de Andrew Node',
      where: 'Garagem de uma mansão grande na Sabal Cir, sul de Starfish Island.',
      when: 'A qualquer hora: segundo o MapGenie, está destrancado e sem alarme.',
      steps: ['Vá até o sul de Starfish Island.', 'Na Sabal Cir, procure a mansão grande com o Thrax na garagem.', 'Entre e saia dirigindo.'],
      reward: 'Um carro único, para registrar ou vender.',
      note: 'Ponto publicado só pelo MapGenie até agora.',
      src: [S.mg]
    },
    {
      id: 'invetero-coquette-enforcer', grp: 'destaque', ok: 0, x: -7006, y: 163, r: 100,
      t: 'Invetero Coquette Enforcer',
      where: 'Num pedestal em frente à delegacia do centro de Capri, oeste de Leonida.',
      when: CLON,
      steps: ['Vá até a delegacia do centro de Capri.', 'O carro está no pedestal da frente.', LUX + ' A polícia está do lado: prepare a fuga.'],
      reward: 'Um carro único, para registrar ou vender.',
      note: 'Ponto publicado só pelo MapGenie até agora.',
      src: [S.mg]
    }
  ];
  var randy = {
    steps: [
      'Libera no capítulo 3, na missão “Clonin’ Keys, Makin’ GS”, que dá o Clonador de Chaves. Sem ele, os carros de luxo não abrem.',
      'São 16 carros. Acompanhe em Mapa > Roubos > Lista de Desejos do Randy, ou escaneie um carro com o app WAiNK para saber se está na lista.',
      'Entregue na garagem do Randy (ícone verde RK, no oeste de Vice City). Quanto menos amassado, mais ele paga.',
      'Fechar a lista dá o troféu Supply & Demand. Os carros também aparecem fora dos pontos fixos, principalmente perto dos hotéis de Vice Beach e Ocean Beach.'
    ],
    src: [S.clickR, S.mg, S.sk, S.ppx]
  };

  /* ---------------------------------------------------------------- trapaças
     [id, nome, categoria, efeito, como liberar, código]
     Código: U D L R no direcional, igual no PS5 e no Xbox; vazio = ainda não publicado. */
  var cheats = [
    ['dinheiro', 'US$ 250.000', 'jogador', 'Põe US$ 250 mil na conta.', 'Terminar a história principal.', 'URDLULDR'],
    ['bebado', 'Bêbado', 'jogador', 'Deixa o personagem bêbado.', 'Gastar US$ 2.500 em bebida.', ''],
    ['heat', 'Aumentar o Heat', 'jogador', 'Sobe o seu nível de Heat com a polícia.', 'Escapar de 3 estrelas de procurado 25 vezes.', 'LDRDUDU'],
    ['procurado', 'Aumentar o procurado', 'jogador', 'Põe mais estrelas de procurado em você.', 'Escapar de 3 estrelas de procurado 50 vezes.', 'LDRDURU'],
    ['foco', 'Foco infinito', 'jogador', 'O Foco nunca acaba.', 'Terminar a história principal.', 'DUUDUDUDUR'],
    ['queda', 'Sem dano de queda', 'jogador', 'Quedas não machucam.', 'Sobreviver a 20 quedas livres de mais de 12 metros (40 pés).', ''],
    ['paraquedas', 'Paraquedas', 'jogador', 'Dá um paraquedas.', 'Fazer 50 saltos de paraquedas ou BASE de pelo menos 90 metros (300 pés).', ''],
    ['colete', 'Colete à prova de balas', 'jogador', 'Enche o colete.', 'Completar 100 treinos de exercício.', 'DULUUUUUDD'],
    ['consertar', 'Consertar veículo', 'jogador', 'Conserta o veículo em que você está.', 'Vencer 10 corridas em Gellhorn Raceway, Thrillbilly Mud Club e Boone Speedway.', ''],
    ['nitro', 'Nitro infinito', 'jogador', 'O nitro não acaba.', 'Completar 50 saltos acrobáticos.', ''],
    ['municao-max', 'Munição máxima', 'combate', 'Enche a munição de todas as armas.', 'Ganhar 25 medalhas de bronze ou melhores nos estandes de tiro.', 'DURDLLUUDL'],
    ['municao-inf', 'Munição infinita', 'combate', 'A munição nunca acaba.', 'Ganhar 25 medalhas de prata ou melhores nos estandes de tiro.', 'DURDLLUDDD'],
    ['sem-recarga', 'Sem recarregar', 'combate', 'Atira sem parar para recarregar.', 'Ganhar 25 medalhas de ouro nos estandes de tiro.', 'DURDLLUDDU'],
    ['explosivos', 'Todas as armas explosivas', 'combate', 'Dá as armas explosivas.', 'Arremessar 100 granadas.', ''],
    ['incendiaria', 'Munição incendiária', 'combate', 'Os tiros incendeiam.', 'Queimar 100 inimigos com fogo.', ''],
    ['garrafas', 'Garrafas explosivas', 'combate', 'Garrafas arremessadas explodem.', 'Arremessar 100 coquetéis molotov.', ''],
    ['escopeta', 'Escopeta explosiva', 'combate', 'Os tiros de escopeta explodem.', 'Ferir 100 inimigos com explosivos.', ''],
    ['h-at', 'Hauners H-AT', 'combate', 'Dá a arma Hauners H-AT.', 'Destruir 100 veículos.', ''],
    ['attack-force', 'Attack Force', 'combate', 'Trapaça de combate; os guias ainda não detalharam o efeito.', 'Terminar a história principal.', 'DULLRDDUD'],
    ['bolas', 'Bolas explosivas', 'combate', 'Bolas arremessadas explodem.', 'Ferir 20 inimigos com explosivos.', 'DULLRDDUR'],
    ['vehicle-force', 'Vehicle Force', 'combate', 'Trapaça de combate com veículos; efeito ainda não detalhado.', 'Matar 25 inimigos ou civis com um veículo.', 'DULLRDLUD'],
    ['avancar-hora', 'Avançar a hora', 'mundo', 'Adianta o relógio do jogo.', 'Coletar 10 relógios.', ''],
    ['pausar-hora', 'Pausar a hora', 'mundo', 'Congela a hora do dia.', 'Coletar 20 relógios.', ''],
    ['clima', 'Mudar o clima', 'mundo', 'Alterna entre os climas.', 'Revelar o mapa inteiro.', 'DRUDRUR'],
    ['ambulancia', 'Interstate Ambulance', 'veiculos', 'Faz aparecer uma ambulância.', 'Descobrir a Interstate Ambulance no menu Progresso.', ''],
    ['airboat', 'Airboat 09', 'veiculos', 'Faz aparecer um aerobarco.', 'Completar 5 desafios de sobrevivência.', ''],
    ['banshee', 'Bravado Banshee', 'veiculos', 'Faz aparecer um Banshee.', 'Completar todos os desafios de combate.', ''],
    ['bmx', 'Tuff BMX', 'veiculos', 'Faz aparecer uma BMX.', 'Completar 5 desafios de condicionamento.', ''],
    ['boomazoom', 'Maibatsu Boomazoom', 'veiculos', 'Faz aparecer um Boomazoom.', 'Completar 5 desafios de compras.', 'LURDLLUL'],
    ['carbon', 'Nagasaki Carbon RS', 'veiculos', 'Faz aparecer uma Carbon RS.', 'Completar todos os desafios de exploração.', ''],
    ['dominator', 'Vapid Dominator ’65', 'veiculos', 'Faz aparecer um Dominator 1965.', 'Completar todos os desafios de condicionamento.', ''],
    ['emerus', 'Progen Emerus', 'veiculos', 'Faz aparecer um Emerus.', 'Completar todos os desafios de veículos.', ''],
    ['flamingo', 'Flamingo inflável', 'veiculos', 'Faz aparecer um flamingo inflável.', 'Destruir 50 flamingos de cocaína.', ''],
    ['pumper', 'MTL Pumper', 'veiculos', 'Faz aparecer um caminhão de bombeiros MTL Pumper.', 'Descobrir o MTL Pumper no menu Progresso.', 'LURDLRRU'],
    ['taxi', 'Vapid Stainer G2 Taxi', 'veiculos', 'Faz aparecer um táxi.', 'Completar 5 desafios de esportes.', ''],
    ['lazer', 'Hauners P-996 Lazer', 'veiculos', 'Faz aparecer o caça Lazer.', 'Completar todos os desafios do jogo.', ''],
    ['bulldozer', 'HVY Bulldozer', 'veiculos', 'Faz aparecer um trator.', 'Descobrir o HVY Bulldozer no menu Progresso.', 'LURDLRRD'],
    ['mallard', 'Lapwing Mallard', 'veiculos', 'Faz aparecer um avião Mallard.', 'Completar 5 desafios de veículos.', ''],
    ['golfer', 'Brimstone Golfer', 'veiculos', 'Faz aparecer um carrinho de golfe.', 'Completar todos os desafios de esportes.', ''],
    ['rhino', 'Hauners Rhino (tanque)', 'veiculos', 'Faz aparecer um tanque.', 'Completar todos os desafios de sobrevivência.', ''],
    ['sanchez', 'Maibatsu Sanchez', 'veiculos', 'Faz aparecer uma moto Sanchez.', 'Completar 5 desafios criminosos.', ''],
    ['sea-sparrow', 'Nagasaki Sea Sparrow', 'veiculos', 'Faz aparecer um helicóptero anfíbio.', 'Completar 5 desafios de exploração.', ''],
    ['speeder', 'Speeder 700 GT', 'veiculos', 'Faz aparecer uma lancha Speeder.', 'Completar 5 desafios de combate.', ''],
    ['thrax', 'Truffade Thrax', 'veiculos', 'Faz aparecer um Thrax.', 'Completar todos os desafios de compras.', ''],
    ['bobber', 'Western Zombie Bobber', 'veiculos', 'Faz aparecer uma moto Zombie Bobber.', 'Completar todos os desafios criminosos.', ''],
    ['golden-hour', 'Golden Hour', 'filtros', 'Filtro de tela Golden Hour.', 'Passar 4 horas de mãos dadas.', ''],
    ['powdered-sugar', 'Powdered Sugar', 'filtros', 'Filtro de tela Powdered Sugar.', 'Escanear todo o lixo espacial com o WAiNK.', ''],
    ['pinhole', 'Pinhole', 'filtros', 'Filtro de tela Pinhole.', 'Desmontar 25 operações de gangue com seu parceiro(a).', ''],
    ['neon-jungle', 'Neon Jungle', 'filtros', 'Filtro de tela Neon Jungle.', 'Descobrir os 16 veículos Girlypop.', ''],
    ['yesteryear', 'Yesteryear', 'filtros', 'Filtro de tela Yesteryear.', 'Descobrir o Ridgway.', ''],
    ['cataclysm', 'Cataclysm', 'filtros', 'Filtro de tela Cataclysm.', 'Descobrir o Vamos da Martha no menu Progresso.', 'DDURRULLRR'],
    ['videotape', 'Videotape', 'filtros', 'Filtro de tela Videotape.', 'Completar 50 atividades com seu parceiro(a).', ''],
    ['dark-mirror', 'Dark Mirror', 'filtros', 'Filtro de tela Dark Mirror.', 'Faturar US$ 500 mil vendendo veículos.', ''],
    ['migraine', 'Migraine', 'filtros', 'Filtro de tela Migraine.', 'Sobreviver 6 minutos com 6 estrelas de procurado.', ''],
    ['dollhouse', 'Dollhouse', 'filtros', 'Filtro de tela Dollhouse.', 'Passar 8 horas com seu parceiro(a).', 'DDURRULLDR'],
    ['bubblegum', 'Bubblegum', 'filtros', 'Filtro de tela Bubblegum.', 'Coletar os 24 cards Vice City Flamingos.', ''],
    ['fast-forward', 'Fast Forward', 'filtros', 'Filtro de tela Fast Forward.', 'Fazer 50 meditações.', ''],
    ['fisheye', 'Fisheye', 'filtros', 'Filtro de tela olho de peixe.', 'Pescar 100 peixes.', ''],
    ['faded-glory', 'Faded Glory', 'filtros', 'Filtro de tela Faded Glory.', 'Roubar 50 lojas com seu parceiro(a).', 'DDURRULLLR'],
    ['pixel-art', 'Pixel Art', 'filtros', 'Filtro de tela Pixel Art.', 'Faturar US$ 250 mil vendendo colecionáveis.', ''],
    ['hellscape', 'Hellscape', 'filtros', 'Filtro de tela Hellscape.', 'Roubar 100 viaturas da polícia.', '']
  ].map(function (c) { return { id: c[0], t: c[1], cat: c[2], fx: c[3], unlock: c[4], code: c[5] }; });

  return {
    eggs: eggs, cars: cars, cheats: cheats, randy: randy,
    cheatSrc: [S.sr, S.rb, S.kg],
    EGG_KIND: { segredo: 'Segredo', criatura: 'Criatura', referencia: 'Referência' },
    CAR_GRP: { randy: 'Lista do Randy', escondido: 'Escondido', militar: 'Militar', destaque: 'Veículo de destaque' },
    CHEAT_CAT: { jogador: 'Jogador', combate: 'Combate', mundo: 'Mundo', veiculos: 'Veículos', filtros: 'Filtros de tela' }
  };
})();
