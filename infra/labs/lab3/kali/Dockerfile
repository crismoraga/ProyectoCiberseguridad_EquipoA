FROM kalilinux/kali-rolling:latest

RUN apt-get update

#Herramientas generales
RUN apt install -y iputils-ping
RUN apt install -y dnsutils
RUN apt install -y net-tools
RUN apt install -y telnet

#Herramientas kali
RUN apt install -y nmap
RUN apt install -y rsh-redone-client
RUN apt install -y metasploit-framework


COPY ./boot.sh ./
