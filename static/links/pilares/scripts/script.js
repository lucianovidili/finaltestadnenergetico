const divAnimales = document.getElementById('divAnimales');
const imgPath = '../../images/animales/';
const aVolver = document.querySelector('a');
aVolver.addEventListener('click', goBack)

let animalsArray = [
    "Rata", "Buey", "Perro", "Liebre", "Dragon", "Serpiente", "Caballo", "Cabra", "Mono", "Gallo", "Tigre", "Cerdo"
];

//Crea y muestra por pantalla las imágenes de los animales en el div de la derecha (los que entren en la pantalla).
populateImages();
document.querySelector('html').style.visibility = 'visible';

//Scroleamos hacia abajo para posicionar el animal presionado.
scrollDown();
exaltateSelectedPilar();

function scrollDown() {
    //Scroleamos hacia abajo para posicionar el animal presionado.

    if (sessionStorage.getItem('pressedPilar')) {
        let pilar = sessionStorage.getItem('pressedPilar');     //"Envoltura", "Tronco", "Defensa" o "Poder".
        window.location.hash = 'p' + pilar;                     //Ubica automaticamente el elemento "pX" (xej: "pEnvoltura") y scrollea hasta ahí.
    }
}

function exaltateSelectedPilar() {
    //Da el efecto deseado al al paragraph del pilar seleccionado previamente.

    if (sessionStorage.getItem('pressedPilar')) {
        let pilar = sessionStorage.getItem('pressedPilar');     //"Envoltura", "Tronco", "Defensa" o "Poder".
        let pPilar = document.getElementById('p' + pilar);
        pPilar.style.transition = "background 2.0s linear 0s";
        pPilar.style.background = '#A0CF20';
    }
}

function populateImages() {
    //Crea y muestra por pantalla las imágenes de los animales en el div de la derecha (los que entren en la pantalla).

    const maxWidthSmartphone = 990;
    //const maxWidthNotebook = 1366;      //const maxHeightNotebook = 768;
    const maxWidthNotebook = 1440;      //const maxHeightNotebook = 768;
    const marginTopSmartPhone = 20;
    let nPictures;
    const imgHeightMonitor = 222;
    const imgWidthMonitor = 234;
    const imgHeightNotebook = 185;
    const imgWidthNotebook = 214;
    const imgHeightSmartPhone = 217;
    const imgWidthSmartPhone = 217;
    const divAnimalesWidthNotebook = 0.5;
    const divAnimalesWidthMonitor = 0.5;
    let imgHeight;
    let imgWidth;

    if (screen.width <= maxWidthSmartphone) {
        //Estamos dentro de un smartphone.
        let scrollHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );

        imgHeight = imgHeightSmartPhone;
        imgWidth = imgWidthSmartPhone;
        nPictures = parseInt((scrollHeight - marginTopSmartPhone) / imgHeight, 10) - 1;

    } else if (screen.width <= maxWidthNotebook) {
        //Estamos dentro de una notebook.
        //imgHeight = imgHeightNotebook;
        //imgWidth = imgWidthNotebook;
        imgWidth = (screen.width * divAnimalesWidthNotebook / 3.15);
        imgHeight = imgWidth * 0.9;
        nPictures = 12;
    
    } else {
        //Estamos dentro de un monitor de escritorio.
        //imgHeight = imgHeightMonitor;
        //imgWidth = imgWidthMonitor;
        imgWidth = (screen.width * divAnimalesWidthMonitor / 4.15);
        imgHeight = imgWidth * 0.9;
        nPictures = 12;
    }
    
    for (let i = 0; i < nPictures; i++) {
        let img = document.createElement('img');
        img.setAttribute('src', imgPath + animalsArray[i % 12] + '.jpg');
        img.setAttribute('height', imgHeight);
        img.setAttribute('width', imgWidth);
        divAnimales.appendChild(img);
    }
}

function goBack() {
    //Regresa hacia atrás, como si se hubiera presionado el botón "GoBack" del navegador.

    window.history.back();
}