# Osmanski Carefinder Server

Written by Josh Osmanski

## Setup

1. Make an .env file and set these 2 variables

   - jwtSecret
   - jwtExp
   - dbConStr

2. run 'npm install'
3. run 'npm run start'

# Routes

## /auth

### login

Will log an existing user into an account

POST req with body: {username: string password: string}

returns: jwt for requests containing username and permission level

### signup

Will create new user account log into it

POST req with body: {username: string password: string}

returns: jwt for requests containing username and permission level

## /hospitals

requires the header 'jwt' to be set and valid

use auth routes to get the jwt

### GET

Gets a list of hospitals that match the query provided,
send an empty request to return all hospitals.

Valid params to query by:

- id
- name
- address
- city
- state
- zipcode
- county
- type
- ownership
- emergency_services
- phone
- latitude
- logitude
- dist (distance from lat + long)

returns: list of hospitals matching query

## ADMIN ONLY /hospitals

### POST

Admin only: adds a new hospital using a JSON body with the format:

- provider_id
- hospital_name
- address
- city
- state
- zip_code
- county_name
- hospital_type
- hospital_ownership
- emergency_services
- phone_number
- latitude
- logitude

returns: db document of the hospital object created

### PUT

Admin only: overwrites or adds a new hospital in the query using the provided JSON body.

query

- id: provider_id of hospital to overwrite

body

- provider_id
- hospital_name
- address
- city
- state
- zip_code
- county_name
- hospital_type
- hospital_ownership
- emergency_services
- phone_number
- latitude
- logitude

returns: db document of the hospital object that was created/replaced

### DELETE

Admin only: Deletes all hospitals matching query provided and returns the hospitals that were deleted

Valid params to query by:

- id
- name
- address
- city
- state
- zipcode
- county
- type
- ownership
- emergency_services
- phone
- latitude
- logitude
- dist (distance from lat + long)

returns: list of hospitals deleted
