

document.addEventListener('DOMContentLoaded', () => {
    menuButtons();
    fetch('skills.json')
        .then(response => response.json())
        .then(data => renderSkills(data));
});
function renderSkills(skills) {
    const container = document.getElementById('skills-container');

    skills.forEach(skill => {
        const card = document.createElement('div');
        card.className = 'skill-card';

        const name = document.createElement('div');
        name.className = 'skill-name';
        name.textContent = skill.nome;

        const level = document.createElement('span');
        level.className = `skill-level ${getLevelClass(skill.nivel)}`;
        level.textContent = skill.nivel;



        card.appendChild(name);
        card.appendChild(level);


        container.appendChild(card);

        const lineHr = document.createElement('hr');
        lineHr.className = "line-hr-skill"

        container.appendChild(lineHr);
    });
}

function getLevelClass(nivel) {
    switch (nivel.toLowerCase()) {
        case 'básico': return 'basic';
        case 'intermediário': return 'intermediate';
        case 'avançado': return 'advanced';
        case 'especialista': return 'specialist';
        default: return '';
    }
}

let categoriasLocais = {};

const palavrasEspeciais = {
    "ti": "TI",
    "rh": "RH",
    "html": "HTML",
    "css": "CSS",
    "nr": "NR",
    "sep": "SEP",
    "lgpd": "LGPD",

    "cs50s": "CS50s",
    "aws": "AWS",
    "csharp": "CSharp",
    "ifood": "iFood",
    "programacao": "Programação",
    "inteligencia": "Inteligência",
    "dados": "Dados",
    "fundamentos": "Fundamentos",
    "algoritmos": "Algoritmos",
    "manutencao": "Manutenção",
    "construcao": "Construção",
    "telecomunicacao": "Telecomunicação",
    "administracao": "Administração",
    "seguranca": "Segurança",
    "introducao": "Introdução",
    "conscientizacao": "Conscientização",
    "distracoes": "Distrações",
    "intermediario": "Intermediário "


    // pode adicionar mais conforme os nomes dos certificados
};


function menuButtons() {
    const buttons = document.querySelectorAll(".nav-link");
    buttons.forEach(button => {
        button.addEventListener("click", showSection);
    });
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
        fetch("certificates-list.json")
            .then(res => res.json())
            .then(data => {
                categoriasLocais = data;
                carregarCategorias();
                window.certificadosCarregados = true;
            });
    }
}

function cleanWords(text) {
    text = text.upper;
    alert(text);
    return text
}

//  Aba de certificados
function formatarNomeCategoria(nome) {
    return nome
        .split(/[\s\-]+/)
        .map(palavra => {
            const palavraLower = palavra.toLowerCase();
            if (palavraLower === "e") return "e";
            if (palavraLower === "a") return "a";
            if (palavraLower === "de") return "de";
            if (palavraLower === "do") return "do";
            if (palavraLower === "para") return "para";

            if (palavrasEspeciais[palavraLower]) return palavrasEspeciais[palavraLower];
            return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
        })
        .join(" ");
}

