package com.ide.demoide.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ide.demoide.DTO.QueryRequest;
import com.ide.demoide.service.QueryaService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class QueryController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private QueryaService queryService;

    @PostMapping("/execute")
    public Object ejecutar(@RequestBody QueryRequest request) {
        return queryService.ejecutarSQL(request.getSql());
    }

    @GetMapping("/tables")
    public List<String> getTables() {
        return jdbcTemplate.queryForList(
                "SHOW TABLES",
                String.class);
    }

    // @GetMapping("/columns/{table}")
    // public List<String> getColumns(@PathVariable String table) {
    // return jdbcTemplate.query(
    // "SHOW COLUMNS FROM " + table,
    // (rs, rowNum) -> rs.getString("Field")
    // );
    // }

    @GetMapping("/columns/{table}")
    public List<String> getColumns(@PathVariable String table) {

        if (!table.matches("[a-zA-Z0-9_]+")) {
            throw new RuntimeException("Nombre de tabla inválido");
        }

        return jdbcTemplate.query(
                "SHOW COLUMNS FROM " + table,
                (rs, rowNum) -> rs.getString("Field"));
    }

}