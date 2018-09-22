FROM node:10
WORKDIR /usr/src/app

RUN apt update
RUN apt install netcat -y
RUN git clone https://github.com/davidcostadev/mymoney.git .

ADD start.sh /usr/src/app/start.sh

EXPOSE 3000

CMD ["sh", "/usr/src/app/start.sh"]
