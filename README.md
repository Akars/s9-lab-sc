# Questions

----

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
