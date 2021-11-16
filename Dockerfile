FROM node:16
WORKDIR /home/node/app
COPY app /home/node/app
ENV SCAN=./
CMD node host
EXPOSE 8080
