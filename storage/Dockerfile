FROM python:3.6
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache -r requirements.txt
COPY . /app
ARG STORAGE_ID
ENV STORAGE_ID ${STORAGE_ID}

## THE LIFE SAVER
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

## Launch the wait tool and then your application
CMD /wait && flask run --host 0.0.0.0 --port 100${STORAGE_ID}
