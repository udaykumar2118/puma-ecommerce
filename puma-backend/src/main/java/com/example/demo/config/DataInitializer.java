package com.example.demo.config;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createAdmin(UserRepository repo,
                                  PasswordEncoder encoder) {
        return args -> {

            if (repo.findByEmail("admin@test.com").isEmpty()) {

                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@test.com");
                admin.setPassword(encoder.encode("admin123"));
                admin.setRole(Role.ADMIN);

                repo.save(admin);

                System.out.println("🔥 DEFAULT ADMIN CREATED 🔥");
                System.out.println("Email: admin@test.com");
                System.out.println("Password: admin123");
            }
        };
    }
}
