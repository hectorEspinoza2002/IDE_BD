package com.ide.demoide.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ide.demoide.models.Usuario;


public interface UsuarioRepository extends JpaRepository<Usuario, Long>{

    Optional<Usuario> findByUsername(String username);

}
