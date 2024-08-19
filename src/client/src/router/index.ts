import { createRouter, createWebHistory } from "vue-router";
import Trains from "../views/Trains.vue";
import Buses from "../views/Buses.vue";

const routes = [
  {
    path: "/buses/:id",
    name: "Buses",
    component: Buses,
    props: true,
  },
  {
    path: "/trains/:id",
    name: "Trains",
    component: Trains,
    props: true,
  },

  // Redirect root to the first bus view
  {
    path: "/",
    redirect: "/buses/1",
  },
  // Catch-all route for any unmatched routes
  {
    path: "/:pathMatch(.*)*",
    redirect: "/buses/1",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
