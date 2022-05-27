FROM node:16.13.2-alpine as builder

WORKDIR /var/www

COPY . .

RUN npm i -g pnpm
RUN pnpm i
RUN pnpm run build

FROM builder as worker


# Expose port 4000 to run the app inside this container
EXPOSE 4000

CMD ["./node_modules/.bin/next", "start", "-p", "4000"]