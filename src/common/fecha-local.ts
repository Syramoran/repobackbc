export function calcularFechaBase(date) {
    const horaInicio = new Date(date) //esta es la fecha universal

    //la transformamos a la fecha local, ¿que año, mes y hora era en parana?
    const anioLocal = horaInicio.getFullYear() //año
    const mesLocal = horaInicio.getMonth() //mes
    const diaLocal = horaInicio.getDate() //numero del mes
    const week_d = horaInicio.getDay() // del 0 al 6

    //fecha local
    const fechaBase =
    {
        diaSemana: week_d,
        horaInicioOriginal:horaInicio,
        fechaValidar: new Date(anioLocal, mesLocal, diaLocal)
    }
    return fechaBase
}
