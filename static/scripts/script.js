let btnCalcular = document.getElementById('btnCalcular');
btnCalcular.addEventListener('click', btnCalcularHandler);
let btnR = document.getElementById('btnR');
btnR.addEventListener('click', btnRHandler);

const requestConstURL = 'http://localhost:8080/cartabazi/';
//const requestConstURL = 'https://pruebaadnenergetico.appspot.com/cartabazi/';

const imgPath = 'images/animales/';

let ihoraNac = document.getElementById('horaNac');
let iminutosNac = document.getElementById('minutosNac');
let fechaNac;
const exampleDate = 'dd/mm/aaaa';
const exampleDateColor = 'grey'
const inputColor = 'black';

let despListDia = document.getElementById('despDiaNac');
let despListMes = document.getElementById('despMesNac');
let despListAno = document.getElementById('despAnoNac');
let despListHour = document.getElementById('despHoraNac');
let despListMinutes = document.getElementById('despMinutosNac');

//Obtengo el día de hoy.
const today = new Date();
const actualYear = today.getFullYear();

//Seteo los clickHandlers a los links de los animales, que al clickearse, vayan al pagina "animals-explanation". Previo a guardar el ANIMAL CLICKEADO.
setAnimalesClickHandlers();

//Seteo los clickHandlers a los links de los pilares, que al clickearse, vayan al pagina "pilares-explanation". Previo a guardar el PILAR CLICKEADO.
setPilaresClickHandlers();

//Completo las Desplay Lists
populateDespLists();

//Seteo el día de hoy en la fecha de nacimiento.
despListDia.value = today.getDate();
despListMes.value = convertMonth(today.getMonth()+1);       //January is 0!
if (actualYear > 2043) {
    despListAno.value = 2043;  
} else {
    despListAno.value = actualYear;
}

//Seteo el handler del link "Carta Bazi" del título para que borre lo que esté guardaro en "pilarPressed" en el SESSION STORAGE 
//(así no scrollea hasta ese pilar en "pilares-explanation").
document.getElementById('aTitle').addEventListener('click', aTitleClickHandler);
function aTitleClickHandler() {
    if (sessionStorage.getItem('pressedPilar')) {
        sessionStorage.removeItem('pressedPilar');
    }
}

//Manejo la imagen de fondo, en caso que sea muy chico el display (como un celular) se pone otra imagen de fondo.
handleBackgroundImage();

function handleBackgroundImage() {
    //Manejo la imagen de fondo, en caso que sea muy chico el display (como un celular) se pone otra imagen de fondo.

    let imgDeFondo = document.getElementById('imgDeFondo');
    const minWidth = 1300;        //El ancho del contenedor de todo.
    
    if (screen.width <= minWidth) {
        imgDeFondo.setAttribute('src', 'images/papel-tapiz/hojas-verdes-celulares.jpg');
    }
}

function setAnimalesClickHandlers() {
    //Seteo los clickHandlers a los links de los cuatro animales, que al clickearse, vayan al pagina "animals-explanation".}

    let pEnvoltura = document.getElementById('pEnvoltura');
    let pTronco = document.getElementById('pTronco');
    let pDefensa = document.getElementById('pDefensa');
    let pPoder = document.getElementById('pPoder');
    
    pEnvoltura.addEventListener('click', aAnimalsExplanationHandler);
    pTronco.addEventListener('click', aAnimalsExplanationHandler);
    pDefensa.addEventListener('click', aAnimalsExplanationHandler);
    pPoder.addEventListener('click', aAnimalsExplanationHandler);
}

