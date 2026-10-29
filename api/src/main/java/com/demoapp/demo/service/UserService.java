package com.demoapp.demo.service;

import java.util.regex.Pattern;
import org.springframework.stereotype.Service;
import com.demoapp.demo.model.User;

import com.demoapp.demo.repository.UserRepository;

@Service
public class UserService {
  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public boolean isEmailValid(String email) {
    // Exige texto antes do @, domínio e extensão (ex: user@dominio.com)
    return email != null && Pattern.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", email);
  }

  public boolean isPasswordValid(String password) {
    String passRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$";
    return Pattern.matches(passRegex, password);
  }

  public User createUser(String email, String password) {
    User user = new User();
    user.setEmail(email);
    user.setPassword(password);
    return userRepository.save(user);
  }

  public User findByEmail(String email) {
    return userRepository.findByEmail(email).orElse(null);
  }

}
