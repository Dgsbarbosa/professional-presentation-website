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
function showSection(event) {
    event.preventDefault();

    const linkMenu = event.target.closest("a");
    const sectionIdMenu = linkMenu.getAttribute("data-target");

    const activeDiv = document.querySelector('[data-visibility="active"]');
    const activeDivId= activeDiv.id;
    
    activeDiv.classList.add("hidden");
    activeDiv.classList.remove("visible");
    activeDiv.dataset.visibility = "deactive"   
    

    const sectionNext = document.querySelector(`#${sectionIdMenu}`);

    sectionNext.classList.add("visible");
    sectionNext.classList.remove("hidden");
    sectionNext.dataset.visibility = "active"




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
            thumb.addEventListener("click",function () { 
                modal.style.display = "block";
                modalImg.src = this.src;
                scale = 1;
                modalImg.style.transform = `scale(${scale}) `;
             });
        });

        closeModal.addEventListener("click", function () {
            modal.style.display = "none";
        });

        modal.addEventListener("click",function(e){
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });

        modal.addEventListener("wheel", function (e) { 
            e.preventDefault();

            if (e.deltaY < 0 ) {
                scale = Math.min(scale + 0.1, maxScale)
            }else{
                scale =  Math.max(scale - 0.1, minScale);
            }
            modalImg.style.transform = `scale(${scale})`;
            modalImg.style.transition = "transform 0.2s ease";
         });
    
}