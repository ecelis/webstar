##  Docker Quick Start

```
docker compose up
```

Browse to http://localhost:8000

**Username:** `admin`
**Password:**: `test123`

## Full instructions (not required if you are running the docker container)

These are instructions for Ubuntu 24.04 systems, Windows and MacOS users will need to adapt. Although this should work without modifications in WSL2.

Base dependencies (I won´t provide instructions to install these, check the provided links):

- NodeJS 22.12
- yarn
- Python 3.12
- Redis 17

**Install API dependencies**

```
cd api
python3 -m venv ENV
source ENV/bin/activate
pip install -r requirements.txt
```

**Install Frontend dependencies**

```
cd web
yarn install
```

## Setup

### Environment variables

**SECRET_KEY,** the secret key must be a large random value and it must be kept
secret.

### Database

```
cd api
python3 manage.py migrate
```

### API

Open 1 terminal an run

```
cd api
python manage runserver
```

### Web

Open other terminal and run

```
cd web
yarn start
```

Browse to http://localhost:3000

## Testing

**TESTS WON'T RUN WITHOUT THE SELENIUM DRIVER AVAILABLE, SO SKIP TESTING**
Running tests will require installing the appropriate driver, which can be not as
easy as it sounds. So don't try testing if you don't know how to setup and install
selenium drivers.

The steps below are for Google Chrome `131.0.6778.204` on Ubuntu 24.10, adapt to
suit your system.

```
curl -LSO https://storage.googleapis.com/chrome-for-testing-public/131.0.6778.204/linux64/chrome-linux64.zip
unzip chrome-linux64.zip -d drivers/
cd webstar
PATH=../drivers/chrome-linux64:$PATH python manage.py test editor.tests
```

### Routes

- `/user/$`
- `document/$`
- `auth/`
