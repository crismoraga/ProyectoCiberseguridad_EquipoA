FROM nginx

#Configurar proxy
WORKDIR /etc/nginx/sites-available

COPY ./grupoa /etc/nginx/sites-available/

WORKDIR /etc/nginx

COPY ./proxy_params /etc/nginx/

WORKDIR /etc/nginx/sites-enabled

RUN ln -s /etc/nginx/sites-available/grupoa /etc/nginx/sites-enabled/

#Habilitar HTTPS
#RUN apt update
#RUN yes | apt install certbot python3-certbot-nginx
#RUN certbot --nginx -d grupoa.com -d www.grupoa.com --non-interactive --agree-tos