<template>
    <div class="links">
        <router-link to="/admin">Главная</router-link>
        <router-link to="/admin/users">Пользователи</router-link>
        <router-link to="/admin/accounts">Аккаунты</router-link>
        <router-link to="/admin/communities">Классы</router-link>
        <router-link to="/admin/groups">Группы</router-link>
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    }
}
</script>

<style scoped>
.links{
    display: grid;
}
.links a{
    color: white;
    font-size: 18px;
    text-decoration: none;
    padding: 10px 4px;
}
.links a:hover{
    background-color: rgba(0, 0, 0, 0.1);
}

.links>a.router-link-active{
    background-color: rgb(43 60 93);
    padding-left: 14px;
}


</style>