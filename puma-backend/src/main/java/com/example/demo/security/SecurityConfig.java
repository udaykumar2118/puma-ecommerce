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
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowCredentials(true);
                config.setAllowedOrigins(List.of(
                        "http://localhost:5173",
                        "https://puma-ecommerce.vercel.app"
                ));
                config.setAllowedHeaders(List.of("*"));
                config.setAllowedMethods(List.of("*"));
                return config;
            }))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth

            	    .requestMatchers("/", "/api/auth/**").permitAll()
            	    .requestMatchers("/api/products/**").permitAll()
            	    .requestMatchers("/api/categories/**").permitAll()

            	    .requestMatchers("/api/cart/**").hasAnyRole("USER","ADMIN")
            	    .requestMatchers("/api/wishlist/**").hasAnyRole("USER","ADMIN")
            	    .requestMatchers("/api/orders/**").hasAnyRole("USER","ADMIN")
            	    .requestMatchers("/api/payments/**").hasAnyRole("USER","ADMIN")

            	    .requestMatchers("/v3/api-docs/**","/swagger-ui/**").permitAll()
            	    .anyRequest().authenticated()
            	)
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}