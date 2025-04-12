package com.codebasics.codebasics.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map URL path /uploads/** to local folder file:/Users/donmariopriyankasubasinghe/Desktop/uploads/
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:/Users/donmariopriyankasubasinghe/Desktop/uploads/");
    }
}
