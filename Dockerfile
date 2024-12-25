# Use the official Python base image
FROM python:3.12.3-alpine 

# Install required package
#RUN apk update && \
#    apk add --virtual --no-cache \
#    gcc musl-dev mariadb-connector-c-dev && \
#    rm -f /var/cache/apk/*

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install the project dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project to the working directory
COPY ./api/ .

# Expose the port that the Django app will run on
EXPOSE 8000

ENTRYPOINT ["python", "manage.py", "migrate"]

# Start the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
