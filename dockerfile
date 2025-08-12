# Use Eclipse Temurin OpenJDK 21 base image
FROM eclipse-temurin:21-jdk

# Set working directory inside container
WORKDIR /app

# Copy the jar file into the container
COPY target/*.jar app.jar

# Expose port your app runs on
EXPOSE 9092

# Command to run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
