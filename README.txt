//DONE -- Signo - - Afuera - - Pilar del Ano
//Fuciona para clientes nacidos entre el año 1901 y el 2043 inclusive.
func GetEnvoltura(fechaNac time.Time) string

//DONE - - Adentro - - Pilar del Dia
func GetTronco(fechaNac time.Time) string

//FALTA (algo hecho) - - Autoridad - - Pilar del Mes - - (El calculo es aproximado!. Se obtuvo del libro "Manual de astrologia china y feng shui" de Marcelo Viggiano)
func GetDefensa(fechaNac time.Time) string

//DONE - - Ascendente - - Pilar de la Hora
func GetPoder(fechaNac time.Time) string