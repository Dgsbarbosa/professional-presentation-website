const apiKey = 'AIzaSyBpsw74UT4iBsjSQUBsJ4SosqtgjddOFiw';
const folderPrincipalId = '1AL-UnO9ZGTGaMIYe3lcu7LLNFYqepCKT';

let certificadosCarregados = false;

document.addEventListener('DOMContentLoaded', () => {
    menuButtons();
    setupImageModal();
});

function menuButtons() {
    const buttons = document.querySelectorAll(".main-list-option");
    buttons.forEach(button => {
        button.addEventListener("click", showSection)
    })
}

// Manipulação do menu
async function showSection(event) {
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
    if (sectionIdMenu === "courses" && !certificadosCarregados) {
        await carregarCategorias();
        certificadosCarregados = true;
    }
}

async function carregarCategorias() {
    const listaCategorias = document.querySelector(".areas-list ul");
    listaCategorias.innerHTML = ""; // limpa categorias existentes

    const categorias = await obterCategorias();
    const nomesOrdenados = Object.keys(categorias).sort();

    nomesOrdenados.forEach(nomeCategoria => {
        const li = document.createElement("li");
        li.textContent = nomeCategoria;
        li.style.cursor = "pointer";
        li.addEventListener("click", () => listarCertificados(categorias[nomeCategoria], nomeCategoria));
        listaCategorias.appendChild(li);
    });
}

async function obterCategorias() {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderPrincipalId}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&key=${apiKey}&fields=files(id,name)`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();

        let categorias = {};
        dados.files.forEach(pasta => {
            categorias[pasta.name] = pasta.id;
        });

        return categorias;
    } catch (erro) {
        console.error('Erro ao obter categorias:', erro);
        return {};
    }
}

async function listarCertificados(folderId, nomeCategoria) {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType,thumbnailLink, webContentLink)`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        const container = document.querySelector('.area-selected-list.row');
        container.innerHTML = ""; 

       
        const titulo = document.querySelector('.area-selected-title');
        titulo.textContent = nomeCategoria;

        if (!dados.files || dados.files.length === 0) {
            container.innerHTML = '<p>Nenhum certificado encontrado.</p>';
            return;
        }

        dados.files.forEach(arquivo => {
            if (arquivo.mimeType.startsWith("image/") && arquivo.thumbnailLink) {
                const imageId = arquivo.id;
                const fullImageUrl = `https://drive.google.com/uc?export=view&id=${imageId}`;
                addCertificate(arquivo.thumbnailLink, arquivo.name, fullImageUrl);
            }

        });
    } catch (erro) {
        console.error("Erro ao listar arquivos:", erro);
    }
    setupImageModal();
}

function addCertificate(thumbnailUrl, certificateName, fullImageUrl) {
    const container = document.querySelector('.area-selected-list.row');

    const divCertificate = document.createElement('div');
    divCertificate.className = 'div-certificate col-md-3';

    divCertificate.innerHTML = `
        <div class="certificate">
            <div class="icon-view">
                <i class="fa-solid fa-eye"></i>
            </div>
            <img src="${thumbnailUrl}" data-full-image="${fullImageUrl}" alt="${certificateName}" class="certificate-thumbnail">
            <span class="certificate-name">${certificateName}</span>
        </div>
    `;

    container.appendChild(divCertificate);

}

function setupImageModal() {
    const thumbnails = document.querySelectorAll(".certificate-thumbnail");
    const modal = document.getElementById("certificateModal");
    const modalImg = document.getElementById("fullImage");
    const closeModal = document.querySelector(".close");

    let scale = 1;
    const minScale = 1;
    const maxScale = 3;

    thumbnails.forEach(thumb => {
        thumb.addEventListener("click", function () {
            modal.style.display = "block";
            modalImg.src = this.dataset.fullImage;

            alert(modalImg.src);
            scale = 1;
            modalImg.style.transform = `scale(${scale}) `;
        });
    });

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    modal.addEventListener("wheel", function (e) {
        e.preventDefault();

        if (e.deltaY < 0) {
            scale = Math.min(scale + 0.1, maxScale)
        } else {
            scale = Math.max(scale - 0.1, minScale);
        }
        modalImg.style.transform = `scale(${scale})`;
        modalImg.style.transition = "transform 0.2s ease";
    });

}

