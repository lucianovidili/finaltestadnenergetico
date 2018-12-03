package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/tealeg/xlsx"
)

//import "google.golang.org/appengine"

//Animales : Estructura de los cuatro animales
type Animales struct {
	Envoltura string `json:"envoltura"` //Signo tradicional - - Afuera - - Pilar del Año
	Tronco    string `json:"tronco"`    //Adentro - - Pilar del Día
	Defensa   string `json:"defensa"`   //Autoridad - - Pilar del Mes
	Poder     string `json:"poder"`     //Ascendente - - Pilar de la Hora
}

//CANTFILASMATRIZ : Ultima fila de la Matriz que contine las fechas de los Pilares del Año
const CANTFILASMATRIZ = 12

//CANTCOLUMNASMATRIZ : Ultima columna de la Matriz que contine las fechas de los Pilares del Año
const CANTCOLUMNASMATRIZ = 24

//Matriz que contine las fechas de los Pilares del Año
var matrizPilardelAno [CANTFILASMATRIZ][CANTCOLUMNASMATRIZ]time.Time

//Arreglo que contiene los 12 animales chinos ("Rata", ... , "Cerdo").
var arregloPilardelAno [CANTFILASMATRIZ]string

//GetCuatroPilaresHandler - GET - /api/clientes/cuatro-pilares/{fullDate}
func GetCuatroPilaresHandler(w http.ResponseWriter, r *http.Request) {
	//Retorna los cuatro signos chinos de acuerdo a su fecha de nacimiento: fullDate.

	vars := mux.Vars(r)
	fullDate := vars["fullDate"] //fullDate = "28-09-1981 08:15". Quedaría agregarle los segundos (:00)
	format := "02-01-2006 15:04:05"

	//Setear esa propiedad a TODOS los dominios. Es decir, para que todos los dominios puedan acceder.
	w.Header().Set("Access-Control-Allow-Origin", "*")

	if esFechaValida(fullDate) {
		w.Header().Set("Content-Type", "aplication/json")

		//Creo la fecha fullDateTime a partir de fullDate
		fullDateTime, _ := time.Parse(format, fullDate+":00")

		//Obtengo los 4 animales del cliente a partir de fullDateTime
		animales := GetAnimales(fullDateTime)

		j, err := json.Marshal(animales)
		if err != nil {
			panic(err)
		}

		//Escribo el encabezado que esta ok y en el Body escribo la json de todos los animales del cliente según el id, obtenida en el paso anterior.
		w.WriteHeader(http.StatusOK)
		w.Write(j)

	} else {
		log.Printf("No es una fecha válida %s", fullDate)
		w.WriteHeader(http.StatusNotFound)
	}
}

func esFechaValida(fullDate string) bool {
	//Aún no implementada dado que se asumen que SIEMPRE se recibe una fecha válida.
	//La fecha fue chequeada en el front-end previo a efectuar la llamada al servidor.

	return true
}

//GetEnvoltura : Cálculo de la Envoltura según la fechaNac. - - Signo Tradicional - - Afuera - - Pilar del Año
func GetEnvoltura(fechaNac time.Time) string {
	//Retorna la Envoltura de acuerdo a la fecha de nacimiento (fechaNac).
	//Funciona para clientes nacidos entre el año 1901 y el 2043 inclusive.

	var envoltura string
	envoltura = "Not found"

	encontre := false
	fila, col := 0, 0
	var fechaHoraCero time.Time
	format := "2006-01-02 15:04:05"
	var dia, mes, ano int
	var diaS, mesS, anoS string

	for (!encontre) && (fila <= CANTFILASMATRIZ-1) {
		for (!encontre) && (col <= CANTCOLUMNASMATRIZ-1) {
			dia = fechaNac.Day()
			mes = int(fechaNac.Month())
			ano = fechaNac.Year()
			diaS = strconv.Itoa(dia)
			if dia <= 9 {
				diaS = "0" + diaS
			}
			mesS = strconv.Itoa(mes)
			if mes <= 9 {
				mesS = "0" + mesS
			}
			anoS = strconv.Itoa(ano)
			fechaHoraCero, _ = time.Parse(format, anoS+"-"+mesS+"-"+diaS+" 00:00:00")
			if fechaHoraCero.After(matrizPilardelAno[fila][col]) && fechaHoraCero.Before(matrizPilardelAno[fila][col+1]) {
				envoltura = arregloPilardelAno[fila]
				encontre = true
			}
			col = col + 2
		}
		fila++
		col = 0
	}

	return envoltura
}

