FROM kalilinux/kali-rolling:latest

RUN apt-get update

#Instals generales
#RUN apt install -y expect
RUN apt install -y iputils-ping
RUN apt install -y dnsutils


#Instals nuevos
RUN apt install -y nmap
RUN apt install -y metasploit-framework


COPY ./boot.sh ./