function carregarCategorias() {
    const listaCategorias = document.querySelector(".areas-list ul");
    listaCategorias.innerHTML = "";

    const nomesOriginais = Object.keys(categoriasLocais);


    const nomesFormatados = nomesOriginais.map(nome => ({
        original: nome,
        exibicao: formatarNomeCategoria(nome)
    }));

    nomesFormatados.sort((a, b) => a.exibicao.localeCompare(b.exibicao));

    nomesFormatados.forEach(({ original, exibicao }) => {
        const li = document.createElement("li");
        li.textContent = exibicao;
        li.style.cursor = "pointer";
        li.addEventListener("click", () =>
            listarCertificados(original));
            

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
    titulo.textContent = formatarNomeCategoria(nomeCategoria);

    if (!certificados || certificados.length === 0) {
        container.innerHTML = '<p>Nenhum certificado encontrado.</p>';
        return;
    }

    const grupos = agruparCertificadosFrenteVerso(certificados);

    Object.keys(grupos).forEach(base => {
        const imagens = grupos[base];
        const temVerso = imagens.length > 1;

        const nomeFormatado = formatarNomeCategoria(base);

        addCertificate(imagens, nomeFormatado, temVerso);
    });

    setupImageModal();
}

function addCertificate(imagens, nomeSemExtensao, temVerso) {
    const container = document.querySelector('.area-selected-list.row');

    const divCertificate = document.createElement('div');
    divCertificate.className = 'div-certificate col-sm-2 col-md-3 col-lg-3 mx-2';
    divCertificate.style.columnGap = "20px";
    divCertificate.style.columnGap = "20px";

    const primeiraImagem = imagens[0].caminho;

    divCertificate.innerHTML = `
        <div class="certificate " data-cert-nome="${nomeSemExtensao}" data-cert-imagens='${JSON.stringify(imagens.map(i => i.caminho))}'>
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
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    let initialDistance = 0;

    // Verifica se é mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    thumbnails.forEach(thumb => {
        thumb.addEventListener("click", function() {
            const divPai = this.closest(".certificate");
            imagens = JSON.parse(divPai.dataset.certImagens);
            indiceAtual = 0;
            scale = 1;
            translateX = 0;
            translateY = 0;
            modalImg.src = imagens[indiceAtual];
            modalImg.style.transform = `scale(${scale})`;
            modal.style.display = "flex";
            document.body.style.overflow = "hidden";

            botaoVerso.style.display = imagens.length > 1 ? "block" : "none";
            
            // Ajustes específicos para mobile
            if (isMobile) {
                modalImg.style.maxHeight = "80vh";
                modalImg.style.maxWidth = "90vw";
                closeModal.style.top = "20px";
                closeModal.style.right = "20px";
                botaoVerso.style.position = "fixed";
                botaoVerso.style.bottom = "20px";
                botaoVerso.style.left = "50%";
                botaoVerso.style.transform = "translateX(-50%)";
            }
        });
    });

    // Fechar modal
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    });

    // Fechar ao clicar fora
    modal.addEventListener("click", e => {
        if (e.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });

    // ZOOM COM SCROLL DO MOUSE (mantido como original)
    modal.addEventListener("wheel", e => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        scale += delta;
        scale = Math.min(Math.max(scale, 1), 3); // Limite entre 1x e 3x
        modalImg.style.transform = `scale(${scale})`;
        modalImg.style.transition = "transform 0.2s ease";
    });

    // COMPORTAMENTOS APENAS PARA MOBILE
    if (isMobile) {
        // Arrastar imagem quando zoomado
        modalImg.addEventListener("touchstart", e => {
            if (scale > 1) {
                isDragging = true;
                startX = e.touches[0].clientX - translateX;
                startY = e.touches[0].clientY - translateY;
            }
        });

        modalImg.addEventListener("touchmove", e => {
            if (isDragging && scale > 1) {
                translateX = e.touches[0].clientX - startX;
                translateY = e.touches[0].clientY - startY;
                modalImg.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
            }
        });

        modalImg.addEventListener("touchend", () => {
            isDragging = false;
        });

        // Double tap para alternar zoom
        let lastTap = 0;
        modalImg.addEventListener("touchend", (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 300 && tapLength > 0) {
                // Double tap detected
                if (scale === 1) {
                    scale = 2;
                } else {
                    scale = 1;
                    translateX = 0;
                    translateY = 0;
                }
                modalImg.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
                modalImg.style.transition = "transform 0.2s ease";
            }
            lastTap = currentTime;
        });
    }

    // Botão "Ver Verso"
    botaoVerso.addEventListener("click", () => {
        if (imagens.length > 1) {
            indiceAtual = (indiceAtual + 1) % imagens.length;
            modalImg.src = imagens[indiceAtual];
            // Reset zoom ao mudar de lado
            scale = 1;
            translateX = 0;
            translateY = 0;
            modalImg.style.transform = `scale(${scale})`;
        }
    });
}


// aba de ferramentas
let tecnologiasCarregadas = false;


function carregarTecnologias() {
    if (tecnologiasCarregadas) return;

    fetch('toolsData.json')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('tech-container');
            container.innerHTML = '';

            Object.entries(data).forEach(([categoria, ferramentas]) => {
                const sectionTools = document.createElement('div');
                sectionTools.className = "section-tools"
                const sectionTitle = document.createElement('h3');


                sectionTitle.textContent = categoria;
                sectionTools.appendChild(sectionTitle);
                container.appendChild(sectionTools);

                const grid = document.createElement('div');
                grid.className = 'tools-grid row';

                ferramentas.forEach(ferramenta => {
                    const item = document.createElement('div');
                    item.className = 'tool-item col-6 col-sm-6 col-md-4 col-lg-3 my-3';

                    item.innerHTML = `
            <a href="${ferramenta.link}" target="_blank" rel="noopener noreferrer">
    <img src="${ferramenta.icone}" alt="imagem de icone do ${ferramenta.nome}">
    <span>${ferramenta.nome}</span>
    <div class="tooltip">Nivel: ${ferramenta.nivel}</div>
  </a>
          `;

                    grid.appendChild(item);


                });

                sectionTools.appendChild(grid);
                const lineHrTools = document.createElement('hr');
                lineHrTools.className = "lineHr";

                sectionTools.appendChild(lineHrTools);

            });

            tecnologiasCarregadas = true;

        })
        .catch(error => console.error('Erro ao carregar o JSON:', error));
}

const techTab = document.querySelector('[data-target="tools"]');
if (techTab) {
    techTab.addEventListener('click', () => {
        carregarTecnologias();
    });
}

let projetosCarregados = false;

function carregarProjetos(project_type) {
    if (projetosCarregados) return;
    fetch("projects.json")
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('projects-selected');
            container.innerHTML = '';


            Object.entries(data).forEach(([categoria, ferramentas]) => {

                // alert(categoria + " " + ferramentas);
                const sectionTools = document.createElement('div');
                sectionTools.className = "section-tools";


                sectionTitle.textContent = categoria;
                sectionTools.appendChild(sectionTitle);
                container.appendChild(sectionTools);



                const grid = document.createElement('div');
                grid.className = 'tools-grid row';

                ferramentas.forEach(ferramenta => {
                    const item = document.createElement('div');
                    item.className = 'tool-item col-md-2';


                    item.innerHTML = `
            <a href="${ferramenta.link}" target="_blank" rel="noopener noreferrer">
    <img src="${ferramenta.icone}" alt="imagem de icone do ${ferramenta.nome}">
    <span>${ferramenta.titulo}</span>
    <div class="tooltip">Nivel: ${ferramenta.nivel}</div>
  </a>
          `;

                    grid.appendChild(item);


                });

                sectionTools.appendChild(grid);
                const lineHrTools = document.createElement('hr');
                lineHrTools.className = "lineHr";

                sectionTools.appendChild(lineHrTools);

            });

            projetosCarregados = true;

        })
        .catch(error => console.error('Erro ao carregar o JSON:', error));
}

const projectsSelected = document.querySelectorAll(".type-projects-li");
if (projectsSelected) {
    projectsSelected.forEach(project => {

        project.addEventListener('click', () => {
            carregarProjetos(project.dataset.project);
        })
    });
}

document.querySelectorAll('.main-left .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelectorAll('.main-left .nav-link').forEach(el => el.classList.remove('active-link'));
        link.classList.add('active-link');
    });
});

document.querySelectorAll('.main-left .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbarCollapse = document.getElementById('navbarSupportedContent');
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
            bsCollapse.hide();
        }

        // Classe ativa
        document.querySelectorAll('.main-left .nav-link').forEach(el => el.classList.remove('active-link'));
        link.classList.add('active-link');
    });
});
