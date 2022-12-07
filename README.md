# Questions

----
## 1.
The database should be reset before each test case to ensure that when you do the test nothing from other tests cause the test to go wrong somehow.
Debugging can be harder with a database uncleaned, so running test in a clean database is much easier to work with.

## 2.
The error occurred in test case "should raise error if email is missing", is an SQL error. The database threw the error after executing the query. The best way is to have a validation before executing the query
to ensure to not make irreversible errors.

## 3.
Typescript constraint validations are insufficient for ensuring database integrity and must be backed with database constraints. 
So every validation should be backed up by a constraint to protect against race conditions.