function setPilaresClickHandlers() {
    //Seteo los clickHandlers a los links de los cuatro pilares, que al clickearse, vayan al pagina "pilares-explanation".

    let aEnvoltura = document.getElementById('aEnvoltura');
    let aTronco = document.getElementById('aTronco');
    let aDefensa = document.getElementById('aDefensa');
    let aPoder = document.getElementById('aPoder');
    
    aEnvoltura.addEventListener('click', aPilaresExplanationHandler);
    aTronco.addEventListener('click', aPilaresExplanationHandler);
    aDefensa.addEventListener('click', aPilaresExplanationHandler);
    aPoder.addEventListener('click', aPilaresExplanationHandler);
}

function aAnimalsExplanationHandler(e) {
    //Handler para los 4 links de los Animales (a ser clickeado uno de ellos), para que guarden cual se clikeo y vayan a la pag "animals-explanation"
    
    //Primero guardo la imagen clickeada para mostrar bien (scrollear en "animals-explanations").
    let pilarId = e.target.id                                   //pEnvoltura, pTronco, pDefensa, pPoder
    let para = removeDragonAccent(document.getElementById(pilarId).textContent);    //Rata o Perro o Gallo, etc.
    sessionStorage.setItem('pressedAnimal', para);

    //No hace falta cambiar de página porque se clickeo un link (a), por ende va ir al link descritpto en el HTML ("animals/explanation.html")
}

function aPilaresExplanationHandler(e) {
    //Handler para los 4 links de los Pilares (a ser clickeado uno de ellos: Envoltura, Tronco, Defensa, Poder), para que guarden cual se clikeo y vayan a la pag "pilares-explanation"
    
    //Primero guardo el pilar clickeado para mostrar bien (scrollear en "pilares-explanation").
    let pilarId = e.target.id                                   //aEnvoltura o aTronco o aDefensa o aPoder
    let para = document.getElementById(pilarId).textContent;    //Envoltura o Troco o Defensa o Poder.
    sessionStorage.setItem('pressedPilar', para);

    //No hace falta cambiar de página porque se clickeo un link (a), por ende va ir al link descritpto en el HTML ("pilares-explanation.html")
}

//Variable global booleana que se setea en true si el año ingresado está fuera del rango (1901 <= year <= 2043) 
//que maneja la API Rest hecha en Golang.
let yearOutGolangApi;

//Seteo los clickHandlers a la imagenes de los animales para, que al clickearse, vayan al pagina "animals-explanation".
setImgAnimalsClickHandlers();

function setImgAnimalsClickHandlers() {
    //Seteo los clickHandlers a la imagenes de los animales para, que al clickearse, vayan al pagina "animals-explanation".

    let imgEnvoltura = document.getElementById('imgEnvoltura');
    let imgTronco = document.getElementById('imgTronco');
    let imgDefensa = document.getElementById('imgDefensa');
    let imgPoder = document.getElementById('imgPoder');

    imgEnvoltura.addEventListener('click', imgAnimalClickHandler);
    imgTronco.addEventListener('click', imgAnimalClickHandler);
    imgDefensa.addEventListener('click', imgAnimalClickHandler);
    imgPoder.addEventListener('click', imgAnimalClickHandler);
}

function imgAnimalClickHandler(e) {
    //Handler al clickearse la imagen del animal, los dervia a la pagina de explicación de "animals-explanation"

    //Primero guardo la imagen clickeada para mostrar bien (scrollear en "animals-explanations").
    let imgId = e.target.id         //imgEnvoltura, imgTronco, imgDefensa, imgPoder
    pId = imgId.slice(3);           //Envolura, Tronco, Defensa, Poder
    pId = 'p' + pId                 //pEnvoltura, pTronco, pDefensa, pPoder
    let para = removeDragonAccent(document.getElementById(pId).textContent);
    sessionStorage.setItem('pressedAnimal', para);

    //Cambio de página a "animals-explanation"
    window.location = "links/animales/animales.html";
}

