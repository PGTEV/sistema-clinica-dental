/*
 * Este archivo simula la parte funcional del sistema sin una base de datos.
 * localStorage guarda información en el navegador del usuario, por lo que los
 * registros permanecen visibles mientras no se borren los datos del navegador.
 */

const CLAVE_DATOS = "clinicaDentalDatos";

// Datos que se cargan una sola vez para que las pantallas no aparezcan vacías.
const DATOS_INICIALES = {
    pacientes: [
        { dni: "00000001", nombres: "Juan", apellidos: "Pérez", telefono: "999111222", correo: "juan@email.com" },
        { dni: "00000002", nombres: "María", apellidos: "López", telefono: "999333444", correo: "maria@email.com" }
    ],
    categorias: [
        { id: "1", nombre: "Preventiva", descripcion: "Servicios de prevención" },
        { id: "2", nombre: "Restaurativa", descripcion: "Tratamientos restaurativos" }
    ],
    servicios: [
        { id: "1", nombre: "Limpieza dental", categoria: "Preventiva", duracion: "45" },
        { id: "2", nombre: "Evaluación general", categoria: "Preventiva", duracion: "30" }
    ],
    odontologos: [
        { id: "1", nombres: "Carlos", apellidos: "Pérez", colegiatura: "C001", telefono: "999555111" },
        { id: "2", nombres: "Ana", apellidos: "López", colegiatura: "C002", telefono: "999555222" }
    ],
    consultorios: [
        { id: "1", nombre: "Consultorio 1", ubicacion: "Primer piso" },
        { id: "2", nombre: "Consultorio 2", ubicacion: "Primer piso" }
    ],
    horarios: [],
    citas: [
        { id: "C001", paciente: "Juan Pérez", servicio: "Limpieza dental", odontologo: "Dr. Carlos Pérez", fecha: "2026-09-10", hora: "09:00", consultorio: "Consultorio 1", estado: "Activa" },
        { id: "C002", paciente: "María López", servicio: "Evaluación general", odontologo: "Dra. Ana López", fecha: "2026-09-10", hora: "10:00", consultorio: "Consultorio 2", estado: "Activa" }
    ]
};

/**
 * Devuelve todos los datos del prototipo. Si es la primera visita, copia los
 * registros de demostración en localStorage para que puedan ser modificados.
 */
function obtenerDatos() {
    const guardados = localStorage.getItem(CLAVE_DATOS);
    if (guardados) {
        return JSON.parse(guardados);
    }

    const datos = JSON.parse(JSON.stringify(DATOS_INICIALES));
    localStorage.setItem(CLAVE_DATOS, JSON.stringify(datos));
    return datos;
}

// Guarda el objeto completo después de crear, editar, cancelar o reprogramar.
function guardarDatos(datos) {
    localStorage.setItem(CLAVE_DATOS, JSON.stringify(datos));
}

