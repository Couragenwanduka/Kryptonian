# Kryptonian API Collection

This repository contains a collection of API requests for the Kryptonian service, intended to demonstrate various functionalities of the system. These requests are designed for testing and development purposes.

## Prerequisites

Before running these requests, ensure that you have the following:

- Node.js installed on your system
- Thunder Client or a similar tool to execute HTTP requests
- Access to the Kryptonian service running locally on `localhost:4000`

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/kryptonian-api-collection.git
   
   ```


2. Import the collection into your preferred API testing tool (e.g., Thunder Client).

## Usage
 - **Register**
- URL: localhost:4000/register
- Method: POST
- Body:
  ``` json
  {
    "name": "Chidiebere Nduka",
    "email": "couragenduka4@gmail.com",
    "password": "someone"
  }
-  **Send OTP**
- URL: localhost:4000/sendOtp
- Method: POST
- Body:
  ```json
  {
   "email": "couragenduka4@gmail.com"
  }
- **Login**
- URL: localhost:4000/login
- Method: POST
- Body:
  ```json
    {
    "email": "couragenduka4@gmail.com",
    "password": "someone",
    "otp": "208362"
    }
- Authentication: Bearer token required. Example token provided in the request.
- **API Key**
- URL: localhost:4000/apikey/couragenduka4@gmail.com
- Method: GET
- **File Upload**
- URL: localhost:4000/upload
- Method: POST
- **Params: apiKey*
- Body:
- Form data:
- title: "bad picture"
- Files:
- file: Path to the image file to upload
- **Get Files**
- URL: localhost:4000/getimages
- Method: GET
- **Deactivate**
- URL: localhost:4000/deactivate
- Method: PATCH
- Params: apiKey=QTwlu1sAdDxcDXrRdvBz
