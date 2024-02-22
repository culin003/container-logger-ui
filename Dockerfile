FROM 10.70.12.12:8082/nginx-base:1.0.0
COPY dist/ /usr/share/nginx/html
RUN sed -i 's/user  nginx;/user  root;/g' /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
