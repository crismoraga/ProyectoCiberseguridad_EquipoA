# Guía de Red Física — Router, Switch y Firewall

Esta guía define la configuración base para conectar las 3 zonas Docker a equipamiento real del laboratorio.

## 1) Objetivo de segmentación

- VLAN 10 → Pública (`200.1.6.0/24`)
- VLAN 40 → DMZ (`10.1.2.0/24`)
- VLAN 20 → Aplicaciones (`10.2.3.0/24`)

Gateway por zona (router):

- `200.1.6.1`
- `10.1.2.1`
- `10.2.3.1`

---

## 2) Switch (L2) — configuración base

Archivo de referencia: `infra/Publica/switch/switch_config.txt`

Puntos clave:

1. Crear VLAN 10/20/40.
2. Puerto trunk al router (permitir VLAN 10,20,40).
3. Un puerto access por host:

   - VLAN 10 → PC Pública
   - VLAN 40 → PC DMZ
   - VLAN 20 → PC Apps

Validación en switch:

```text
show vlan brief
show interfaces trunk
show running-config interface fa0/1
```

---

## 3) Router (L3) — inter-VLAN y ACL

Archivo de referencia: `infra/Publica/router/router_config.txt`

Puntos clave:

1. Configuración router-on-a-stick (`Fa0/0.10`, `.20`, `.40`).
2. NAT base en perímetro (SNAT/PAT de salida + DNAT estático de servicios DMZ publicados).
3. ACL por zona (baseline de segmentación):

   - Pública puede llegar a servicios expuestos DMZ.
   - Pública bloqueada hacia Apps.
   - DMZ bloqueada hacia Apps por defecto.
   - Apps bloqueada hacia Pública salvo DNS.

4. Ruta por defecto al firewall físico (`172.16.100.1`).
5. Si el firewall hace NAT principal hacia Internet, evitar doble NAT no controlado.

VIPs sugeridas en Zona Pública para publicación DMZ:

- `200.1.6.10` → WebGoat DMZ (`10.1.2.2:8080`)
- `200.1.6.11` → Web DMZ (`10.1.2.3:80`)
- `200.1.6.12` → FTP DMZ (`10.1.2.4:21`)

Validación en router:

```text
show ip interface brief
show ip route
show access-lists
show ip nat translations
show ip nat statistics
show run interface fa0/0.10
show run interface fa0/0.20
show run interface fa0/0.40
```

---

## 4) Firewall físico — política mínima recomendada

### Interfaces

- WAN/OUTSIDE: hacia red externa o backbone del laboratorio.
- INSIDE: hacia router (red tránsito sugerida `172.16.100.0/30`).

### Rutas estáticas en firewall

- `200.1.6.0/24` vía `172.16.100.2`
- `10.1.2.0/24` vía `172.16.100.2`
- `10.2.3.0/24` vía `172.16.100.2`

### Políticas

1. Permitir Pública→DMZ solo puertos necesarios: 80, 8080, 21 y pasivos FTP.
2. Bloquear Pública→Aplicaciones.
3. Permitir DNS desde DMZ/Apps a `200.1.6.2`.
4. Denegar por defecto el resto del tráfico inter-zonas.

### NAT

- Opción A (recomendada para readiness): NAT base en router + reglas de salida en firewall.
- Opción B: NAT principal en firewall. En ese caso, mantener en router solo ruteo/ACL y retirar NAT duplicado.

---

## 5) Pruebas de conectividad por capas

1. **L2:** estado de enlaces y VLANs en switch.
2. **L3:** reachability a gateways (`.1` por zona).
3. **Servicios:** DNS, Proxy, WebGoat, AD, DVWA, FTP.
4. **Seguridad:** confirmar bloqueos esperados entre zonas.

---

## 6) Errores frecuentes y corrección

- **VLAN mal asignada en puerto access:** host no llega a su gateway.
- **Trunk sin VLAN permitida:** zona aislada completamente.
- **ACL demasiado restrictiva:** servicios parecen caídos pero es bloqueo de capa 3/4.
- **Firewall sin rutas estáticas:** no hay retorno de tráfico entre zonas.
- **Desalineación IP Docker vs red física:** DNS resuelve, pero no hay conectividad real.
