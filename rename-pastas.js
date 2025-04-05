const fs = require("fs");
const path = require("path");

// Função para normalizar nomes: sem acento, espaço vira hífen, tudo minúsculo
function normalizarNome(nome) {
  return nome
    .normalize("NFD") // separa letras acentuadas
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/\s+/g, "-") // espaço por hífen
    .toLowerCase();
}

// Caminho principal
const baseDir = path.join(__dirname, "certificados");
const outputJson = path.join(__dirname, "certificados.json");

const resultado = {};

function processarDiretorio(dir, categoriaOriginal = null) {
  const itens = fs.readdirSync(dir, { withFileTypes: true });

  itens.forEach((item) => {
    const caminhoAntigo = path.join(dir, item.name);
    const nomeNormalizado = normalizarNome(item.name);
    const caminhoNovo = path.join(dir, nomeNormalizado);

    // Renomear se necessário
    if (item.name !== nomeNormalizado) {
      fs.renameSync(caminhoAntigo, caminhoNovo);
      console.log(`🔄 Renomeado: ${item.name} -> ${nomeNormalizado}`);
    }

    if (item.isDirectory()) {
      // Se é diretório, processa recursivamente
      processarDiretorio(caminhoNovo, nomeNormalizado);
    } else {
      // Se é arquivo, adiciona ao JSON
      if (!nomeNormalizado.startsWith(".") && nomeNormalizado !== "desktop.ini") {
        if (!resultado[categoriaOriginal]) resultado[categoriaOriginal] = [];
        resultado[categoriaOriginal].push(
          `certificados/${categoriaOriginal}/${nomeNormalizado}`
        );
      }
    }
  });
}

// Iniciar leitura da raiz
const categorias = fs.readdirSync(baseDir, { withFileTypes: true });

categorias.forEach((cat) => {
  if (cat.isDirectory()) {
    const categoriaOriginal = normalizarNome(cat.name);
    const caminhoAntigo = path.join(baseDir, cat.name);
    const caminhoNovo = path.join(baseDir, categoriaOriginal);

    if (cat.name !== categoriaOriginal) {
      fs.renameSync(caminhoAntigo, caminhoNovo);
      console.log(`📁 Renomeado diretório: ${cat.name} -> ${categoriaOriginal}`);
    }

    processarDiretorio(caminhoNovo, categoriaOriginal);
  }
});

// Gerar JSON
fs.writeFileSync(outputJson, JSON.stringify(resultado, null, 2), "utf-8");
console.log("\n✅ certificados.json gerado com sucesso!");
