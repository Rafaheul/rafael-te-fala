// Animações do site, feitas com a biblioteca Motion (motion.dev).
// A Motion vem pela internet, na linha <script> logo acima deste arquivo no index.html.
//
// COMO ANIMAR UM ELEMENTO NOVO: coloque data-anima nele, no index.html.
//   data-anima            sobe e aparece (o padrão)
//   data-anima="esquerda" entra vindo da esquerda
//   data-anima="direita"  entra vindo da direita
//   data-anima="cartao"   sobe, cresce de leve e aparece
//   data-anima="livro"    sobe de mais longe, como quem põe o livro na prateleira
// Os elementos da mesma seção aparecem um depois do outro, na ordem do arquivo.
//
// Quem pediu ao celular ou ao computador "reduzir movimento" vê o site sem animação.
// Se a Motion não carregar (sem internet), o site aparece normal, só que parado.

const raiz = document.documentElement;

if (!window.Motion) {
  raiz.classList.remove("anima");
} else if (raiz.classList.contains("anima")) {
  const { animate, inView, scroll, stagger } = Motion;
  const SUAVE = [0.22, 1, 0.36, 1];   // começa rápido e freia no fim

  const partida = {
    "":       { opacity: [0, 1], y: [28, 0] },
    esquerda: { opacity: [0, 1], x: [-32, 0] },
    direita:  { opacity: [0, 1], x: [32, 0] },
    cartao:   { opacity: [0, 1], y: [40, 0], scale: [0.96, 1] },
    livro:    { opacity: [0, 1], y: [70, 0] },
  };

  // Anima uma lista de elementos, um depois do outro
  const entrar = (elementos, atraso = 0) => {
    elementos.forEach((el, i) => {
      const tipo = el.dataset.anima in partida ? el.dataset.anima : "";
      animate(el, partida[tipo], { duration: 0.7, ease: SUAVE, delay: atraso + i * 0.09 });
    });
  };

  // ---------- Topo: entra assim que a página abre ----------
  const fundo = document.querySelector(".hero__fundo");
  if (fundo) animate(fundo, { opacity: [0, 1] }, { duration: 1.4, ease: "easeOut" });

  entrar([...document.querySelectorAll(".hero__texto [data-anima]")], 0.2);
  entrar([...document.querySelectorAll(".hero__palco [data-anima]")], 0.5);   // o celular com a lente

  // O "sem ficar com cara de IA" acende em coral depois que o título aparece
  const destaque = document.querySelector(".hero h1 em");
  if (destaque) {
    animate(destaque, { color: ["#F7F1E8", "#F0A08F"] }, { duration: 0.9, delay: 1.1, ease: "easeOut" });
  }

  // ---------- Seções: cada uma entra quando chega na tela ----------
  document.querySelectorAll("main .secao").forEach((secao) => {
    inView(secao, () => {
      entrar([...secao.querySelectorAll("[data-anima]")]);
    }, { amount: 0.2 });   // dispara quando 20% da seção estiver visível
  });

  // ---------- Barra coral no menu: mostra quanto da página já foi lida ----------
  const barra = document.querySelector(".progresso");
  if (barra) scroll(animate(barra, { scaleX: [0, 1] }, { ease: "linear" }));
}
