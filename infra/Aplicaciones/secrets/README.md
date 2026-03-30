# Secrets de Zona 3

Este directorio contiene secretos locales necesarios para levantar servicios de `infra/Aplicaciones`.

## Archivo requerido

- `samba_pass.txt` (no versionado)

## Inicialización

1. Copiar `samba_pass.txt.example` a `samba_pass.txt`.
2. Reemplazar el valor por una contraseña de administrador de dominio válida.
3. Levantar la zona con Docker Compose.
