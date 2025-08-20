# Fortune Cookie Microservice - VTEX IO

## Descripción General

El **Fortune Cookie Microservice** es una aplicación de referencia para VTEX IO Services que permite gestionar mensajes de galletas de la fortuna. Proporciona funcionalidades para crear, leer, obtener mensajes aleatorios y eliminar galletas de la fortuna almacenadas en Master Data.

## Información Técnica

- **Nombre**: `md-fortune-cooky`
- **Vendor**: `valtech`
- **Versión**: `0.0.0`
- **Título**: Fortune cooky App service
- **Builders**: Node.js 6.x, Docs 0.x

## Configuración

### Memoria y Rendimiento
- **Memoria**: 256 MB
- **TTL**: 10 segundos
- **Timeout**: 2 segundos
- **Réplicas**: 2 mínimas, 4 máximas
- **Workers**: 1

### Políticas y Permisos

El servicio requiere los siguientes permisos:

- **outbound-access**: 
  - `httpstat.us/*` - Para verificación de estado
  - `api.vtex.com/dataentities/*` - Para acceso a Master Data
- **ADMIN_DS** - Permisos de administrador de Data Store
- **POWER_USER_DS** - Permisos de usuario avanzado de Data Store  
- **colossus-fire-event** - Para eventos de Colossus
- **colossus-write-logs** - Para escritura de logs

## Endpoints de la API

### 1. Status Check
```
GET /_v/status/:code
```
**Descripción**: Verifica el estado del servicio
- **Público**: ✅
- **Autenticación**: No requerida
- **Parámetros**: `code` (número de estado)

---

### 2. Obtener Todos los Mensajes
```
GET /_v/fortune-cookies
```
**Descripción**: Recupera todos los mensajes de galletas de la fortuna almacenados

- **Público**: ✅
- **Autenticación**: ✅ Requerida (VTEX Auth)
- **Respuesta exitosa** (200):
```json
{
  "data": {
    "ok": [
      {
        "id": "string",
        "CookieFortune": "string"
      }
    ]
  }
}
```

---

### 3. Obtener Mensaje Aleatorio
```
GET /_v/message
```
**Descripción**: Obtiene un mensaje de galleta de la fortuna aleatorio junto con un número de la suerte

- **Público**: ✅
- **Autenticación**: No requerida
- **Respuesta exitosa** (200):
```json
{
  "data": {
    "message": "Tu mensaje de fortuna aquí",
    "number": "12-34 5678",
    "success": true
  }
}
```

**Respuestas de error**:
- **404**: No hay mensajes disponibles
- **500**: Error de conexión o mensaje vacío

---

### 4. Crear Galleta de la Fortuna
```
POST /_v/fortune-cookie
```
**Descripción**: Crea un nuevo mensaje de galleta de la fortuna

- **Público**: ✅
- **Autenticación**: ✅ Requerida (VTEX Auth)
- **Body de la petición**:
```json
{
  "CookieFortune": "Tu nuevo mensaje de fortuna"
}
```

- **Respuesta exitosa** (201):
```json
{
  "message": "Galleta de la fortuna creada con éxito",
  "ok": true,
  "id": "documento-id",
  "CookieFortune": "Tu nuevo mensaje de fortuna"
}
```

---

### 5. Eliminar Galleta de la Fortuna
```
DELETE /_v/fortune-cookie/:id
```
**Descripción**: Elimina una galleta de la fortuna específica por ID

- **Público**: ✅
- **Autenticación**: ✅ Requerida (VTEX Auth)
- **Parámetros**: `id` (ID del documento a eliminar)
- **Respuesta exitosa** (200):
```json
{
  "message": "Record with ID {id} deleted successfully"
}
```

**Respuestas de error**:
- **400**: ID requerido
- **500**: Error al eliminar el registro

## Autenticación

### VTEX Auth Middleware

El servicio implementa un middleware de autenticación personalizado que:

1. **Extrae el token**: Busca `VtexIdclientAutCookie` en las cookies
2. **Valida el JWT**: Decodifica y verifica el payload del token
3. **Verifica expiración**: Comprueba que el token no haya expirado

**Códigos de error de autenticación**:
- **401**: 
  - "Requiere de autenticacion" - No se encontraron cookies
  - "Token no encontrado" - Cookie de VTEX no presente
  - "Secion no valida" - Token inválido
  - "Secion expirada" - Token expirado
  - "Error validando token" - Error en validación

## Master Data

### Data Entity: CF (Cookie Fortune)

El servicio utiliza la entidad de datos `CF` en Master Data con los siguientes campos:

- **id**: Identificador único del documento
- **CookieFortune**: Mensaje de la galleta de la fortuna (string)

## Características Técnicas

### Cache y Rendimiento
- **LRU Cache**: Implementado con máximo 5000 elementos
- **Timeout**: 800ms para operaciones
- **Reintentos**: 2 reintentos automáticos en caso de fallo

### Generación de Números de la Suerte
El endpoint `/message` genera números aleatorios con el formato `XX-XX XXXX`:
- Dos grupos de 2 dígitos (10-99)
- Un grupo de 4 dígitos (1000-9999)
- Ejemplo: `42-73 8521`

## Instalación y Despliegue

1. **Prerrequisitos**:
   - VTEX IO CLI instalado
   - Workspace de desarrollo configurado

2. **Comandos de desarrollo**:
```bash
# Linting (ejecutado automáticamente antes de release)
bash lint.sh

# Link para desarrollo
vtex link
```

3. **Despliegue**:
```bash
vtex publish
vtex deploy
```

## Monitoreo

El servicio incluye métricas de cache que se pueden monitorear:
- **Cache hits/misses**: Rastreados automáticamente
- **Memoria**: Limitada a 256 MB
- **Logs**: Escritos a través de colossus-write-logs

## Dependencias

- **VTEX IO Node.js Runtime**: 6.x
- **Master Data**: Para almacenamiento de mensajes
- **LRU Cache**: Para optimización de rendimiento
- **co-body**: Para parsing de requests

## Consideraciones de Seguridad

- Todos los endpoints de escritura requieren autenticación VTEX
- Validación de tokens JWT con verificación de expiración
- Políticas de acceso restringidas a dominios específicos
- Timeouts configurados para prevenir ataques de denegación de servicio

## Soporte

Para más información sobre desarrollo en VTEX IO, consulta la documentación oficial en [VTEX IO Documentation](https://developers.vtex.com/).
