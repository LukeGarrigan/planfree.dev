import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'
import Privacy from "@/components/Privacy.vue";
import About from "@/components/About.vue";
import Contact from "@/components/Contact.vue";

const router = createRouter({
    history: createWebHistory(),
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
            name: 'About',
            component: About,
            meta: {
                auth: false,
                title: 'Planning Poker'
            }
        },
        {
            path: '/contact',
            name: 'Contact',
            component: Contact,
            meta: {
                auth: false,
                title: 'Planning Poker'
            }
        }
    ]
});

export default router
