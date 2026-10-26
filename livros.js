// A estante do site. Cada bloco { } é um livro, na ordem em que aparece na prateleira.
// Os títulos abaixo são provisórios: troque pelos definitivos quando decidir.
//
// O que cada campo faz:
//   id            nome curto, sem espaço nem acento. Vira o link direto do livro:
//                 rafaeltefala.com.br/#livro-ID (bom para a bio e os Stories)
//   tipo          "E-book" ou "Livro Kindle"
//   titulo        o título. A barra | diz onde a linha quebra na capa
//   subtitulo     uma frase sobre o livro
//   cor           cor de fundo da capa desenhada e da lombada
//   arte          o desenho da capa enquanto não chega a imagem: "grade", "baloes" ou "digital"
//   capa          a imagem da capa feita na IA, ex.: "img/capa-voz.webp". Vazio = usa o desenho
//   tituloNaCapa  true se a imagem já tem o título escrito (aí o site não escreve por cima)
//   paraQuem      para quem é o livro
//   dentro        o que tem dentro, um item por linha
//   onde          onde vai ser vendido: "Hotmart" ou "Amazon"
//   link          o link de compra. Vazio = livro em produção, aparece a lista de espera
//   preco         o preço, ex.: "R$ 27". Só aparece quando houver link
//
// O primeiro link (Sem cara de IA) entrou em 25/10/2026 com o OK do Rafael, antes do rodapé.
// PENDENTE: o rodapé do site mostrar quem vende, o CPF ou CNPJ e um e-mail de contato
// (Decreto 7.962/2013, art. 2º; ver LEIA-ME.md).

window.LIVROS = [
  {
    id: "sem-cara",
    tipo: "E-book",
    titulo: "Sem cara|de IA",
    subtitulo: "Os sinais que entregam o seu texto e como tirar cada um",
    cor: "#164649",
    arte: "grade",
    capa: "",
    tituloNaCapa: false,
    paraQuem: "Para quem já usa a IA nas legendas e nas mensagens e sente que o texto sai artificial.",
    dentro: [
      "Os sinais que o cliente percebe, com o antes e o depois de cada um",
      "Como corrigir cada sinal em poucos segundos",
      "Um pedido pronto para a IA revisar o seu próprio texto",
    ],
    onde: "Hotmart",
    // sck=site_estante: no relatório da Hotmart, a venda aparece como vinda da estante do site
    link: "https://pay.hotmart.com/C108191719G?sck=site_estante",
    preco: "R$ 29,90",
  },
  {
    id: "falar",
    tipo: "E-book",
    titulo: "Como falar|com a sua IA",
    subtitulo: "Pedidos que funcionam na versão gratuita",
    cor: "#1F5F63",
    arte: "baloes",
    capa: "img/capa-conversa.webp",
    tituloNaCapa: false,
    paraQuem: "Para quem pede uma legenda e recebe um texto que não tem nada a ver com o seu trabalho.",
    dentro: [
      "Por que o pedido curto dá resposta genérica",
      "O pedido que faz a IA te entrevistar antes de escrever",
      "Falar em vez de digitar: o ditado por voz no celular",
    ],
    onde: "Hotmart",
    link: "",
    preco: "",
  },
  {
    id: "voz",
    tipo: "Livro Kindle",
    titulo: "A sua voz|na IA",
    subtitulo: "A ficha que faz a IA escrever do seu jeito",
    cor: "#22303A",
    arte: "digital",
    capa: "",
    tituloNaCapa: false,
    paraQuem: "Para quem quer que a IA responda como você responderia, com o seu jeito de falar e o seu método.",
    dentro: [
      "Como montar a ficha de voz, parte por parte",
      "Os exemplos da Maria e do João, antes e depois da ficha",
      "Como usar a mesma ficha no ChatGPT, no Gemini e no Claude",
    ],
    onde: "Amazon",
    link: "",
    preco: "",
  },
];
