# Habita Flow · Demo de lead a visita

Demo comercial aislada para inmobiliarias. Simula el recorrido completo de un lead ficticio desde un mensaje de WhatsApp hasta una propuesta de visita con revisión humana.

## Ejecutar en local

No hay dependencias ni proceso de build. Desde esta carpeta se puede abrir `index.html` directamente en el navegador o servirla con un servidor local:

```bash
cd /home/openclaw/.openclaw/workspace/demo-inmobiliarias-lead-visita
python3 -m http.server 4173
```

Después, abrir http://localhost:4173.

## Recorrido de la demo

1. Pulsar **Analizar mensaje** para identificar el Ático Santa Engracia.
2. Pulsar **Cualificar lead** para mostrar señales operativas e intención alta.
3. Pulsar **Generar respuesta** para crear el borrador y las tres franjas.
4. Seleccionar una franja si se quiere y probar **Editar** o **Rechazar**.
5. Pulsar **Aprobar y proponer** para ver confirmación visual, actualización del CRM simulado, timeline y métricas.

El botón **Reiniciar demo** devuelve el caso a su estado inicial. No hay llamadas de red, persistencia, datos reales, credenciales, mensajería ni integración con CRM/WhatsApp.

## Archivos

- `index.html`: estructura y contenido ficticio de la interfaz.
- `styles.css`: diseño responsive, estados visuales y estilos de la demo. No carga recursos externos.
- `app.js`: máquina de estados local para el flujo, botones, métricas, timeline y toasts.

## Verificación

Comandos previstos:

```bash
node --check app.js
python3 -m http.server 4173
curl -I http://localhost:4173
```

La verificación funcional manual debe cubrir los cinco pasos, aprobar/editar/rechazar y reiniciar. La demo no incluye un test runner porque no usa dependencias externas.

## Limitaciones del MVP

- Los leads, inmuebles, franjas, métricas y agentes están hardcodeados.
- La aprobación y la confirmación son estados visuales locales; no se envía ningún mensaje.
- El dibujo del inmueble es una ilustración CSS, no una fotografía real.
- No hay backend, autenticación, almacenamiento, calendario, WhatsApp ni CRM real.
- Usa fuentes del sistema y no requiere red para funcionar.
