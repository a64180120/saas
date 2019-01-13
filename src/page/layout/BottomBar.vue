<template>
    <div style="border:5px solid #fff">
        <div class="navtitle navCss" @click="Navingclick()" :class="{NavShow:barshow,NavHide:!barshow}">
            <div></div>
            <el-button type="success" round size="small"  >功能导航</el-button>
        </div>
        <div class="sys-footer" :class="{NavShow:barshow,NavHide:!barshow}" >
            <transition name="move" mode="out-in" appear>
                <nav-bar   :isCollapse="collapsevule"></nav-bar>
            </transition>
        </div>
         
    </div>
    
</template>

<script>
import { mapState, mapActions } from 'vuex'
import NavBar from './NavBar'

export default {
    data() {
        return {
            collapsevule:this.isCollapse,
            barshow:true
        }
    },
    props: ["isCollapse"],
    computed: {
        ...mapState({
            username: state => state.user.name,
            lang: state => state.lang
        })
    },
    components:{
        NavBar
    },
    methods: {
        Navingclick(){
            //console.log('123456')
            var old=this.barshow;
            this.barshow=!old;
        }
    }
}
</script>
<style lang='scss' scoped>
.sys-footer{
    display: flex;
    position: absolute;   
    border-color: #ccc;
    background: transparent;
    width:100%;
    min-width:1660px;
    height: 50px;
    left: -290px;    
    //border-bottom: 1px solid #00B8EE;
    z-index: 99;
    bottom: 0px;
    border-bottom:5px solid #eaeaea;
    
    >.side-nav.top{
        background: none;
        //box-shadow: 0 1px 8px #b3acac;
        margin:0;
        width:100%;
        >.el-menu--horizontal.el-menu{
            >li.el-menu-item{
                width:14.28%;
               
            }
            >li.el-submenu{
               width:14.28%; 
              
            }
        }
    }
    
}

.navtitle{
    display: flex;
    position: absolute;
    background:url("../../assets/images/nav4.png") 100% 0 no-repeat;         
    color:#fff;
    background-size:cover;
    width: 140px;
    height: 60px;
    overflow: hidden;
    left:0;
    z-index: 999;
    bottom: 10px;
    text-align: right;
    transition: all 0.5s linear;
    cursor:pointer;
    >div:first-of-type{
        position:absolute;
        background: url('../../assets/images/dh.png');
        background-size:cover;
        width:50px;
        height:80%;
        top:5px ;
        left:-50px;
        color:#333;
        opacity:0;
        transition: all 0.5s linear;
    }
    >button{       
        padding:0;
        color:#333;
        font-size:20px;
        font-weight: 800;
        position: relative;  
        border-radius:50%;
        text-align: right;
        background: none;
        border:0;
        left:10px;
        top:5px;
        opacity:1;
        transition: all 0.5s linear;
    }
}
.navtitle.NavShow{
    left:-45px;
}
.sys-footer.NavShow{
    left:-310px;
}
.NavShow{
    
    >div:first-of-type{
        left:50px;
        opacity:1;
    }
    >button{       
        left:-100px;
        opacity:0;
    }
}

</style>
<style lang="scss">
// .sys-footer{
//     .side-nav.top > .el-menu > .el-menu-item,
//     .side-nav.top > .el-menu > .el-submenu > .el-submenu__title{
//         font-size:15px;
//         color:#666;
//     }
//     .el-menu{
//         border:0;
//     }
//     .sys-footer .side-nav.top .el-menu--horizontal > .el-submenu:focus .el-submenu__title,
//     .el-menu--horizontal > .el-submenu .el-submenu__title:hover,
//     .side-nav.top > .el-menu > .el-submenu:hover .el-submenu__title,
//     .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover, .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
//     .side-nav.top > .el-menu > .el-menu-item:hover {
//         background-color:#00b7ee;
//         color:#fff;
//     }
//      .el-menu--horizontal > .el-submenu:hover  .el-icon-lx-SAAS_tb3::before {
//         background: url(../../assets/images/finance/SAAS_tb3-2.png);
//         background-size: cover;

//     }
//      .el-menu--horizontal > .el-submenu:hover  .el-icon-lx-SAAS_tb4::before {
//          background: url(../../assets/images/finance/SAAS_tb4-2.png);
//         background-size: cover;
//     }
//     .el-menu--horizontal > .el-submenu:hover  .el-icon-lx-SAAS_tb5::before {
//          background: url(../../assets/images/finance/SAAS_tb5-2.png);
//         background-size: cover;
//     }
//    .el-menu--horizontal > .el-submenu:hover  .el-icon-lx-SAAS_tb6::before {
//          background: url(../../assets/images/finance/SAAS_tb8-2.png);
//         background-size: cover;
//     }
//      .el-menu--horizontal > .el-submenu:hover  .el-icon-lx-SAAS_tb7::before {
//          background: url(../../assets/images/finance/SAAS_tb7-2.png);
//         background-size: cover;
//     }
//      .el-menu--horizontal > .el-submenu:hover  .el-icon-lx-SAAS_tb8::before {
//          background: url(../../assets/images/finance/SAAS_tb6-2.png);
//         background-size: cover;
//     }
//     .el-menu--horizontal > .el-submenu .el-submenu__title,
//     .el-menu--horizontal > .el-menu-item {
//         height:50px;
//         line-height:50px;
//         padding:0 15px;
//     }
//     >.side-nav.top>.el-menu--horizontal.el-menu{
//             >li.el-menu-item{
//                 width:14.28%;
//                 text-align:center;
//             }
//             >li.el-submenu{
//                width:14.28%; 
//                text-align:center;
//             }
//         }
    
