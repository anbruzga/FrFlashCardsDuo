# First stage: Build the application using Maven and JDK 21
FROM maven:3.9.7-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
COPY .env-docker .env
RUN mvn clean package

# Second stage: Run the application using the built JAR
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/FrFlashcardsRestApi-0.0.1-SNAPSHOT.jar /app/app.jar
COPY .env-docker .env
COPY entrypoint.sh entrypoint.sh

EXPOSE 9090
ENTRYPOINT ["sh", "entrypoint.sh"]