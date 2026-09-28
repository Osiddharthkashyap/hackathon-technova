# SevaConnect OpenAPI Starter

Use this file as the starting point for `docs/api/openapi.yaml`.

The production repository should keep a complete machine-readable OpenAPI document. Generate frontend clients/types from it where practical.

```yaml
openapi: 3.0.3
info:
  title: SevaConnect API
  version: 1.0.0
  description: Government benefits discovery and assistance API

servers:
  - url: /api/v1

tags:
  - name: Auth
  - name: Users
  - name: Schemes
  - name: Eligibility
  - name: Documents
  - name: Applications
  - name: AI
  - name: Notifications
  - name: Admin

paths:

  /auth/register:
    post:
      tags: [Auth]
      summary: Register a citizen
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RegisterRequest'
      responses:
        '201':
          description: Registered
        '400':
          $ref: '#/components/responses/BadRequest'
        '409':
          $ref: '#/components/responses/Conflict'

  /auth/login:
    post:
      tags: [Auth]
      summary: Login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
      responses:
        '200':
          description: Authenticated
        '401':
          $ref: '#/components/responses/Unauthorized'

  /auth/refresh:
    post:
      tags: [Auth]
      summary: Rotate refresh session
      responses:
        '200':
          description: Token refreshed
        '401':
          $ref: '#/components/responses/Unauthorized'

  /auth/logout:
    post:
      tags: [Auth]
      security:
        - bearerAuth: []
      responses:
        '204':
          description: Logged out

  /auth/me:
    get:
      tags: [Auth]
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Current authenticated user

  /schemes:
    get:
      tags: [Schemes]
      summary: Search schemes
      parameters:
        - in: query
          name: q
          schema:
            type: string
        - in: query
          name: category
          schema:
            type: string
        - in: query
          name: state
          schema:
            type: string
        - in: query
          name: pageSize
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
        - in: query
          name: cursor
          schema:
            type: string
      responses:
        '200':
          description: Scheme list

  /schemes/{schemeId}:
    get:
      tags: [Schemes]
      summary: Get scheme details
      parameters:
        - $ref: '#/components/parameters/SchemeId'
      responses:
        '200':
          description: Scheme
        '404':
          $ref: '#/components/responses/NotFound'

  /schemes/{schemeId}/eligibility:
    get:
      tags: [Eligibility]
      security:
        - bearerAuth: []
      summary: Evaluate current user's eligibility
      parameters:
        - $ref: '#/components/parameters/SchemeId'
      responses:
        '200':
          description: Eligibility result
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'

  /users/me/documents:
    get:
      tags: [Documents]
      security:
        - bearerAuth: []
      responses:
        '200':
          description: User documents

  /users/me/applications:
    get:
      tags: [Applications]
      security:
        - bearerAuth: []
      responses:
        '200':
          description: User applications

    post:
      tags: [Applications]
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateApplicationRequest'
      responses:
        '201':
          description: Application created
        '409':
          $ref: '#/components/responses/Conflict'

  /ai/chat:
    post:
      tags: [AI]
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AIChatRequest'
      responses:
        '200':
          description: AI response
        '429':
          $ref: '#/components/responses/RateLimited'

components:

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  parameters:
    SchemeId:
      name: schemeId
      in: path
      required: true
      schema:
        type: string
        format: uuid

  responses:
    BadRequest:
      description: Bad request

    Unauthorized:
      description: Authentication required

    Forbidden:
      description: Not authorized

    NotFound:
      description: Resource not found

    Conflict:
      description: Resource conflict

    RateLimited:
      description: Too many requests

  schemas:

    RegisterRequest:
      type: object
      required: [name, email, password]
      properties:
        name:
          type: string
          minLength: 2
        email:
          type: string
          format: email
        password:
          type: string
          minLength: 12

    LoginRequest:
      type: object
      required: [email, password]
      properties:
        email:
          type: string
          format: email
        password:
          type: string

    CreateApplicationRequest:
      type: object
      required: [schemeId]
      properties:
        schemeId:
          type: string
          format: uuid

    AIChatRequest:
      type: object
      required: [message]
      properties:
        conversationId:
          type: string
          format: uuid
        message:
          type: string
          minLength: 1
          maxLength: 4000
        language:
          type: string
          default: en

    EligibilityStatus:
      type: string
      enum:
        - POTENTIALLY_RELEVANT
        - NEEDS_VERIFICATION
        - MORE_INFORMATION_NEEDED
        - DOES_NOT_MATCH
```

## Contract rule

Any endpoint added to the application must first be added to the OpenAPI contract and API documentation before frontend/backend implementation is considered complete.
