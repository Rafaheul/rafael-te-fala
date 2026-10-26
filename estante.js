// A estante: monta os livros a partir do livros.js e abre a ficha de cada um.
//
// Na prateleira, cada livro fica de pé, meio de lado, mostrando a lombada. Com o mouse
// por cima, ele vira de frente, sobe um pouco e inclina acompanhando o mouse.
// Ao clicar, a capa sai da prateleira e voa até a ficha do livro; ao fechar, ela volta.
// A ficha mostra para quem é, o que tem dentro e a lista de espera (ou o botão de
// comprar, quando o livro tiver link no livros.js).
//
// Para mudar os livros, edite só o livros.js.

(() => {
  const prateleira = document.querySelector(".estante__livros");
  const painel = document.querySelector(".painel");
  const LIVROS = window.LIVROS || [];
  if (!prateleira || !painel || !LIVROS.length) return;

  const parado = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const temMouse = matchMedia("(hover: hover)").matches;
  const SUAVE = "cubic-bezier(0.22, 1, 0.36, 1)";
  const umaLinha = (l) => l.titulo.replace(/\s*\|\s*/g, " ");
  const comQuebra = (l) => l.titulo.split("|").map((p) => p.trim()).join("<br>");

  // ---------- Desenhos de papel recortado (enquanto não há imagem da IA) ----------
  // Cada desenho ocupa uma capa de 200 x 320. O terço de cima fica livre para o título.
  const CREME = "#F7F1E8", CORAL = "#C4553E", AGUA = "#6FC3BE";
  const ARTES = {
    grade() {
      let atras = "", frente = "";
      for (let j = 0; j < 5; j++) {
        for (let i = 0; i < 6; i++) {
          const k = (i * 7 + j * 13) % 11;
          const solto = k === 0 || k === 5;
          const giro = solto ? (k === 0 ? 14 : -11) : 0;
          const x = 24 + i * 26 + (solto ? -3 : 0), y = 140 + j * 26 + (solto ? -4 : 0);
          const q = `<rect x="${x}" y="${y}" width="18" height="18" rx="1.5" fill="${solto ? "#FBF7F1" : CREME}" transform="rotate(${giro} ${x + 9} ${y + 9})"/>`;
          if ((i + j) % 3 === 0) frente += q; else atras += q;
        }
      }
      return `<g filter="url(#papel-sombra)">${atras}</g>
        <path d="M-12 236 C 30 170, 74 290, 112 214 S 168 150, 214 196" fill="none" stroke="${CORAL}" stroke-width="15" stroke-linecap="round" filter="url(#papel-sombra)"/>
        <g filter="url(#papel-sombra)">${frente}</g>`;
    },
    baloes() {
      return `<path d="M0 292 C 50 272, 120 302, 200 280 V320 H0 Z" fill="#164649"/>
        <g filter="url(#papel-sombra)">
          <rect x="26" y="146" width="116" height="74" rx="18" fill="${CREME}"/>
          <path d="M46 214 l-6 22 l24 -14 z" fill="${CREME}"/>
          <circle cx="62" cy="183" r="6" fill="#1F5F63" opacity=".9"/>
          <circle cx="84" cy="183" r="6" fill="#1F5F63" opacity=".6"/>
          <circle cx="106" cy="183" r="6" fill="#1F5F63" opacity=".35"/>
        </g>
        <g filter="url(#papel-sombra)">
          <rect x="64" y="204" width="112" height="70" rx="18" fill="${CORAL}"/>
          <path d="M150 268 l10 22 l-26 -12 z" fill="${CORAL}"/>
          <rect x="82" y="226" width="74" height="7" rx="3.5" fill="${CREME}" opacity=".85"/>
          <rect x="82" y="242" width="52" height="7" rx="3.5" fill="${CREME}" opacity=".85"/>
        </g>`;
    },
    digital() {
      const cores = [CORAL, CREME, AGUA];
      let s = "";
      for (let n = 0; n < 8; n++) {
        const rx = 10 + n * 9, ry = rx * 1.22;
        s += `<ellipse cx="100" cy="218" rx="${rx}" ry="${ry}" fill="none" stroke="${cores[n % 3]}" stroke-width="4.2" stroke-linecap="round"
          stroke-dasharray="${30 + ((n * 17) % 40)} 9" stroke-dashoffset="${n * 11}"/>`;
      }
      return `<g filter="url(#papel-sombra)">${s}</g>`;
    },
  };

  // A capa inteira: imagem (ou desenho) + título + autor
  const capa = (l) => {
    const fundo = l.capa
      ? `<img src="${l.capa}" alt="" decoding="async">`
      : `<svg viewBox="0 0 200 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
           <rect width="200" height="320" fill="${l.cor}"/>
           ${(ARTES[l.arte] || ARTES.grade)()}
           <rect width="200" height="320" filter="url(#papel-fibra)" opacity=".45"/>
         </svg>`;
    const texto = l.capa && l.tituloNaCapa ? "" : `
      <span class="capa__texto">
        <span class="capa__tipo">${l.tipo}</span>
        <span class="capa__titulo">${comQuebra(l)}</span>
      </span>
      <span class="capa__autor">Rafael te Fala</span>`;
    return `<span class="capa" style="background:${l.cor}">${fundo}${texto}</span>`;
  };

  // ---------- A prateleira ----------
  prateleira.innerHTML = LIVROS.map((l) => `
    <li class="estante__item" data-anima="livro">
      <button type="button" class="livro" data-id="${l.id}"
              aria-label="${umaLinha(l)}, ${l.tipo.toLowerCase()}. Abrir a ficha do livro">
        <span class="livro__corpo">
          <span class="livro__verso" style="background:${l.cor}"></span>
          <span class="livro__paginas"></span>
          <span class="livro__lombada" style="background:${l.cor}"><span>${umaLinha(l)}</span></span>
          <span class="livro__capa">${capa(l)}</span>
        </span>
        <span class="livro__sombra"></span>
      </button>
      <p class="livro__tipo">${l.tipo}</p>
      <p class="livro__status">${l.link ? `À venda na ${l.onde}` : "Em produção"}</p>
    </li>`).join("");

  // Inclinar acompanhando o mouse
  prateleira.querySelectorAll(".livro").forEach((livro) => {
    if (!temMouse || parado) return;
    livro.addEventListener("pointerenter", () => livro.classList.add("livro--mao"));
    livro.addEventListener("pointermove", (e) => {
      const r = livro.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      livro.style.setProperty("--ry", `${(px * 22).toFixed(1)}deg`);
      livro.style.setProperty("--rx", `${(-py * 10).toFixed(1)}deg`);
      livro.style.setProperty("--sobe", "-14px");
    });
    livro.addEventListener("pointerleave", () => {
      livro.classList.remove("livro--mao");
      ["--ry", "--rx", "--sobe"].forEach((v) => livro.style.removeProperty(v));
    });
  });

  // ---------- A ficha ----------
  const veu = painel.querySelector(".painel__veu");
  const papel = painel.querySelector(".painel__papel");
  const capaPainel = painel.querySelector(".painel__capa");
  const info = painel.querySelector(".painel__info");
  const form = painel.querySelector("form");
  const comprar = painel.querySelector(".painel__comprar");
  let aberto = null;     // { livro, botao }
  let fechando = false;
  let animacoes = [];

  const preencher = (l) => {
    capaPainel.innerHTML = capa(l);
    painel.querySelector(".painel__tipo").textContent = `${l.tipo} · ${l.link ? `à venda na ${l.onde}` : "em produção"}`;
    painel.querySelector(".painel__titulo").textContent = umaLinha(l);
    painel.querySelector(".painel__sub").textContent = l.subtitulo;
    painel.querySelector(".painel__para").textContent = l.paraQuem;
    painel.querySelector(".painel__dentro").innerHTML = l.dentro.map((d) => `<li>${d}</li>`).join("");

    comprar.hidden = !l.link;
    form.hidden = !!l.link;
    if (l.link) {
      comprar.href = l.link;
      comprar.textContent = `Comprar na ${l.onde}${l.preco ? ` por ${l.preco}` : ""}`;
    } else {
      form.reset();
      form.classList.remove("formulario--enviado");
      form.querySelector("button").disabled = false;
      const aviso = form.querySelector(".formulario__aviso");
      if (aviso) aviso.textContent = "";
      form.elements.livro.value = umaLinha(l);
    }
  };

  const limparAnimacoes = () => { animacoes.forEach((a) => a.cancel()); animacoes = []; };

  const abrir = (id, botao) => {
    const l = LIVROS.find((x) => x.id === id);
    if (!l || fechando) return;
    limparAnimacoes();
    preencher(l);
    painel.showModal();
    document.documentElement.classList.add("travado");
    history.replaceState(null, "", `#livro-${id}`);
    aberto = { livro: l, botao };
    painel.scrollTop = 0;
    if (parado) return;

    const origem = botao && botao.querySelector(".livro__capa");
    animacoes.push(veu.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350, easing: "ease-out" }));
    animacoes.push(papel.animate(
      [{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "none" }],
      { duration: 500, easing: SUAVE }
    ));
    [...info.children].forEach((el, i) => {
      if (el.hidden) return;
      animacoes.push(el.animate(
        [{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }],
        { duration: 500, delay: 200 + i * 60, easing: SUAVE, fill: "backwards" }
      ));
    });
    if (origem) {
      // A capa sai da prateleira e voa até o lugar dela na ficha
      const a = origem.getBoundingClientRect();
      const b = capaPainel.getBoundingClientRect();
      animacoes.push(capaPainel.animate(
        [{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})` },
         { transform: "none" }],
        { duration: 700, easing: SUAVE }
      ));
      botao.classList.add("livro--fora");
    }
  };

  const fechar = async () => {
    if (!painel.open || fechando) return;
    fechando = true;
    const { botao } = aberto || {};
    if (!parado) {
      limparAnimacoes();
      const ida = { duration: 420, easing: "cubic-bezier(0.32, 0, 0.67, 0)", fill: "forwards" };
      const volta = [
        veu.animate([{ opacity: 1 }, { opacity: 0 }], ida),
        papel.animate([{ opacity: 1 }, { opacity: 0, transform: "scale(0.97)" }], ida),
        info.animate([{ opacity: 1 }, { opacity: 0 }], { ...ida, duration: 250 }),
      ];
      const origem = botao && botao.querySelector(".livro__capa");
      if (origem) {
        const a = origem.getBoundingClientRect();
        const b = capaPainel.getBoundingClientRect();
        volta.push(capaPainel.animate(
          [{ transform: "none" },
           { transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})` }],
          { duration: 560, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" }
        ));
      }
      animacoes = volta;
      await Promise.all(volta.map((a) => a.finished.catch(() => {})));
    }
    painel.close();
    limparAnimacoes();
    document.documentElement.classList.remove("travado");
    if (botao) { botao.classList.remove("livro--fora"); botao.focus({ preventScroll: true }); }
    history.replaceState(null, "", "#estante");
    aberto = null;
    fechando = false;
  };

  prateleira.addEventListener("click", (e) => {
    const botao = e.target.closest(".livro");
    if (botao) abrir(botao.dataset.id, botao);
  });
  painel.querySelector(".painel__fechar").addEventListener("click", fechar);
  veu.addEventListener("click", fechar);
  painel.addEventListener("cancel", (e) => { e.preventDefault(); fechar(); });   // tecla Esc

  // ---------- Link direto: rafaeltefala.com.br/#livro-ID ----------
  const peloEndereco = () => {
    const m = location.hash.match(/^#livro-(.+)$/);
    if (!m || painel.open) return;
    const botao = prateleira.querySelector(`.livro[data-id="${CSS.escape(m[1])}"]`);
    if (!botao) return;
    document.querySelector("#estante").scrollIntoView({ behavior: parado ? "auto" : "smooth" });
    setTimeout(() => abrir(m[1], botao), parado ? 0 : 900);
  };
  window.addEventListener("hashchange", peloEndereco);
  peloEndereco();
})();
