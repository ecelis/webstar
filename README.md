##  Docker Quick Start

```
docker compose up
```

Browse to http://localhost:8000

**Username:** `admin`
**Password:**: `test123`

## Full instructions (not required if you are running the docker container)

These are instructions for Ubuntu 24.04 systems, Windows and MacOS users will need to adapt.
Although these instructions should work without modifications in WSL2.

Base dependencies (I won´t provide instructions to install these, check the provided links):

- NodeJS 22.12 https://nodejs.org/en
- yarn https://yarnpkg.com/
- Python 3.12 https://www.python.org/
- Python venv module, it should be part of python, but Ubutnu ships it as a separate package

Get the code

```
git clone https://github.com/ecelis/webstar.git
cd webstar

```

**Install API dependencies**

```
sudo apt install python3-venv
python3 -m venv ENV
source ENV/bin/activate
pip install -r requirements.txt
```

**Install Frontend dependencies**

NodeJS (optional, skip this step if you already have NodeJS installed)
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install --lts ; nvm alias default node
npm install -g yarn
```

**SECRET_KEY,** the secret key must be a large random value and it must be kept
secret. You can set an environment variable, but it will not be permanent.

```
export SECRET_KEY=veryLongValue
```

**Start the API**

```
cd api
python3 manage.py migrate
python3 manage.py runserver
```

**Start the web frontend**

Open other terminal and run

```
cd web
yarn install
REACT_APP_API_URL=http://localhost:8000/api/ yarn start
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
