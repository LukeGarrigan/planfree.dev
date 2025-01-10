import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'
import Privacy from "@/components/Privacy.vue";
import About from "@/components/About.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
            meta: {
                auth: false,
                title: 'Planning Poker'
            }
        },
        {
            path: '/game/:id',
            name: 'Game',
            component: Game,
            meta: {
                auth: false,
                title: 'Planning Poker'
            }
        },
        {
            path: '/privacy',
            name: 'Privacy',
            component: Privacy,
            meta: {
                auth: false,
                title: 'Planning Poker'
            }
        },
        {
            path: '/about',
            name: 'Arivacy',
            component: About,
            meta: {
                auth: false,
                title: 'Planning Poker'
            }
        }
    ]
});

export default router
