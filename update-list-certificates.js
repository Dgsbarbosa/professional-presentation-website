const fs = require("fs");
const path = require("path");

const certificadosDir = path.join(__dirname, "Certificados");
const outputJson = path.join(__dirname, "certificates-list.json");

const resultado = {};

fs.readdirSync(certificadosDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .forEach(dirent => {
    const categoria = dirent.name;
    const categoriaPath = path.join(certificadosDir, categoria);

    const arquivos = fs.readdirSync(categoriaPath)
      .filter(file => !file.startsWith(".") && path.extname(file) !== ".ini")
      .map(file => `Certificados/${categoria}/${file}`);

    resultado[categoria] = arquivos;
  });

fs.writeFileSync(outputJson, JSON.stringify(resultado, null, 2), "utf-8");

console.log("✅ certificados.json gerado com sucesso!");
