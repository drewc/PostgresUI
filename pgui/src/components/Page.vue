<script setup>
import { ref, getCurrentInstance, watchEffect, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import pgAPI from '../assets/js/pgAPI'
import Status from '../assets/js/status'

const { currentServer, servers} = pgAPI;

const topServer = ref(false);

pgAPI.liveServers().then((lv) => {
   topServer.value = currentServer()

   console.log('New Live Servers:', lv, currentServer(), servers)
});

console.log('currserv from Page setup', currentServer(), watchEffect)

const darkFilter = document.createElement('style');

darkFilter.setAttribute('id', '___pgui_Darkfilterstyle');

darkFilter.innerHTML = 'html, img, video {' +
    'filter: invert(95%) hue-rotate(180deg);' +
    '--webkit-filter: invert(95%) hue-rotate(180deg);' +
	'}';

function changeFilter() {
 const head = document.querySelector('head');
 if (document.getElementById('___pgui_Darkfilterstyle')) {
   head.removeChild(darkFilter)
 } else head.appendChild(darkFilter);
};

function innerWidth() { return window.innerWidth };
function isMobile () { return innerWidth() <= 640 }

window.pgAPI = pgAPI

</script>
<template>
  <div>
    <!--HEADER-->
    <header id="top-head" class="uk-position-fixed">
      <div class="uk-container uk-container-expand uk-background-primary">
        <nav class="uk-navbar uk-light" data-uk-navbar="mode:click; duration: 250">
          <div class="uk-navbar-left">
            <div class="uk-navbar-item uk-hidden@m">
              <!-- <a class="uk-logo" href="#"><img class="custom-logo" src="img/dashboard-logo-white.svg" alt=""></a> -->
            </div>
            <ul class="uk-navbar-nav uk-visible@m">
              <li><a href="#"
                     uk-icon="paint-bucket"
                     title="Change App day/night mode" @click="changeFilter()"
                     > </a>
              </li>
              <li>
            <a href="#">Settings <span data-uk-icon="icon: triangle-down"></span></a>
            <div class="uk-navbar-dropdown">
             <ul class="uk-nav uk-navbar-dropdown-nav">
              <li class="uk-nav-header">YOUR ACCOUNT</li>
              <li><a href="#"><span data-uk-icon="icon: info"></span> Summary</a></li>
              <li><a href="#"><span data-uk-icon="icon: refresh"></span> Edit</a></li>
              <li><a href="#"><span data-uk-icon="icon: settings"></span> Configuration</a></li>
              <li class="uk-nav-divider"></li>
              <li><a href="#"><span data-uk-icon="icon: image"></span> Your Data</a></li>
              <li class="uk-nav-divider"></li>
              <li><a href="#"><span data-uk-icon="icon: sign-out"></span> Logout</a></li>
             </ul>
            </div>
           </li>
          </ul>
          <div class="uk-navbar-item uk-visible@s">
           <form action="dashboard.html" class="uk-search uk-search-default">
            <span data-uk-search-icon></span>
            <input class="uk-search-input search-field" type="search" placeholder="Search">
           </form>
          </div>
         </div>
         <div class="uk-navbar-right">
          <ul class="uk-navbar-nav">
           <li><a href="#" data-uk-icon="icon:user" title="Your profile" data-uk-tooltip></a></li>
           <li><a href="#" data-uk-icon="icon: settings" title="Settings" data-uk-tooltip></a></li>
           <li><a href="#" data-uk-icon="icon:  sign-out" title="Sign Out" data-uk-tooltip></a></li>
           <li><a class="uk-navbar-toggle" data-uk-toggle data-uk-navbar-toggle-icon href="#offcanvas-nav" title="Offcanvas" data-uk-tooltip></a></li>
          </ul>
         </div>
        </nav>
       </div>
      </header>
      <!--/HEADER-->
    
      <!-- LEFT BAR -->
        <aside :id="!isMobile() ? 'left-col' : null" class=""
               >
         <div class="left-logo uk-flex uk-flex-middle">
          <!-- <img class="custom-logo" src="img/dashboard-logo.svg" alt=""> -->
         </div>
         <div class="left-content-box  content-box-dark">
          <!-- <img src="img/avatar.svg" alt="" class="uk-border-circle profile-img"> -->
          <div class="uk-position-relative uk-text-center uk-display-block">
              <a href="#" class="uk-text-large uk-display-block uk-text-center" data-uk-icon="icon: triangle-down; ratio: 0.7">
                {{ topServer && topServer.host }}</a>
              <!-- user dropdown -->
              <div class="uk-dropdown user-drop" data-uk-dropdown="mode: click; pos: bottom-center; animation: uk-animation-slide-bottom-small; duration: 150">
               <ul class="uk-nav uk-dropdown-nav uk-text-left">
                 <li v-for="server in servers"> {{ server.name }} </li>
              <li><a href="#"><span data-uk-icon="icon: settings"></span> Configuration</a></li>
              <li class="uk-nav-divider"></li>
              <li><a href="#"><span data-uk-icon="icon: refresh"></span> Change Server </a></li>
              <li class="uk-nav-divider"></li>
              <li><a href="#"><span data-uk-icon="icon: sign-out"></span> Sign Out</a></li>
               </ul>
              </div>
              <!-- /user dropdown -->
          </div>
         </div>
      
         <div class="left-nav-wrap">
          <ul class="uk-nav uk-nav-default uk-nav-parent-icon" data-uk-nav>
           <li class="uk-nav-header">ACTIONS</li>
           <li><router-link :to="{ name: 'shell' }"><span data-uk-icon="icon: list" class="uk-margin-small-right"></span>SQL Shell</router-link></li>
           <li><a href="#"><span data-uk-icon="icon: comments" class="uk-margin-small-right"></span>Messages</a></li>
           <li class="uk-parent"><a href="#"><span data-uk-icon="icon: thumbnails" class="uk-margin-small-right"></span>Templates</a>
            <ul class="uk-nav-sub">
             <li><a title="Article" href="https://zzseba78.github.io/Kick-Off/article.html">Article</a></li>
             <li><a title="Album" href="https://zzseba78.github.io/Kick-Off/album.html">Album</a></li>
             <li><a title="Cover" href="https://zzseba78.github.io/Kick-Off/cover.html">Cover</a></li>
             <li><a title="Cards" href="https://zzseba78.github.io/Kick-Off/cards.html">Cards</a></li>
             <li><a title="News Blog" href="https://zzseba78.github.io/Kick-Off/newsBlog.html">News Blog</a></li>
             <li><a title="Price" href="https://zzseba78.github.io/Kick-Off/price.html">Price</a></li>
             <li><a title="Login" href="https://zzseba78.github.io/Kick-Off/login.html">Login</a></li>
             <li><a title="Login-Dark" href="https://zzseba78.github.io/Kick-Off/login-dark.html">Login - Dark</a></li>
            </ul>
           </li>
           <li><a href="#"><span data-uk-icon="icon: album" class="uk-margin-small-right"></span>Albums</a></li>
           <li><a href="#"><span data-uk-icon="icon: thumbnails" class="uk-margin-small-right"></span>Featured Content</a></li>
           <li><a href="#"><span data-uk-icon="icon: lifesaver" class="uk-margin-small-right"></span>Tips</a></li>
           <li class="uk-parent">
            <a href="#"><span data-uk-icon="icon: comments" class="uk-margin-small-right"></span>Reports</a>
            <ul class="uk-nav-sub">
             <li><a href="#">Sub item</a></li>
             <li><a href="#">Sub item</a></li>
            </ul>
           </li>
          </ul>
          <div class="left-content-box uk-margin-top">
      
            <h5>Daily Reports</h5>
            <div>
             <span class="uk-text-small">Traffic <small>(+50)</small></span>
             <progress class="uk-progress" value="50" max="100"></progress>
            </div>
            <div>
             <span class="uk-text-small">Income <small>(+78)</small></span>
             <progress class="uk-progress success" value="78" max="100"></progress>
            </div>
            <div>
             <span class="uk-text-small">Feedback <small>(-12)</small></span>
             <progress class="uk-progress warning" value="12" max="100"></progress>
            </div>
      
          </div>
      
         </div>
         <div class="bar-bottom context-box-dark">
          <ul class="uk-subnav uk-flex uk-flex-center uk-child-width-1-5" data-uk-grid>
           <li>
            <a href="#" class="uk-icon-link" data-uk-icon="icon: home" title="Home" data-uk-tooltip></a>
           </li>
           <li>
            <a href="#" class="uk-icon-link" data-uk-icon="icon: settings" title="Settings" data-uk-tooltip></a>
           </li>
           <li>
            <a href="#" class="uk-icon-link" data-uk-icon="icon: social"  title="Social" data-uk-tooltip></a>
           </li>
      
           <li>
            <a href="#" class="uk-icon-link" data-uk-tooltip="Sign out" data-uk-icon="icon: sign-out"></a>
           </li>
          </ul>
         </div>
        </aside>
        <!-- /LEFT BAR -->
      

  <!-- CONTENT -->
  <div :id="(currentServer() && currentServer().uuid) ? 'content' : null" data-uk-height-viewport="expand: true">
  <router-view></router-view>

   </div>
  <!-- /CONTENT -->
  </div>
</template>
<style src="/src/assets/css/dashboard.css"> </style>
