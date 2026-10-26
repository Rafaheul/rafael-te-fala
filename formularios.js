// Os formulários do site: o do material grátis e o da lista de espera dos livros.
//
// HOJE ELES NÃO ENVIAM NADA. Mostram a mensagem de "pronto" com o aviso
// "(teste: ainda não envia)", só para você ver como fica, e não guardam nada.
//
// PARA LIGAR: escolha a ferramenta de e-mail, pegue o endereço que ela dá para receber
// formulários e cole entre as aspas abaixo. O aviso de teste some sozinho.
// Cada envio leva o nome, o e-mail, qual formulário foi ("material-gratis" ou
// "lista-de-espera") e, na lista de espera, o nome do livro.
const ENDERECO_DOS_FORMULARIOS = "";

document.querySelectorAll("form[data-formulario]").forEach((form) => {
  const aviso = document.createElement("p");
  aviso.className = "formulario__aviso";
  aviso.setAttribute("role", "status");
  form.append(aviso);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dados = new FormData(form);
    dados.append("formulario", form.dataset.formulario);
    const nome = String(dados.get("nome") || "").trim().split(/\s+/)[0];
    const pronto = (form.dataset.sucesso || "Pronto, {nome}.")
      .replace("{nome}", nome)
      .replace("{livro}", String(dados.get("livro") || ""));
    const botao = form.querySelector("button");
    botao.disabled = true;

    try {
      if (ENDERECO_DOS_FORMULARIOS) {
        const resposta = await fetch(ENDERECO_DOS_FORMULARIOS, {
          method: "POST", body: dados, headers: { Accept: "application/json" },
        });
        if (!resposta.ok) throw new Error(resposta.status);
        aviso.textContent = pronto;
      } else {
        aviso.textContent = `${pronto} (teste: ainda não envia)`;
      }
      form.classList.add("formulario--enviado");
    } catch {
      aviso.textContent = "Não deu certo agora. Tente de novo em alguns minutos.";
      botao.disabled = false;
    }
  });
});