function populateAll(animales, alsoFullDate) {
    //Se muestra todo por pantalla (al recibir la respuesta del servidor o un roll-back a la pagina actual)
    //Si el parametro recibido alsoFullDate está en True, también muestro la fecha y hora ingresada, además de todo lo demás.
    //En caso contrario (alsoFullDate = False), solo muestro los títulos de los pilares, las fotos de los animales y el nombre de cada animal.
    //Esto se da cuando se presiona el Botón Calcular. Mientras que el primer caso se da cuando se hace un Load State de toda la página.

    if (alsoFullDate) {
        populateFullDate(animales);
    }

    setVisiblePilaresTitles();
    populateImgs(animales);
    populateParas(animales);
    
    //Guardo el estado de lo que se trajo del servidor.
    saveState();

    function populateFullDate(animales) {
        //Completo el input con la fecha, el display list con la hora y el display list con los minutos.

        despListDia.value = animales["diaNac"];
        despListMes.value = animales["mesNac"];
        despListAno.value = animales["anoNac"];
        despListHour.value = animales["horaNac"];
        despListMinutes.value = animales["minutosNac"];
    }

    function setVisiblePilaresTitles() {
        //Hago visible los textos con los pilares (Envoltura, Tronco, Defensa, Poder)

        let aPilares = document.querySelectorAll('.aPilares');
        for (let i = 0; i < aPilares.length; i++) {
            aPilares[i].style.visibility = 'visible';
        }
    }

    function populateImgs(animales) {
        //Cargo las imagenes con los animales y las hago visibles.

        let imgEnvoltura = document.getElementById('imgEnvoltura');
        let imgTronco = document.getElementById('imgTronco');
        let imgDefensa = document.getElementById('imgDefensa');
        let imgPoder = document.getElementById('imgPoder');
        imgEnvoltura.setAttribute ('src', imgPath + animales["envoltura"] + ".jpg");
        imgTronco.setAttribute ('src', imgPath + animales["tronco"] + ".jpg");
        imgDefensa.setAttribute ('src', imgPath + animales["defensa"] + ".jpg");
        imgPoder.setAttribute ('src', imgPath + animales["poder"] + ".jpg");
        imgEnvoltura.style.visibility = 'visible';
        imgTronco.style.visibility = 'visible';
        imgDefensa.style.visibility = 'visible';
        imgPoder.style.visibility = 'visible';
    }

    function populateParas(animales) {
        //Completo los nombres de los animales debajo.

        let pEnvoltura = document.getElementById('pEnvoltura');
        let pTronco = document.getElementById('pTronco');
        let pDefensa = document.getElementById('pDefensa');
        let pPoder = document.getElementById('pPoder');
        pEnvoltura.textContent = setDragonAccent(animales["envoltura"]);
        pTronco.textContent = setDragonAccent(animales["tronco"]);
        pDefensa.textContent = setDragonAccent(animales["defensa"]);
        pPoder.textContent = setDragonAccent(animales["poder"]);
    }
}

function setDragonAccent(animalStr) {
    //Devuelve el string recibido (animalStr) CON el tilde en la ó en el caso que animalStr sea Dragon. Si no, devuelve el string animalStr.

    if (animalStr === 'Dragon') {
        return 'Dragón';
    } else {
        return animalStr;
    }
}

function removeDragonAccent(animalStr) {
    //Devuelve el string recibido (animalStr) SIN el tilde en la ó en el caso que animalStr sea Dragón. Si no, devuelve el string animalStr.

    if (animalStr === 'Dragón') {
        return 'Dragon';
    } else {
        return animalStr;
    }
}

function saveState() {
    //Guarda el estado de la pantalla.

    sessionStorage.setItem('diaNac', despListDia.value);
    sessionStorage.setItem('mesNac', despListMes.value);
    sessionStorage.setItem('anoNac', despListAno.value);
    sessionStorage.setItem('horaNac', despListHour.value);
    sessionStorage.setItem('minutosNac', despListMinutes.value);
    
    let pEnvoltura = document.getElementById('pEnvoltura');
    let pTronco = document.getElementById('pTronco');
    let pDefensa = document.getElementById('pDefensa');
    let pPoder = document.getElementById('pPoder');
    sessionStorage.setItem('envoltura', removeDragonAccent(pEnvoltura.textContent));
    sessionStorage.setItem('tronco', removeDragonAccent(pTronco.textContent));
    sessionStorage.setItem('defensa', removeDragonAccent(pDefensa.textContent));
    sessionStorage.setItem('poder', removeDragonAccent(pPoder.textContent));
}

