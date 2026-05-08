package com.ide.demoide.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ide.demoide.DTO.LoginRequest;
import com.ide.demoide.Repository.UsuarioRepository;
import com.ide.demoide.models.Usuario;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UsuarioRepository repo;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        
        Optional<Usuario> user = repo.findByUsername(req.getUsername());

        if(user.isPresent()){
            Usuario u = user.get();

            if(u.getPassword().equals(req.getPassword())){
                return ResponseEntity.ok(u);
            }
        }

        return ResponseEntity.status(401).body("Credenciales incorrectas");
        
        
    }
    

}
