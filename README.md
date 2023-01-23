# Questions

----
# LAB 3

## 1

The database should be reset before each test case to ensure that when you do the test nothing from other tests cause the test to go wrong somehow.
Debugging can be harder with a database uncleaned, so running test in a clean database is much easier to work with.

## 2

The error occurred in test case "should raise error if email is missing", is an SQL error. The database threw the error after executing the query. The best way is to have a validation before executing the query
to ensure to not make irreversible errors.

## 3

Typescript constraint validations are insufficient for ensuring database integrity and must be backed with database constraints.
So every validation should be backed up by a constraint to protect against race conditions.

## 4

Model validations can serve the security of an application by ensuring that the data being stored in the database is consistent and follows certain rules. For example, a validation that checks for the uniqueness of the email field can prevent malicious users from creating multiple accounts with the same email, which could be used for spamming or phishing attacks.
One database mechanism that can be leveraged for security hardening in case a validation fails is a database constraint. A database constraint is a rule that is enforced by the database to ensure the integrity and consistency of the data stored in the database.

---------
# LAB 4

## 1

REST is an architectural style for building webservice. Using consistent naming convention for apis. REST naming is based to CRUD operations on resources corresponding to HTTP verbs (GET, POST, PUT, DELETE). The name of the endpoint can describe what the api is intended to do. The path will indicate the resource that is accessed. 

## 2

POST /web-api/users endpoint will create a resource, in this case it will create an user.
POST /web-api/sessions endpoint will create a resource, so it will create a new session.

## 3

If no json schema for any of body, query and params the server respond: 
the server will send an error message
``` json
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "body must be object"
}
```

If the client submits an unknown property, according to the JSON schema:
The user is created but the unknown property is not record onto the db

If the client omits a required property, according to the JSON schema:
It will send an error message to the client with the omitted property
```json
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "body must have required property 'lastname'"
}
```