// }
// .navCss>button.el-button--success>span{
//         position:relative;
//         left:30px;
//         top:5px;
//     }
.sys-footer{
    .side-nav.top{
        >ul.el-menu{
            position: relative;
            bottom: 5px;
        }
    }
    
    .side-nav.top > .el-menu > {
       
        .el-menu-item{
            height:45px;
            line-height:45px;
            width:10%;
            background:url("../../assets/images/nav1.png") 100% 0 no-repeat;         
            color:#fff;
            background-size:cover;
            text-align:right;
            padding-right:50px;
            transition:all 1s; 
            &:nth-of-type(1){
                transform:translate(350px);
                position:relative;
                z-index:6;
            }
            &:nth-of-type(2){
                transform:translate(290px);
                position:relative;
                z-index:5;

            }
             &:nth-of-type(3){
                transform:translate(230px);
                position:relative;
                z-index:4;
            }
            &:nth-of-type(4){
                transform:translate(170px);
                position:relative;
                z-index:3;
            }
            &:nth-of-type(5){
                transform:translate(110px);
                position:relative;
                z-index:2;
            }
            &:nth-of-type(6){
                transform:translate(50px);
                position:relative;
                z-index:1;
            }
            &:nth-of-type(7){
                transform:translate(-10px);
                position:relative;
                z-index:0;
            }
        }
        .el-submenu{
             transition:all 1s; 
            height:45px;
            line-height:45px;
            text-align:right;
            padding-right:30px;
            background:url("../../assets/images/nav1.png") 100% 0 no-repeat;   
            background-size:cover;        
            color:#fff; 
            width:10%; 
            &:hover{
                .el-submenu__title {
                    background:none;
                }       
            }  
            &:nth-of-type(1){
                transform:translate(350px);
                position:relative;
                z-index:6;
            }   
            &:nth-of-type(2){
                transform:translate(290px);
                position:relative;
                z-index:5;

            }
             &:nth-of-type(3){
                transform:translate(230px);
                position:relative;
                z-index:4;
            }
            &:nth-of-type(4){
                transform:translate(170px);
                position:relative;
                z-index:3;
            }
            &:nth-of-type(5){
                transform:translate(110px);
                position:relative;
                z-index:2;
            }
            &:nth-of-type(6){
                transform:translate(50px);
                position:relative;
                z-index:1;
            }
            &:nth-of-type(7){
                transform:translate(-10px);
                position:relative;
                z-index:0;
            }
            >.el-submenu__title{
                height:45px;
                line-height:45px;
                color:#fff;
                >i:before{
                    content:""
                }
            }
        }
        

    }
}
.NavShow{
    .side-nav.top > .el-menu > {
       
       .el-menu-item{
           left:0;
            &:nth-of-type(1){
                
            }
            &:nth-of-type(2){
              
                transition-delay:0.03s
            }
             &:nth-of-type(3){
              
                transition-delay:0.06s
            }
            &:nth-of-type(4){
              
                transition-delay:0.09s 
            }
            &:nth-of-type(5){
             
                transition-delay:0.12s 
            }
            &:nth-of-type(6){
              
                transition-delay:0.15s
            }
            &:nth-of-type(7){ 
                transition-delay:0.18s
            }
        }
        .el-submenu{
           left:0;
            &:nth-of-type(2){
              
                transition-delay:0.03s
            }
             &:nth-of-type(3){
              
                transition-delay:0.06s
            }
            &:nth-of-type(4){
              
                transition-delay:0.09s 
            }
            &:nth-of-type(5){
             
                transition-delay:0.12s 
            }
            &:nth-of-type(6){
              
                transition-delay:0.15s
            }
            &:nth-of-type(7){ 
                transition-delay:0.18s
            }
           
        }
        

    }
}
.NavHide{
    .side-nav.top > .el-menu > {
       .el-menu-item{
           left:-1000px;
            &:nth-of-type(1){
              
                transition-delay:0.18s
            }
            &:nth-of-type(6){
             
                transition-delay:0.03;
            }
        }
        .el-submenu{
              left:-1000px;
            &:nth-of-type(2){
             
                transition-delay:0.15s
            }
             &:nth-of-type(3){
               
                transition-delay:0.12s 
            }
            &:nth-of-type(4){
               
                transition-delay:0.09s
            }
            &:nth-of-type(5){
                
                transition-delay:0.06s 
            }
            &:nth-of-type(6){
               
                transition-delay:0.03; 
            }
            &:nth-of-type(7){
               
                transition-delay:0; 
            }
            
        }
        
        
        

    }
}
.side-nav.top > .el-menu > .el-submenu.is-active > .el-submenu__title,
.side-nav.top > .el-menu > .el-menu-item.is-active{
    border-bottom:0;
}

</style>
