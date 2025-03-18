package com.codebasics.codebasics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication

public class CodebasicsApplication {

	public static void main(String[] args) {

		Dotenv dotenv = Dotenv.load();
		// Set environment variables for Spring Boot
		System.setProperty("DATABASE_URL", dotenv.get("DATABASE_URL"));
		System.setProperty("DATABASE_USER", dotenv.get("DATABASE_USER"));
		System.setProperty("DATABASE_PASSWORD", dotenv.get("DATABASE_PASSWORD"));


		SpringApplication.run(CodebasicsApplication.class, args);
	}

}
