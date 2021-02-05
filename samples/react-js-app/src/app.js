/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";
import ReactJson from "react-json-view";
import "./app.css";
import PRODUCT_LOGOS from "./images/asgardeo-logo.png";
import REACT_LOGO from "./images/react-logo.png";
import JS_LOGO from "./images/js-logo.png";
import FOOTER_LOGOS from "./images/footer.png";
// Import Asgardeo Auth JS SDK
import { Hooks, AsgardeoSPAClient } from "@asgardeo/auth-spa";
import * as authConfig from "./config.json";

const authClient = AsgardeoSPAClient.getInstance();

const App = () => {
    const [authenticateState, setAuthenticateState] = useState({});
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const parseIdToken = (idToken) => {
        return idToken.split(".");
    };

    authClient.on(Hooks.SignIn, (response) => {
        authClient.getDecodedIDToken().then((idTokenPayload) => {
            setIsAuth(true);
            setIsLoading(false);

            sessionStorage.setItem("authenticateResponse", JSON.stringify(response));
            sessionStorage.setItem("decodedIdToken", JSON.stringify(idTokenPayload));

            authClient.getIDToken().then((idToken) => {
                setAuthenticateState({
                    ...authenticateState,
                    authenticateResponse: response,
                    decodedIdTokenHeader: JSON.parse(atob(parseIdToken(idToken)[0])),
                    decodedIdTokenPayload: idTokenPayload,
                    displayName: response.displayName,
                    idToken: parseIdToken(idToken),
                    username: response.username
                });
            });
        });
    });

    authClient.on(Hooks.SignOut, () => {
        setIsAuth(false);
        setIsLoading(false);
    });

    const handleLogin = () => {
        // Add a check property to the session, so we can recall sign-in method upon redirect with authorization code.
        // authorization code grant type flow
        authClient.signIn();
    };

    const handleLogout = () => {
        authClient.signOut();
    };

    useEffect(() => {
        authClient.initialize(authConfig.default);

        authClient.signIn({ callOnlyOnRedirect: true });

        authClient.isAuthenticated().then((response) => {
            if (response) {
                authClient.getIDToken().then((idToken) => {
                    setAuthenticateState({
                        ...authenticateState,
                        authenticateResponse: JSON.parse(sessionStorage.getItem("authenticateResponse")),
                        decodedIdTokenHeader: JSON.parse(atob(parseIdToken(idToken)[0])),
                        decodedIdTokenPayload: JSON.parse(sessionStorage.getItem("decodedIdToken")),
                        displayName: sessionStorage.getItem("display_name"),
                        email: JSON.parse(sessionStorage.getItem("email"))
                            ? JSON.parse(sessionStorage.getItem("email"))[0]
                            : "",
                        idToken: parseIdToken(idToken),
                        username: sessionStorage.getItem("username")
                    });

                    setIsAuth(true);
                });
            }
            setIsLoading(false);
        });
    }, []);

    return (
        <>
            <img src={PRODUCT_LOGOS} className="logo-image" />
            <div className="container">
                {authConfig.default.clientID === "" ? (
                    <div className="content">
                        <h2>You need to update the Client ID to proceed.</h2>
                        <p>
                            Please open "src/config.json" file using an editor, and update the <code>clientID</code>{" "}
                            value with the registered application's client ID.
                        </p>
                        <p>
                            Visit repo{" "}
                            <a href="https://github.com/asgardeo/asgardeo-auth-spa-sdk/tree/master/samples/react-js-app">
                                README
                            </a>{" "}
                            for more details.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="header-title">
                            <h1>
                                JavaScript Based React SPA Authentication Sample <br /> (OIDC - Authorization Code
                                Grant)
                            </h1>
                        </div>
                        <div className="content">
                            {isLoading ? (
                                <div>Loading ...</div>
                            ) : (
                                <>
                                    {isAuth ? (
                                        <>
                                            <h2>Authentication response</h2>
                                            <div className="json">
                                                <ReactJson
                                                    src={authenticateState.authenticateResponse}
                                                    name={null}
                                                    enableClipboard={false}
                                                    displayObjectSize={false}
                                                    displayDataTypes={false}
                                                    iconStyle="square"
                                                    theme="monokai"
                                                />
                                            </div>

                                            <h2 className="mb-0 mt-4">ID token</h2>

                                            <div className="row">
                                                {authenticateState.idToken && (
                                                    <div className="column">
                                                        <h5>
                                                            <b>Encoded</b>
                                                        </h5>
                                                        <div className="code">
                                                            <code>
                                                                <span className="id-token-0">
                                                                    {authenticateState.idToken[0]}
                                                                </span>
                                                                .
                                                                <span className="id-token-1">
                                                                    {authenticateState.idToken[1]}
                                                                </span>
                                                                .
                                                                <span className="id-token-2">
                                                                    {authenticateState.idToken[2]}
                                                                </span>
                                                            </code>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="column">
                                                    <div className="json">
                                                        <h5>
                                                            <b>Decoded:</b> Header
                                                        </h5>
                                                        <ReactJson
                                                            //src={ JSON.parse(atob(authenticateState.idToken)) }
                                                            src={authenticateState.decodedIdTokenHeader}
                                                            name={null}
                                                            enableClipboard={false}
                                                            displayObjectSize={false}
                                                            displayDataTypes={false}
                                                            iconStyle="square"
                                                            theme="monokai"
                                                        />
                                                    </div>

                                                    <div className="json">
                                                        <h5>
                                                            <b>Decoded:</b> Payload
                                                        </h5>
                                                        <ReactJson
                                                            src={authenticateState.decodedIdTokenPayload}
                                                            name={null}
                                                            enableClipboard={false}
                                                            displayObjectSize={false}
                                                            displayDataTypes={false}
                                                            iconStyle="square"
                                                            theme="monokai"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <button className="btn primary mt-4" onClick={handleLogout}>
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="home-image">
                                                <img src={JS_LOGO} className="js-logo-image logo" />
                                                <span className="logo-plus">+</span>
                                                <img src={REACT_LOGO} className="react-logo-image logo" />
                                            </div>
                                            <h3>
                                                Sample demo to showcase how to authenticate a simple client side
                                                application using
                                                <br />
                                                <b>Asgardeo</b> with the{" "}
                                                <a
                                                    href="https://github.com/asgardeo/asgardeo-auth-spa-sdk"
                                                    target="_blank"
                                                >
                                                    Asgardeo Auth SPA SDK
                                                </a>
                                            </h3>
                                            <button className="btn primary" onClick={handleLogin}>
                                                Login
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>

            <img src={FOOTER_LOGOS} className="footer-image" />
        </>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
