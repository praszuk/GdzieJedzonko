FROM python:3.7
ENV PYTHONUNBUFFERED 1

WORKDIR /backend
ADD . /backend

RUN mkdir -p media

RUN pip install -r requirements.txt --quiet

EXPOSE 8000

CMD ["./docker-entrypoint.sh"]
