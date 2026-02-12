package com.example.demo.security;

import lombok.RequiredArgsConstructor;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final CustomUserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder; // ⭐ use existing bean from PasswordConfig

    // 🔐 Connect DB users to Spring Security
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowCredentials(true);
                config.setAllowedOrigins(List.of("http://localhost:5173"));
                config.setAllowedHeaders(List.of("Authorization","Content-Type","Accept","Origin"));
                config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
                return config;
            }))

            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth
                // PUBLIC APIs
                .requestMatchers("/api/auth/**","/api/products/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS,"/**").permitAll()

                // USER + ADMIN APIs
                .requestMatchers(
                        "/api/cart/**",
                        "/api/orders/**",
                        "/api/payments/**",
                        "/api/wishlist/**",
                        "/api/invoice/**"
                ).hasAnyRole("USER","ADMIN")

                // ADMIN APIs
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            )

            // JWT Filter
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
