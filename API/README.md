# Cortex Back End Developer Challenge

## Prompt
In this test we would like you to create an API that will manage a player character’s Hit Points(HP). Clients will need to be able to do the following:
- Deal damage of different types (bludgeoning, fire, etc) while considering character resistences and immunities
- Heal
- Add temporary hit points

The API should be built with Express on Node.js and run in docker. The service you create should calculate the HP based on the character information and persist for the life of the application. You can store the data however you'd like. You'll find the json that represents a stripped down character in  [briv.json](Reference/briv.json).

HP are an abstract representation of a character's life total. In D&D a character's HP are calculated in one of two ways. Either a random roll of a Hit Die whose number of sides is determined by a character's class for each class level they have, or the player may choose to the rounded up average result of the hit die value for each character level. You may choose either method you do not need to do both. Also included in the calculation of the character's HP is the character's constitution stat modifer. To calculate a stat modifier take the ((statValue - 10)/2) round to the lowest integer. In negative numbers this means rounding to the integer further from zero.

Temporary Hit Points are a special case of hitpoints that are added to the current HP total and are always subtracted from first, and they cannot be healed. Temporary hit points are never additive they only take the higher value, either what exists or what is being "added".

When a character has resistance to a damage type they receive half damage from that type.

When a character has immunity to a damage type they receive no damage from that type.

Feel free to fill in any gaps you may encounter as you see fit. However, if you have questions please reach out to your Fandom contact and we will get back to you.


## API Structure
I have included a [Swagger document](Documentation/Swagger.yaml) for the API.
I find it helps me to think through the API structure using this format before I begin coding the implementation.
The structure did change as I worked through the implementation, and I went back and updated the documentation to match the final result.

### Endpoints
```
/characters
  GET  - gets all characters
  POST - creats a new character, using the Fixed HP calculation method
/characters/:id
  GET  - retrieves a character
/characters/:id/hp
  GET  - retrievers a character's current hp
  POST - updates a character's hp (accounts for damage type)
  PUT  - overrides a character's hp value
/characters/:id/hp/updateTemp
  PUT  - overrides a character's temp hp value
```

Actions that are idempotent (such as overriding a character's hp or temp hp) are set to the PUT method.  Actions that can have side effects such as updating the character's hp while accounting for damage type are set to the POST method.

### Notes
I noticed that the example [briv.json](/Reference/briv.json) is inconsistent with the `hitDiceValue` class property.
I elected to only support the standard camelcase convention.  Though this means means that submitting the example json will result in a 400 Bad request response.

```
  "classes": [
    {
    "name":"fighter",
    "hitDiceValue":10,
    "classLevel":3
    },
    {
      "name":"wizard",
      "hitdicevalue":6,
      "classLevel":2
    }
  ]
```

I set up a basic in-memory storage class for the API for illustration purposes.
This is accessed via the `DataService` interface so it can be easily substituted with a more permanent datastore such as DynamoDb.

## Environment Variables
The following Environment variables are included for use in the API:

- **DEBUG** - controls console log behavior.  Set to `*` to enable all logging.
- **PORT** - controls port for API hosted service.  Set to 3000 by default.

## Libraries used
### io-ts
Input request validations are completed via the [io-ts](https://github.com/gcanti/io-ts/blob/HEAD/index.md) library.
The library provides a useful bridge between Typescript's compile time types and runtime object validation.

The declaration of models can be a bit clunky, but I often find it preferable to handwriting the validations.
The biggest downside I've found is that the error messages generated for invalid objects are very difficult to parse.
This can be inspected by looking at the `ValidationError.details` property.  
However, for the purposes of this exercise I felt the behavior was sufficient.

Relevant files:
- [types/Models](src/types/Models.ts) - contains declarative models for runtime object validation.
- [utility/ObjectValidator](src/utility/ObjectValidator.ts) - contains the `parseExact()` method for validating objects.

## Docker
I have limited experience with Docker, so I have included only a basic implmentation for this project that uses docker-compose to manage the build configuration.

relevant commands:
`docker-compose up --build` - builds full environment
`docker-compose down --rmi all` - tears down environment, including created image.