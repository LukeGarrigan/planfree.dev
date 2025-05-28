import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'

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
        }
    ]
});

export default router
