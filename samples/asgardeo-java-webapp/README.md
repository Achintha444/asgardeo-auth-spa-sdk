# Asgardeo Java Sample Webapp
## Getting Started
Before getting started with running this app, make sure you have followed the instructions in the [Try Out the Sample Apps](../../README.md#try-out-the-sample-apps) section.


Open the [index.jsp](index.jsp) file. Scroll down to the `<script>` tag below the `<body>` where the app logic is written.

Paste the copied `OAuth Client Key` in front of the `clientID` attribute of `auth.initialize` method's argument object. You will be replacing a value called `client-id`.

Replace the `"client-host"` value of the `clientHost` attribute with the application's URL in the server.

```javascript
 // Initialize the client
auth.initialize({
    signInRedirectURL: origin,
    clientID: "client-id",
    serverOrigin: serverOrigin,
    responseMode:"form_post"
});
```

Copy the `java-webapp` directory to a tomcat server to run it.

**This SDK is supposed to be used only in Single-Page Applications. This sample shows how this SDK can be used in a Single-Page Application served by a Java Webapp. To authenticate Multi-Page
Java Webapp Applications, it is recommended to use the [Asgardeo Java OIDC SDK](https://github.com/asgardeo/asgardeo-java-oidc-sdk).**

**However, if you still decide to use the Asgardeo Auth SPA SDK, then make sure you**
- **set the `storage` type to anything other than `webWorker`**
- **initialize the `IdentityClient` using the `initialize()` method on every page you plan to use the SDK.**