// Evita que un texto ingresado por el usuario se interprete como código HTML.
function escaparHTML(valor) {
    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

// Muestra una confirmación debajo del formulario que se acaba de utilizar.
function mostrarMensaje(texto) {
    const mensaje = document.getElementById("message") || document.getElementById("loginMessage");
    if (mensaje) {
        mensaje.textContent = texto;
        mensaje.style.display = "block";
    }
}

/**
 * Procesa el formulario de inicio de sesión. Las credenciales son solo para
 * la demostración: usuario admin y contraseña 123456.
 */
function iniciarSesion(event) {
    event.preventDefault();
    const usuario = document.getElementById("usuario").value.trim();
    const clave = document.getElementById("clave").value.trim();

    if (usuario === "admin" && clave === "123456") {
        localStorage.setItem("usuarioSesion", usuario);
        window.location.href = "/dashboard.html";
    } else {
        mostrarMensaje("Usuario o contraseña incorrectos.");
    }
}

// Cierra la sesión de demostración y devuelve al formulario de acceso.
function cerrarSesion() {
    localStorage.removeItem("usuarioSesion");
    window.location.href = "/";
}

// Crea un identificador consecutivo para las entidades que usan el campo id.
function siguienteId(lista) {
    return String(lista.reduce((mayor, item) => Math.max(mayor, Number(item.id) || 0), 0) + 1);
}

function nombreCompleto(persona) {
    return `${persona.nombres} ${persona.apellidos}`.trim();
}

/**
 * Lee los campos del formulario y guarda la entidad que corresponde a la
 * página actual. La ruta permite reutilizar una misma función en varios forms.
 */
function guardarFormulario(event, tipo) {
    event.preventDefault();
    const formulario = event.currentTarget;
    const campos = Object.fromEntries(new FormData(formulario).entries());
    const datos = obtenerDatos();
    const pagina = window.location.pathname;

    if (pagina.includes("f02-registrar-paciente")) {
        if (datos.pacientes.some((paciente) => paciente.dni === campos.dni)) {
            mostrarMensaje("El DNI ya está registrado.");
            return;
        }
        datos.pacientes.push(campos);
    } else if (pagina.includes("f04-actualizar-paciente")) {
        const paciente = datos.pacientes.find((item) => item.dni === campos.dni) || datos.pacientes[0];
        Object.assign(paciente, { ...campos, telefono: campos["teléfono"] || campos.telefono });
        delete paciente["teléfono"];
    } else if (tipo === "categoria") {
        datos.categorias.push({ id: siguienteId(datos.categorias), ...campos });
    } else if (pagina.includes("f07-actualizar-categoria")) {
        const categoria = datos.categorias.find((item) => item.id === campos.id) || datos.categorias[0];
        Object.assign(categoria, campos);
    } else if (tipo === "servicio") {
        datos.servicios.push({ id: siguienteId(datos.servicios), ...campos });
    } else if (pagina.includes("f10-actualizar-servicio")) {
        const servicio = datos.servicios.find((item) => item.id === campos.id) || datos.servicios[0];
        Object.assign(servicio, campos);
    } else if (tipo === "odontologo") {
        datos.odontologos.push({ id: siguienteId(datos.odontologos), ...campos });
    } else if (pagina.includes("f13-actualizar-odontologo")) {
        const odontologo = datos.odontologos.find((item) => item.id === campos.id) || datos.odontologos[0];
        Object.assign(odontologo, campos);
    } else if (tipo === "consultorio") {
        datos.consultorios.push({ id: siguienteId(datos.consultorios), ...campos });
    } else if (tipo === "horario") {
        datos.horarios.push({ id: siguienteId(datos.horarios), ...campos });
    } else if (tipo === "cita") {
        datos.citas.push({ id: `C${String(datos.citas.length + 1).padStart(3, "0")}`, ...campos, estado: "Activa" });
    } else if (tipo === "reprogramacion") {
        // El select muestra una descripción completa; solo el primer texto es el código de cita.
        const idCita = campos.cita.split(" - ")[0];
        const cita = datos.citas.find((item) => item.id === idCita);
        if (cita) {
            Object.assign(cita, { fecha: campos.fecha, hora: campos.hora, odontologo: campos.odontologo });
        }
    }

    guardarDatos(datos);
    mostrarMensaje("Los datos se guardaron correctamente en el navegador.");
    if (!pagina.includes("actualizar") && tipo !== "reprogramacion") {
        formulario.reset();
    }
    actualizarPantalla();
}

// Convierte una lista de objetos en filas de la tabla presente en la pantalla.
function pintarTabla(filas) {
    const cuerpo = document.querySelector("table tbody");
    if (!cuerpo) return;
    cuerpo.innerHTML = filas.map((fila) => `<tr>${fila.map((celda) => `<td>${escaparHTML(celda)}</td>`).join("")}</tr>`).join("");
}

// Muestra la entidad correcta cuando el usuario abre una pantalla de consulta.
function pintarConsultas(datos) {
    const pagina = window.location.pathname;
    if (pagina.includes("f03-consultar-pacientes")) {
        pintarTabla(datos.pacientes.map((p) => [p.dni, p.nombres, p.apellidos, p.telefono]));
    } else if (pagina.includes("f06-consultar-categorias")) {
        pintarTabla(datos.categorias.map((c) => [c.id, c.nombre, c.descripcion]));
    } else if (pagina.includes("f09-consultar-servicios")) {
        pintarTabla(datos.servicios.map((s) => [s.id, s.nombre, s.categoria, `${s.duracion} min`]));
    } else if (pagina.includes("f12-consultar-odontologos")) {
        pintarTabla(datos.odontologos.map((o) => [o.id, nombreCompleto(o), o.colegiatura]));
    } else if (pagina.includes("f15-consultar-consultorios")) {
        pintarTabla(datos.consultorios.map((c) => [c.id, c.nombre, c.ubicacion]));
    }
}

// Llena selects con la información guardada, para que los módulos estén conectados.
function llenarSelect(id, opciones) {
    const select = document.getElementById(id);
    if (!select || !opciones.length) return;
    const valorActual = select.value;
    select.innerHTML = opciones.map((opcion) => `<option value="${escaparHTML(opcion)}">${escaparHTML(opcion)}</option>`).join("");
    if (opciones.includes(valorActual)) select.value = valorActual;
}

function prepararSelects(datos) {
    const pacientes = datos.pacientes.map(nombreCompleto);
    const servicios = datos.servicios.map((s) => s.nombre);
    const odontologos = datos.odontologos.map((o) => `Dr. ${nombreCompleto(o)}`);
    const consultorios = datos.consultorios.map((c) => c.nombre);
    const citas = datos.citas.filter((c) => c.estado === "Activa").map((c) => `${c.id} - ${c.paciente} - ${c.fecha} ${c.hora}`);

    if (window.location.pathname.includes("f18")) {
        llenarSelect("paciente", pacientes);
        llenarSelect("servicio", servicios);
        llenarSelect("odontologo", odontologos);
        llenarSelect("consultorio", consultorios);
    }
    if (window.location.pathname.includes("f16")) {
        llenarSelect("odontologo", odontologos);
        llenarSelect("consultorio", consultorios);
    }
    if (window.location.pathname.includes("f17")) {
        llenarSelect("servicio", servicios);
        llenarSelect("odontologo", odontologos);
    }
    if (window.location.pathname.includes("f19") || window.location.pathname.includes("f20")) {
        llenarSelect("cita", citas);
    }
}

// Coloca datos reales de localStorage en los formularios de actualización.
function prepararActualizacion(datos) {
    const pagina = window.location.pathname;
    let registro;
    if (pagina.includes("f04")) registro = datos.pacientes[0];
    if (pagina.includes("f07")) registro = datos.categorias[0];
    if (pagina.includes("f10")) registro = datos.servicios[0];
    if (pagina.includes("f13")) registro = datos.odontologos[0];
    if (!registro) return;

    Object.entries(registro).forEach(([campo, valor]) => {
        // La pantalla de paciente conserva "teléfono" con tilde como nombre del input.
        const control = document.querySelector(`[name="${campo}"]`) ||
            document.getElementById(campo) ||
            (campo === "telefono" ? document.querySelector('[name="teléfono"]') : null);
        if (control) control.value = valor;
    });
}

function consultarDisponibilidad(event) {
    event.preventDefault();
    mostrarMensaje("Disponibilidad consultada correctamente. Los horarios mostrados son de demostración.");
}

function cancelarCita(event) {
    event.preventDefault();
    const datos = obtenerDatos();
    // El valor visible contiene datos extra; se extrae primero el identificador C001, C002, etc.
    const id = document.getElementById("cita").value.split(" - ")[0];
    const cita = datos.citas.find((item) => item.id === id);
    if (cita) {
        cita.estado = "Cancelada";
        guardarDatos(datos);
        mostrarMensaje("La cita fue cancelada correctamente.");
        prepararSelects(datos);
    }
}

// Borra los cambios del navegador y vuelve a cargar los registros de ejemplo.
function reiniciarDatosDemo() {
    localStorage.removeItem(CLAVE_DATOS);
    actualizarPantalla();
    alert("Se restauraron los datos de demostración.");
}

function actualizarPantalla() {
    const datos = obtenerDatos();
    pintarConsultas(datos);
    prepararSelects(datos);
    prepararActualizacion(datos);
}

/*
 * Este bloque se ejecuta al terminar de cargar el HTML. También protege las
 * páginas internas: si no existe una sesión de demostración, vuelve al login.
 */
document.addEventListener("DOMContentLoaded", () => {
    if (!document.body.dataset.interna) return;
    if (!localStorage.getItem("usuarioSesion")) {
        window.location.href = "/";
        return;
    }
    actualizarPantalla();
});
