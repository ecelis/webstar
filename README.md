## Dependencies

NodeJS 22.12, yarn, Python 3.12, Redis 17

**Install Backend dependencies**

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

```

```

### Run

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
