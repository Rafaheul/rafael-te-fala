// O topo do site: a lente sobre o post da Maria.
// Fora da lente aparece o texto que a IA escreveu com a ficha da Maria; dentro da lente,
// o que a mesma IA escreveu sem contexto, com os sinais de "cara de IA" sublinhados.
// Quando a lente passa por cima de um sinal, o nome dele acende embaixo do celular.
//
// Como a lente se mexe:
//   no computador, ela segue o mouse por cima do post;
//   no celular, a pessoa arrasta a lente com o dedo ou toca onde quer que ela vá
//   (o dedo fora da lente continua rolando a página);
//   pelo teclado, as setas movem a lente.
// Na primeira vez, a lente passeia sozinha por três sinais para mostrar como funciona.
// Quem pediu "reduzir movimento" não vê o passeio e a lente vai direto aonde apontar.
//
// PARA TROCAR O TEXTO: edite os dois textos no index.html (está explicado lá).

(() => {
  const post = document.querySelector(".post");
  const ia = document.querySelector(".post__ia");
  const lente = document.querySelector(".lente");
  const lista = document.querySelector(".sinais__lista");
  if (!post || !ia || !lente || !lista) return;

  const hero = document.querySelector(".hero");
  const grade = document.querySelector("#grade");
  const conta = document.querySelector(".sinais__conta strong");
  const fim = document.querySelector(".sinais__fim");
  const botaoTudo = document.querySelector(".lente-tudo");
  const parado = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const temMouse = matchMedia("(pointer: fine)").matches;

  const trechos = [...ia.querySelectorAll(".sinal")];
  const itens = new Map([...lista.querySelectorAll("li")].map((li) => [li.dataset.sinal, li]));
  const achados = new Set();

  const raio = () => parseFloat(getComputedStyle(post).getPropertyValue("--raio")) || 76;
  const pos = { x: 0, y: 0 };      // onde a lente está
  const alvo = { x: 0, y: 0 };     // para onde ela vai (persegue devagar)
  let raioAgora = 0;               // começa fechada e abre na entrada
  let raioAlvo = raio();
  let modo = "espera";             // "passeio" (anda sozinha), "pessoa" (alguém está usando), "espera"
  let tudo = false;                // botão "Mostrar o texto todo"
  let arrastando = false;
  let pedido = 0;

  // ---------- Contas de posição ----------
  // Converte a posição do ponteiro na tela para dentro do post
  const paraPost = (e) => {
    const r = post.getBoundingClientRect();
    alvo.x = (e.clientX - r.left) * (post.clientWidth / r.width);
    alvo.y = (e.clientY - r.top) * (post.clientHeight / r.height);
    limitar();
  };
  const limitar = () => {
    alvo.x = Math.min(Math.max(alvo.x, 8), post.clientWidth - 8);
    alvo.y = Math.min(Math.max(alvo.y, 8), post.clientHeight - 8);
  };
  // Centro de um trecho sublinhado, dentro do post
  const centro = (el) => {
    const p = post.getBoundingClientRect();
    const r = el.getClientRects()[0] || el.getBoundingClientRect();
    const k = post.clientWidth / p.width;
    return { x: (r.left + r.width / 2 - p.left) * k, y: (r.top + r.height / 2 - p.top) * k };
  };
  // Quais sinais estão debaixo da lente agora
  const debaixo = () => {
    const nomes = new Set();
    if (tudo) { itens.forEach((_, nome) => nomes.add(nome)); return nomes; }
    const p = post.getBoundingClientRect();
    const k = post.clientWidth / p.width;
    const perto = raioAgora * 0.55;
    for (const el of trechos) {
      for (const r of el.getClientRects()) {
        const x0 = (r.left - p.left) * k, x1 = (r.right - p.left) * k;
        const y0 = (r.top - p.top) * k, y1 = (r.bottom - p.top) * k;
        const dx = Math.max(x0 - pos.x, 0, pos.x - x1);
        const dy = Math.max(y0 - pos.y, 0, pos.y - y1);
        if (dx * dx + dy * dy <= perto * perto) { nomes.add(el.dataset.sinal); break; }
      }
    }
    return nomes;
  };

  // ---------- Os sinais embaixo do celular ----------
  const marcar = () => {
    const agora = debaixo();
    itens.forEach((li, nome) => {
      li.classList.toggle("agora", agora.has(nome));
      if (agora.has(nome) && modo === "pessoa" && !tudo && !achados.has(nome)) {
        achados.add(nome);
        li.classList.add("achado");
      }
    });
    if (conta) conta.textContent = achados.size;
    if (fim && fim.hidden && achados.size === itens.size) {
      fim.hidden = false;
      if (!parado) fim.animate(
        [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }],
        { duration: 600, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
      );
    }
  };

  // ---------- O passeio da primeira vez ----------
  let passeio = null;   // { pontos, inicio }
  const PERNA = 1100;   // milissegundos para ir de um ponto ao outro
  const curva = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const comecarPasseio = () => {
    if (modo !== "espera") return;
    const de = (nome) => trechos.find((el) => el.dataset.sinal === nome);
    const pontos = [{ ...pos }, ...["abertura", "travessao", "tres"].map((n) => centro(de(n)))];
    passeio = { pontos, inicio: performance.now() };
    modo = "passeio";
    acordar();
  };
  const andarPasseio = (agora) => {
    const { pontos, inicio } = passeio;
    const t = (agora - inicio) / PERNA;
    const i = Math.min(Math.floor(t), pontos.length - 2);
    const f = curva(Math.min(t - i, 1));
    alvo.x = pontos[i].x + (pontos[i + 1].x - pontos[i].x) * f;
    alvo.y = pontos[i].y + (pontos[i + 1].y - pontos[i].y) * f;
    if (t >= pontos.length - 1) {
      passeio = null;
      modo = "espera";
      lente.classList.add("lente--convite");
    }
  };

  // Quem mexe assume a lente: o passeio para e o convite some
  const assumir = () => {
    if (modo === "pessoa") return;
    modo = "pessoa";
    passeio = null;
    lente.classList.remove("lente--convite");
  };

  // ---------- Fundo quadriculado que se mexe com o mouse ----------
  const mouseNoTopo = { x: 0.5, y: 0.5 };
  const desloc = { x: 0, y: 0 };
  if (hero && grade && temMouse && !parado) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      mouseNoTopo.x = (e.clientX - r.left) / r.width;
      mouseNoTopo.y = (e.clientY - r.top) / r.height;
      acordar();
    });
  }

  // ---------- Desenho de cada quadro ----------
  let ultimo = "";
  const desenhar = (agora) => {
    pedido = 0;
    if (!naTela()) return;
    if (passeio) andarPasseio(agora);

    const k = parado ? 1 : 0.2;
    pos.x += (alvo.x - pos.x) * k;
    pos.y += (alvo.y - pos.y) * k;
    raioAgora += (raioAlvo - raioAgora) * (parado ? 1 : 0.14);

    const r = raio();
    ia.style.clipPath = `circle(${raioAgora.toFixed(1)}px at ${pos.x.toFixed(1)}px ${pos.y.toFixed(1)}px)`;
    lente.style.transform = `translate(${(pos.x - r).toFixed(1)}px, ${(pos.y - r).toFixed(1)}px) scale(${Math.min(raioAgora / r, 1).toFixed(3)})`;

    const estado = `${pos.x.toFixed(0)},${pos.y.toFixed(0)},${raioAgora.toFixed(0)},${tudo},${modo}`;
    if (estado !== ultimo) { marcar(); ultimo = estado; }

    let mexendo = Math.abs(alvo.x - pos.x) > 0.3 || Math.abs(alvo.y - pos.y) > 0.3
      || Math.abs(raioAlvo - raioAgora) > 0.3 || passeio;

    if (grade) {
      desloc.x += ((mouseNoTopo.x - 0.5) * 16 - desloc.x) * 0.06;
      desloc.y += ((mouseNoTopo.y - 0.5) * 16 - desloc.y) * 0.06;
      grade.setAttribute("x", desloc.x.toFixed(2));
      grade.setAttribute("y", desloc.y.toFixed(2));
      if (Math.abs((mouseNoTopo.x - 0.5) * 16 - desloc.x) > 0.05) mexendo = true;
    }

    if (mexendo && naTela()) pedido = requestAnimationFrame(desenhar);
  };
  // Só desenha quando algo muda e o topo está na tela (poupa bateria)
  const naTela = () => {
    if (!hero) return true;
    const r = hero.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight;
  };
  const acordar = () => { if (!pedido) pedido = requestAnimationFrame(desenhar); };
  addEventListener("scroll", acordar, { passive: true });   // volta a andar quando o topo reaparece

  // ---------- Mouse, dedo e teclado ----------
  post.addEventListener("pointermove", (e) => {
    if (e.pointerType === "mouse" || arrastando) { assumir(); paraPost(e); acordar(); }
  });
  // Toque rápido fora da lente: a lente vai até lá. Se o dedo rolar a página,
  // o navegador cancela o toque e a lente fica onde estava.
  post.addEventListener("pointerup", (e) => {
    if (e.pointerType === "mouse" || arrastando || e.target.closest(".lente")) return;
    assumir(); paraPost(e); acordar();
  });
  lente.addEventListener("pointerdown", (e) => {
    arrastando = true;
    lente.setPointerCapture(e.pointerId);
    assumir(); paraPost(e); acordar();
    e.preventDefault();
  });
  const soltar = () => { arrastando = false; };
  lente.addEventListener("pointerup", soltar);
  lente.addEventListener("pointercancel", soltar);
  lente.addEventListener("keydown", (e) => {
    const passo = e.shiftKey ? 40 : 16;
    const setas = { ArrowLeft: [-passo, 0], ArrowRight: [passo, 0], ArrowUp: [0, -passo], ArrowDown: [0, passo] };
    if (!setas[e.key]) return;
    e.preventDefault();
    assumir();
    alvo.x += setas[e.key][0];
    alvo.y += setas[e.key][1];
    limitar();
    acordar();
  });

  if (botaoTudo) {
    botaoTudo.addEventListener("click", () => {
      tudo = !tudo;
      raioAlvo = tudo ? Math.hypot(post.clientWidth, post.clientHeight) : raio();
      lente.classList.toggle("lente--escondida", tudo);
      botaoTudo.textContent = tudo ? "Voltar para a lente" : "Mostrar o texto todo";
      botaoTudo.setAttribute("aria-pressed", String(tudo));
      acordar();
    });
  }

  window.addEventListener("resize", () => {
    if (!tudo) raioAlvo = raio();
    limitar();
    acordar();
  });

  // ---------- Começo ----------
  // A lente nasce perto do primeiro sinal, fechada, e abre depois que o celular entra.
  const inicio = () => {
    const primeiro = centro(trechos[0]);
    pos.x = alvo.x = primeiro.x + 30;
    pos.y = alvo.y = Math.max(primeiro.y + 10, raio() * 0.8);   // sem invadir o nome da Maria
    limitar();
    raioAgora = parado ? raio() : 0;
    acordar();
    if (parado) { lente.classList.add("lente--convite"); return; }
    setTimeout(comecarPasseio, 1500);
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(inicio);
})();
