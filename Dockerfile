# Stage 1: Build the Application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the pom.xml and source code into the container
COPY event-management-backend/pom.xml .
COPY event-management-backend/src ./src

# Package the application
RUN mvn clean package -DskipTests

# Stage 2: Run the Application
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app

# Copy the generated JAR file from the build stage
COPY --from=build /app/target/event-management-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080 which Render maps beautifully internally
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
