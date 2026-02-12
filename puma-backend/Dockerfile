# ---------- BUILD STAGE ----------
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

# copy pom and download dependencies first (faster builds)
COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline

# copy source and build jar
COPY src ./src
RUN mvn -q -DskipTests package

# ---------- RUN STAGE ----------
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 9090

ENTRYPOINT ["java","-jar","app.jar"]
