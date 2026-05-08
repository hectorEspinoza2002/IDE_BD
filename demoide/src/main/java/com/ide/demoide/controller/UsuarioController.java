package com.ide.demoide.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ide.demoide.Repository.UsuarioRepository;
import com.ide.demoide.models.Usuario;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/usuarios")
@CrossOrigin("*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository userRepo;

    @GetMapping
    public List<Usuario> leerUsuario() {
        return userRepo.findAll();
    }
    
    
    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario usuario) {
        
        return userRepo.save(usuario);
    }
    

}
