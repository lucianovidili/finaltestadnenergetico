const divEscudos = document.getElementById('divEscudos');
const imgPath = '../../images/carta-bazi-imagenes/escudo.jpg';
const aVolver = document.querySelector('a');
aVolver.addEventListener('click', goBack)

//Creamos y mostramos por pantalla las imágenes de los escudos, en forma vertical en el div de la derecha (los que entren en la pantalla).
populateImages();
document.querySelector('html').style.visibility = 'visible';

//Scroleamos hacia abajo para posicionar el animal presionado.
scrollDown();
exaltateSelectedAnimal();

function scrollDown() {
    //Scroleamos hacia abajo para posicionar el animal presionado.

    if (sessionStorage.getItem('pressedAnimal')) {
        let animal = sessionStorage.getItem('pressedAnimal');       //"Rata", "Buey", ... , "Cerdo"
        window.location.hash = 'p' + animal;                        //Ubica automaticamente el elemento "pX" (xej: "pBuey") y scrollea hasta ahí.
    }
}

function exaltateSelectedAnimal() {
    //Da el efecto deseado al paragraph del animal seleccionado previamente.

    if (sessionStorage.getItem('pressedAnimal')) {
        let animal = sessionStorage.getItem('pressedAnimal');       //"Rata", "Buey", ... , "Cerdo"
        let pAnimal = document.getElementById('p' + animal);
        pAnimal.style.transition = "background 2.0s linear 0s";
        pAnimal.style.background = '#9DCEFF';
    }
}

function populateImages() {
    //Crea y muestra por pantalla las imágenes de los escudos, en forma vertical en el div de la derecha (las que entren en la pantalla).

    const maxWidthSmartphone = 990;
    const maxWidthTablet = 1099;
    const maxWidthNotebook = 1366;          //const maxHeightNotebook = 768;
    const imgHeightSmartPhone = 220;
    const imgHeightTablet = 290;
    const imgHeightNotebook = 400;
    const imgHeightMonitor = 550;
    const marginTopSmartPhone = 11;
    const marginBottomTablet = 10;
    const marginBottomNotebook = 15;
    const marginBottomMonitor = 20;
    let nPictures;

    let scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );

    if (screen.width <= maxWidthSmartphone) {
        //Estamos dentro de un smartphone.
        nPictures = parseInt((scrollHeight - marginTopSmartPhone) / imgHeightSmartPhone, 10) - 2;

    } else if (screen.width <= maxWidthTablet) {
        //Estamos dentro de una tablet.
        nPictures = parseInt((scrollHeight - marginBottomTablet) / (imgHeightTablet + marginBottomTablet), 10);

    } else if (screen.width <= maxWidthNotebook) {
        //Estamos dentro de una notebook.
        nPictures = parseInt((scrollHeight - marginBottomNotebook) / (imgHeightNotebook + marginBottomNotebook), 10);
        //nPictures = 5;

    } else {
        //Estamos dentro de un monitor de escritorio.
        nPictures = parseInt((scrollHeight - marginBottomMonitor) / (imgHeightMonitor + marginBottomMonitor), 10);
        //nPictures = 3;
    }
        
    for (let i = 0; i < nPictures; i++) {
        let img = document.createElement('img');
        img.setAttribute('src', imgPath);
        img.setAttribute('display', 'inline');
        divEscudos.appendChild(img);
    }
}

function goBack() {
    //Regresa hacia atrás, como si se hubiera presionado el botón "GoBack" del navegador.
    
    window.history.back();
}