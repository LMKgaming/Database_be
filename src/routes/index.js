import procedureRoutes from "./procedure.js";
import revenueRoutes from "./revenue.js"

const routes = {
    procedure: procedureRoutes,
    movies: revenueRoutes,
    use: function (app) {
        Object.entries(this).forEach(([key, value]) => {
            if (key !== "use") {
                app.use(`/api/${key}`, value);
            }
        });
    },
};

export default routes;