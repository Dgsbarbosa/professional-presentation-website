

document.addEventListener('DOMContentLoaded', () => {
    menuButtons();
});

let categoriasLocais = {};


function menuButtons() {
    const buttons = document.querySelectorAll(".main-list-option");
    buttons.forEach(button => {
        button.addEventListener("click", showSection)
    })
}

// Manipulação do menu
function showSection(event) {
    event.preventDefault();

    const linkMenu = event.target.closest("a");
    const sectionIdMenu = linkMenu.getAttribute("data-target");

    const activeDiv = document.querySelector('[data-visibility="active"]');

    const activeDivId = activeDiv.id;

    if (activeDiv) {
        activeDiv.classList.add("hidden");
        activeDiv.classList.remove("visible");
        activeDiv.dataset.visibility = "deactive";
    }


    const sectionNext = document.querySelector(`#${sectionIdMenu}`);

    sectionNext.classList.add("visible");
    sectionNext.classList.remove("hidden");
    sectionNext.dataset.visibility = "active";
    if (sectionIdMenu === "courses" && !window.certificadosCarregados) {
        fetch("certificados.json")
            .then(res => res.json())
            .then(data => {
                categoriasLocais = data;
                carregarCategorias();
                window.certificadosCarregados = true;
            });
    }
}


function carregarCategorias() {
    const listaCategorias = document.querySelector(".areas-list ul");
    listaCategorias.innerHTML = "";

    const nomesOrdenados = Object.keys(categoriasLocais).sort();
    nomesOrdenados.forEach(nomeCategoria => {
        const li = document.createElement("li");
        li.textContent = nomeCategoria;
        li.style.cursor = "pointer";
        li.addEventListener("click", () => listarCertificados(nomeCategoria));
        listaCategorias.appendChild(li);
    });
}

function agruparCertificadosFrenteVerso(lista) {
    const grupos = {};

    lista
        .filter(arquivo => arquivo.toLowerCase().endsWith(".png"))
        .forEach(caminho => {
            const nomeArquivo = caminho.split("/").pop().replace(".png", "");
            const base = nomeArquivo.replace(/-\d$/, ''); // Ex: Inglês 1-1 → Inglês 1

            if (!grupos[base]) grupos[base] = [];
            grupos[base].push({ caminho, nome: nomeArquivo });
        });

    return grupos;
}

function listarCertificados(nomeCategoria) {
    const certificados = categoriasLocais[nomeCategoria];
    const container = document.querySelector('.area-selected-list.row');
    container.innerHTML = "";

    const titulo = document.querySelector('.area-selected-title');
    titulo.textContent = nomeCategoria;

    if (!certificados || certificados.length === 0) {
        container.innerHTML = '<p>Nenhum certificado encontrado.</p>';
        return;
    }

    const grupos = agruparCertificadosFrenteVerso(certificados);

    Object.keys(grupos).forEach(base => {
        const imagens = grupos[base];
        const temVerso = imagens.length > 1;
        addCertificate(imagens, base, temVerso);
    });

    setupImageModal();
}

function addCertificate(imagens, nomeSemExtensao, temVerso) {
    const container = document.querySelector('.area-selected-list.row');

    const divCertificate = document.createElement('div');
    divCertificate.className = 'div-certificate col-md-3';

    const primeiraImagem = imagens[0].caminho;

    divCertificate.innerHTML = `
        <div class="certificate" data-cert-nome="${nomeSemExtensao}" data-cert-imagens='${JSON.stringify(imagens.map(i => i.caminho))}'>
            <img src="${primeiraImagem}" alt="${nomeSemExtensao}" class="certificate-thumbnail">
            <span class="certificate-name">${nomeSemExtensao}${temVerso ? ' 🔄' : ''}</span>
        </div>
    `;

    container.appendChild(divCertificate);
}


function setupImageModal() {
    const modal = document.getElementById("certificateModal");
    const modalImg = document.getElementById("fullImage");
    const closeModal = document.querySelector(".close");
    const thumbnails = document.querySelectorAll(".certificate-thumbnail");

    const botaoVerso = document.querySelector("#toggleSide");
    let imagens = [];
    let indiceAtual = 0;
    let scale = 1;

    thumbnails.forEach(thumb => {
        thumb.addEventListener("click", function () {
            const divPai = this.closest(".certificate");
            imagens = JSON.parse(divPai.dataset.certImagens);
            indiceAtual = 0;
            scale = 1;
            modalImg.src = imagens[indiceAtual];
            modalImg.style.transform = `scale(${scale})`;
            modal.style.display = "block";

            botaoVerso.style.display = imagens.length > 1 ? "inline-block" : "none";
        });
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", e => {
        if (e.target === modal) modal.style.display = "none";
    });

    modal.addEventListener("wheel", e => {
        e.preventDefault();
        scale += (e.deltaY < 0 ? 0.1 : -0.1);
        scale = Math.min(Math.max(scale, 1), 3);
        modalImg.style.transform = `scale(${scale})`;
        modalImg.style.transition = "transform 0.2s ease";
    });

    botaoVerso.addEventListener("click", () => {
        if (imagens.length > 1) {
            indiceAtual = (indiceAtual + 1) % imagens.length;
            modalImg.src = imagens[indiceAtual];
        }
    });
}
