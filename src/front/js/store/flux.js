const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
      userLogged: JSON.parse(localStorage.getItem("userLogged")) || null,
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      getMessage: async () => {
        try {
          // fetching data from the backend
          const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
          const data = await resp.json();
          setStore({ message: data.message });
          // don't forget to return something, that is how the async resolves
          return data;
        } catch (error) {
          console.log("Error loading message from backend", error);
        }
      },
      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },
      signUp: async (user) => {
        try {
          const requestConfig = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          };
          const response = await fetch(
            process.env.BACKEND_URL + "/api/user",
            requestConfig
          );
          const data = await response.json();
          return data;
        } catch (error) {
          console.log("Verify your inputs", error);
        }
      },
      login: async (user) => {
        try {
          const requestConfig = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          };
          const response = await fetch(
            process.env.BACKEND_URL + "/api/login",
            requestConfig
          );
          const data = await response.json();
          if (data.token) {
            localStorage.setItem("userLogged", JSON.stringify(data));
            setStore({ userLogged: data });
            return true;
          }
          // localStorage.setItem("userLogged", JSON.stringify(data));
          // setStore({ userLogged: data });
          return data;
        } catch (error) {
          console.log("Invalid User", error);
        }
      },
      logout: () => {
        localStorage.removeItem("userLogged");
        setStore({ userLogged: null });
      },
    },
  };
};

export default getState;
