# Desplegar Backend Spring Boot como servicio Windows con NSSM

## ¿Qué es NSSM?
NSSM (Non-Sucking Service Manager) registra cualquier ejecutable .jar/.exe
como servicio de Windows — se comporta igual que Tomcat corriendo como
servicio, pero sin Tomcat.

---

## PASO 1 — Compilar el JAR

```cmd
cd C:\ruta\al\valverde-backend
mvn clean package -DskipTests
```
Genera: `target\autosales-1.0.0.jar`

Copia el JAR a una carpeta fija, por ejemplo:
```
C:\Servicios\valverde-autosales\autosales-1.0.0.jar
```

---

## PASO 2 — Descargar NSSM

1. Ir a https://nssm.cc/download
2. Descargar la versión más reciente (ZIP)
3. Extraer a `C:\Aplicaciones\nssm\`
4. El ejecutable es `C:\Aplicaciones\nssm\win64\nssm.exe`

---

## PASO 3 — Registrar el servicio (CMD como Administrador)

```cmd
C:\Aplicaciones\nssm\win64\nssm.exe install ValverdeAutoSalesAPI
```

Se abre la GUI de NSSM. Configura así:

### Pestaña "Application"
| Campo       | Valor |
|-------------|-------|
| Path        | `C:\Program Files\Java\jdk-17\bin\java.exe` |
| Startup dir | `C:\Servicios\valverde-autosales\` |
| Arguments   | `-jar autosales-1.0.0.jar` |

### Pestaña "Details"
| Campo           | Valor |
|-----------------|-------|
| Display name    | Valverde Auto Sales API |
| Description     | Backend Spring Boot WebFlux |
| Startup type    | Automatic |

### Pestaña "Log on"
- Local System account ✓ (o un usuario con permisos de red si tu BD está en otro servidor)

### Pestaña "I/O" (logs)
| Campo  | Valor |
|--------|-------|
| Output | `C:\Servicios\valverde-autosales\logs\stdout.log` |
| Error  | `C:\Servicios\valverde-autosales\logs\stderr.log` |

Haz clic en **Install service**.

---

## PASO 4 — Iniciar y verificar

```cmd
# Iniciar
C:\Aplicaciones\nssm\win64\nssm.exe start ValverdeAutoSalesAPI

# Verificar estado
C:\Aplicaciones\nssm\win64\nssm.exe status ValverdeAutoSalesAPI

# Verificar que responde
curl -k https://localhost:8087/api/cars
```

---

## PASO 5 — Comandos útiles

```cmd
# Detener
nssm stop ValverdeAutoSalesAPI

# Reiniciar (para actualizar el JAR)
nssm restart ValverdeAutoSalesAPI

# Editar configuración
nssm edit ValverdeAutoSalesAPI

# Eliminar el servicio
nssm remove ValverdeAutoSalesAPI confirm

# Ver logs en tiempo real
tail -f C:\Servicios\valverde-autosales\logs\stdout.log
```

---

## PASO 6 — Actualizar el JAR (nueva versión)

```cmd
nssm stop ValverdeAutoSalesAPI

# Sobreescribir el JAR
copy /Y target\autosales-1.0.0.jar C:\Servicios\valverde-autosales\autosales-1.0.0.jar

nssm start ValverdeAutoSalesAPI
```

---

## Verificar SSL

El backend ya incluye el certificado del Tomcat existente en `application.yml`:
```yaml
server:
  port: 8087
  ssl:
    enabled: true
    key-store: C:/Aplicaciones/apache-tomcat-10.1.25/conf/actoursapps.jks
    key-store-password: 4ct0urs4pps
    key-store-type: PKCS12
    key-alias: actoursapps
```

Prueba desde el navegador: `https://actoursapps.com.pe:8087/api/cars`

---

## Diferencia con Tomcat

| Característica | Tomcat | NSSM + JAR |
|---|---|---|
| Configuración | server.xml, WAR, webapps | application.yml, JAR único |
| Inicio en Windows | Servicio Tomcat | Servicio Windows vía NSSM |
| Logs | logs/catalina.out | logs/stdout.log configurable |
| Actualizar app | Copiar WAR en webapps | Copiar JAR + restart servicio |
| Puerto SSL | Conector en server.xml | `server.ssl.*` en application.yml |

Spring Boot embebe Netty (WebFlux) — **no necesita Tomcat**.
El JAR es autosuficiente: incluye el servidor HTTP dentro.
