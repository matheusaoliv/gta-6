/* Conteúdo e configuração da contagem — GTA VI (projeto de fã). */
(function () {
  'use strict';

  var MEDIA = 'https://www.rockstargames.com/VI/_next/static/media/';

  window.VI_DATA = {
    // Meia-noite (horário local do visitante) de 19/11/2026.
    // A Rockstar ainda não divulgou o horário exato de liberação.
    release: [2026, 10, 19, 0, 0, 0],
    preload: [2026, 10, 12, 0, 0, 0],
    // Estreia do Trailer 1 (04/12/2023, ~18h30 ET) — usada no "percentual da espera".
    trailer1: '2023-12-04T23:30:00Z',

    // Prévias oficiais publicadas em rockstargames.com/VI/music (08/10/2026).
    // O áudio é transmitido direto do site oficial; nada é hospedado neste repositório.
    stations: [
      {
        key: 'flash-fm',
        name: 'Flash FM',
        genre: 'Pop',
        hosts: 'Robyn e Alex',
        color: '#ff4f9a',
        src: MEDIA + 'Flash%20FM.059xksp1t-k7h.mp3',
        tracks: [
          { t: 0, title: 'Flash FM', artist: 'Robyn e Alex', dj: true },
          { t: 10, title: 'Good Ones', artist: 'Charli xcx' },
          { t: 39, title: 'Flash FM', artist: 'Robyn e Alex', dj: true },
          { t: 59, title: 'Electric Feel', artist: 'MGMT' },
          { t: 73, title: 'Flash FM', artist: 'Robyn e Alex', dj: true },
          { t: 91, title: 'Midnight Sun (Girls Trip)', artist: 'Zara Larsson & PinkPantheress' },
          { t: 127, title: 'Flash FM', artist: 'Robyn e Alex', dj: true }
        ]
      },
      {
        key: 'cocoteo',
        name: 'Cocoteo FM',
        genre: 'Latina moderna',
        hosts: 'El Martillo e La Gata',
        color: '#ff8ad8',
        src: MEDIA + 'CocoTeo%20FM.0n-4zp0t4l~if.mp3',
        tracks: [
          { t: 0, title: 'Cocoteo FM', artist: 'El Martillo e La Gata', dj: true },
          { t: 23, title: 'EoO', artist: 'Bad Bunny' },
          { t: 43, title: 'Cocoteo FM', artist: 'El Martillo e La Gata', dj: true },
          { t: 57, title: 'Si Es Trucho Es Trucho (Remix)', artist: 'Axel Rulay ft. Farruko & El Alfa' },
          { t: 81, title: 'Cocoteo FM', artist: 'El Martillo e La Gata', dj: true },
          { t: 85, title: 'Canalla', artist: 'Romeo Santos & El Chaval de la Bachata' },
          { t: 114, title: 'Cocoteo FM', artist: 'El Martillo e La Gata', dj: true }
        ]
      },
      {
        key: 'back-country',
        name: 'Back Country Radio',
        genre: 'Country',
        hosts: 'MW e Delta Dawne',
        color: '#e3283e',
        src: MEDIA + 'Back%20Country%20Radio.08cmgjn3.p-j_.mp3',
        tracks: [
          { t: 0, title: 'Back Country Radio', artist: 'MW e Delta Dawne', dj: true },
          { t: 14, title: 'Need a Little Time Off for Bad Behavior', artist: 'David Allan Coe' },
          { t: 33, title: 'Back Country Radio', artist: 'MW e Delta Dawne', dj: true },
          { t: 39, title: "Don't Come Home A-Drinkin' (With Lovin' On Your Mind)", artist: 'Loretta Lynn' },
          { t: 63, title: 'Back Country Radio', artist: 'MW e Delta Dawne', dj: true },
          { t: 79, title: 'The Conversation', artist: 'Hank Williams, Jr. & Waylon Jennings' },
          { t: 99, title: 'Back Country Radio', artist: 'MW e Delta Dawne', dj: true }
        ]
      },
      {
        key: 'afrobank',
        name: 'AfroBank FM',
        genre: 'Amapiano e clássicos africanos',
        hosts: 'Burna e Palmsy',
        color: '#f2c94c',
        src: MEDIA + 'Afrobank.0rtmh0bm33.ky.mp3',
        tracks: [
          { t: 0, title: 'AfroBank FM', artist: 'Burna e Palmsy', dj: true },
          { t: 16, title: 'Joha', artist: 'Asake' },
          { t: 33, title: 'AfroBank FM', artist: 'Burna e Palmsy', dj: true },
          { t: 50, title: 'Gye Wani', artist: 'Pat Thomas ft. Ebo Taylor' },
          { t: 64, title: 'AfroBank FM', artist: 'Burna e Palmsy', dj: true },
          { t: 69, title: "Shay'sana", artist: 'DJ Lag & Robot Boii ft. Kamo Mphela' },
          { t: 97, title: 'AfroBank FM', artist: 'Burna e Palmsy', dj: true }
        ]
      },
      {
        key: 'the-chamber',
        name: 'The Chamber 106.6',
        genre: 'Metal',
        hosts: 'DJ Tom e DJ Kerry',
        color: '#ff2a2a',
        src: MEDIA + 'The%20Chamber%20106.6.11_iey2p6kb55.mp3',
        tracks: [
          { t: 0, title: 'The Chamber', artist: 'DJ Tom e DJ Kerry', dj: true },
          { t: 22, title: 'I', artist: 'Black Sabbath' },
          { t: 52, title: 'The Chamber', artist: 'DJ Tom e DJ Kerry', dj: true },
          { t: 62, title: "I'm Broken", artist: 'Pantera' },
          { t: 86, title: 'The Chamber', artist: 'DJ Tom e DJ Kerry', dj: true },
          { t: 96, title: 'Raining Blood', artist: 'Slayer' },
          { t: 129, title: 'The Chamber', artist: 'DJ Tom e DJ Kerry', dj: true }
        ]
      },
      {
        key: 'dirty-south',
        name: 'Dirty South Classics',
        genre: 'Rap clássico do Sul',
        hosts: 'Trick e Trina',
        color: '#d9b26a',
        src: MEDIA + 'Dirty%20South%20Classics.11o18zry-5mp7.mp3',
        tracks: [
          { t: 0, title: 'Dirty South Classics', artist: 'Trick e Trina', dj: true },
          { t: 22, title: 'Like A Pimp', artist: "David Banner ft. Lil' Flip" },
          { t: 49, title: 'Dirty South Classics', artist: 'Trick e Trina', dj: true },
          { t: 63, title: 'Who Dat', artist: 'JT Money ft. Solé' },
          { t: 96, title: 'Dirty South Classics', artist: 'Trick e Trina', dj: true },
          { t: 101, title: 'Born N Raised', artist: 'DJ Khaled ft. Trick Daddy, Rick Ross & Pitbull' },
          { t: 131, title: 'Dirty South Classics', artist: 'Trick e Trina', dj: true }
        ]
      }
    ],

    // Vídeos. O "An Extended Look" é servido em MP4 (H.264) pelo CDN de vídeo
    // da própria Rockstar, com legendas oficiais. Os trailers 1 e 2 só existem
    // no YouTube (embed bloqueado pelo dono, erro 150) e em downloads 4K em
    // MPEG-4 Part 2, codec que nenhum navegador reproduz.
    videos: {
      'extended-look': {
        title: 'Grand Theft Auto VI: An Extended Look',
        meta: '27 de agosto de 2026 · gameplay capturada no PS5',
        poster: 'assets/img/trailers/extended-look.webp',
        sources: [
          { label: '4K', height: 2160, src: 'https://videos-rockstargames-com.akamaized.net/v4/rk721912/flv/en-us-2160p.mp4' },
          { label: '1080p', height: 1080, src: 'https://videos-rockstargames-com.akamaized.net/v4/rk721912/flv/en-us-1080p.mp4' },
          { label: '720p', height: 720, src: 'https://videos-rockstargames-com.akamaized.net/v4/rk721912/flv/en-us-720p.mp4' },
          { label: '360p', height: 360, src: 'https://videos-rockstargames-com.akamaized.net/v4/rk721912/flv/en-us-360p.mp4' }
        ],
        captions: [
          { lang: 'pt-BR', label: 'Português (Brasil)', src: 'https://videos-rockstargames-com.akamaized.net/v4/rk721912/cap/pt-br.vtt' },
          { lang: 'en', label: 'English', src: 'https://videos-rockstargames-com.akamaized.net/v4/rk721912/cap/en-us.vtt' },
          { lang: 'es', label: 'Español (México)', src: 'https://videos-rockstargames-com.akamaized.net/v4/rk721912/cap/es-mx.vtt' }
        ],
        links: [
          { label: 'Netflix', href: 'https://www.netflix.com/GTAVI' },
          { label: 'YouTube', href: 'https://www.youtube.com/watch?v=tJbzMqJGH4k' }
        ]
      },
      'trailer-2': {
        title: 'Grand Theft Auto VI — Trailer 2',
        meta: '6 de maio de 2025 · “Hot Together” — The Pointer Sisters',
        poster: 'assets/img/trailers/trailer-2.webp',
        // convertido do download oficial em 4K (MPEG-4 Part 2) para H.264, que todo navegador toca
        sources: [{ label: '1080p', height: 1080, src: 'assets/video/gtavi-trailer-2-1080p.mp4' }],
        youtube: 'VQRLujxTm3c',
        links: [{ label: 'YouTube', href: 'https://www.youtube.com/watch?v=VQRLujxTm3c' }]
      },
      'trailer-1': {
        title: 'Grand Theft Auto VI — Trailer 1',
        meta: 'Dezembro de 2023 · “Love Is a Long Road” — Tom Petty',
        poster: 'assets/img/trailers/trailer-1.webp',
        sources: [{ label: '1080p', height: 1080, src: 'assets/video/gtavi-trailer-1-1080p.mp4' }],
        youtube: 'QdBZY2fkU-0',
        links: [{ label: 'YouTube', href: 'https://www.youtube.com/watch?v=QdBZY2fkU-0' }]
      }
    },

    places: [
      { key: 'vice-city', name: 'Vice City', desc: 'Praias, néon e excesso. A capital do glamour de Leonida, onde todo mundo quer ficar famoso — ou rico — antes do pôr do sol.' },
      { key: 'leonida-keys', name: 'Leonida Keys', desc: 'Um colar de ilhas tropicais ligadas por pontes, onde barcos, pescaria e contrabando fazem parte da paisagem.' },
      { key: 'grassrivers', name: 'Grassrivers', desc: 'Pântanos sem fim, aerobarcos e jacarés: um mundo selvagem a poucos quilômetros dos arranha-céus.' },
      { key: 'port-gellhorn', name: 'Port Gellhorn', desc: 'Cidade portuária esquecida na costa do Golfo, de motéis baratos, boates de beira de estrada e indústria decadente.' },
      { key: 'ambrosia', name: 'Ambrosia', desc: 'O interior industrial dominado pela refinaria de açúcar — e pelas gangues de motoqueiros que rodam pelas estradas.' },
      { key: 'mount-kalaga', name: 'Mount Kalaga', desc: 'Montanhas, rios e trilhas no norte de Leonida: território de caçadores, aventureiros e de quem quer sumir do mapa.' }
    ]
  };
})();
