package com.ide.demoide.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class QueryaService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Object ejecutarSQL(String sql){

        sql = sql.trim().toLowerCase();

        try{

            if(sql.startsWith("select")){
                List<Map<String, Object>> resultado = jdbcTemplate.queryForList(sql);
                return resultado;
            } else {
                int filasAfectadas = jdbcTemplate.update(sql);
                return "Consulta ejecutada correctamente. Filas afectadas: " + filasAfectadas;
            }
        } catch(Exception e){
            return "Error" + e.getMessage();
        }

    }

}
