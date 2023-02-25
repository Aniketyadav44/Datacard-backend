# Datacard Backend
---
## Datacard server project

>This is the code repository of Datacard project, a Final year major project about securing sensitive documents with many features using IPFS _(Inter Planetary File Storage)_ system and Encryption.

## Installation

Datacard project requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and start the server.

```sh
cd Datacard-backend
npm i
node index.js
```

## Packages
###### NPM Packages used for this projects are,

- express
- ipfs-core
- multer
- firebase-admin
- firebase
- body-parser
- crypto
___
## API Documentation

This API has two main services:

- _Uploading_
- _Requesting_
&nbsp;
##### 1. Uploading
> _Uploading file to ipfs_

Route:
```sh
/api/upload/file
```
Headers:
```sh
{ x-api-key : <api-key> }
```
Body form-data:
```sh
{
    "file" : <FILE>,
    "secretKey" : "user's security key"
}
```
&nbsp;
##### 2. Requesting
> _Requesting single file from ipfs_

Route:
```sh
/api/request/file
```
Headers:
```sh
{ x-api-key : <api-key> }
```
Body form-data:
```sh
{
    "docUID" : "UID of the document from firebase",
    "secretKey" : "user's security key"
}
```
&nbsp;
> _Requesting datacard(file collection)_

Route:
```sh
/api/request/data-card
```
Headers:
```sh
{ x-api-key : <api-key> }
```
Body form-data:
```sh
{
    "dataCardUID" : "UID of the datacard from firebase",
    "secretKey" : "user's security key"
}
```
&nbsp;
##### 3. Decrypting
> _Decrypting an encrypted CID_

Route:
```sh
/api/request/decrypt
```
Headers:
```sh
{ x-api-key : <api-key> }
```
Body form-data:
```sh
{
    "encrypted" : "encrypted CID",
    "secretKey" : "user's security key"
}
```
___
##### The members of this project are:
- _Aniket Yadav_
- _Harsh Purohit_
- _Abdulkadir Sadriwala_
