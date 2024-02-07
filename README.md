# WheelDealz
Real-time auction platform for bidding on vehicles, initially only cars. 
Learning project for me personally, as an old Java / Spring (Boot) dude who wants to see 
how long it takes to do it with the long-unused C#, .NET, and associated ecosystem 
(After work hours.)

## Tech-Stack
1. C#, .NET
2. EntityFramework
3. PostgreSQL
4. Docker
1. ...

# Developer Notes
what's relevant (or recommended) for starting locally and debugging.

## Development Tool Stack
1. Docker
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

## Bidding Service (BE)
This service manages the ongoing auctions and the real-time `Biddings`.

## User Service (BE)
User management

## WebApp (FE)
Web-UI.

## Backend For Frontend (BFFE)
This service knows how to talk to the various backends to fulfill frontend's needs. 

## Infrastructure

### Event Bus
The backend services should communicate asynchronously via the event bus.
Technologies: EventStore or RabbitMQ.

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


