# Proof of Code

Hello candidate!

You should have received this codebase (and this `README.md` file) in
a `.zip` file emailed to you by a hiring manager or recruiter.

This is a modest web application used for evaluating candidates
applying to engineering & product positions at Unchained Capital.

This app is meant to be a microcosm of the kind of code you will find
at Unchained.  We use git and practice code review.  We run a
PostgreSQL database, a Flask API backend (with SQLAlchemy), and a
React frontend (with Redux).

We make different choices and we're under different constraints than
what you'll find in this small app, but the feel of working in this
codebase should be similar to working in Unchained's production code.

We intend for your first interview to be interactive and this
application will serve as the context for our discussion.

You will later go on to do some further, take-home work on your own
which you will submit back to us for next steps.

Good luck!

## Before your first interview

To ensure a good interview, you should ensure you can run this
application on your computer.

Start by reviewing the "Requirements for your computer" below and then
ensure you can run through the commands in the "Quickstart".  (You may
also want to run the test suites, see the subsequent "Testing"
section).

At that point you're ready for your interview -- though feel free to
read through the rest of this document to get a sense of what we'll be
interested in.

### Requirements for your computer

Your computer

* must be UNIX-compatible (e.g. Mac, Linux)
* must have the `git`, `docker` & `docker-compose` commands
* must have an internet connection

**Frontend Note:** If you're planning on doing a lot of frontend
development or running frontend unit or E2E tests frequently, you may
also want to ensure you have a NodeJS environment installed on your
host machine.  This will allow you to directly run `npm` commands on
your host machine instead of through Docker, which is way faster on
some platforms (e.g. Mac).

**QA Note:** To run the E2E test suite or to interact with Cypress at
all, you **need** a local NodeJS environment.

### Quickstart

**NOTE:** It should take you about 10-15 minutes to set up your local
environment using Docker (and perhaps `npm` locally, should you need),
so we suggest doing this before your interview time.

Run the following commands from the root directory of this repository:

```
# 1st shell -- build docker images
$ docker-compose build

# Install Python dependencies
$ docker-compose run server pipenv install --dev

# If you want this command to run fast *OR* if you want to
# run E2E tests, you'll want to install JavaScript
# dependencies locally:
$ cd client && npm install

# If you don't have a compatibale JavaScript environment
# locally, you can install JavaScript dependencies
# through Docker:
$ docker-compose run client npm install

# 2nd shell -- PostgreSQL database
$ docker-compose up database

# 3rd shell -- Flask development server
$ docker-compose up server

# 4th shell -- If you want this to be fast, you'll want to
# run the React development server locally:
$ cd client && npm start

# If you don't have a compatibale JavaScript environment
# locally, you can install run the React development
# server through Docker:
$ docker-compose up client

# Back to 1st shell -- upgrade database schema version
$ docker-compose run server pipenv run flask db upgrade
```

Now you should be ready to visit
[`http://localhost:3000`](http://localhost:3000) in your browser and
interact with the application.

## Repository Layout

This repository contains several things:

* in `specs` are product specs which describe how the application works
* in `dockerfiles` are Dockerfiles which define the Docker images used in this application
* in `server` is a Flask application which provides a JSON API.  It's typically run using Docker.
* in `client` is a React application which provides the UI.  It can be run using Docker or directly on your host (through `npm`).
* in `jira` are bug reports for various known bugs in the application
* in `prs` are pull requests (git diffs, really) addressing some of the issues in `jira`
* in `QUESTIONS.md` there are many questions used for take-home work

Many of the subdirectories of this repository have their own README
files with further documentation.

## Testing

This application has several kinds of test suites.

### Backend Unit Tests

Backend unit tests are through `pytest`.  You can run it directly or
use `pytest-watch` if you want to run tests interactively while you
develop.

**NOTE:** Some tests assume that the database is empty, so if you have
already inserted records into the database tables, those tests might
fail.

```
$ docker-compose run server pipenv run pytest
$ docker-compose run server pipenv run pytest-watch
```

### Frontend Unit Tests

Frontend unit tests use React Testing Library.  You can run them
through Docker:

```
$ docker-compose run client npm test
```

or on your host from the client directory (much faster for Mac):

```
$ npm test
```
### E2E Tests

We use Cypress for E2E testing.  Cypress does not run inside Docker,
so you **must** run it on your host, from the client directory:

```
$ npm run cypress:run
$ npm run cypress:open
```

## Updating Dependencies

If you find that you need to update dependencies in order to fix a bug
or add a feature, do so via the following commands.

On the backend, to add a Python dependency `foo`:

```
$ docker-compose run server pipenv install foo
```

On the frontend, to add a JavaScript dependency `foo`:

```
$ docker-compose run client npm install --save foo
# or just
$ npm install --save foo
```

## Submitting Your Response

To submit your response:

1) Ensure you have committed all changes to the `master` branch locally
2) Ensure that you are currently on the `master` branch with a clean `git status`
3) Run the [submission script](./create_response_patch.sh):

	```
	$ ./create_response_patch.sh
	```

4) Email the created `.patch` file to your recruiter or hiring manager.
