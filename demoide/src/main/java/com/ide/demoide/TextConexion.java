package com.ide.demoide;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class TextConexion implements CommandLineRunner{

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception{
        System.out.println("Conexion exitosa!");

        String sql = "SELECT 1";
        Integer resultado = jdbcTemplate.queryForObject(sql, Integer.class);

        System.out.println("Resultado: "+resultado);

    }

}
