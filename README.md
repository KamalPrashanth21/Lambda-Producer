# Generic Producer Lambda Implementation with Webhook.site

## Description
> An **AWS Lambda Function** written in typescript receives order payloads via API Gateway, **validates**, **transforms**, and **publishes** the result to [Webhook.site](https://webhook.site) for testing and inspection.

## Features
- Fully testable locally with AWS SAM  
- Modular structure with 80% unit-test coverage using jest
- CloudWatch logging via custom logger
- Environment management via `.env`

## Tech Stack
- Typescript & Node.js
- AWS Lambda with API Gateway
- AWS Serverless Application Model(SAM) framework
- Axios (Http Client)
- Jest (Unit Tests)
  
---

## Installation & Set-up
- Clone and Install Dependencies
```
git clone https://github.com/KamalPrashanth21/Lambda-Producer.git
cd lambda-producer
npm install 
```
- Set Up Environment Variables
```
WEBHOOK_URL=https://webhook.site/your-unique-id
```
- Build the Typescript Project
```
npm run build
```
---

## Run Unit Tests
```
npm test 
```
---

## Run the project locally
- Start API locally 
```
sam local start-api
```
- (or) Invoke lambda function directly
```
sam local invoke LambdaOrderProducerFunction -e events/event.json
```
---

## Deploy to AWS
- Configure AWS CLI
``` 
aws configure
```
- Deploy using AWS SAM
```
sam build 
sam deploy --guided 
```

---

## API Endpoints
- **POST**  `/process/order-producer/v1`

     - Accepts a SourceOrderData JSON payload.
     - Validates, transforms, and sends it to webhook.site
- **GET** `/process/order-producer/v1/healthCheck`

     - simulates basic health-Check by returning `{"status": "ok"}`
     
---

## Folder structure
```
lambda_producer/
│
├── src/                         # Core business logic
│   ├── index.ts                 # Lambda handler
│   ├── validate.ts              # Input validation logic
│   ├── transform.ts             # Transforms source to target model
│   ├── publish.ts               # Publishes data to webhook.site
│   ├── logger.ts                 
│   ├── utils.ts                 # Helper functions
│   └── types.ts                 # TypeScript interfaces 
│   │
|  test/                         # Jest unit tests
│   ├── validate.test.ts
│   ├── transform.test.ts
│   └── publish.test.ts
│
├── events/                         
│   ├── event.json               # Sample input payload
├── .env                         # Environment variable for WEBHOOK_URL
├── .gitignore                   
├── jest.config.js               # Jest test config
├── package.json                 # Scripts and dependencies
├── tsconfig.json                # TypeScript compiler config
├── template.yaml                # AWS SAM deployment template
└── README.md                    # Project overview and setup guide
```
---

## Logging (CloudFormation)
> - logs incoming requests
> - logs transformation success/failure
> - logs webhook publish status
