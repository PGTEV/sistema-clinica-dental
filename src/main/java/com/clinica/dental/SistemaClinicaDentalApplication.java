package com.clinica.dental;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase de inicio de todo el proyecto.
 *
 * La anotación @SpringBootApplication activa la configuración automática de
 * Spring Boot y permite que el programa detecte los controladores y recursos
 * del sistema. Al ejecutar esta clase se levanta el servidor web local.
 */
@SpringBootApplication
public class SistemaClinicaDentalApplication {

	/**
	 * Método que Java ejecuta primero. SpringApplication.run inicia el servidor
	 * y registra esta clase como la configuración principal de la aplicación.
	 */
	public static void main(String[] args) {
		SpringApplication.run(SistemaClinicaDentalApplication.class, args);
	}

}