//GetTronco : Cálculo del Tronco según la fechaNac. - - Adentro - - Pilar del Día
func GetTronco(fechaNac time.Time) string {
	//Retorna el Tronco de acuerdo a la fecha de nacimiento (fechaNac).

	var tronco string
	tronco = "Not found"

	//Formula Utilizada: (5(X - 1) + (X - 1)/4 + 15 + Y) % 60 = Q
	//X: Numero conformado por los ultimos dos digitos del año de nacimiento. OBS: Si el año de nacimiento es >= 2000,
	//   entonces a X le asignamos X + 100
	//Y: Dias transcurridos del año hasta el dia de nacimiento, incluyendo a este. OBS: Se tiene en cuenta los años bisiestos.
	//Q: Resto de la division entera. OBS: Si Q = 0, entonces a Q le asignamos 60.

	X := fechaNac.Year() % 100
	if fechaNac.Year() >= 2000 {
		X += 100
	}

	format := "2006-01-02 15:04:05"
	ano := fechaNac.Year()
	anoString := strconv.Itoa(ano)
	eneroUno, _ := time.Parse(format, anoString+"-01-01 00:00:00")
	dif := fechaNac.Sub(eneroUno)
	Y := int(dif.Hours()/24) + 1 // + 1: Porque se obtuvo la diferencia en dias con respecto al 01/01, pero como queremos la cantidad
	//									 de días con respecto al día 0, al inicio del año, se le suma uno a lo calculado.
	Q := (5*(X-1) + int((X-1)/4) + 15 + Y) % 60
	if Q == 0 {
		Q = 60
	}

	indiceArreglo := (Q - 1) % 12
	tronco = arregloPilardelAno[indiceArreglo]

	return tronco
}

//GetDefensa : Cálculo de la Defensa según la fechaNac. - - Autoridad - - Pilar del Mes (El cálculo es aproximado!)
func GetDefensa(fechaNac time.Time) string {
	//Retorna la Defensa de acuerdo a la fecha de nacimiento (fechaNac).

	//LOS VALORES DE AQUI DEBAJO COMENTADOS SON APROXIMADOS, Y SON LOS UTILIZADOS PARA CALCULAR defensa//
	//07.12 - 05.01: Rata
	//06.01 - 03.02: Buey
	//04.02 - 04.03: Tigre
	//05.03 - 03.04: Liebre
	//04.04 - 04.05: Dragon
	//05.05 - 04.06: Serpiente
	//05.06 - 06.07: Caballo
	//07.07 - 06.08: Cabra
	//07.08 - 06.09: Mono
	//07.09 - 07.10: Gallo
	//08.10 - 06.11: Perro
	//07.11 - 06.12: Cerdo

	var defensa string
	defensa = "Not found"

	switch {
	case ((fechaNac.Day() >= 7) && (fechaNac.Month() == 12)) || ((fechaNac.Day() <= 5) && (fechaNac.Month() == 1)):
		defensa = "Rata"
	case ((fechaNac.Day() >= 6) && (fechaNac.Month() == 1)) || ((fechaNac.Day() <= 3) && (fechaNac.Month() == 2)):
		defensa = "Buey"
	case ((fechaNac.Day() >= 4) && (fechaNac.Month() == 2)) || ((fechaNac.Day() <= 4) && (fechaNac.Month() == 3)):
		defensa = "Tigre"
	case ((fechaNac.Day() >= 5) && (fechaNac.Month() == 3)) || ((fechaNac.Day() <= 3) && (fechaNac.Month() == 4)):
		defensa = "Liebre"
	case ((fechaNac.Day() >= 4) && (fechaNac.Month() == 4)) || ((fechaNac.Day() <= 4) && (fechaNac.Month() == 5)):
		defensa = "Dragon"
	case ((fechaNac.Day() >= 5) && (fechaNac.Month() == 5)) || ((fechaNac.Day() <= 4) && (fechaNac.Month() == 6)):
		defensa = "Serpiente"
	case ((fechaNac.Day() >= 5) && (fechaNac.Month() == 6)) || ((fechaNac.Day() <= 6) && (fechaNac.Month() == 7)):
		defensa = "Caballo"
	case ((fechaNac.Day() >= 7) && (fechaNac.Month() == 7)) || ((fechaNac.Day() <= 6) && (fechaNac.Month() == 8)):
		defensa = "Cabra"
	case ((fechaNac.Day() >= 7) && (fechaNac.Month() == 8)) || ((fechaNac.Day() <= 6) && (fechaNac.Month() == 9)):
		defensa = "Mono"
	case ((fechaNac.Day() >= 7) && (fechaNac.Month() == 9)) || ((fechaNac.Day() <= 7) && (fechaNac.Month() == 10)):
		defensa = "Gallo"
	case ((fechaNac.Day() >= 8) && (fechaNac.Month() == 10)) || ((fechaNac.Day() <= 6) && (fechaNac.Month() == 11)):
		defensa = "Perro"
	case ((fechaNac.Day() >= 7) && (fechaNac.Month() == 11)) || ((fechaNac.Day() <= 6) && (fechaNac.Month() == 12)):
		defensa = "Cerdo"
	}

	return defensa
}

