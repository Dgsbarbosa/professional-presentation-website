document.addEventListener('DOMContentLoaded', () => {
    menuButtons();
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