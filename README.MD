![logo](https://user-images.githubusercontent.com/23036224/85926450-d5881e80-b89f-11ea-9f1e-d5a49ae55964.png)

![Backend tests badge](https://github.com/praszuk/GdzieJedzonko/workflows/Backend%20tests/badge.svg) ![Frontend build badge](https://github.com/praszuk/GdzieJedzonko/workflows/Frontend%20build/badge.svg)



### Table of Contents
You're sections headers will be used to reference location of destination.

- [Description](#description)
- [Images](#images)
- [How To Use](#how-to-use)
- [License](#license)

---

## Description

Portal for sharing your experiences from restaurants, bars and other gastronomy facilities visited by you and others. Application is equipped with interactive map and markers for easier searching places in your area. Users can also search, browse and comment reviews of other users. Moderators have access to all the reviews with the ability to accept, reject, delete and edit them. Admin of the portal have dedicated view for managing users and all above.




**_NOTE:_** All of UI is written in ***Polish!***

#### Technologies

- Django
- Angular 8
- Docker
- PostgreSQL

---

## Images


![Main map](https://user-images.githubusercontent.com/23036224/85927500-c9ec2600-b8a6-11ea-9c2a-da4d1b616717.jpg)

![Main articles](https://user-images.githubusercontent.com/23036224/85927501-cb1d5300-b8a6-11ea-9cee-dd9febbc504b.jpg)

![Article](https://user-images.githubusercontent.com/23036224/85927504-cc4e8000-b8a6-11ea-9edb-1c66a45081b4.jpg)

![Article photos](https://user-images.githubusercontent.com/23036224/85927505-cd7fad00-b8a6-11ea-9ab2-75d39d23d71e.jpg)

![Article comments](https://user-images.githubusercontent.com/23036224/85927507-ceb0da00-b8a6-11ea-8319-f74f999632bb.jpg)

![Admin panel](https://user-images.githubusercontent.com/23036224/85927508-cfe20700-b8a6-11ea-89a0-d8ebcbb2e072.jpg)



## How To Use

Application uses docker compose for easy and quick setup. Follow those simple steps.

#### Installation

Create _.env_ file in the root of the project directory and fill with your credential as below:

```
SECRET_KEY=<secret key for web app>
BACKEND_ALLOWED_HOST=<domain/ip>
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_DB=<postgres db>
POSTGRES_USER=<postgres user>
POSTGRES_PASSWORD=<postgres password>
USER_AGENT_API=<Agent to get location data from Nominatim>
```

#### Run production:
```
PORT=80 docker-compose -f docker-compose-prod.yml -p prod up -d
```

#### Run release (auto merge front end and back end):
```
PORT=6789 docker-compose -f docker-compose-prod.yml -p dev up -d
```

#### Run development:
```
docker-compose -f docker-compose-dev.yml up -d
```

#### Create Admin account
Get into web container.
```
docker exec -it prod_backend_1 bash
```
Run django shell
```
python manage.py shell
```
Create admin object
```
from users.models import User, Role
admin = User.objects.create_user(email='admin@gdziejedzonko.tk', password='admin1234', first_name='Admin', last_name='Admin', birth_date='1990-03-11', role=Role.ADMIN)

exit()
```


## License

[MIT](LICENSE)

[Back To The Top](#description)
