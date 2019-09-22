FROM python:3.6
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache -r requirements.txt
COPY . /app
EXPOSE 5000

## THE LIFE SAVER
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

## Launch the wait tool and then your application
CMD /wait && flask run --host 0.0.0.0