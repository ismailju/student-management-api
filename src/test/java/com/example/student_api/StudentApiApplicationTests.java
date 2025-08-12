package com.example.student_api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class StudentApiApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetAllStudents() throws Exception {
        mockMvc.perform(get("/students"))
               .andExpect(status().isOk());
    }

    @Test
    void testCreateStudent() throws Exception {
        String studentJson = """
            {
                "name": "Test Student",
                "email": "test@student.com",
                "course": "Mathematics"
            }
        """;

        mockMvc.perform(post("/students")
               .contentType(MediaType.APPLICATION_JSON)
               .content(studentJson))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.id").exists());
    }
}

