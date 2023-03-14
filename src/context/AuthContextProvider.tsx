import Keycloak, { KeycloakConfig, KeycloakInitOptions } from "keycloak-js";
import { createContext, useEffect, useState } from "react";

const {
    location: { protocol, hostname, port }
} = window;
const baseUrl = `${protocol}//${hostname}${port ? `:${port}` : ""}`;

/**
 * KeycloakConfig configures the connection to the Keycloak server.
 */
const keycloakConfig: KeycloakConfig = {
    realm: "calendaria",
    clientId: process.env.KEYCLOAK_CLIENT_ID || "",
    url: process.env.KEYCLOAK_AUTH_URL
    // url: "https://lemur-16.cloud-iam.com/auth", //temporary server
};

/**
 * KeycloakInitOptions configures the Keycloak client.
 */
const keycloakInitOptions: KeycloakInitOptions = {
    // Configure that Keycloak will check if a user is already authenticated (when opening the app or reloading the page). If not authenticated the user will be send to the login form. If already authenticated the webapp will open.
    onLoad: "login-required",
    // checkLoginIframe: false,
    redirectUri: `${baseUrl}${sessionStorage.getItem("location") || "/"}`
};

// Create the Keycloak client instance
const keycloak = new Keycloak(keycloakConfig);

/**
 * AuthContextValues defines the structure for the default values of the {@link AuthContext}.
 */
interface AuthContextValues {
    /**
     * Whether or not a user is currently authenticated
     */
    isAuthenticated: boolean;
    roles: Array<string>;
    userInfo: any;
    /**
     * Function to initiate the login and logout
     */
    login: () => void;
    logout: () => void;
    updateToken: () => void;
    token: string;
}

/**
 * Default values for the {@link AuthContext}
 */
const defaultAuthContextValues: AuthContextValues = {
    isAuthenticated: false,
    token: "",
    roles: [],
    userInfo: {},
    login: () => {},
    logout: () => {},
    updateToken: () => {}
};

/**
 * Create the AuthContext using the default values.
 */
export const AuthContext = createContext<AuthContextValues>(defaultAuthContextValues);

/**
 * The props that must be passed to create the {@link AuthContextProvider}.
 */
interface AuthContextProviderProps {
    /**
     * The elements wrapped by the auth context.
     */
    children: JSX.Element;
}

/**
 * AuthContextProvider is responsible for managing the authentication state of the current user.
 *
 * @param props
 */
const AuthContextProvider = (props: AuthContextProviderProps) => {
    // console.log("rendering AuthContextProvider");

    // Create the local state in which we will keep track if a user is authenticated
    const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
    const [roles, setRoles] = useState<Array<string>>([]);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [token, setToken] = useState<any>(null);

    useEffect(() => {
        /**
         * Initialize the Keycloak instance
         */
        async function initializeKeycloak() {
            // console.log("initialize Keycloak");
            try {
                const isAuthenticatedResponse = await keycloak.init(keycloakInitOptions);
                if (!isAuthenticatedResponse) {
                    console.log("user is not yet authenticated.");
                } else {
                    // console.log("user already authenticated");
                    setRoles(keycloak.realmAccess?.roles || []);
                    setToken(keycloak.token);
                    console.log(keycloak);
                    // keycloak.loadUserInfo().then((user: any) => {
                    //     console.log(user);
                    //     setUserInfo(user);
                    // });
                }
                setAuthenticated(isAuthenticatedResponse);
            } catch {
                console.log("error initializing Keycloak");
                setAuthenticated(false);
            }
        }

        initializeKeycloak();
    }, []);

    const login = () => {
        keycloak.login();
    };

    const updateToken = () => {
        keycloak.updateToken(0);
    };

    const logout = () => {
        keycloak.logout();
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, roles, userInfo, login, logout, token, updateToken }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
