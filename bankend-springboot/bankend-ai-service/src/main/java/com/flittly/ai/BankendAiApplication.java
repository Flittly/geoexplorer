package com.flittly.ai;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.flittly.ai.mapper")
public class BankendAiApplication {
    public static void main(String[] args) {
        SpringApplication.run(BankendAiApplication.class, args);
    }
}
