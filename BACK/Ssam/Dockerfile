FROM gradle:7.2-jdk17 AS build
WORKDIR /app
COPY gradle/ gradle/
COPY gradlew .
COPY build.gradle settings.gradle ./
COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew build -x test --no-daemon

FROM openjdk:17-jdk
WORKDIR /app
COPY --from=build /app/build/libs/Ssam-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
ENV JAVA_TOOL_OPTIONS -Djava.net.preferIPv4Stack=true
ENTRYPOINT ["java", "-Duser.timezone=Asia/Seoul", "-jar", "app.jar"]

