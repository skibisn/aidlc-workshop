FROM amazoncorretto:17-al2023 AS build
WORKDIR /app

RUN yum install -y wget unzip findutils && \
    wget -q https://services.gradle.org/distributions/gradle-8.6-bin.zip -O /tmp/gradle.zip && \
    unzip -q /tmp/gradle.zip -d /opt && \
    ln -s /opt/gradle-8.6/bin/gradle /usr/local/bin/gradle && \
    rm /tmp/gradle.zip

# 의존성만 먼저 캐싱 (build.gradle 변경 시에만 재다운로드)
COPY build.gradle settings.gradle ./
RUN gradle dependencies --no-daemon -q || true

# 소스 복사 및 빌드 (소스 변경 시에만 재실행)
COPY src src
RUN gradle bootJar -x test --no-daemon

FROM amazoncorretto:17-al2023
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
RUN mkdir -p /uploads/menus
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