function loadState() {
    //Carga el estado de la pantalla.
    
    //Inicializo clickTheButton en true, para "clickearlo" en caso que todas los valores fueron recuperados de sessionStorage.
    //(es decir para "populate" todo).
    let clickTheButton = true;
    let animales = new Array(7);
    
    if (sessionStorage.getItem('diaNac')) {
        animales["diaNac"] = sessionStorage.getItem('diaNac');

    } else {
        clickTheButton = false;
    }

    if (sessionStorage.getItem('mesNac')) {
        animales["mesNac"] = sessionStorage.getItem('mesNac');

    } else {
        clickTheButton = false;
    }

    if (sessionStorage.getItem('anoNac')) {
        animales["anoNac"] = sessionStorage.getItem('anoNac');

    } else {
        clickTheButton = false;
    }

    if (sessionStorage.getItem('horaNac')) {
        animales["horaNac"] = sessionStorage.getItem('horaNac');

    } else {
        clickTheButton = false;
    }
    
    if (sessionStorage.getItem('minutosNac')) {
        animales["minutosNac"] = sessionStorage.getItem('minutosNac');

    } else {
        clickTheButton = false;
    }

    if (sessionStorage.getItem('envoltura')) {
        animales["envoltura"] = sessionStorage.getItem('envoltura')
    } else {
        clickTheButton = false;
    }

    if (sessionStorage.getItem('tronco')) {
        animales["tronco"] = sessionStorage.getItem('tronco')
    } else {
        clickTheButton = false;
    }

    if (sessionStorage.getItem('defensa')) {
        animales["defensa"] = sessionStorage.getItem('defensa')
    } else {
        clickTheButton = false;
    }

    if (sessionStorage.getItem('poder')) {
        animales["poder"] = sessionStorage.getItem('poder')
    } else {
        clickTheButton = false;
    }

    
    if (clickTheButton) {
        //Muestro por pantalla el titulo de los cuatro pilares, las cuatro imagenes de los animales y sus respectivos nombres.
        populateAll(animales, true);
    }

}

//Cargo el estado de toda la pantalla.
loadState();


function populateDespLists() {
    //Completa las 31, 12, 1901-2043, 24 y las 60 opciones de las listas desplegables del DIA, MES, AÑO, HORA y MINUTOS respectivamente.

    //Populating Dias (DesplayList)
    for (let i = 1; i <= 31; i++) {
        let newItem = document.createElement('option');
        newItem.textContent = i.toString();
        despListDia.appendChild(newItem);
    }

    //Populating Meses (DesplayList)
    for (let i = 1; i <= 12; i++) {
        let newItem = document.createElement('option');
        newItem.textContent = convertMonth(i);
        despListMes.appendChild(newItem);
    }

    //Populating Años (DesplayList)
    let maxYear;
    if (actualYear > 2043) {
        maxYear = 2043;
    } else {
        maxYear = actualYear;
    }
    for (let i = 1901; i <= maxYear; i++) {
        let newItem = document.createElement('option');
        newItem.textContent = i.toString();
        despListAno.appendChild(newItem);
    }

    //Populating Horas (DesplayList)
    for (let i = 0; i < 24; i++) {
        let newItem = document.createElement('option');
        newItem.textContent = i.toString();
        despListHour.appendChild(newItem);
    }

    //Populating Minutos (DesplayList)
    for (let i = 0; i < 60; i++) {
        let newItem = document.createElement('option');
        newItem.textContent = i.toString();
        despListMinutes.appendChild(newItem);
    }
}

