import { useContext } from "react";
import { ThemeProvider } from "react-jss";

import { AuthContext } from "context/AuthContextProvider";
import "antd/dist/antd.css";
import Spinner from "ui/Spinner";

import { Provider } from "react-redux";
import store from "store";
import defaultStyles from "styles/defaultStyles";
import tabulatorStyles from "styles/tabulatorStyles";
import sharedTheme from "styles/theme/sharedTheme";
import AppLayout from "./AppLayout";
import extraStyles from "styles/extraStyles";

window.onbeforeunload = () => {
    sessionStorage.setItem("location", window.location.pathname);
};

const App = () => {
    defaultStyles();
    extraStyles();
    tabulatorStyles();

    const authContext = useContext(AuthContext);
    // const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme") || "shared");

    return (
        <>
            {authContext.isAuthenticated ? (
                <Provider store={store}>
                    <ThemeProvider theme={sharedTheme}>
                        <AppLayout />
                    </ThemeProvider>
                </Provider>
            ) : (
                <div
                    style={{
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Spinner style={{ color: sharedTheme.color.regular }} />
                </div>
            )}
        </>
    );
};

export default App;
