# Stage 1: Build the application
FROM eclipse-temurin:22.0.1_8-jdk-ubi9-minimal as build

# Install Maven using microdnf
RUN microdnf install -y maven && microdnf clean all

# Set the working directory
WORKDIR /app

# Copy the pom.xml file and download the dependencies
COPY pom.xml .

# Download the project dependencies
RUN mvn dependency:go-offline

# Copy the rest of the application source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Run the application using the same base image
FROM eclipse-temurin:22.0.1_8-jdk-ubi9-minimal

# Set the working directory
WORKDIR /app

# Copy the application jar from the previous stage
COPY --from=build /app/target/FrFlashcardsRestApi-0.0.1-SNAPSHOT.jar app.jar

# Expose the application port (for example, using port 9090)
EXPOSE 9090

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