function convertMonth(month) {
    //Convierte un entero, que es el mes, a un string correspondiente a ese MES.
    
    let salida;
    switch (month) {
        case 1: salida = 'Enero'; break;
        case 2: salida = 'Febrero'; break;
        case 3: salida = 'Marzo'; break;
        case 4: salida = 'Abril'; break;
        case 5: salida = 'Mayo'; break;
        case 6: salida = 'Junio'; break;
        case 7: salida = 'Julio'; break;
        case 8: salida = 'Agosto'; break;
        case 9: salida = 'Septiembre'; break;
        case 10: salida = 'Octubre'; break;
        case 11: salida = 'Noviembre'; break;
        case 12: salida = 'Diciembre'; break;
        default: salida = 'Enero'; break;
    }
    return salida;
}

function btnCalcularHandler() {
    //Handler que maneja el click en el botón "Calcular".

    let pDateInvalid = document.getElementById('pDateInvalid');
    let validFullData = true;
    let validHour = true;
    let validMinutes = true;
    pDateInvalid.style.visibility = 'hidden';
        
    yearOutGolangApi = false;
    if (!isValidDate(despListDia.value, convertStrMonthToInt(String(despListMes.value)), despListAno.value)) {
        validFullData = false;
        if (yearOutGolangApi) {
            pDateInvalid.textContent = 'El año debe estar dentro del rango: 1901 - 2043.'
        } else {
            pDateInvalid.textContent = 'La fecha ingresada no es válida.';
        }

        //Hace visible el paragraph con date invalid.
        pDateInvalid.style.visibility = 'visible';
    }

    if (!isValidHour(String(despListHour.value))) {
        validFullData = false;
        validHour = false;
    }

    if (!isValidMinutes(String(despListMinutes.value))) {
        validFullData = false;
        validMinutes = false;
    }

    if (validFullData) {
        //Aquí  son válidos todos los datos ingresados. Se procede a hacer el pedido.

        //Creo el pedido que le haré al servidor.
        let requestURL = requestConstURL + getFullDate();
        let request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.responseType = 'json';

        //Cambio el cursor al "wait", que está esperando la respuesta del servidor.
        btnCalcular.style.cursor = 'wait';
        document.body.style.cursor = 'wait';

        //Envio el pedido al servidor.
        request.send();

        
        //Seteo el handler para cuando reciba respuesta del servidor.
        request.onload = function() {
            
            //RECIBI RESPUESTA DEL SERVIDOR

            //Vuelvo a poner el cursor al "default" dado que ya recibí la respuesta del servidor.
            btnCalcular.style.cursor = 'default';
            document.body.style.cursor = 'default';

            //"Muestro" todos los elementos hasta el momento ocultos:
            //los 4 titulos de los pilares, las cuatro imágenes de los animales y los cuatro nombres de los animales.
            populateAll(request.response, false);
        }
    }

    function convertStrMonthToInt(strMonth) {
        //Convierte un mes recibido como string, a un número entero, que representa el mes.

        let salida;

        switch (strMonth) {
            case 'Enero': salida = 1; break;
            case 'Febrero': salida = 2; break;
            case 'Marzo': salida = 3; break;
            case 'Abril': salida = 4; break;
            case 'Mayo': salida = 5; break;
            case 'Junio': salida = 6; break;
            case 'Julio': salida = 7; break;
            case 'Agosto': salida = 8; break;
            case 'Septiembre': salida = 9; break;
            case 'Octubre': salida = 10; break;
            case 'Noviembre': salida = 11; break;
            case 'Diciembre': salida = 12; break;
            default: salida = 1; break;
        }
        return salida;
    }

    function isValidDate(day, month, year) {
        //Recibe tres enteros (day, month, year). Retorna si se trata de una fecha válida.

        yearOutGolangApi = false;
        
        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return false;
        }
        
        if (day < 1 || year < 1) {
            return false;
        }
            
        if (month > 12 || month < 1) {
            return false;
        }
                
        if ((month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) && day > 31) {
            return false;
        }
            
        if ((month == 4 || month == 6 || month == 9 || month == 11 ) && day > 30) {
            return false;
        }

        if (month == 2) {
            if (((year % 4) == 0 && (year % 100) != 0) || ((year % 400) == 0 && (year % 100) == 0)) {
                if (day > 29)
                    return false;
            } else {
                if (day > 28)
                    return false;
            }      
        }
                
        //RESTRICCION POR LA API de GOLANG que usa una tabla en estos rangos de año.
        if (year < 1901 || year > 2043) {
            yearOutGolangApi = true;
            return false;
        }
        
        //Si superó todas las condiciones anteriores --> ES UN FECHA VALIDA!!.
        return true;
    }

    function isValidHour(hour) {
        //Retorna si el string recibido (hour) representa a una hora valida (0 .. 23)

        let salida = false;
        if (hour.length <= 2) {
           if (isNaturalNumber(hour)) {
                let hourInt = parseInt(hour, 10);
                salida = ((hourInt >= 0) && (hourInt <= 23));
            }
        }
        
        return salida;
    }

    function isValidMinutes(minutes) {
        //Retorna si el string recibido (minutes) representa a un valor de minutos válidos (0 .. 59)

        let salida = false;
        if (minutes.length <= 2) {
            if (isNaturalNumber(minutes)) {
                let minutesInt = parseInt(minutes, 10);
                salida = ((minutesInt >= 0) && (minutesInt <= 59));
            }
        }
        
        return salida;
    }

    function isDigit(c) {
        //Retorna si el string recibido (c) representa un dígito válido (0 .. 9).

        let salida;
        switch (c) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                salida = true;
                break;
            default:
                salida = false;
                break;
        }
        return salida;
    }

    function isNaturalNumber(s) {
        //Retorna si el string recibido (s) representa un número natural válido.

        let ok = true;
        let i = 0;
        while (ok && (i < s.length)) {
            ok = isDigit(s[i]);
            i++;
        }
        return ok;
    }

    function getFullDate() {
        //Es llamada cuando ya está verificado que todo lo ingresado es valido.
        //Devuelve una fecha completa válida para utilizarla en el llamado al server. (xEj: 28-09-1981 08:15).

        strDay = despListDia.value.toString();
        strMonth = String(despListMes.value);
        strYear = despListAno.value.toString();
        
        if (despListDia.value <= 9) {
            strDay = '0' + strDay;
        }

        intMonth = convertStrMonthToInt(strMonth);
        strMonth = intMonth.toString();
        if (intMonth <= 9) {
            strMonth = '0' + strMonth;
        }

        fechaNac = strDay + '-' + strMonth + '-' + strYear;

        let hourInt = parseInt(String(despListHour.value), 10);
        let minutesInt = parseInt(String(despListMinutes.value), 10);
        let horaNac;
        let minutosNac;

        //Ponerle un cero adelante ('0x') para la hora y minutos, en caso que haya ingresdo un solo dígito (x).
        if (hourInt <= 9) {
            horaNac = '0' + hourInt.toString();
        } else {
            horaNac = despListHour.value;
        }
        if (minutesInt <= 9) {
            minutosNac = '0' + minutesInt.toString();
        } else {
            minutosNac = despListMinutes.value;
        }

        //Se devuelve, xej: 28-09-1981 08:15
        return(fechaNac + ' ' + horaNac + ':' + minutosNac);
    }
}

function btnRHandler() {
    //Handler cuando se aprieta el boton R para "resetear/reiniciar" todo (Es como si hubieran ingresado a la pagina por primera vez).

    sessionStorage.clear();
    location.reload();
}