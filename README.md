# 🌐 Professional Presentation Website

Este projeto é uma apresentação profissional online que exibe meusdados básicos, certificados, ferramentas que domina e projetos realizados. Ele é construído em HTML, CSS e JavaScript

## 📁 Estrutura do Projeto


<!-- to do -->


## 🚀 Como rodar o projeto

1. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/professional-presentation-website.git
cd professional-presentation-website
```

2. **Instale o Node.js (se ainda não tiver):**  
[https://nodejs.org](https://nodejs.org)

3. **Gere o JSON de certificados:**  
Esse script percorre a pasta `Certificados/` e organiza os arquivos por categoria.

```bash
node certificados-json.js
```

> Isso criará ou atualizará o arquivo `certificados.json`.

---

## 🔄 Rodar automaticamente ao adicionar certificados

Para que o script `certificados-json.js` seja executado automaticamente ao adicionar novos arquivos na pasta `Certificados`, você pode usar o `nodemon`.

### 📦 Instalar nodemon:

```bash
npm install -g nodemon
```

### ▶️ Rodar com nodemon:

```bash
nodemon --watch Certificados certificados-json.js
```

> Toda vez que algum arquivo for adicionado, o `certificados.json` será regenerado automaticamente.

---

## 🛠️ Como adicionar um certificado

1. Crie ou escolha uma categoria (pasta) dentro de `/Certificados`.
2. Coloque o certificado (PDF ou imagem) dentro dessa pasta.
3. Rode o script `certificados-json.js` (ou deixe o `nodemon` rodando).
4. Atualize a página (`index.html`) para visualizar o novo certificado.

---

## 🧰 Como adicionar uma ferramenta

1. No arquivo `script.js`, localize onde as ferramentas são carregadas.
2. Adicione uma nova entrada ao seu JSON (ou diretamente no HTML se for estático):

```json
{
    "nome": "JavaScript",
    "icone": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    "nivel": "Intermediário",
    "link": "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript"
}
```


---

## 🧱 Como adicionar um projeto

Você pode seguir a mesma lógica dos certificados. Crie uma estrutura de JSON para projetos como:

```json
[
  {
    "titulo": "Reforma Completa de Imóvel",
    "descricao":"Reforma completa de imóvel",
    "miniatura":"https://i.ibb.co/LDhJkdMg/telhado-1012.jpg",
    "album":"https://ibb.co/album/TrZvkb"
  }
]
```



---

## 📸 Exemplo visual

- Certificados são exibidos com visual elegante em cards.
- Ferramentas mostram o nível de habilidade ao passar o mouse.
- Projetos podem ser exibidos com imagem, descrição e botão de acesso.

---

## ✨ Melhorias futuras sugeridas

- Criar um backend leve com Express.js para servir os dados.
- Utilizar localStorage para personalização do tema (dark/light).
- Adicionar filtro de categorias.
- Responsividade completa para dispositivos móveis.

---
