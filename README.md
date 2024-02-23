# WheelDealz
Real-time auction platform for bidding on vehicles, initially only cars. 
Learning project for me personally, as an old Java / Spring (Boot) dude who wants to see 
how long it takes to do it with the long-unused C#, .NET, and associated ecosystem 
(After work hours.)

**short foreword on comments in a learner's project:**
As this is my learning project, I use a lot more comments than in productive projects (where I try to avoid them as much as possible [as they scale poorly] by writing code that doesn't need comments). I use the comments as a memory aid and to record certain learnings.

And I think `todo`s (and `fixme`s) are acceptable for hobby/learning projects. You want to make progress after all.
Of course _not_ in a professional environment with the sole exception of _spikes or prototypes_.


## Tech-Stack
1. C#, .NET
1. EntityFramework
1. PostgreSQL, mongoDB, RabbitMQ
1. Identity Server
1. Docker
1. ...

# Developer Notes
what's relevant (or recommended) for starting locally and debugging.

- `docker compose up`  ...to start the postgres db of the auction service in /WheelDealz/

- `dotnet watch`  ...to start the Backend-Service of your choice like for instance '/WheelDealz/AuctionService' in '/WheelDealz/src/AuctionService/'

- `docker compose down; docker volume prune -f; docker volume rm wheeldealz_pgdata; docker volume rm wheeldealz_mongodata; docker compose up -d`
... to restart everything (except for the frontend) and reset the databases.

- `npm run dev` ... to start the frontend in '/WheelDealz/frontend/wheeldealz-fe'

- in order to make Authentication work with Identity Server on the client, you **must** have a '.env.local' file with these keys in '/WheelDealz/frontend/wheeldealz-fe/' with the following content:
```properties
NEXTAUTH_SECRET=somethingverysecret
NEXTAUTH_URL=http://localhost:3000
```

- **todo brief description howto debug**: backend service, backend service inside docker, frontend

- Currently these Urls are configured to access some services web interfaces in Dev Environment:
    - Duende Identity Server: http://localhost:5000/
    - RabbitMQ console: http://localhost:15672 with credentials 'guest', 'guest'
    - **todo add missing**


You may run the entire postman collection or a subfolder of it using the postman ui.

## Development Tool Stack
1. Docker, -Compose
1. VS Code
1. .NET v.8
1. Postman





# Micro Service Architecture
Without thinking too long (or applying DDD, which I would never 
do again in a professional setting, but this is more of a tech learning demo...)
... I consider the following services a good idea:

## Auctions Service (BE)
Simple CRUD service. For auctions with the cars or `Items` to be auctioned.
Persistence: PostgreSQL

## Search Service (BE)
Search for cars (`Items`) and related `Auctions`.
Persistence: MongoDB, a document store. Mainly because there is a very handy 
.NET integretion package that provides us a welcome search and pagination for mongoDB.

## Bidding Service (BE)
This service manages the ongoing auctions and the real-time `Biddings`.

## User Service (BE)
User management Authentication and Authorization. To start with, we use IdentityServer.

## Gateway Service 
Single access point for clients, like the the FE/BFFE. We will do authentication on the gateway service. We will go with YARP.

## WebApp (FE) with Backend For Frontend (BFFE)
[NextJS](https://nextjs.org/docs) with [Tailwind CSS](https://tailwindcss.com/docs/utility-first) and [Flowbite React](https://www.flowbite-react.com/docs/getting-started/introduction). Shifting from React state hooks to [Zustand](https://zustand-demo.pmnd.rs/).

## Infrastructure

### Event Bus
The backend services should communicate asynchronously via the event bus.
Technologies: EventStore or RabbitMQ.

---

# a poor man's backlog / todo list
Many of the entries listed here also have a `// todo` in the code.
I find `todo`s (and `fixme`s) acceptable for hobby/learning projects, 
as well as in a professional environment, 
_as long as it's about spikes or prototypes_.
You want to make progress after all.

**But in a production context, `todo`s and `fixme`s are an absolute no-go!**
In my experience, they tend to stay and even propagate.


## a - low hanging fruits
- Rename: Auctions Property from EndedAt to EndsAt
- AuctionsController.GetAllAuctions() parameterize ordering criteria
- Paging

## b - medium sized features and ideas
- introduce architecture tests 
- introduce unit and integration testing
- setup github ci/cd pipeline

## c - bigger ideas
- EventStore instead of RabbitMQ (or vice versa)?
- Angular instead of NextJS (or vice versa)?
- introduce OpenAPI / Swagger
- Frontend: do a spike using Aurelia
- SQL-Server instead of Postgres
- deploy on local / K8s cluster and expose via public dns/url