//GetPoder : Cálculo del Poder según la fechaNac. - - Ascendente - - Pilar de la Hora
func GetPoder(fechaNac time.Time) string {
	//Retorna el Poder de acuerdo a la fecha de nacimiento (fechaNac).

	var poder string
	poder = "Not found"

	switch fechaNac.Hour() {
	case 23, 0:
		poder = "Rata"
	case 1, 2:
		poder = "Buey"
	case 3, 4:
		poder = "Tigre"
	case 5, 6:
		poder = "Liebre"
	case 7, 8:
		poder = "Dragon"
	case 9, 10:
		poder = "Serpiente"
	case 11, 12:
		poder = "Caballo"
	case 13, 14:
		poder = "Cabra"
	case 15, 16:
		poder = "Mono"
	case 17, 18:
		poder = "Gallo"
	case 19, 20:
		poder = "Perro"
	case 21, 22:
		poder = "Cerdo"
	}

	return poder
}

//GetAnimales : Devuelve los cuatro animales, en un formato de tipo Animales, segun fechaNac.
func GetAnimales(fechaNac time.Time) Animales {
	//Retorna los cuatro Animales (Signos Chinos) de acuerdo a la fecha de nacimiento (fechaNac).

	respuesta := Animales{
		Envoltura: GetEnvoltura(fechaNac),
		Tronco:    GetTronco(fechaNac),
		Defensa:   GetDefensa(fechaNac),
		Poder:     GetPoder(fechaNac),
	}

	return respuesta
}

func crearMatrizPilardelAno() {
	//Crea la matriz que contine las fechas de los Pilares del Año.

	const DATEFORMAT = "2006-01-02"
	var fila, col int

	excelFileName := "PilardelAno/PilardelAno.xlsx"
	xlFile, err := xlsx.OpenFile(excelFileName)
	if err != nil {
		panic(err)
	}

	for _, sheet := range xlFile.Sheets {
		fila = 0
		for _, row := range sheet.Rows {
			col = 0
			for _, cell := range row.Cells {
				matrizPilardelAno[fila][col], _ = time.Parse(DATEFORMAT, cell.String())
				col++
			}
			fila++
		}
	}
}

func crearArregloPilardelAno() {
	//Crea el arreglo que contine los doce signos chinos.

	arregloPilardelAno[0] = "Rata"
	arregloPilardelAno[1] = "Buey"
	arregloPilardelAno[2] = "Tigre"
	arregloPilardelAno[3] = "Liebre"
	arregloPilardelAno[4] = "Dragon"
	arregloPilardelAno[5] = "Serpiente"
	arregloPilardelAno[6] = "Caballo"
	arregloPilardelAno[7] = "Cabra"
	arregloPilardelAno[8] = "Mono"
	arregloPilardelAno[9] = "Gallo"
	arregloPilardelAno[10] = "Perro"
	arregloPilardelAno[11] = "Cerdo"
}

func main() {

	//Crea la matriz que contine las fechas de los Pilares del Año.
	crearMatrizPilardelAno()

	//Crea el arreglo que contine los doce signos chinos.
	crearArregloPilardelAno()

	//Crea el gorilla mux que va a servir de server handler.
	r := mux.NewRouter().StrictSlash(false)

	//Setea el handler "GetCuatroPilaresHandler" que obtiene los cuatro pilares a partir de la fecha de nacimiento completa ("fullDate")
	//ingresada en el front-end.
	r.HandleFunc("/cartabazi/{fullDate}", GetCuatroPilaresHandler).Methods("GET")

	//Seteo del File Server (servidor de archivos estaticos: CSS, JS, imágenes)
	fs := http.FileServer(http.Dir("static"))
	r.Handle("/", fs)

	//Creación y seteo del servidor.
	server := &http.Server{
		Addr: ":8080",
		//Addr:           ":3000",
		Handler:        r,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	//Escritura por consola que se está escuchando.
	log.Println("Listening http://localhost:8080 ... MI SWEETY")

	//Setear al servidor en estado de Escucha y Servicio.
	log.Fatal(server.ListenAndServe())
}
