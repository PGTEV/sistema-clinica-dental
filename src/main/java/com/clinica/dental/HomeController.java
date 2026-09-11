package com.clinica.dental;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Controlador principal de la aplicación.
 *
 * Un controlador es el componente que recibe las solicitudes
 * que realiza el navegador y determina qué página debe mostrar.
 *
 * En este caso, HomeController se encargará de mostrar
 * nuestra página principal de inicio de sesión.
 */
@Controller
public class HomeController {

    /**
     * Atiende la dirección principal del sistema.
     *
     * Cuando el usuario escribe:
     *
     * http://localhost:8080/
     *
     * Spring Boot ejecutará este metodo.
     *
     * El valor "index" indica que debe buscar la plantilla:
     *
     * src/main/resources/templates/index.html
     */
    @GetMapping("/")
    public String mostrarInicio() {

        // Retornamos el nombre de la plantilla HTML.
        return "index";
    }

    /**
     * Devuelve cualquiera de las pantallas HTML del prototipo.
     *
     * Por ejemplo, la URL /f02-registrar-paciente.html recibe el valor
     * "f02-registrar-paciente" como pagina y Spring Boot busca la plantilla
     * con ese mismo nombre dentro de resources/templates. Esto evita crear
     * un método repetido para cada una de las interfaces de la clínica.
     */
    @GetMapping("/{pagina}.html")
    public String mostrarPagina(@PathVariable String pagina) {
        return pagina;
    }
}
