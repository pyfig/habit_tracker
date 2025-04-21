FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Копируем файлы фронтенда
COPY . .

# Копируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
