package com.ide.demoide.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class QueryaService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private String currentDatabase = null;

    public Map<String, Object> ejecutarSQL(String sql){

        Map<String, Object> response = new HashMap<>();

        try {
            
            String tipo = sql.trim().split(" ")[0].toLowerCase();

            if(tipo.equals("use")){
                String db = sql.split(" ")[1].replace(";", "");
                currentDatabase = db;

                jdbcTemplate.execute("USE " + db);

                response.put("type", "use");
                response.put("message", "Database Changed to "+ db);
                return response;
            }

            if (currentDatabase != null) {
                jdbcTemplate.execute("Use "+currentDatabase);
            }
            
            if (tipo.equals("select")) {
                List<Map<String, Object>> resultado = jdbcTemplate.queryForList(sql);

                response.put("type", "select");
                response.put("data", resultado);
                response.put("rows", resultado.size());

            } else {

                int filasAfectadas = jdbcTemplate.update(sql);

                response.put("type", "update");
                response.put("rows", filasAfectadas);
                response.put("message", "Query OK");

            }

        } catch (Exception e) {
            response.put("type", "error");
            response.put("message", e.getMessage());
        }

        return response;

    }

    // public Map<String, Object> ejecutarSQL(String sql){

    //     Map<String, Object> response = new HashMap<>();

    //     try {
            
    //         String tipo = sql.trim().split(" ")[0].toLowerCase();

    //         if (tipo.equals("select")) {
    //             List<Map<String, Object>> resultado = jdbcTemplate.queryForList(sql);

    //             response.put("type", "select");
    //             response.put("data", resultado);
    //             response.put("rows", resultado.size());

    //         } else {

    //             int filasAfectadas = jdbcTemplate.update(sql);

    //             response.put("type", "update");
    //             response.put("rows", filasAfectadas);
    //             response.put("message", "Query OK");

    //         }

    //     } catch (Exception e) {
    //         response.put("type", "error");
    //         response.put("message", e.getMessage());
    //     }

    //     return response;

    // }
    
    // public Object ejecutarSQL(String sql){

    //     // convierte todo a miniscula
    //     sql = sql.trim().toLowerCase();

    //     try{

    //         if(sql.startsWith("select")){
    //             List<Map<String, Object>> resultado = jdbcTemplate.queryForList(sql);
    //             return resultado;
    //         } else {
    //             int filasAfectadas = jdbcTemplate.update(sql);
    //             return "Consulta ejecutada correctamente. Filas afectadas: " + filasAfectadas;
    //         }
    //     } catch(Exception e){
    //         return "Error" + e.getMessage();
    //     }

    // }

}
